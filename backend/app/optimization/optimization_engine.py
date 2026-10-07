"""Orchestration for the supported structural optimization workflow."""

from qiskit import QuantumCircuit

from app.optimization.partitioner import optimize_partitions
from app.optimization.solution_parser import parse_partition_solution


def optimize_circuit_structure(
    circuit: QuantumCircuit,
    *,
    max_qubits_per_partition: int,
    max_partitions: int,
    objective: str = "balanced",
    timeout_ms: int = 5_000,
) -> dict:
    """Create and validate a structural plan without claiming executable cuts."""
    solution = optimize_partitions(
        circuit,
        max_qubits_per_partition=max_qubits_per_partition,
        max_partitions=max_partitions,
        objective=objective,
        timeout_ms=timeout_ms,
    )
    return parse_partition_solution(solution)
