import { Clock3 } from "lucide-react";

/** Props: before and after durations, unit, and display labels. */
export function RuntimeComparison({
  before,
  after,
  unit = "ms",
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}) {
  if (before == null && after == null) {
    return (
      <section className={`qpart-frontend-runtime-comparison qpart-frontend-empty ${className}`.trim()}>
        <Clock3 aria-hidden="true" />
        <p>No runtime comparison data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-runtime-comparison ${className}`.trim()}>
      <h3><Clock3 aria-hidden="true" /> Runtime comparison</h3>
      <div className="qpart-frontend-comparison-values">
        <div><span>{beforeLabel}</span><strong>{before == null ? "—" : `${String(before)} ${unit}`}</strong></div>
        <span aria-hidden="true">→</span>
        <div><span>{afterLabel}</span><strong>{after == null ? "—" : `${String(after)} ${unit}`}</strong></div>
      </div>
    </section>
  );
}

export { RuntimeComparison as default };
