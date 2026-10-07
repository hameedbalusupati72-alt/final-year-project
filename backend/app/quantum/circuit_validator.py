"""Input limits and supported-operation validation."""

from qiskit import QuantumCircuit

from app.config.settings import settings

MAX_QUBITS = settings.max_qubits
MAX_INSTRUCTIONS = settings.max_instructions
NON_GATE_OPERATIONS = {"barrier", "measure", "reset", "delay"}


class CircuitValidationError(ValueError):
    """Raised when a parsed circuit exceeds analyzer limits."""


def validate_circuit(circuit: QuantumCircuit) -> None:
    """Reject oversized circuits and operations unsupported by this phase."""
    if not isinstance(circuit, QuantumCircuit):
        raise CircuitValidationError("Input must be a Qiskit QuantumCircuit.")
    if circuit.num_qubits < 1:
        raise CircuitValidationError("Circuit must contain at least one qubit.")
    if circuit.num_qubits > MAX_QUBITS:
        raise CircuitValidationError(
            f"Circuit has {circuit.num_qubits} qubits; the limit is {MAX_QUBITS}."
        )
    if len(circuit.data) > MAX_INSTRUCTIONS:
        raise CircuitValidationError(
            f"Circuit has {len(circuit.data)} instructions; "
            f"the limit is {MAX_INSTRUCTIONS:,}."
        )

    for instruction in circuit.data:
        operation = instruction.operation
        if (
            operation.name not in NON_GATE_OPERATIONS
            and operation.num_qubits > 2
        ):
            raise CircuitValidationError(
                f"Operation '{operation.name}' acts on {operation.num_qubits} "
                "qubits; operations on more than two qubits are not supported "
                "by the Phase 1 analyzer."
            )
