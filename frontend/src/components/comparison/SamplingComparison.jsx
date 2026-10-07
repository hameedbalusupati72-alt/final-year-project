import { Radio } from "lucide-react";

/** Props: before and after sampling values, unit, and display labels. */
export function SamplingComparison({
  before,
  after,
  unit = "shots",
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}) {
  if (before == null && after == null) {
    return (
      <section className={`qpart-frontend-sampling-comparison qpart-frontend-empty ${className}`.trim()}>
        <Radio aria-hidden="true" />
        <p>No sampling comparison data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-sampling-comparison ${className}`.trim()}>
      <h3><Radio aria-hidden="true" /> Sampling comparison</h3>
      <div className="qpart-frontend-comparison-values">
        <div><span>{beforeLabel}</span><strong>{before == null ? "—" : `${String(before)} ${unit}`}</strong></div>
        <span aria-hidden="true">→</span>
        <div><span>{afterLabel}</span><strong>{after == null ? "—" : `${String(after)} ${unit}`}</strong></div>
      </div>
    </section>
  );
}

export { SamplingComparison as default };
