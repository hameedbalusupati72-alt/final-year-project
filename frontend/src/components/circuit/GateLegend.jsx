const entries = [
  { kind: "single", label: "Single-qubit gate", color: "#9d87ff" },
  { kind: "two", label: "Two-qubit gate", color: "#68b8df" },
  { kind: "measurement", label: "Measurement / readout", color: "#75d0a1" },
];

/** Key for the gate, wire, and measurement colors used by circuit diagrams. */
export function GateLegend({ items = entries, className = "" }) {
  return <ul className={`qpart-frontend-gate-legend ${className}`.trim()} aria-label="Circuit diagram legend" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", margin: 0, padding: 0, listStyle: "none" }}>
    {items.map((item) => <li key={item.kind ?? item.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#b1b7c4", fontSize: 13 }}><span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: item.kind === "two" ? "50%" : 3, background: item.color ?? "#9d87ff" }} />{item.label}</li>)}
  </ul>;
}

export default GateLegend;
