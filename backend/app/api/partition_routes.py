"""Compatibility route for structural partition planning."""

from fastapi import APIRouter

from app.api.optimization_routes import _optimize
from app.schemas.optimization_schema import OptimizationRequest

router = APIRouter(prefix="/api/partitions", tags=["partitions"])


@router.post("/plan")
def plan(request: OptimizationRequest) -> dict:
    """Return the same structural plan as the optimization endpoint."""
    return _optimize(request)
