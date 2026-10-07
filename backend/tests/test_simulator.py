import pytest
from qiskit import QuantumCircuit

from app.quantum.circuit_analyzer import analyze_circuit
from app.quantum.circuit_parser import parse_openqasm
from app.simulation.ideal_simulator import simulate_original_circuit
import app.simulation.ideal_simulator as ideal_simulator


TEST_10_QASM = """OPENQASM 2.0;
include "qelib1.inc";
qreg q[8];
creg c[8];
h q[0];
h q[1];
h q[2];
h q[3];
cx q[0],q[1];
cx q[1],q[2];
cx q[2],q[3];
cx q[3],q[4];
cx q[4],q[5];
cx q[5],q[6];
cx q[6],q[7];
rz(0.5) q[0];
ry(0.8) q[1];
rz(1.2) q[2];
ry(0.7) q[3];
cx q[0],q[4];
cx q[1],q[5];
cx q[2],q[6];
cx q[3],q[7];
cx q[4],q[5];
cx q[5],q[6];
cx q[6],q[7];
measure q -> c;
"""


def assert_valid_distribution(result: dict, *, expected_shots: int) -> None:
    assert result["simulation_status"] == "completed"
    assert result["shots"] == expected_shots
    assert sum(result["counts"].values()) == expected_shots
    assert sum(result["probabilities"].values()) == pytest.approx(1.0)
    assert set(result["counts"]) == set(result["probabilities"])
    assert list(result["counts"].values()) == sorted(
        result["counts"].values(), reverse=True
    )


def test_bell_state_produces_only_correlated_measurement_outcomes():
    circuit = QuantumCircuit(2)
    circuit.h(0)
    circuit.cx(0, 1)

    result = simulate_original_circuit(
        circuit,
        shots=2_000,
        random_seed=42,
    )

    assert_valid_distribution(result, expected_shots=2_000)
    assert result["backend"] == "Qiskit Aer"
    assert result["mode"] == "ideal"
    assert result["scope"] == (
        "Ideal local simulation of the original circuit only. This result "
        "is the baseline for comparing partitioned and reconstructed results later."
    )
    assert result["qubit_count"] == 2
    assert set(result["counts"]).issubset({"00", "11"})
    assert result["random_seed"] == 42


def test_test_10_actual_eight_qubit_qasm_runs_in_aer():
    circuit = parse_openqasm(TEST_10_QASM)
    analysis = analyze_circuit(circuit)

    result = simulate_original_circuit(
        circuit,
        shots=1_024,
        random_seed=42,
    )

    assert_valid_distribution(result, expected_shots=1_024)
    assert result["qubit_count"] == 8
    assert result["total_gates"] == 22
    assert len(analysis.interaction_graph["edges"]) == 11
    assert all(len(outcome) == 8 for outcome in result["counts"])
    assert result["distinct_outcomes"] == len(result["counts"])
    assert result["most_probable_outcome"] == next(iter(result["counts"]))
    assert result["most_probable_probability"] == pytest.approx(
        next(iter(result["probabilities"].values()))
    )


def test_same_seed_repeats_the_same_shot_distribution():
    circuit = parse_openqasm(TEST_10_QASM)

    first = simulate_original_circuit(circuit, shots=256, random_seed=42)
    second = simulate_original_circuit(circuit, shots=256, random_seed=42)

    assert first["counts"] == second["counts"]


def test_no_measurement_is_handled_by_final_all_qubit_readout():
    circuit = QuantumCircuit(2, 1)
    circuit.h(0)

    result = simulate_original_circuit(circuit, shots=64, random_seed=3)

    assert_valid_distribution(result, expected_shots=64)
    assert all(len(outcome) == 2 for outcome in result["counts"])


def test_existing_measurements_and_registers_return_final_qubit_width():
    circuit = parse_openqasm(
        """OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
measure q -> c;
"""
    )

    result = simulate_original_circuit(circuit, shots=64, random_seed=3)

    assert_valid_distribution(result, expected_shots=64)
    assert all(len(outcome) == 2 for outcome in result["counts"])


@pytest.mark.parametrize("shots", [0, -1, 100_001, 1.5, True])
def test_invalid_shot_values_are_rejected(shots):
    with pytest.raises(ValueError, match="Shots must be an integer"):
        simulate_original_circuit(QuantumCircuit(1), shots=shots)


@pytest.mark.parametrize("seed", [-1, 2**32, 1.5, True])
def test_invalid_random_seeds_are_rejected(seed):
    with pytest.raises(ValueError, match="Random seed must be"):
        simulate_original_circuit(QuantumCircuit(1), random_seed=seed)


def test_random_seed_can_be_omitted():
    result = simulate_original_circuit(
        QuantumCircuit(1),
        shots=16,
        random_seed=None,
    )

    assert_valid_distribution(result, expected_shots=16)
    assert result["random_seed"] is None


def test_more_than_twenty_qubits_are_rejected_before_aer_execution():
    with pytest.raises(ValueError, match="at most 20 qubits"):
        simulate_original_circuit(QuantumCircuit(21), shots=1)


def test_missing_measurement_counts_raise_a_readable_error(monkeypatch):
    class EmptyResult:
        def get_counts(self, circuit):
            return {}

    class EmptyJob:
        def result(self):
            return EmptyResult()

    class EmptySimulator:
        def run(self, circuit, **options):
            return EmptyJob()

    monkeypatch.setattr(ideal_simulator, "AerSimulator", EmptySimulator)
    monkeypatch.setattr(
        ideal_simulator,
        "transpile",
        lambda circuit, simulator, **options: circuit,
    )

    with pytest.raises(RuntimeError, match="returned no measurement counts"):
        simulate_original_circuit(QuantumCircuit(1), shots=4)
