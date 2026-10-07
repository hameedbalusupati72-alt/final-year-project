"""Service adapter for structural partition planning."""

from app.services.optimization_service import optimize_qasm


def plan_partitions(
    qasm: str,
    *,
    max_qubits_per_partition: int,
    max_partitions: int,
    objective: str = "balanced",
    timeout_ms: int = 5_000,
) -> dict:
    """Return qubit assignments and crossing-interaction metadata."""
    return optimize_qasm(
        qasm,
        max_qubits_per_partition=max_qubits_per_partition,
        max_partitions=max_partitions,
        objective=objective,
        timeout_ms=timeout_ms,
    )
