import { GitCompareArrows } from "lucide-react";

/** Props: strategies: [{ id, name|label, metrics: { metric: value } }]. */
export function StrategyComparison({ strategies = [], className = "" }) {
  const items = Array.isArray(strategies) ? strategies.filter(Boolean) : [];
  const metricNames = [...new Set(items.flatMap((item) =>
    item.metrics && typeof item.metrics === "object" && !Array.isArray(item.metrics)
      ? Object.keys(item.metrics)
      : [],
  ))];
  if (!items.length || !metricNames.length) {
    return (
      <section className={`qpart-frontend-strategy-comparison qpart-frontend-empty ${className}`.trim()}>
        <GitCompareArrows aria-hidden="true" />
        <p>Supply strategies with metrics to compare.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-strategy-comparison ${className}`.trim()}>
      <h3>Strategy comparison</h3>
      <div className="qpart-frontend-table-wrap">
        <table>
          <thead><tr><th>Metric</th>{items.map((item, index) => <th key={item.id ?? index}>{item.name ?? item.label ?? `Strategy ${index + 1}`}</th>)}</tr></thead>
          <tbody>{metricNames.map((metric) => (
            <tr key={metric}><th>{metric}</th>{items.map((item, index) => <td key={item.id ?? index}>{item.metrics?.[metric] == null ? "—" : String(item.metrics[metric])}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

export { StrategyComparison as default };
