"""FastAPI application wiring the supported backend API routes."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis_routes import router as analysis_router
from app.api.circuit_routes import router as circuit_router
from app.api.comparison_routes import router as comparison_router
from app.api.optimization_routes import router as optimization_router
from app.api.partition_routes import router as partition_router
from app.api.report_routes import router as report_router
from app.api.simulation_routes import router as simulation_router
from app.config.settings import settings

app = FastAPI(
    title=settings.app_name,
    description=(
        "OpenQASM 2 analysis, Z3 interaction-graph partition planning, "
        "and ideal simulation of the original circuit."
    ),
    version="0.2.0",
)

app.include_router(simulation_router)
app.include_router(circuit_router)
app.include_router(analysis_router)
app.include_router(optimization_router)
app.include_router(partition_router)
app.include_router(comparison_router)
app.include_router(report_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_allowed_origins),
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    """Report API readiness and implemented functional stages."""
    return {
        "status": "ok",
        "phase": "working-prototype",
        "features": (
            "circuit-validation,analysis,interaction-graph-planning,"
            "ideal-simulation,distribution-comparison,text-reports"
        ),
    }
