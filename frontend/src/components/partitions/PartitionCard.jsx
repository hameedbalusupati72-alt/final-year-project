import { Layers3 } from "lucide-react";

/** Props: partition object ({ id, name|label, qubits, gates, metrics }),
 * selected, onSelect(partition). */
export function PartitionCard({
  partition,
  selected = false,
  onSelect,
  className = "",
}) {
  if (!partition || typeof partition !== "object") return null;
  const name = partition.name ?? partition.label ?? `Partition${partition.id == null ? "" : ` ${partition.id}`}`;
  const qubitCount = Array.isArray(partition.qubits) ? partition.qubits.length : partition.qubitCount;
  const gateCount = Array.isArray(partition.gates) ? partition.gates.length : partition.gateCount;
  const Content = (
    <>
      <Layers3 aria-hidden="true" />
      <strong>{name}</strong>
      {qubitCount != null && <span>Qubits: {String(qubitCount)}</span>}
      {gateCount != null && <span>Gates: {String(gateCount)}</span>}
    </>
  );
  return onSelect ? (
    <button
      type="button"
      className={`qpart-frontend-partition-card${selected ? " qpart-frontend-selected" : ""} ${className}`.trim()}
      onClick={() => onSelect(partition)}
      aria-pressed={selected}
    >
      {Content}
    </button>
  ) : (
    <article className={`qpart-frontend-partition-card ${className}`.trim()}>{Content}</article>
  );
}

export { PartitionCard as default };
