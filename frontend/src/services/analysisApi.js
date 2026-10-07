import { analyzeCircuit } from "./api.js";

export { analyzeCircuit };

export async function getCircuitAnalysis(qasm) {
  return analyzeCircuit(qasm);
}
