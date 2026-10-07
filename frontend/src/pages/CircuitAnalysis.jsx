import { BookOpen, CircleHelp } from "lucide-react";
import AnalysisSummary from "../components/analysis/AnalysisSummary.jsx";
import GateStatistics from "../components/analysis/GateStatistics.jsx";
import QubitStatistics from "../components/analysis/QubitStatistics.jsx";
import InteractionGraph from "../components/analysis/InteractionGraph.jsx";
import DepthAnalysis from "../components/analysis/DepthAnalysis.jsx";
import CircuitViewer from "../components/circuit/CircuitViewer.jsx";
import CircuitStatistics from "../components/circuit/CircuitStatistics.jsx";

export default function CircuitAnalysis({ qasm = "", analysis = null, onUpload = () => {}, onAnalyze = () => {}, isAnalyzing = false }) {
  if (!analysis) {
    return <main className="qpart-page"><header className="qpart-page-heading"><span>STEP 02 · CIRCUIT ANALYSIS</span><h1>Analyze your circuit</h1><p>Load OpenQASM 2 and run analysis to calculate circuit metrics and its qubit interaction graph.</p></header><button type="button" onClick={onUpload}>Open circuit input</button></main>;
  }
  return (
    <main className="qpart-page qpart-analysis-page">
      <header className="qpart-page-heading"><span>STEP 02 · ANALYSIS COMPLETE</span><h1>What is happening in this circuit?</h1><p>Metrics are computed from the latest analyzed OpenQASM source.</p></header>
      <div className="qpart-analysis-page-actions"><button type="button" onClick={onAnalyze} disabled={isAnalyzing}>{isAnalyzing ? "Analyzing…" : "Re-analyze circuit"}</button><button type="button" onClick={onUpload}>Edit circuit source</button></div>
      <AnalysisSummary analysis={analysis} />
      <CircuitStatistics analysis={analysis} />
      <QubitStatistics analysis={analysis} />
      <GateStatistics gateCounts={analysis.gate_counts} />
      <DepthAnalysis analysis={analysis} />
      <section className="qpart-analysis-graph"><header><BookOpen size={17} /><div><h2>Qubit interactions</h2><p>Nodes are qubits; edges represent two-qubit gates.</p></div></header><InteractionGraph graph={analysis.interaction_graph} /></section>
      <CircuitViewer qasm={qasm} analysis={analysis} />
      <p className="qpart-page-note"><CircleHelp size={15} /> Analysis describes circuit structure. Measurement outcomes come from the separate ideal simulation stage.</p>
    </main>
  );
}
