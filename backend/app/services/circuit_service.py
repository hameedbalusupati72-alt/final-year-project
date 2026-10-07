"""Service helpers for circuit parsing and validation."""

from qiskit import QuantumCircuit

from app.quantum.circuit_parser import parse_openqasm
from app.quantum.circuit_validator import validate_circuit


def load_circuit(qasm: str) -> QuantumCircuit:
    """Parse and validate submitted OpenQASM 2."""
    circuit = parse_openqasm(qasm)
    validate_circuit(circuit)
    return circuit
