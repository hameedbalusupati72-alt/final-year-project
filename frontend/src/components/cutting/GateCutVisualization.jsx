import { Scissors } from "lucide-react";

/**
 * Props: gates: supplied gate objects; cuts: [{ id, gateId, label, status }];
 * selectedCutId; onCutSelect(cut).
 */
export function GateCutVisualization({
  gates = [],
  cuts = [],
  selectedCutId,
  onCutSelect,
  className = "",
}) {
  const items = Array.isArray(cuts) ? cuts : [];
  const gateItems = Array.isArray(gates) ? gates : [];
  if (!items.length) {
    return (
      <section className={`qpart-frontend-gate-cuts qpart-frontend-empty ${className}`.trim()}>
        <Scissors aria-hidden="true" />
        <p>No gate cuts were provided.</p>
      </section>
    );
  }
  const gateLabel = (id) => {
    const gate = gateItems.find((item) => item?.id === id);
    return gate?.label ?? gate?.name ?? gate?.type ?? (id == null ? null : String(id));
  };
  return (
    <section className={`qpart-frontend-gate-cuts ${className}`.trim()} aria-label="Gate cuts">
      <h3>Gate cuts</h3>
      <ul>
        {items.map((cut, index) => {
          const label = cut?.label ?? gateLabel(cut?.gateId) ?? `Cut ${index + 1}`;
          const selected = cut?.id != null && cut.id === selectedCutId;
          return (
            <li key={cut?.id ?? index}>
              <button
                type="button"
                className={`qpart-frontend-cut-item${selected ? " qpart-frontend-selected" : ""}`}
                onClick={() => onCutSelect?.(cut)}
                disabled={!onCutSelect}
                aria-pressed={onCutSelect ? selected : undefined}
              >
                <Scissors aria-hidden="true" />
                <span>{label}</span>
                {cut?.status != null && <span>{String(cut.status)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { GateCutVisualization as default };
