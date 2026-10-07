import { Scissors } from "lucide-react";

/**
 * Props: wires: [{ id, label }], cuts: [{ id, wireId, position, label,
 * status }], selectedCutId; onCutSelect(cut).
 */
export function WireCutVisualization({
  wires = [],
  cuts = [],
  selectedCutId,
  onCutSelect,
  className = "",
}) {
  const wireItems = Array.isArray(wires) ? wires : [];
  const cutItems = Array.isArray(cuts) ? cuts : [];
  if (!cutItems.length) {
    return (
      <section className={`qpart-frontend-wire-cuts qpart-frontend-empty ${className}`.trim()}>
        <Scissors aria-hidden="true" />
        <p>No wire cuts were provided.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-wire-cuts ${className}`.trim()} aria-label="Wire cuts">
      <h3>Wire cuts</h3>
      <ul>
        {cutItems.map((cut, index) => {
          const wire = wireItems.find((item) => (item?.id ?? item) === cut?.wireId);
          const label = cut?.label ?? wire?.label ?? (cut?.wireId == null ? `Cut ${index + 1}` : `Wire ${String(cut.wireId)}`);
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
                {cut?.position != null && <span>Position: {String(cut.position)}</span>}
                {cut?.status != null && <span>{String(cut.status)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { WireCutVisualization as default };
