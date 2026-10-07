import { useCallback, useContext } from "react";
import { CircuitContext } from "../context/CircuitContext.jsx";

export function useCircuit() {
  const context = useContext(CircuitContext);
  if (!context) throw new Error("useCircuit must be used inside CircuitProvider.");
  const {
    qasm,
    setQasm,
    analyzedQasm,
    setAnalyzedQasm,
    analysis,
    setAnalysis,
    fileName,
    setFileName,
    lastAnalyzedAt,
    setLastAnalyzedAt,
  } = context;

  const updateQasm = useCallback((nextQasm) => setQasm(nextQasm), [setQasm]);
  const hasUnanalyzedChanges = Boolean(analysis) && qasm.trim() !== analyzedQasm.trim();

  return {
    qasm,
    setQasm: updateQasm,
    analyzedQasm,
    setAnalyzedQasm,
    analysis,
    setAnalysis,
    fileName,
    setFileName,
    lastAnalyzedAt,
    setLastAnalyzedAt,
    hasUnanalyzedChanges,
  };
}
