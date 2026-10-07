"""Service for parsing and simulating the original submitted circuit."""

from app.quantum.circuit_parser import parse_openqasm
from app.simulation.ideal_simulator import simulate_original_circuit


def run_original_simulation(
    qasm: str,
    *,
    shots: int = 1024,
    random_seed: int | None = 42,
) -> dict:
    """Parse the submitted OpenQASM and produce its ideal baseline result."""
    circuit = parse_openqasm(qasm)
    return simulate_original_circuit(
        circuit,
        shots=shots,
        random_seed=random_seed,
    )
