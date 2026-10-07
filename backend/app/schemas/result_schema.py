"""Response schemas describing currently supported backend results."""

from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    """Result of source circuit analysis."""

    status: str = "completed"
    analysis: dict


class OptimizationResult(BaseModel):
    """Structural plan returned by the existing Z3 planner."""

    status: str = "structural_partition_plan"
    scope: str
    objective: str
    partition_count: int = Field(ge=1)
    partitions: list[dict]
    cut_edges: list[dict]


class ServiceResult(BaseModel):
    """Generic envelope used by small service adapters."""

    status: str
    data: dict
