"""Public adapter for the existing Z3 structural partition planner."""

from qiskit import QuantumCircuit

from app.optimization.partitioner import optimize_partitions


def solve_partitioning(
    circuit: QuantumCircuit,
    *,
    max_qubits_per_partition: int,
    max_partitions: int,
    objective: str = "balanced",
    timeout_ms: int = 5_000,
) -> dict:
    """Solve only the supported qubit-level structural assignment problem."""
    return optimize_partitions(
        circuit,
        max_qubits_per_partition=max_qubits_per_partition,
        max_partitions=max_partitions,
        objective=objective,
        timeout_ms=timeout_ms,
    )
