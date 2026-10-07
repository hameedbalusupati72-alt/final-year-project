import { Layers3 } from "lucide-react";

/** Props: partition object; optional title. Displays only supplied partition data. */
export function PartitionViewer({ partition, title, className = "" }) {
  if (!partition || typeof partition !== "object") {
    return (
      <section className={`qpart-frontend-partition-viewer qpart-frontend-empty ${className}`.trim()}>
        <Layers3 aria-hidden="true" />
        <p>Select a partition to inspect its supplied details.</p>
      </section>
    );
  }
  const name = title ?? partition.name ?? partition.label ?? "Partition details";
  const qubits = Array.isArray(partition.qubits) ? partition.qubits : [];
  const gates = Array.isArray(partition.gates) ? partition.gates : [];
  const scalars = Object.entries(partition).filter(
    ([key, value]) => !["qubits", "gates"].includes(key) && value != null && typeof value !== "object",
  );
  return (
    <section className={`qpart-frontend-partition-viewer ${className}`.trim()}>
      <h3>{name}</h3>
      {qubits.length > 0 && <div><strong>Qubits</strong><ul>{qubits.map((q, i) => <li key={q?.id ?? i}>{q?.label ?? q?.id ?? String(q)}</li>)}</ul></div>}
      {gates.length > 0 && <div><strong>Gates</strong><ul>{gates.map((gate, i) => <li key={gate?.id ?? i}>{gate?.label ?? gate?.name ?? gate?.type ?? String(gate)}</li>)}</ul></div>}
      {scalars.length > 0 && (
        <dl>{scalars.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl>
      )}
      {!qubits.length && !gates.length && !scalars.length && <p>No details were supplied for this partition.</p>}
    </section>
  );
}

export { PartitionViewer as default };
