import { Workflow } from "lucide-react";

/** Props: subcircuit object ({ id, name, qubits, gates, depth }), title. */
export function SubcircuitViewer({ subcircuit, title, className = "" }) {
  if (!subcircuit || typeof subcircuit !== "object") {
    return (
      <section className={`qpart-frontend-subcircuit-viewer qpart-frontend-empty ${className}`.trim()}>
        <Workflow aria-hidden="true" />
        <p>No subcircuit selected.</p>
      </section>
    );
  }
  const name = title ?? subcircuit.name ?? subcircuit.label ?? "Subcircuit";
  const qubits = Array.isArray(subcircuit.qubits) ? subcircuit.qubits : [];
  const gates = Array.isArray(subcircuit.gates) ? subcircuit.gates : [];
  return (
    <section className={`qpart-frontend-subcircuit-viewer ${className}`.trim()}>
      <h3><Workflow aria-hidden="true" /> {name}</h3>
      {subcircuit.id != null && <p>ID: {String(subcircuit.id)}</p>}
      {subcircuit.depth != null && <p>Depth: {String(subcircuit.depth)}</p>}
      <div className="qpart-frontend-subcircuit-content">
        <div><strong>Qubits ({qubits.length})</strong>{qubits.length > 0 ? <ul>{qubits.map((q, i) => <li key={q?.id ?? i}>{q?.label ?? q?.id ?? String(q)}</li>)}</ul> : <p>No qubits supplied.</p>}</div>
        <div><strong>Gates ({gates.length})</strong>{gates.length > 0 ? <ol>{gates.map((gate, i) => <li key={gate?.id ?? i}>{gate?.label ?? gate?.name ?? gate?.type ?? String(gate)}</li>)}</ol> : <p>No gates supplied.</p>}</div>
      </div>
    </section>
  );
}

export { SubcircuitViewer as default };
