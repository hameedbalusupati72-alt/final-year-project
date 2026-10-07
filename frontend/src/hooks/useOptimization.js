import { useCallback, useState } from "react";
import { createPartitionPlan } from "../services/optimizationApi.js";

export function useOptimization() {
  const [result, setResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState("");

  const optimize = useCallback(async (qasm, options) => {
    setIsOptimizing(true);
    setError("");
    try {
      const plan = await createPartitionPlan(qasm, options);
      setResult({ qasm, plan });
      return plan;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Partition planning failed.";
      setError(message);
      throw cause;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return { result, setResult, isOptimizing, error, optimize };
}
