import { useCallback, useState } from "react";
import { validateSimulationSettings } from "../utils/validators.js";
import { simulateOriginalCircuit } from "../services/simulationApi.js";

export function useSimulation() {
  const [result, setResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");

  const simulate = useCallback(async (qasm, settings = {}) => {
    const { shots = 1024, randomSeed = 42 } = settings;
    const validationError = validateSimulationSettings({ shots, randomSeed });
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setIsSimulating(true);
    setError("");
    try {
      const simulation = await simulateOriginalCircuit(qasm, {
        shots: Number(shots),
        randomSeed: randomSeed === "" ? null : randomSeed,
      });
      const stored = { qasm, result: simulation };
      setResult(stored);
      return simulation;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Simulation failed.";
      setError(message);
      throw cause;
    } finally {
      setIsSimulating(false);
    }
  }, []);

  return { result, setResult, isSimulating, error, simulate };
}
