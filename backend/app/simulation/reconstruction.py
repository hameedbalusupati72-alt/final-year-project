"""Explicit boundary for cutting-result reconstruction."""


def reconstruct_result(*_args: object, **_kwargs: object) -> dict:
    """Reconstruct a full-circuit result from cut experiments (not implemented)."""
    raise NotImplementedError(
        "Result reconstruction from cut partitions is not supported; no exact "
        "cuts or executable subcircuits are currently produced."
    )
