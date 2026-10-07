import pytest
from qiskit import QuantumCircuit

from app.optimization.partitioner import optimize_partitions


def test_line_graph_is_partitioned_with_capacity_and_cut_details():
    circuit = QuantumCircuit(4)
    circuit.cx(0, 1)
    circuit.cx(1, 2)
    circuit.cx(2, 3)

    plan = optimize_partitions(
        circuit,
        max_qubits_per_partition=2,
        max_partitions=2,
        objective="minimize_cuts",
    )

    assert plan["status"] == "structural_partition_plan"
    assert plan["partition_count"] == 2
    assert all(partition["qubit_count"] <= 2 for partition in plan["partitions"])
    assert plan["crossing_gate_count"] == 1
    assert len(plan["cut_edges"]) == 1
    assert plan["cut_edges"][0]["kind"] == "interaction_boundary"
    assert "not an exact circuit-cut" in plan["scope"]


def test_impossible_partition_limits_are_explained():
    circuit = QuantumCircuit(5)

    with pytest.raises(ValueError, match="need at least 3 partitions"):
        optimize_partitions(
            circuit,
            max_qubits_per_partition=2,
            max_partitions=2,
        )


def test_multiple_gates_on_same_pair_are_counted_as_crossing_interactions():
    circuit = QuantumCircuit(2)
    circuit.cx(0, 1)
    circuit.cz(0, 1)

    plan = optimize_partitions(
        circuit,
        max_qubits_per_partition=1,
        max_partitions=2,
    )

    assert plan["crossing_gate_count"] == 2
    assert plan["cut_edges"][0]["operation_indices"] == [0, 1]


def test_qubit_groups_can_be_planned_without_interaction_edges():
    plan = optimize_partitions(
        QuantumCircuit(3),
        max_qubits_per_partition=2,
        max_partitions=2,
        objective="balanced",
    )

    assert plan["partition_count"] == 2
    assert plan["cut_edges"] == []
    assert plan["weighted_cut_interactions"] == 0


@pytest.mark.parametrize(
    "objective", ["balanced", "minimize_cuts", "minimize_partitions"]
)
def test_all_supported_objectives_return_a_plan(objective):
    circuit = QuantumCircuit(3)
    circuit.cx(0, 1)
    circuit.cx(1, 2)

    plan = optimize_partitions(
        circuit,
        max_qubits_per_partition=2,
        max_partitions=2,
        objective=objective,
    )

    assert plan["objective"] == objective
    assert plan["partition_count"] == 2


def test_unknown_objective_is_rejected():
    with pytest.raises(ValueError, match="Unsupported objective"):
        optimize_partitions(
            QuantumCircuit(2),
            max_qubits_per_partition=1,
            max_partitions=2,
            objective="invalid",
        )
