"""Routes for validating OpenQASM source before analysis."""

from fastapi import APIRouter, HTTPException

from app.schemas.circuit_schema import CircuitRequest
from app.services.circuit_service import load_circuit

router = APIRouter(prefix="/api/circuits", tags=["circuits"])


@router.post("/validate")
def validate_source(request: CircuitRequest) -> dict:
    """Parse and validate circuit source without starting analysis or simulation."""
    try:
        circuit = load_circuit(request.qasm)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "status": "valid",
        "qubits": circuit.num_qubits,
        "classical_bits": circuit.num_clbits,
        "operations": len(circuit.data),
    }
