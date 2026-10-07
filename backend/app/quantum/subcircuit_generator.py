"""Explicit boundary for executable subcircuit generation."""

from qiskit import QuantumCircuit


def generate_subcircuits(
    _circuit: QuantumCircuit, _partition_plan: dict
) -> list[QuantumCircuit]:
    """Generate executable subcircuits (not implemented)."""
    raise NotImplementedError(
        "Executable subcircuit generation is not supported; the planner "
        "returns structural assignments only."
    )
