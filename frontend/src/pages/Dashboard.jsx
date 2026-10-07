import { Activity, ArrowRight, Atom, Layers3, Network, Sparkles } from "lucide-react";

export default function Dashboard({ analysis, simulationResult, partitionResult, onNavigate = () => {} }) {
  const simulation = simulationResult?.result;
  const plan = partitionResult?.result;
  const metrics = [
    ["Qubits", analysis?.qubits ?? "—", Atom],
    ["Gates", analysis?.gate_count ?? "—", Sparkles],
    ["Interaction pairs", analysis?.interaction_graph?.edges?.length ?? "—", Network],
    ["Baseline shots", simulation?.shots?.toLocaleString() ?? "Not run", Activity],
    ["Planned groups", plan?.partition_count ?? "Not planned", Layers3],
  ];
  const steps = [
    ["Circuit analyzer", "Inspect gates, depth, and qubit connectivity.", "analyzer"],
    ["Cutting graph", "Explore the analyzed two-qubit interaction graph.", "cutting"],
    ["Optimization", "Build a Z3 structural qubit-group plan.", "optimization"],
    ["Partitions", "Inspect group assignments and crossing interactions.", "partitions"],
    ["Simulation", "Sample the original circuit as a comparison baseline.", "simulation"],
    ["Comparison and report", "Review available analysis and baseline exports.", "report"],
  ];

  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>PROJECT OVERVIEW</span><h1>Quantum circuit dashboard</h1><p>Your current circuit and workflow status in one place.</p></header>
      <section className="qpart-dashboard-metrics">
        {metrics.map(([label, value, Icon]) => <article key={label}><Icon size={17} /><span>{label}</span><strong>{value}</strong></article>)}
      </section>
      <section className="qpart-dashboard-workflow">
        <header><h2>Workspace sections</h2><p>Open a stage to see circuit-specific information and controls.</p></header>
        <div>{steps.map(([title, description, key], index) => <button key={key} type="button" onClick={() => onNavigate(key)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{description}</small><ArrowRight size={16} /></button>)}</div>
      </section>
    </main>
  );
}
