"""Routes for Z3-based structural partition planning."""

from fastapi import APIRouter, HTTPException

from app.schemas.optimization_schema import OptimizationRequest
from app.services.optimization_service import optimize_qasm

router = APIRouter(tags=["optimization"])


def _optimize(request: OptimizationRequest) -> dict:
    try:
        return optimize_qasm(
            request.qasm,
            max_qubits_per_partition=request.max_qubits_per_partition,
            max_partitions=request.max_partitions,
            objective=request.objective,
            timeout_ms=request.timeout_ms,
        )
    except TimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/api/optimize")
def optimize(request: OptimizationRequest) -> dict:
    """Plan bounded qubit groups; this does not create physical circuit cuts."""
    return _optimize(request)
