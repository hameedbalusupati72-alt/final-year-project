import { useState } from "react";
import StrategyComparison from "../components/comparison/StrategyComparison.jsx";
import PerformanceTable from "../components/comparison/PerformanceTable.jsx";
import { compareDistributions } from "../services/comparisonApi.js";

export default function ComparisonPage({ originalResult = null, savedComparison = null, onComparison = () => {} }) {
  const [candidateText, setCandidateText] = useState(() =>
    savedComparison?.candidate
      ? JSON.stringify(savedComparison.candidate, null, 2)
      : "",
  );
  const [comparison, setComparison] = useState(savedComparison);
  const [error, setError] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const baseline = originalResult;
  const probabilities = baseline?.probabilities;
  const exampleWidth = baseline?.qubit_count || 8;
  const exampleDistribution = JSON.stringify(
    {
      ["0".repeat(exampleWidth)]: 0.5,
      ["1".repeat(exampleWidth)]: 0.5,
    },
    null,
    2,
  );
  const baselineMetrics = baseline ? {
    Qubits: baseline.qubit_count,
    "Distinct outcomes": baseline.distinct_outcomes,
    Shots: baseline.shots,
    "Execution time (s)": baseline.execution_time,
  } : null;

  async function runComparison(event) {
    event.preventDefault();
    setError("");
    setComparison(null);
    if (!probabilities) {
      setError("Run the original-circuit simulation to create a baseline first.");
      return;
    }
    let candidate;
    try {
      candidate = JSON.parse(candidateText);
    } catch {
      setError("Enter a valid JSON object mapping outcome bitstrings to probabilities.");
      return;
    }
    if (!candidate || Array.isArray(candidate) || typeof candidate !== "object") {
      setError("The comparison distribution must be a JSON object.");
      return;
    }

    setIsComparing(true);
    try {
      const result = await compareDistributions(probabilities, candidate);
      const nextComparison = { result, candidate };
      setComparison(nextComparison);
      onComparison({ ...nextComparison, qasm: baseline.qasm || "" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not compare distributions.");
    } finally {
      setIsComparing(false);
    }
  }

  const result = comparison?.result;
  const candidateDistribution = comparison?.candidate;
  const distributionRows = result
    ? [...new Set([...Object.keys(probabilities), ...Object.keys(candidateDistribution)])]
        .sort()
        .map((outcome) => ({
          outcome,
          baseline: `${((probabilities[outcome] ?? 0) * 100).toFixed(2)}%`,
          candidate: `${((candidateDistribution[outcome] ?? 0) * 100).toFixed(2)}%`,
          difference: `${(Math.abs((probabilities[outcome] ?? 0) - (candidateDistribution[outcome] ?? 0)) * 100).toFixed(2)}%`,
        }))
    : [];

  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>RESULT COMPARISON</span><h1>Compare measurement distributions</h1><p>Compare a supplied measured distribution with the original circuit baseline using the backend's classical probability metrics.</p></header>
      <section className="qpart-distribution-compare">
        <h2>Candidate probability distribution</h2>
        <p>Paste the outcome probabilities from a separate experiment or future reconstructed run as JSON. This endpoint compares distributions; it does not generate cut circuits or reconstructed results.</p>
        <form onSubmit={runComparison}>
          <label htmlFor="qpart-candidate-distribution">Outcome bitstring to probability</label>
          <textarea
            id="qpart-candidate-distribution"
            value={candidateText}
            onChange={(event) => setCandidateText(event.target.value)}
            placeholder={exampleDistribution}
            spellCheck={false}
            disabled={!probabilities || isComparing}
          />
          <button type="submit" disabled={!probabilities || isComparing || !candidateText.trim()}>
            {isComparing ? "Comparing…" : "Compare distributions"}
          </button>
        </form>
        {!probabilities && <p className="qpart-page-note">Run an original-circuit simulation first to create the reference distribution.</p>}
        {error && <div role="alert" className="qpart-page-error">{error}</div>}
      </section>
      {result && <>
        <section className="qpart-comparison-metrics" aria-label="Distribution comparison results">
          <article><span>Total variation distance</span><strong>{Number(result.total_variation_distance).toFixed(6)}</strong><small>0 means identical measured distributions</small></article>
          <article><span>Classical distribution fidelity</span><strong>{(Number(result.classical_distribution_fidelity) * 100).toFixed(2)}%</strong><small>Squared Bhattacharyya coefficient; not quantum-state fidelity</small></article>
          <article><span>Outcomes compared</span><strong>{result.outcomes_compared}</strong><small>Union of observed and supplied bitstrings</small></article>
        </section>
        <PerformanceTable
          title="Outcome probability differences"
          columns={[
            { key: "outcome", label: "Outcome" },
            { key: "baseline", label: "Original baseline" },
            { key: "candidate", label: "Candidate" },
            { key: "difference", label: "Absolute difference" },
          ]}
          rows={distributionRows}
        />
        <p className="qpart-page-note">{result.scope}</p>
      </>}
      <StrategyComparison strategies={baselineMetrics ? [{ id: "original", name: "Original Circuit Baseline", metrics: baselineMetrics }] : []} />
      <PerformanceTable
        title="Available baseline metrics"
        columns={[{ key: "metric", label: "Metric" }, { key: "value", label: "Original Circuit Baseline" }]}
        rows={baselineMetrics ? Object.entries(baselineMetrics).map(([metric, value]) => ({ metric, value })) : []}
      />
    </main>
  );
}
