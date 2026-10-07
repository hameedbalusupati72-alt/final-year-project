import pytest
from qiskit import QuantumCircuit

from app.quantum.circuit_analyzer import analyze_circuit
from app.quantum.circuit_parser import parse_openqasm
from app.quantum.circuit_validator import CircuitValidationError


def test_analyzes_bell_circuit_and_interaction_graph():
    circuit = QuantumCircuit(2, 2)
    circuit.h(0)
    circuit.cx(0, 1)
    circuit.measure([0, 1], [0, 1])

    result = analyze_circuit(circuit)

    assert result.qubits == 2
    assert result.classical_bits == 2
    assert result.depth == 3
    assert result.operation_count == 4
    assert result.gate_count == 2
    assert result.single_qubit_gates == 1
    assert result.two_qubit_gates == 1
    assert result.cnot_count == 1
    assert result.gate_density == pytest.approx(1 / 3)
    assert result.interaction_graph == {
        "nodes": [0, 1],
        "edges": [{"source": 0, "target": 1, "weight": 1}],
    }


def test_repeated_interactions_are_weighted():
    circuit = QuantumCircuit(2)
    circuit.cx(0, 1)
    circuit.cx(1, 0)

    result = analyze_circuit(circuit)

    assert result.interaction_graph["edges"] == [
        {"source": 0, "target": 1, "weight": 2}
    ]


def test_qasm2_is_parsed_and_analyzed():
    circuit = parse_openqasm(
        'OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; '
        "h q[0]; cx q[0],q[1];"
    )

    result = analyze_circuit(circuit)

    assert result.qubits == 2
    assert result.two_qubit_gates == 1
    assert result.cnot_count == 1


@pytest.mark.parametrize("source", ["", "   "])
def test_empty_qasm_is_rejected(source):
    with pytest.raises(ValueError, match="non-empty"):
        parse_openqasm(source)


def test_invalid_qasm_is_rejected():
    with pytest.raises(ValueError, match="Invalid OpenQASM 2 input"):
        parse_openqasm("this is not QASM")


def test_more_than_two_qubit_gate_is_rejected():
    circuit = QuantumCircuit(3)
    circuit.ccx(0, 1, 2)

    with pytest.raises(CircuitValidationError, match="more than two qubits"):
        analyze_circuit(circuit)
