import { useCallback, useState } from "react";
import { getCircuitAnalysis } from "../services/analysisApi.js";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = useCallback(async (qasm) => {
    setIsAnalyzing(true);
    setError("");
    try {
      const result = await getCircuitAnalysis(qasm);
      setAnalysis(result);
      return result;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Circuit analysis failed.";
      setError(message);
      throw cause;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analysis, setAnalysis, isAnalyzing, error, setError, runAnalysis };
}
