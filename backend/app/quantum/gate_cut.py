"""Explicit boundary for exact quantum gate cutting."""

from qiskit import QuantumCircuit


def cut_gates(_circuit: QuantumCircuit, _operation_indices: list[int]) -> None:
    """Create exact gate cuts (not implemented)."""
    raise NotImplementedError(
        "Exact gate cutting is not supported; crossing interactions are "
        "reported as structural boundaries only."
    )
