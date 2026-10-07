"""Explicit boundary for noise-aware circuit simulation."""

from qiskit import QuantumCircuit


def simulate_noisy_circuit(
    _circuit: QuantumCircuit, *, _shots: int = 1024, **_options: object
) -> dict:
    """Run noisy simulation (not implemented)."""
    raise NotImplementedError(
        "Noisy simulation is not supported. The available simulator runs the "
        "original circuit with ideal Aer behavior."
    )
