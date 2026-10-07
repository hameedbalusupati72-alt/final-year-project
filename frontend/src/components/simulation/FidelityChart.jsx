import { ChartNoAxesColumnIncreasing } from "lucide-react";

/** Props: data: [{ label, value }], where values are caller-provided; title. */
export function FidelityChart({ data = [], title = "Fidelity", className = "" }) {
  const items = (Array.isArray(data) ? data : []).filter(
    (item) => item && typeof item.value === "number" && Number.isFinite(item.value),
  );
  if (!items.length) {
    return (
      <section className={`qpart-frontend-fidelity-chart qpart-frontend-empty ${className}`.trim()}>
        <ChartNoAxesColumnIncreasing aria-hidden="true" />
        <p>No fidelity data available.</p>
      </section>
    );
  }
  const minimum = Math.min(0, ...items.map((item) => item.value));
  const maximum = Math.max(0, ...items.map((item) => item.value));
  const span = maximum - minimum || 1;
  return (
    <section className={`qpart-frontend-fidelity-chart ${className}`.trim()}>
      <h3><ChartNoAxesColumnIncreasing aria-hidden="true" /> {title}</h3>
      <div className="qpart-frontend-fidelity-bars">
        {items.map((item, index) => {
          const height = Math.max(0, Math.min(100, ((item.value - minimum) / span) * 100));
          return (
            <div className="qpart-frontend-fidelity-item" key={item.id ?? index}>
              <div className="qpart-frontend-fidelity-bar-wrap">
                <div className="qpart-frontend-fidelity-bar" style={{ height: `${height}%` }} title={String(item.value)} />
              </div>
              <span>{item.label ?? `Sample ${index + 1}`}</span>
              <strong>{item.value.toLocaleString(undefined, { maximumFractionDigits: 6 })}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { FidelityChart as default };
