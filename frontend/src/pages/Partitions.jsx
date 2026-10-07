import { useState } from "react";
import PartitionList from "../components/partitions/PartitionList.jsx";
import PartitionViewer from "../components/partitions/PartitionViewer.jsx";
import SubcircuitViewer from "../components/partitions/SubcircuitViewer.jsx";

export default function PartitionsPage({ plan = null, onNavigate = () => {} }) {
  const result = plan?.result || null;
  const [selectedId, setSelectedId] = useState(null);
  const partitions = (result?.partitions || []).map((partition) => ({
    ...partition,
    id: partition.partition_id,
    name: `Group ${partition.partition_id + 1}`,
    qubitCount: partition.qubit_count,
  }));
  const selectedPartition = partitions.find((partition) => partition.id === selectedId) || partitions[0];
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>STEP 05 · STRUCTURAL ASSIGNMENTS</span><h1>Partitions</h1><p>Inspect the qubit groups returned by the Z3 structural plan.</p></header>
      {result ? <><PartitionList partitions={partitions} selectedPartitionId={selectedPartition?.id} onSelect={(partition) => setSelectedId(partition.id)} /><PartitionViewer partition={selectedPartition} /><section className="qpart-partition-crossings"><h2>Crossing interactions · {result.crossing_gate_count}</h2>{result.cut_edges?.length ? result.cut_edges.map((edge) => <article key={`${edge.source}-${edge.target}`}><strong>q[{edge.source}] ↔ q[{edge.target}]</strong><span>Groups {edge.source_partition + 1} → {edge.target_partition + 1}</span><span>{edge.weight} interaction{edge.weight === 1 ? "" : "s"} · instruction{edge.operation_indices.length === 1 ? "" : "s"} {edge.operation_indices.map((index) => index + 1).join(", ")}</span></article>) : <p>No interaction edges cross the assigned groups.</p>}</section><SubcircuitViewer /></> : <p className="qpart-page-note">Run optimization first to create a structural group assignment.</p>}
      <button type="button" onClick={() => onNavigate("simulation")}>Continue to original-circuit simulation</button>
    </main>
  );
}
