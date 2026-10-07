"""Optimization request schema for the supported Z3 structural planner."""

from typing import Literal

from pydantic import Field

from app.config.settings import settings
from app.schemas.circuit_schema import CircuitRequest


OptimizationObjective = Literal[
    "minimize_cuts", "minimize_partitions", "balanced"
]


class OptimizationRequest(CircuitRequest):
    """Inputs for qubit-level interaction graph partition planning."""

    max_qubits_per_partition: int = Field(ge=1, le=settings.max_qubits)
    max_partitions: int = Field(default=4, ge=1, le=16)
    objective: OptimizationObjective = "balanced"
    timeout_ms: int = Field(default=5_000, ge=100, le=10_000)
