import { createContext, useMemo, useState } from "react";

export const CircuitContext = createContext(null);

const DEFAULT_QASM = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`;

function readStoredCircuit() {
  try {
    const saved = JSON.parse(localStorage.getItem("qpart.analysis-workspace.v1") || "null");
    if (!saved || typeof saved.qasm !== "string") return null;
    return saved;
  } catch {
    return null;
  }
}

export function CircuitProvider({ children }) {
  const [saved] = useState(readStoredCircuit);
  const [qasm, setQasm] = useState(() => saved?.qasm || DEFAULT_QASM);
  const [analyzedQasm, setAnalyzedQasm] = useState(() => saved?.analyzedQasm || "");
  const [analysis, setAnalysis] = useState(() => saved?.analysis || null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState(() => saved?.lastAnalyzedAt || "");
  const [fileName, setFileName] = useState("");

  const value = useMemo(
    () => ({
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
    }),
    [qasm, analyzedQasm, analysis, fileName, lastAnalyzedAt],
  );

  return <CircuitContext.Provider value={value}>{children}</CircuitContext.Provider>;
}
