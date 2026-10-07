import { Activity, Cpu, Layers3, Network, Zap } from "lucide-react";

const summaryItems = [
  { label: "Qubits", field: "qubits", icon: Cpu },
  { label: "Circuit depth", field: "depth", icon: Layers3 },
  { label: "Operations", field: "operation_count", icon: Activity },
  { label: "Total gates", field: "gate_count", icon: Zap },
  { label: "Qubit interactions", field: null, icon: Network },
];

/** Concise metrics panel; interaction count is derived from graph edges. */
export function AnalysisSummary({ analysis, title = "Analysis summary", className = "" }) {
  if (!analysis) return <section className={`qpart-frontend-analysis-summary ${className}`.trim()} aria-label={title} style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, color: "#969eae" }}>Run analysis to see a summary.</section>;
  const edges = Array.isArray(analysis.interaction_graph?.edges) ? analysis.interaction_graph.edges : [];
  return <section className={`qpart-frontend-analysis-summary ${className}`.trim()} aria-label={title}>
    <h2 style={{ margin: "0 0 12px", fontSize: 18, color: "#e7e9ef" }}>{title}</h2>
    <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 10, margin: 0 }}>
      {summaryItems.map(({ label, field, icon: Icon }) => <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px solid #303443", borderRadius: 8, background: "#11141c" }}>
        <Icon size={18} aria-hidden="true" style={{ color: "#ad98ff", flex: "0 0 auto" }} />
        <div><dt style={{ color: "#9299a8", fontSize: 12 }}>{label}</dt><dd style={{ margin: "3px 0 0", fontSize: 20, fontWeight: 700, color: "#e7e9ef" }}>{field ? (Number.isFinite(analysis[field]) ? analysis[field] : "—") : edges.length}</dd></div>
      </div>)}
    </dl>
  </section>;
}

export default AnalysisSummary;
