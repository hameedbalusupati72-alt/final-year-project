import { Cpu } from "lucide-react";

/** Props: before and after supplied scalar qubit counts; labels may be overridden. */
export function QubitComparison({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}) {
  if (before == null && after == null) {
    return (
      <section className={`qpart-frontend-qubit-comparison qpart-frontend-empty ${className}`.trim()}>
        <Cpu aria-hidden="true" />
        <p>No qubit comparison data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-qubit-comparison ${className}`.trim()}>
      <h3><Cpu aria-hidden="true" /> Qubit comparison</h3>
      <div className="qpart-frontend-comparison-values">
        <div><span>{beforeLabel}</span><strong>{before == null ? "—" : String(before)}</strong></div>
        <span aria-hidden="true">→</span>
        <div><span>{afterLabel}</span><strong>{after == null ? "—" : String(after)}</strong></div>
      </div>
    </section>
  );
}

export { QubitComparison as default };
