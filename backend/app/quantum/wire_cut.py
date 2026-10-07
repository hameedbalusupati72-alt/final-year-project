"""Explicit boundary for exact quantum wire cutting."""

from qiskit import QuantumCircuit


def cut_wires(_circuit: QuantumCircuit, _qubit_indices: list[int]) -> None:
    """Create exact wire cuts (not implemented)."""
    raise NotImplementedError(
        "Exact wire cutting is not supported; qubits are only assigned to "
        "structural partitions."
    )
