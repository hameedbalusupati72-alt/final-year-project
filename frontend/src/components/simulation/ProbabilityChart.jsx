import { ChartPie } from "lucide-react";

/** Props: data as [{ label, value }] or { outcome: probability }; title. */
export function ProbabilityChart({ data, title = "Outcome probabilities", className = "" }) {
  const entries = Array.isArray(data)
    ? data.map((item, index) => [item?.label ?? `Outcome ${index + 1}`, item?.value])
    : data && typeof data === "object"
      ? Object.entries(data)
      : [];
  const valid = entries.filter(([, value]) => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) {
    return (
      <section className={`qpart-frontend-probability-chart qpart-frontend-empty ${className}`.trim()}>
        <ChartPie aria-hidden="true" />
        <p>No probability data available.</p>
      </section>
    );
  }
  const max = Math.max(0, ...valid.map(([, value]) => value));
  return (
    <section className={`qpart-frontend-probability-chart ${className}`.trim()}>
      <h3><ChartPie aria-hidden="true" /> {title}</h3>
      <ul>
        {valid.map(([label, value], index) => {
          const width = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
          return (
            <li key={`${String(label)}-${index}`}>
              <span>{String(label)}</span>
              <div className="qpart-frontend-chart-track"><div className="qpart-frontend-chart-bar" style={{ width: `${width}%` }} /></div>
              <strong>{value.toLocaleString(undefined, { maximumFractionDigits: 6 })}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { ProbabilityChart as default };
