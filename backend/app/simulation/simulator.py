"""Compatibility import for callers of the earlier simulator module."""

from qiskit import QuantumCircuit

from app.simulation.ideal_simulator import simulate_original_circuit


def simulate_circuit(
    circuit: QuantumCircuit,
    *,
    shots: int = 1024,
    seed: int | None = 42,
) -> dict:
    """Run the ideal original-circuit simulator using the legacy argument name."""
    return simulate_original_circuit(
        circuit,
        shots=shots,
        random_seed=seed,
    )
