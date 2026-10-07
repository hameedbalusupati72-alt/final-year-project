"""Run the Phase 1 circuit analyzer from the command line."""

import argparse
import json
from pathlib import Path

from qiskit import QuantumCircuit

from app.quantum.circuit_analyzer import analyze_circuit
from app.quantum.circuit_parser import parse_openqasm


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze an OpenQASM 2 circuit.")
    parser.add_argument(
        "qasm_file",
        nargs="?",
        type=Path,
        help="OpenQASM 2 file to analyze; defaults to a Bell circuit.",
    )
    args = parser.parse_args()

    if args.qasm_file is None:
        circuit = QuantumCircuit(2, 2)
        circuit.h(0)
        circuit.cx(0, 1)
        circuit.measure([0, 1], [0, 1])
    else:
        source = args.qasm_file.read_text(encoding="utf-8")
        circuit = parse_openqasm(source)

    print(json.dumps(analyze_circuit(circuit).to_dict(), indent=2))


if __name__ == "__main__":
    main()
