"""Service adapter for structural optimization."""

from app.optimization.optimization_engine import optimize_circuit_structure
from app.services.circuit_service import load_circuit


def optimize_qasm(
    qasm: str,
    *,
    max_qubits_per_partition: int,
    max_partitions: int,
    objective: str = "balanced",
    timeout_ms: int = 5_000,
) -> dict:
    """Parse OpenQASM 2 and return a structural partition plan."""
    return optimize_circuit_structure(
        load_circuit(qasm),
        max_qubits_per_partition=max_qubits_per_partition,
        max_partitions=max_partitions,
        objective=objective,
        timeout_ms=timeout_ms,
    )
