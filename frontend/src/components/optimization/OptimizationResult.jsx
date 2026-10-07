import { ChartNoAxesCombined } from "lucide-react";

const labelFor = (key) => key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ");

/** Props: result object. Only scalar fields supplied in result are displayed. */
export function OptimizationResult({ result, className = "" }) {
  const entries =
    result && typeof result === "object" && !Array.isArray(result)
      ? Object.entries(result).filter(([, value]) => value != null && typeof value !== "object")
      : [];
  if (!entries.length) {
    return (
      <section className={`qpart-frontend-optimization-result qpart-frontend-empty ${className}`.trim()}>
        <ChartNoAxesCombined aria-hidden="true" />
        <p>No optimization result is available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-optimization-result ${className}`.trim()}>
      <h3>Optimization result</h3>
      <dl>
        {entries.map(([key, value]) => (
          <div key={key}><dt>{labelFor(key)}</dt><dd>{String(value)}</dd></div>
        ))}
      </dl>
    </section>
  );
}

export { OptimizationResult as default };
