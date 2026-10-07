const twoQubitNames = new Set(["cx", "cnot", "cz", "swap", "ecr", "rxx", "ryy", "rzz", "ccx", "toffoli"]);

/** Tabular gate histogram from the backend's `gate_counts` map. */
export function GateStatistics({ analysis, gateCounts = analysis?.gate_counts, className = "" }) {
  const rows = Object.entries(gateCounts ?? {}).filter(([, count]) => Number.isFinite(count)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const maximum = Math.max(1, ...rows.map(([, count]) => count));
  return <section className={`qpart-frontend-gate-statistics ${className}`.trim()} aria-label="Gate statistics" style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, background: "#11141c", color: "#e7e9ef" }}>
    <h2 style={{ margin: "0 0 12px", fontSize: 17 }}>Gate counts</h2>
    {!rows.length ? <p style={{ margin: 0, color: "#969eae" }}>No gate count data is available.</p> : <div style={{ display: "grid", gap: 10 }}>
      {rows.map(([name, count]) => <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(65px, 100px) minmax(60px, 1fr) 38px", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "ui-monospace, monospace", color: "#d7d9e2" }}>{name.toUpperCase()} <span style={{ color: "#9299a8", fontSize: 11 }}>{twoQubitNames.has(name.toLowerCase()) ? "2q" : "1q"}</span></span>
        <span aria-hidden="true" style={{ height: 8, overflow: "hidden", borderRadius: 5, background: "#272c38" }}><span style={{ display: "block", width: `${(count / maximum) * 100}%`, height: "100%", borderRadius: "inherit", background: twoQubitNames.has(name.toLowerCase()) ? "#68b8df" : "#9d87ff" }} /></span>
        <strong style={{ textAlign: "right" }}>{count}</strong>
      </div>)}
    </div>}
  </section>;
}

export default GateStatistics;
