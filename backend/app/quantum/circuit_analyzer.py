"""Basic circuit metrics and a weighted two-qubit interaction graph."""

from collections import Counter
from dataclasses import asdict, dataclass

from qiskit import QuantumCircuit

from app.quantum.circuit_validator import NON_GATE_OPERATIONS, validate_circuit


@dataclass(frozen=True)
class CircuitAnalysis:
    """JSON-serializable summary of a validated quantum circuit."""

    qubits: int
    classical_bits: int
    depth: int
    operation_count: int
    gate_count: int
    single_qubit_gates: int
    two_qubit_gates: int
    cnot_count: int
    gate_density: float
    gate_counts: dict[str, int]
    interaction_graph: dict[str, list]

    def to_dict(self) -> dict:
        """Return this analysis as a plain dictionary."""
        return asdict(self)


def analyze_circuit(circuit: QuantumCircuit) -> CircuitAnalysis:
    """Calculate Phase 1 metrics for a circuit."""
    validate_circuit(circuit)

    gate_counts: Counter[str] = Counter()
    interaction_counts: Counter[tuple[int, int]] = Counter()
    single_qubit_gates = 0
    two_qubit_gates = 0

    for instruction in circuit.data:
        operation = instruction.operation
        arity = operation.num_qubits
        if operation.name in NON_GATE_OPERATIONS or arity == 0:
            continue

        gate_counts[operation.name] += 1
        if arity == 1:
            single_qubit_gates += 1
        elif arity == 2:
            two_qubit_gates += 1
            first, second = sorted(
                circuit.find_bit(qubit).index for qubit in instruction.qubits
            )
            interaction_counts[(first, second)] += 1

    gate_count = single_qubit_gates + two_qubit_gates
    depth = circuit.depth() or 0
    density_denominator = circuit.num_qubits * depth
    gate_density = gate_count / density_denominator if density_denominator else 0.0
    edges = [
        {"source": source, "target": target, "weight": weight}
        for (source, target), weight in sorted(interaction_counts.items())
    ]

    return CircuitAnalysis(
        qubits=circuit.num_qubits,
        classical_bits=circuit.num_clbits,
        depth=depth,
        operation_count=len(circuit.data),
        gate_count=gate_count,
        single_qubit_gates=single_qubit_gates,
        two_qubit_gates=two_qubit_gates,
        cnot_count=gate_counts.get("cx", 0) + gate_counts.get("cnot", 0),
        gate_density=gate_density,
        gate_counts=dict(sorted(gate_counts.items())),
        interaction_graph={
            "nodes": list(range(circuit.num_qubits)),
            "edges": edges,
        },
    )
