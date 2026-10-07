"""Resource requirement schema for structural partition planning."""

from pydantic import BaseModel, Field

from app.config.settings import settings


class PartitionRequirements(BaseModel):
    """Bounded limits consumed by the existing structural planner."""

    max_qubits_per_partition: int = Field(ge=1, le=settings.max_qubits)
    max_partitions: int = Field(ge=1, le=16)
    timeout_ms: int = Field(default=5_000, ge=100, le=10_000)
