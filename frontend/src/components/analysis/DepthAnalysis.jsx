/** Depth and gate-density overview. `layers` is optional actual per-layer data. */
export function DepthAnalysis({ analysis, depth = analysis?.depth, gateCount = analysis?.gate_count, layers, className = "" }) {
  const validDepth = Number.isFinite(depth) && depth >= 0 ? depth : null;
  const density = Number.isFinite(analysis?.gate_density) ? analysis.gate_density : null;
  const layerData = Array.isArray(layers) ? layers : null;
  const maxLayer = Math.max(1, ...(layerData ?? []).map((layer) => Number(layer?.gate_count ?? layer?.count) || 0));
  return <section className={`qpart-frontend-depth-analysis ${className}`.trim()} aria-label="Circuit depth analysis" style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, background: "#11141c", color: "#e7e9ef" }}>
    <h2 style={{ margin: "0 0 12px", fontSize: 17 }}>Depth analysis</h2>
    {validDepth === null ? <p style={{ margin: 0, color: "#969eae" }}>Depth data is not available.</p> : <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 12 }}>
        <p style={{ margin: 0 }}><span style={{ color: "#969eae" }}>Circuit depth</span><br /><strong style={{ fontSize: 24 }}>{validDepth}</strong></p>
        {Number.isFinite(gateCount) && <p style={{ margin: 0 }}><span style={{ color: "#969eae" }}>Gate operations</span><br /><strong style={{ fontSize: 24 }}>{gateCount}</strong></p>}
        {density !== null && <p style={{ margin: 0 }}><span style={{ color: "#969eae" }}>Gate density</span><br /><strong style={{ fontSize: 24 }}>{density.toFixed(3)}</strong></p>}
      </div>
      <p style={{ margin: 0, color: "#aab1c0", fontSize: 13, lineHeight: 1.5 }}>Depth is the number of sequential layers after accounting for operations that can act in parallel. The analyzer reports the depth metric; it does not include per-layer scheduling data.</p>
      {layerData && <ol aria-label="Per-layer operation counts" style={{ display: "grid", gap: 7, margin: "14px 0 0", paddingLeft: 25 }}>{layerData.map((layer, index) => {
        const count = Number(layer?.gate_count ?? layer?.count) || 0;
        return <li key={layer?.index ?? index} style={{ paddingLeft: 3 }}><span aria-hidden="true" style={{ display: "inline-block", width: `${Math.max(4, (count / maxLayer) * 70)}%`, height: 8, marginRight: 8, borderRadius: 5, background: "#9d87ff" }} />Layer {layer?.index ?? index + 1}: {count} gate{count === 1 ? "" : "s"}</li>;
      })}</ol>}
    </>}
  </section>;
}

export default DepthAnalysis;
