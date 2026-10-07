import { useState } from "react";
import { Activity } from "lucide-react";

/** Displays measured output returned by the original-circuit simulator. */
export function SimulationResult({ result, className = "" }) {
  const [showAll, setShowAll] = useState(false);
  const outcomes = result?.counts && typeof result.counts === "object"
    ? Object.entries(result.counts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    : [];
  const displayedOutcomes = showAll ? outcomes : outcomes.slice(0, 8);
  const totalProbability = result?.probabilities
    ? Object.values(result.probabilities).reduce((sum, probability) => sum + probability, 0)
    : 0;
  if (!result || typeof result !== "object") {
    return (
      <section className={`qpart-frontend-simulation-result qpart-frontend-empty ${className}`.trim()}>
        <Activity aria-hidden="true" />
        <p>The original-circuit baseline has not been run yet.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-simulation-result ${className}`.trim()}>
      <header>
        <span>RESULT READY</span>
        <h2><Activity aria-hidden="true" /> Original Circuit Baseline</h2>
        <p>Ideal local simulation of the original circuit only. This result is the baseline for comparing partitioned and reconstructed results later.</p>
      </header>
      <dl className="qpart-baseline-metrics">
        <div><dt>Shots</dt><dd>{Number(result.shots).toLocaleString()}</dd></div>
        <div><dt>Execution time</dt><dd>{Number(result.execution_time).toFixed(4)} s</dd></div>
        <div><dt>Backend</dt><dd>{result.backend ?? "—"}</dd></div>
        <div><dt>Mode</dt><dd>{result.mode ?? "—"}</dd></div>
        <div><dt>Qubits</dt><dd>{result.qubit_count ?? "—"}</dd></div>
        <div><dt>Distinct outcomes</dt><dd>{result.distinct_outcomes ?? outcomes.length}</dd></div>
      </dl>
      <div className="qpart-outcome-table-wrap">
        <table className="qpart-outcome-table">
          <caption>Observed outcomes, sorted by count</caption>
          <thead><tr><th>Outcome</th><th>Shots</th><th>Probability</th></tr></thead>
          <tbody>{displayedOutcomes.map(([bitstring, count]) => <tr key={bitstring}><td><code>{bitstring}</code></td><td>{Number(count).toLocaleString()}</td><td>{(Number(result.probabilities?.[bitstring] ?? 0) * 100).toFixed(2)}%</td></tr>)}</tbody>
        </table>
        {outcomes.length > 8 && <button type="button" onClick={() => setShowAll((visible) => !visible)}>{showAll ? "Show top 8 outcomes" : `Show all ${outcomes.length} outcomes`}</button>}
      </div>
      <p className="qpart-page-note">Total probability: <strong>{(totalProbability * 100).toFixed(2)}%</strong></p>
    </section>
  );
}

export { SimulationResult as default };
