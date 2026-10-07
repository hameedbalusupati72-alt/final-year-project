import { createContext, useMemo, useState } from "react";

export const ProjectContext = createContext(null);

function readSavedProject() {
  try {
    const saved = JSON.parse(localStorage.getItem("qpart.analysis-workspace.v1") || "null");
    return {
      partitionResult: saved?.partitionResult || null,
      simulationResult:
        saved?.simulationResult?.result?.simulation_status === "completed"
          ? saved.simulationResult
          : null,
      comparisonResult: saved?.comparisonResult || null,
    };
  } catch {
    return { partitionResult: null, simulationResult: null, comparisonResult: null };
  }
}

export function ProjectProvider({ children }) {
  const [saved] = useState(readSavedProject);
  const [activePage, setActivePage] = useState("analyzer");
  const [partitionResult, setPartitionResult] = useState(() => saved.partitionResult);
  const [simulationResult, setSimulationResult] = useState(() => saved.simulationResult);
  const [comparisonResult, setComparisonResult] = useState(() => saved.comparisonResult);

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      partitionResult,
      setPartitionResult,
      simulationResult,
      setSimulationResult,
      comparisonResult,
      setComparisonResult,
    }),
    [activePage, partitionResult, simulationResult, comparisonResult],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
