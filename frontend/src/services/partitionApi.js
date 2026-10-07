import { createPartitionPlan } from "./optimizationApi.js";

export { createPartitionPlan };

export function describePartitionPlan(plan) {
  if (!plan || plan.status !== "structural_partition_plan") {
    throw new Error("A valid structural partition plan is required.");
  }
  return {
    partitions: plan.partitions,
    crossingInteractions: plan.cut_edges,
    scope: plan.scope,
    generatesSubcircuits: false,
  };
}
