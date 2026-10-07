"""Circuit format conversion helpers."""

from qiskit import QuantumCircuit
from qiskit.qasm2 import dumps

from app.quantum.circuit_parser import parse_openqasm


def from_openqasm(source: str) -> QuantumCircuit:
    """Parse OpenQASM 2 using the application's safe parser."""
    return parse_openqasm(source)


def to_openqasm(circuit: QuantumCircuit) -> str:
    """Serialize a circuit as OpenQASM 2."""
    return dumps(circuit)
