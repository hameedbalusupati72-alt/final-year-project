"""Supported structural-planner objective names."""

from app.optimization.partitioner import OBJECTIVES

SUPPORTED_OBJECTIVES = frozenset(OBJECTIVES)


def validate_objective(objective: str) -> str:
    """Return a supported objective name or raise a clear validation error."""
    if objective not in SUPPORTED_OBJECTIVES:
        raise ValueError(
            f"Unsupported objective '{objective}'. Choose one of: "
            f"{', '.join(sorted(SUPPORTED_OBJECTIVES))}."
        )
    return objective
