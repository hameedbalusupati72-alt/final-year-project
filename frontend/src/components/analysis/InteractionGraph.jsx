import { useId, useState } from "react";

/** Selectable SVG graph. Edges use `{ source, target, weight }` and nodes are IDs. */
export function InteractionGraph({ interactionGraph, graph = interactionGraph, className = "", onSelectNode, title = "Qubit interaction graph" }) {
  const uid = useId().replace(/:/g, "");
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph?.edges) ? graph.edges.filter((edge) => edge && nodes.some((node) => String(node) === String(edge.source)) && nodes.some((node) => String(node) === String(edge.target))) : [];
  const [selection, setSelection] = useState(null);
  const selected = nodes.find((node) => String(node) === String(selection)) ?? nodes[0] ?? null;
  const width = Math.max(340, nodes.length * 54);
  const cx = width / 2;
  const cy = Math.max(120, Math.min(175, width * 0.34));
  const rx = Math.max(0, cx - 40);
  const ry = Math.max(40, cy - 43);
  const positions = nodes.map((id, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / Math.max(nodes.length, 1));
    return { id, x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
  const points = new Map(positions.map((point) => [String(point.id), point]));
  const selectedEdges = edges.filter((edge) => String(edge.source) === String(selected) || String(edge.target) === String(selected));
  const neighbors = selectedEdges.map((edge) => String(edge.source) === String(selected) ? edge.target : edge.source);
  const height = cy * 2 + 35;
  if (!nodes.length) return <section className={`qpart-frontend-interaction-graph ${className}`.trim()} aria-label={title} style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, background: "#11141c", color: "#969eae" }}><h2 style={{ margin: "0 0 8px", color: "#e7e9ef", fontSize: 17 }}>{title}</h2><p style={{ margin: 0 }}>No qubit interaction data is available.</p></section>;
  return <section className={`qpart-frontend-interaction-graph ${className}`.trim()} aria-label={title} style={{ padding: 16, border: "1px solid #303443", borderRadius: 9, background: "#11141c", color: "#e7e9ef" }}>
    <h2 style={{ margin: "0 0 10px", fontSize: 17 }}>{title}</h2>
    <div style={{ overflowX: "auto" }}><svg role="group" aria-label="Select a qubit to highlight its two-qubit gate connections" viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: "block", maxWidth: "none" }}>
      <defs><linearGradient id={`${uid}-edge`}><stop stopColor="#aa84ff" /><stop offset="1" stopColor="#55c0d5" /></linearGradient></defs>
      {edges.map((edge, index) => {
        const source = points.get(String(edge.source));
        const target = points.get(String(edge.target));
        const emphasized = String(edge.source) === String(selected) || String(edge.target) === String(selected);
        return <g key={`${String(edge.source)}-${String(edge.target)}-${index}`}>
          <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={emphasized ? `url(#${uid}-edge)` : "#566075"} strokeWidth={Math.min(6, 1.4 + (Number(edge.weight) || 1))} strokeOpacity={emphasized ? 1 : 0.52} />
          <title>q{edge.source} to q{edge.target}: {edge.weight ?? 1} gate{Number(edge.weight ?? 1) === 1 ? "" : "s"}</title>
        </g>;
      })}
      {positions.map((point, index) => {
        const chosen = String(point.id) === String(selected);
        const connected = neighbors.some((node) => String(node) === String(point.id));
        return <g key={String(point.id)} role="button" tabIndex={0} aria-label={`Qubit ${point.id}`} aria-pressed={chosen} onClick={() => { setSelection(point.id); onSelectNode?.(point.id); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelection(point.id); onSelectNode?.(point.id); } }} style={{ cursor: "pointer" }}>
          <circle cx={point.x} cy={point.y} r="22" fill={chosen ? "#37304e" : "#202431"} stroke={chosen || connected ? ["#ad8aff", "#65c7dc", "#75d0a1", "#f0bd76"][index % 4] : "#5a6377"} strokeWidth={chosen ? 2.5 : 1.5} />
          <text x={point.x} y={point.y + 4} textAnchor="middle" fill="#f1eff8" fontSize="12" pointerEvents="none">q{point.id}</text>
        </g>;
      })}
    </svg></div>
    <p className="qpart-frontend-interaction-graph-selection" aria-live="polite" style={{ margin: "8px 0 0", color: "#aeb5c4", fontSize: 13 }}>{selected === null ? "No qubit selected." : <>Qubit <strong>{selected}</strong> {selectedEdges.length ? <>connects to {selectedEdges.map((edge) => { const neighbor = String(edge.source) === String(selected) ? edge.target : edge.source; return `q${neighbor} (${edge.weight ?? 1})`; }).join(", ")}</> : "has no two-qubit interactions."}</>}</p>
  </section>;
}

export default InteractionGraph;
