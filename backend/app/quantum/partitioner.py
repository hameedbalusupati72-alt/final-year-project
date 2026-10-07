"""Compatibility entry point for the existing Z3 structural planner."""

from app.optimization.partitioner import OBJECTIVES, optimize_partitions

__all__ = ["OBJECTIVES", "optimize_partitions"]
