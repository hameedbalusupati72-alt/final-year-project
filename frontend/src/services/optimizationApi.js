import { optimizeCircuit } from "./api.js";

export { optimizeCircuit };

export function createPartitionPlan(qasm, options) {
  return optimizeCircuit(qasm, options);
}
