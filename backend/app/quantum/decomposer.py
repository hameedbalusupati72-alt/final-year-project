"""Explicit boundary for future exact circuit decomposition."""

from qiskit import QuantumCircuit


def decompose_circuit(_circuit: QuantumCircuit) -> QuantumCircuit:
    """Decompose a circuit into executable cut partitions (not implemented)."""
    raise NotImplementedError(
        "Exact circuit decomposition is not supported; only structural "
        "partition planning is available."
    )
