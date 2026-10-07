"""OpenQASM 2 parsing for user-provided quantum circuits."""

from qiskit import QuantumCircuit
from qiskit.qasm2 import loads
from qiskit.qasm2.exceptions import QASM2ParseError

from app.config.settings import settings

MAX_QASM_CHARACTERS = settings.max_qasm_characters


def parse_openqasm(source: str) -> QuantumCircuit:
    """Parse an OpenQASM 2 string without evaluating arbitrary Python code."""
    if not isinstance(source, str) or not source.strip():
        raise ValueError("OpenQASM input must be a non-empty string.")
    if len(source) > MAX_QASM_CHARACTERS:
        raise ValueError(
            f"OpenQASM input exceeds the {MAX_QASM_CHARACTERS:,}-character limit."
        )

    try:
        return loads(source)
    except (QASM2ParseError, ValueError, SyntaxError) as exc:
        raise ValueError(f"Invalid OpenQASM 2 input: {exc}") from exc
