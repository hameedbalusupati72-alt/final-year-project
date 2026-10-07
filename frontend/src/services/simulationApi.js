import { simulateCircuit } from "./api.js";

export { simulateCircuit };

export function simulateOriginalCircuit(qasm, { shots = 1024, randomSeed = 42 } = {}) {
  return simulateCircuit(qasm, { shots, random_seed: randomSeed });
}
