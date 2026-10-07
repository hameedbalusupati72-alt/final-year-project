"""Structural graph helpers for interaction boundaries."""

from qiskit import QuantumCircuit

from app.quantum.circuit_analyzer import analyze_circuit
from app.quantum.circuit_validator import validate_circuit


def build_cutting_graph(circuit: QuantumCircuit) -> dict:
    """Return the circuit's weighted two-qubit interaction graph."""
    validate_circuit(circuit)
    graph = analyze_circuit(circuit).interaction_graph
    return {
        **graph,
        "scope": (
            "Structural interaction graph only; no gate or wire cuts are "
            "generated."
        ),
    }
