import { ArrowRight, Atom, BarChart3, Network, Play, Radio } from "lucide-react";

export default function Home({ backendOnline = false, onStart = () => {}, onOpenExample = () => {} }) {
  return (
    <main className="qpart-page qpart-home">
      <span className="qpart-page-eyebrow"><Atom size={15} /> QUANTUM CIRCUIT WORKSPACE</span>
      <h1>Understand the structure behind your quantum circuit.</h1>
      <p>Analyze OpenQASM, inspect qubit interactions, plan structural groups, and run an ideal original-circuit baseline—all from one workspace.</p>
      <div className="qpart-home-actions">
        <button type="button" onClick={onStart}><Play size={16} /> Open circuit workspace <ArrowRight size={15} /></button>
        <button type="button" onClick={onOpenExample}><Atom size={16} /> Load Bell-state example</button>
      </div>
      <div className="qpart-home-status"><span className={backendOnline ? "is-online" : "is-offline"} /><Radio size={16} /> Backend {backendOnline ? "connected" : "not connected yet"}</div>
      <div className="qpart-home-cards">
        <article><BarChart3 size={20} /><h2>Analyze</h2><p>Read gate counts, depth, circuit size, and source explanations.</p></article>
        <article><Network size={20} /><h2>Explore</h2><p>Understand which qubits interact and how often.</p></article>
        <article><Atom size={20} /><h2>Simulate baseline</h2><p>Sample the original circuit with a local ideal Aer simulator.</p></article>
      </div>
    </main>
  );
}
