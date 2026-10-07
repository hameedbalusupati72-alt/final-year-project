"""HTTP routes for original-circuit baseline simulation."""

from fastapi import APIRouter, HTTPException
from qiskit.exceptions import QiskitError
from qiskit_aer.aererror import AerError

from app.schemas.simulation_schema import OriginalSimulationRequest
from app.services.simulation_service import run_original_simulation

router = APIRouter(tags=["simulation"])


@router.post("/api/simulation/original")
@router.post("/api/simulate", include_in_schema=False)
def simulate_original(request: OriginalSimulationRequest) -> dict:
    """Simulate the original OpenQASM circuit locally with ideal Aer."""
    try:
        return run_original_simulation(
            request.qasm,
            shots=request.shots,
            random_seed=request.random_seed,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except (AerError, QiskitError, RuntimeError) as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Original-circuit simulation failed: {exc}",
        ) from exc
