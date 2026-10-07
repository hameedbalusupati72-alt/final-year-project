"""Routes for OpenQASM circuit analysis."""

from fastapi import APIRouter, HTTPException

from app.schemas.circuit_schema import CircuitRequest
from app.services.analysis_service import analyze_qasm

router = APIRouter(prefix="/api/circuits", tags=["analysis"])


@router.post("/analyze")
def analyze(request: CircuitRequest) -> dict:
    """Return gate metrics and the weighted interaction graph."""
    try:
        return analyze_qasm(request.qasm)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
