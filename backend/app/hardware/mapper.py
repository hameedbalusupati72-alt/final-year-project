"""Explicit boundary for target-hardware mapping."""

from qiskit import QuantumCircuit


def map_to_hardware(
    _circuit: QuantumCircuit, _target: object
) -> QuantumCircuit:
    """Map a circuit to a hardware target (not implemented)."""
    raise NotImplementedError(
        "Hardware mapping is not supported; this backend currently analyzes "
        "circuits and creates abstract structural partition plans."
    )
