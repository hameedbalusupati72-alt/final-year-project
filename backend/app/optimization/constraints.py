"""Constraint definitions shared by optimization-facing code."""

MAX_QUBITS_PER_PARTITION = 64
MAX_PARTITIONS = 16
MIN_SOLVER_TIMEOUT_MS = 100
MAX_SOLVER_TIMEOUT_MS = 10_000


def validate_partition_limits(
    max_qubits_per_partition: int,
    max_partitions: int,
    timeout_ms: int,
) -> None:
    """Validate planner bounds consistently with the existing implementation."""
    if not 1 <= max_qubits_per_partition <= MAX_QUBITS_PER_PARTITION:
        raise ValueError("Maximum qubits per partition must be between 1 and 64.")
    if not 1 <= max_partitions <= MAX_PARTITIONS:
        raise ValueError("Maximum partitions must be between 1 and 16.")
    if not MIN_SOLVER_TIMEOUT_MS <= timeout_ms <= MAX_SOLVER_TIMEOUT_MS:
        raise ValueError("SMT timeout must be between 100 and 10,000 milliseconds.")
