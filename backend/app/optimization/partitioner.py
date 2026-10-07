"""Z3 qubit-level partition planner for the analyzed interaction graph.

This module plans qubit groups and identifies cross-partition interactions. It
does not perform quantum gate/wire cutting or generate a reconstructed circuit.
"""

from collections import defaultdict

from qiskit import QuantumCircuit
from z3 import If, Int, IntVal, Optimize, Or, Sum, sat, unknown

from app.quantum.circuit_validator import validate_circuit

OBJECTIVES = {"minimize_cuts", "minimize_partitions", "balanced"}


def _interaction_edges(circuit: QuantumCircuit) -> list[dict]:
    interactions: dict[tuple[int, int], list[int]] = defaultdict(list)
    for operation_index, instruction in enumerate(circuit.data):
        if instruction.operation.num_qubits != 2:
            continue
        first, second = sorted(
            circuit.find_bit(qubit).index for qubit in instruction.qubits
        )
        interactions[(first, second)].append(operation_index)

    return [
        {
            "source": source,
            "target": target,
            "weight": len(operation_indices),
            "operation_indices": operation_indices,
        }
        for (source, target), operation_indices in sorted(interactions.items())
    ]


def optimize_partitions(
    circuit: QuantumCircuit,
    *,
    max_qubits_per_partition: int,
    max_partitions: int,
    objective: str = "balanced",
    timeout_ms: int = 5_000,
) -> dict:
    """Find a bounded assignment of qubits minimizing the requested objective."""
    validate_circuit(circuit)
    if not 1 <= max_qubits_per_partition <= 64:
        raise ValueError(
            "Maximum qubits per partition must be between 1 and 64."
        )
    if not 1 <= max_partitions <= 16:
        raise ValueError("Maximum partitions must be between 1 and 16.")
    if objective not in OBJECTIVES:
        raise ValueError(
            f"Unsupported objective '{objective}'. Choose one of: "
            f"{', '.join(sorted(OBJECTIVES))}."
        )
    if not 100 <= timeout_ms <= 10_000:
        raise ValueError("SMT timeout must be between 100 and 10,000 milliseconds.")

    qubit_count = circuit.num_qubits
    partition_capacity = min(max_qubits_per_partition, qubit_count)
    minimum_partitions = (
        qubit_count + partition_capacity - 1
    ) // partition_capacity
    if minimum_partitions > max_partitions:
        raise ValueError(
            f"No feasible partition: {qubit_count} qubits need at least "
            f"{minimum_partitions} partitions at a limit of "
            f"{partition_capacity} qubits each, but only "
            f"{max_partitions} are allowed."
        )

    partition_limit = min(max_partitions, qubit_count)
    solver = Optimize()
    solver.set(timeout=timeout_ms)

    assignment = [
        Int(f"qubit_partition_{qubit}") for qubit in range(qubit_count)
    ]
    active = [Int(f"partition_active_{partition}") for partition in range(partition_limit)]

    for partition_var in assignment:
        solver.add(partition_var >= 0, partition_var < partition_limit)

    for partition in range(partition_limit):
        membership = [
            assignment[qubit] == partition for qubit in range(qubit_count)
        ]
        solver.add(active[partition] == If(Or(membership), 1, 0))
        solver.add(
            Sum([If(member, 1, 0) for member in membership])
            <= partition_capacity
        )
        if partition < partition_limit - 1:
            solver.add(active[partition] >= active[partition + 1])
    solver.add(active[0] == 1)
    solver.add(Sum(active) <= max_partitions)

    edges = _interaction_edges(circuit)
    cut_vars = []
    for edge_index, edge in enumerate(edges):
        cut_var = Int(f"interaction_cut_{edge_index}")
        solver.add(
            cut_var
            == If(
                assignment[edge["source"]] != assignment[edge["target"]],
                1,
                0,
            )
        )
        cut_vars.append(cut_var)

    weighted_cut_interactions = Sum(
        [
            cut_vars[index] * edge["weight"]
            for index, edge in enumerate(edges)
        ]
    ) if edges else IntVal(0)
    partition_count = Sum(active)
    partition_sizes = [
        Sum(
            [
                If(assignment[qubit] == partition, 1, 0)
                for qubit in range(qubit_count)
            ]
        )
        for partition in range(partition_limit)
    ]
    maximum_partition_size = partition_sizes[0]
    for partition_size in partition_sizes[1:]:
        maximum_partition_size = If(
            partition_size > maximum_partition_size,
            partition_size,
            maximum_partition_size,
        )

    if objective == "minimize_partitions":
        solver.minimize(partition_count)
        solver.minimize(weighted_cut_interactions)
        solver.minimize(maximum_partition_size)
    elif objective == "minimize_cuts":
        solver.minimize(weighted_cut_interactions)
        solver.minimize(partition_count)
        solver.minimize(maximum_partition_size)
    else:
        solver.minimize(weighted_cut_interactions)
        solver.minimize(maximum_partition_size)
        solver.minimize(partition_count)

    status = solver.check()
    if status == unknown:
        raise TimeoutError(
            f"The partition solver did not finish within {timeout_ms} milliseconds."
        )
    if status != sat:
        raise ValueError(
            "The SMT solver could not find a feasible partition for these limits."
        )

    model = solver.model()
    qubit_assignments = [model.eval(value).as_long() for value in assignment]
    used_partitions = sorted(set(qubit_assignments))
    partition_ids = {old: new for new, old in enumerate(used_partitions)}
    qubit_assignments = [partition_ids[value] for value in qubit_assignments]

    partitions = [
        {
            "partition_id": partition_id,
            "qubits": [
                qubit
                for qubit, assigned in enumerate(qubit_assignments)
                if assigned == partition_id
            ],
            "qubit_count": sum(
                assigned == partition_id for assigned in qubit_assignments
            ),
        }
        for partition_id in range(len(used_partitions))
    ]

    cut_edges = []
    for edge in edges:
        source_partition = qubit_assignments[edge["source"]]
        target_partition = qubit_assignments[edge["target"]]
        if source_partition != target_partition:
            cut_edges.append(
                {
                    **edge,
                    "source_partition": source_partition,
                    "target_partition": target_partition,
                    "kind": "interaction_boundary",
                }
            )

    crossing_gate_count = sum(edge["weight"] for edge in cut_edges)
    return {
        "status": "structural_partition_plan",
        "scope": (
            "Qubit-level interaction graph assignment only. Crossing gates are "
            "identified but not decomposed; this is not an exact circuit-cut "
            "solution and does not provide reconstructed-circuit guarantees."
        ),
        "objective": objective,
        "max_qubits_per_partition": max_qubits_per_partition,
        "max_partitions": max_partitions,
        "partition_count": len(partitions),
        "max_partition_qubits": max(
            partition["qubit_count"] for partition in partitions
        ),
        "weighted_cut_interactions": crossing_gate_count,
        "cut_pair_count": len(cut_edges),
        "crossing_gate_count": crossing_gate_count,
        "qubit_assignments": [
            {"qubit": qubit, "partition_id": partition}
            for qubit, partition in enumerate(qubit_assignments)
        ],
        "partitions": partitions,
        "cut_edges": cut_edges,
    }
