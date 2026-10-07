import { CircleHelp, Network } from "lucide-react";
import CuttingGraphView from "../components/cutting/CuttingGraph.jsx";
import CutSummary from "../components/cutting/CutSummary.jsx";
import GateCutVisualization from "../components/cutting/GateCutVisualization.jsx";
import WireCutVisualization from "../components/cutting/WireCutVisualization.jsx";

export default function CuttingGraphPage({ analysis = null, partitionPlan = null, onNavigate = () => {} }) {
  const graph = analysis?.interaction_graph;
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>STEP 03 · CIRCUIT STRUCTURE</span><h1>Cutting graph</h1><p>Inspect the weighted interaction graph from the analyzed original circuit.</p></header>
      {graph ? <><section className="qpart-analysis-graph"><header><Network size={17} /><div><h2>Analyzed interaction graph</h2><p>{analysis.qubits} qubits · {graph.edges.length} unique interaction pairs</p></div></header><CuttingGraphView interactionGraph={graph} /></section><CutSummary title="Graph summary" summary={{ qubits: analysis.qubits, interaction_pairs: graph.edges.length, structural_plan: partitionPlan ? "available" : "not run" }} /><section className="qpart-requirements-grid"><GateCutVisualization gates={[]} cuts={[]} /><WireCutVisualization wires={[]} cuts={[]} /></section></> : <p className="qpart-page-note">Analyze a circuit first to see its interaction graph.</p>}
      <p className="qpart-page-note"><CircleHelp size={15} /> The graph shows interactions; it does not by itself identify valid gate or wire cuts.</p>
      <button type="button" onClick={() => onNavigate("optimization")}>Continue to optimization</button>
    </main>
  );
}
