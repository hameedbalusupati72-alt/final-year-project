"""Ideal shot-based simulation of an original circuit with Qiskit Aer."""

from collections import Counter
from time import perf_counter

from qiskit import ClassicalRegister, QuantumCircuit, transpile
from qiskit.exceptions import QiskitError
from qiskit_aer import AerSimulator
from qiskit_aer.aererror import AerError

from app.config.settings import settings
from app.quantum.circuit_analyzer import analyze_circuit
from app.quantum.circuit_validator import validate_circuit

MAX_SIMULATION_QUBITS = settings.max_simulation_qubits
MAX_SHOTS = settings.max_shots
MAX_RANDOM_SEED = 2**32 - 1


def _final_measurement_register_name(circuit: QuantumCircuit) -> str:
    register_names = {register.name for register in circuit.cregs}
    register_name = "baseline"
    suffix = 1
    while register_name in register_names:
        register_name = f"baseline_{suffix}"
        suffix += 1
    return register_name


def _extract_final_outcomes(raw_counts: dict[str, int]) -> dict[str, int]:
    outcomes: Counter[str] = Counter()
    for raw_outcome, count in raw_counts.items():
        # Aer displays the most recently added classical register first.
        outcome = raw_outcome.split()[0].replace("_", "")
        outcomes[outcome] += count
    return dict(outcomes)


def simulate_original_circuit(
    circuit: QuantumCircuit,
    *,
    shots: int = 1024,
    random_seed: int | None = 42,
) -> dict:
    """Return real, reproducible ideal-shot results for the source circuit."""
    validate_circuit(circuit)
    if (
        not isinstance(shots, int)
        or isinstance(shots, bool)
        or not 1 <= shots <= MAX_SHOTS
    ):
        raise ValueError(f"Shots must be an integer from 1 to {MAX_SHOTS:,}.")
    if random_seed is not None and (
        not isinstance(random_seed, int)
        or isinstance(random_seed, bool)
        or not 0 <= random_seed <= MAX_RANDOM_SEED
    ):
        raise ValueError(
            "Random seed must be an integer from 0 to 4,294,967,295, or null."
        )
    if circuit.num_qubits > MAX_SIMULATION_QUBITS:
        raise ValueError(
            f"Local simulation supports at most {MAX_SIMULATION_QUBITS} qubits; "
            f"this circuit has {circuit.num_qubits}."
        )

    analysis = analyze_circuit(circuit)
    simulation_circuit = circuit.copy()
    final_register = ClassicalRegister(
        circuit.num_qubits,
        _final_measurement_register_name(simulation_circuit),
    )
    simulation_circuit.add_register(final_register)
    simulation_circuit.measure(range(circuit.num_qubits), final_register)

    simulator = AerSimulator()
    transpile_options = (
        {"seed_transpiler": random_seed} if random_seed is not None else {}
    )
    started_at = perf_counter()
    try:
        compiled = transpile(simulation_circuit, simulator, **transpile_options)
        run_options = {"shots": shots}
        if random_seed is not None:
            run_options["seed_simulator"] = random_seed
        result = simulator.run(compiled, **run_options).result()
        raw_counts = result.get_counts(compiled)
    except (AerError, QiskitError, RuntimeError) as exc:
        raise RuntimeError(f"Aer could not complete the simulation: {exc}") from exc
    execution_time = perf_counter() - started_at

    if not raw_counts:
        raise RuntimeError(
            "Aer returned no measurement counts for the original circuit."
        )

    counts = _extract_final_outcomes(raw_counts)
    total_shots = sum(counts.values())
    if total_shots != shots:
        raise RuntimeError(
            f"Aer returned {total_shots} measurement shots; expected {shots}."
        )

    ordered_counts = dict(
        sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    )
    probabilities = {
        outcome: count / total_shots
        for outcome, count in ordered_counts.items()
    }
    most_probable_outcome = next(iter(ordered_counts))

    return {
        "simulation_status": "completed",
        "backend": "Qiskit Aer",
        "mode": "ideal",
        "shots": total_shots,
        "random_seed": random_seed,
        "qubit_count": circuit.num_qubits,
        "circuit_depth": analysis.depth,
        "total_gates": analysis.gate_count,
        "execution_time": execution_time,
        "counts": ordered_counts,
        "probabilities": probabilities,
        "distinct_outcomes": len(ordered_counts),
        "most_probable_outcome": most_probable_outcome,
        "most_probable_probability": probabilities[most_probable_outcome],
        "scope": (
            "Ideal local simulation of the original circuit only. This result "
            "is the baseline for comparing partitioned and reconstructed "
            "results later."
        ),
    }
