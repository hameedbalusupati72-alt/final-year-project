import { useState } from "react";
import OptimizationSettings from "../components/optimization/OptimizationSettings.jsx";
import OptimizationProgress from "../components/optimization/OptimizationProgress.jsx";
import OptimizationResult from "../components/optimization/OptimizationResult.jsx";

export default function OptimizationPage({ qasm = "", analysis = null, initialSettings, result = null, error = "", isOptimizing = false, onOptimize = () => {}, onNavigate = () => {} }) {
  const [settings, setSettings] = useState(() => initialSettings || {
    max_qubits_per_partition: Math.min(2, analysis?.qubits || 2),
    max_partitions: 4,
    objective: "balanced",
  });
  const plan = result?.result || null;
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>STEP 04 · Z3 STRUCTURAL PLANNING</span><h1>Optimization</h1><p>Plan qubit groups from the original circuit’s weighted interaction graph.</p></header>
      <OptimizationSettings value={settings} onChange={setSettings} maxQubits={analysis?.qubits || 64} disabled={isOptimizing || !analysis} onSubmit={(options) => onOptimize(qasm, options)} />
      {!analysis && <p className="qpart-page-note">Analyze the current circuit before creating a structural plan.</p>}
      <OptimizationProgress active={isOptimizing} status={error ? "error" : plan ? "completed" : ""} message={error || (plan ? "Structural plan ready" : undefined)} />
      <OptimizationResult result={plan} />
      {error && <div role="alert" className="qpart-page-error">{error}</div>}
      <p className="qpart-page-note">This is a structural assignment, not exact gate/wire cutting or subcircuit generation.</p>
      <button type="button" onClick={() => onNavigate("partitions")}>Continue to partitions</button>
    </main>
  );
}
