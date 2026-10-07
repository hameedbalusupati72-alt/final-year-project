import { ArrowLeftRight } from "lucide-react";

/** Props: objectives: [{ id, label, before, after, unit }]. */
export function ObjectiveComparison({ objectives = [], className = "" }) {
  const items = Array.isArray(objectives) ? objectives : [];
  if (!items.length) {
    return (
      <section className={`qpart-frontend-objective-comparison qpart-frontend-empty ${className}`.trim()}>
        <ArrowLeftRight aria-hidden="true" />
        <p>No objective comparison data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-objective-comparison ${className}`.trim()}>
      <h3>Objective comparison</h3>
      <div className="qpart-frontend-objective-list">
        {items.map((item, index) => (
          <div className="qpart-frontend-objective-row" key={item?.id ?? index}>
            <strong>{item?.label ?? `Objective ${index + 1}`}</strong>
            <span>{item?.before == null ? "—" : `${String(item.before)}${item.unit ?? ""}`}</span>
            <ArrowLeftRight aria-hidden="true" />
            <span>{item?.after == null ? "—" : `${String(item.after)}${item.unit ?? ""}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export { ObjectiveComparison as default };
