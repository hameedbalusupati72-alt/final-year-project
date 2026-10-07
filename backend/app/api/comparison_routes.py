"""Routes for comparing measured outcome distributions."""

from fastapi import APIRouter, HTTPException

from app.schemas.comparison_schema import DistributionComparisonRequest
from app.services.comparison_service import compare_simulations

router = APIRouter(prefix="/api/comparison", tags=["comparison"])


@router.post("/distributions")
def compare(request: DistributionComparisonRequest) -> dict:
    """Compare two supplied distributions without claiming circuit reconstruction."""
    try:
        return compare_simulations(
            request.original_probabilities,
            request.comparison_probabilities,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
