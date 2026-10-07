import { useState } from "react";
import { Activity, CircleHelp } from "lucide-react";
import SimulationSettings from "../components/simulation/SimulationSettings.jsx";
import SimulationResult from "../components/simulation/SimulationResult.jsx";
import ProbabilityChart from "../components/simulation/ProbabilityChart.jsx";
import CountsChart from "../components/simulation/CountsChart.jsx";

export default function SimulationPage({ qasm = "", analysis = null, result = null, error = "", isSimulating = false, onSimulate = () => {} }) {
  const [settings, setSettings] = useState({ shots: 1024, seed: 42 });
  const simulation = result?.result || null;
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>STEP 06 · ORIGINAL-CIRCUIT BASELINE</span><h1>Simulate the Original Circuit</h1><p>Ideal local Qiskit Aer simulation. No hardware or cut reconstruction.</p></header>
      <SimulationSettings value={settings} onChange={setSettings} disabled={isSimulating || !qasm} onSubmit={() => onSimulate(qasm, settings)} />
      <p className="qpart-page-note"><Activity size={16} /> {analysis?.qubits ?? "—"} qubits · maximum 20 qubits · your analyzed QASM is reused automatically.</p>
      {error && <div role="alert" className="qpart-page-error">{error}</div>}
      {simulation && <section className="qpart-baseline-results">
        <SimulationResult result={simulation} />
        <CountsChart counts={simulation.counts} />
        <ProbabilityChart data={simulation.probabilities} />
      </section>}
      {!qasm && <p className="qpart-page-note"><CircleHelp size={16} /> Analyze or upload a circuit before running the original-circuit baseline.</p>}
      <p className="qpart-page-note">Ideal local simulation of the original circuit only. This result is the baseline for comparing partitioned and reconstructed results later.</p>
    </main>
  );
}
