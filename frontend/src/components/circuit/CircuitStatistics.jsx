const items = [
  ["Qubits", "qubits"], ["Classical bits", "classical_bits"], ["Depth", "depth"],
  ["Operations", "operation_count"], ["Gates", "gate_count"], ["Single-qubit gates", "single_qubit_gates"],
  ["Two-qubit gates", "two_qubit_gates"], ["CNOT gates", "cnot_count"],
];

/** Displays the analyzer's top-level metrics from `analysis`. */
export function CircuitStatistics({ analysis, className = "" }) {
  if (!analysis) return <div className={`qpart-frontend-circuit-statistics ${className}`.trim()} role="status" style={{ color: "#969eae" }}>Analyze a circuit to see its statistics.</div>;
  return <dl className={`qpart-frontend-circuit-statistics ${className}`.trim()} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, margin: 0 }}>
    {items.map(([label, key]) => <div key={key} style={{ padding: 12, border: "1px solid #303443", borderRadius: 8, background: "#11141c" }}><dt style={{ color: "#9299a8", fontSize: 12 }}>{label}</dt><dd style={{ margin: "6px 0 0", color: "#e7e9ef", fontSize: 20, fontWeight: 700 }}>{Number.isFinite(analysis[key]) ? analysis[key] : "—"}</dd></div>)}
    <div style={{ padding: 12, border: "1px solid #303443", borderRadius: 8, background: "#11141c" }}><dt style={{ color: "#9299a8", fontSize: 12 }}>Gate density</dt><dd style={{ margin: "6px 0 0", color: "#e7e9ef", fontSize: 20, fontWeight: 700 }}>{Number.isFinite(analysis.gate_density) ? analysis.gate_density.toFixed(3) : "—"}</dd></div>
  </dl>;
}

export default CircuitStatistics;
