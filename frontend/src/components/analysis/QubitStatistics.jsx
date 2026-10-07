/** Per-qubit interaction degree derived from `analysis.interaction_graph`. */
export function QubitStatistics({ analysis, interactionGraph = analysis?.interaction_graph, qubits = analysis?.qubits, className = "" }) {
  const nodes = Array.isArray(interactionGraph?.nodes) ? interactionGraph.nodes : Array.from({ length: Number.isFinite(qubits) ? qubits : 0 }, (_, index) => index);
  const edges = Array.isArray(interactionGraph?.edges) ? interactionGraph.edges : [];
  const degreeByNode = new Map(nodes.map((node) => [String(node), 0]));
  for (const edge of edges) {
    const source = String(edge.source);
    const target = String(edge.target);
    degreeByNode.set(source, (degreeByNode.get(source) ?? 0) + (Number(edge.weight) || 1));
    degreeByNode.set(target, (degreeByNode.get(target) ?? 0) + (Number(edge.weight) || 1));
  }
  const rows = nodes.map((node) => ({ node, degree: degreeByNode.get(String(node)) ?? 0 }));
  const maxDegree = Math.max(1, ...rows.map((row) => row.degree));
  return <section className={`qpart-frontend-qubit-statistics ${className}`.trim()} aria-label="Qubit statistics" style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, background: "#11141c", color: "#e7e9ef" }}>
    <h2 style={{ margin: "0 0 7px", fontSize: 17 }}>Qubit interactions</h2>
    <p style={{ margin: "0 0 12px", color: "#969eae", fontSize: 13 }}>Weighted degree counts each two-qubit gate touching the qubit.</p>
    {!rows.length ? <p style={{ margin: 0, color: "#969eae" }}>No qubit data is available.</p> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: 8 }}>
      {rows.map(({ node, degree }) => <div key={String(node)} style={{ padding: 10, border: "1px solid #303443", borderRadius: 7, background: "#151821" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}><strong>q{node}</strong><span style={{ color: "#b7a6ff" }}>{degree}</span></div>
        <span aria-hidden="true" style={{ display: "block", height: 4, marginTop: 8, borderRadius: 3, background: "#292d39" }}><span style={{ display: "block", width: `${(degree / maxDegree) * 100}%`, height: "100%", borderRadius: "inherit", background: "#66bdd7" }} /></span>
      </div>)}
    </div>}
  </section>;
}

export default QubitStatistics;
