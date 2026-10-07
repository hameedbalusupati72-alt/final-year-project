import { BarChart3 } from "lucide-react";

/** Props: counts as [{ label|state, value|count }] or { outcome: count }. */
export function CountsChart({ counts, title = "Measurement counts", className = "" }) {
  const entries = Array.isArray(counts)
    ? counts.map((item, index) => [item?.label ?? item?.state ?? `Outcome ${index + 1}`, item?.value ?? item?.count])
    : counts && typeof counts === "object"
      ? Object.entries(counts)
      : [];
  const valid = entries.filter(([, value]) => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) {
    return (
      <section className={`qpart-frontend-counts-chart qpart-frontend-empty ${className}`.trim()}>
        <BarChart3 aria-hidden="true" />
        <p>No measurement counts available.</p>
      </section>
    );
  }
  const max = Math.max(0, ...valid.map(([, value]) => value));
  return (
    <section className={`qpart-frontend-counts-chart ${className}`.trim()}>
      <h3><BarChart3 aria-hidden="true" /> {title}</h3>
      <ul>
        {valid.map(([label, value], index) => {
          const width = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
          return (
            <li key={`${String(label)}-${index}`}>
              <span>{String(label)}</span>
              <div className="qpart-frontend-chart-track"><div className="qpart-frontend-chart-bar" style={{ width: `${width}%` }} /></div>
              <strong>{value.toLocaleString()}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { CountsChart as default };
