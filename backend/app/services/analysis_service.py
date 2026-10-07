"""Service adapter for existing circuit analysis."""

from app.quantum.circuit_analyzer import analyze_circuit
from app.services.circuit_service import load_circuit


def analyze_qasm(qasm: str) -> dict:
    """Parse OpenQASM 2 and return supported circuit metrics."""
    return analyze_circuit(load_circuit(qasm)).to_dict()
