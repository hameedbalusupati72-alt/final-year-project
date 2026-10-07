export const MAX_QASM_CHARACTERS = 1_000_000;
export const MAX_SIMULATION_SHOTS = 100_000;
export const MAX_SIMULATION_QUBITS = 20;
export const MAX_RANDOM_SEED = 4_294_967_295;

export function validateQasmInput(qasm) {
  if (typeof qasm !== "string" || qasm.trim().length === 0) {
    return "Enter or upload an OpenQASM 2 circuit first.";
  }
  if (qasm.length > MAX_QASM_CHARACTERS) {
    return `Circuit source exceeds the ${MAX_QASM_CHARACTERS.toLocaleString()} character limit.`;
  }
  return "";
}

export function validateSimulationSettings({ shots, randomSeed }) {
  const shotCount = Number(shots);
  if (!Number.isInteger(shotCount) || shotCount < 1 || shotCount > MAX_SIMULATION_SHOTS) {
    return `Shots must be a whole number from 1 to ${MAX_SIMULATION_SHOTS.toLocaleString()}.`;
  }
  if (randomSeed !== "" && randomSeed !== null && randomSeed !== undefined) {
    const seed = Number(randomSeed);
    if (!Number.isInteger(seed) || seed < 0 || seed > MAX_RANDOM_SEED) {
      return `Random seed must be a whole number from 0 to ${MAX_RANDOM_SEED.toLocaleString()}, or left blank.`;
    }
  }
  return "";
}

export function validateQasmFile(file) {
  if (!file) return "Choose a QASM file first.";
  if (!/\.(qasm|qasm2)$/i.test(file.name)) {
    return "Choose an OpenQASM 2 file with a .qasm or .qasm2 extension.";
  }
  if (file.size > MAX_QASM_CHARACTERS) {
    return "The selected QASM file exceeds the 1 MB upload limit.";
  }
  return "";
}
