import { Layers3 } from "lucide-react";
import PartitionCard from "./PartitionCard.jsx";

/** Props: partitions: partition objects; selectedPartitionId; onSelect(partition). */
export function PartitionList({
  partitions = [],
  selectedPartitionId,
  onSelect,
  className = "",
}) {
  const items = Array.isArray(partitions) ? partitions.filter(Boolean) : [];
  if (!items.length) {
    return (
      <section className={`qpart-frontend-partition-list qpart-frontend-empty ${className}`.trim()}>
        <Layers3 aria-hidden="true" />
        <p>No partitions available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-partition-list ${className}`.trim()} aria-label="Partitions">
      <h3>Partitions <span>({items.length})</span></h3>
      <div className="qpart-frontend-partition-grid">
        {items.map((partition, index) => (
          <PartitionCard
            key={partition.id ?? index}
            partition={partition}
            selected={partition.id != null && partition.id === selectedPartitionId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

export { PartitionList as default };
