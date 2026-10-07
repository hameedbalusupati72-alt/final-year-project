import { GitBranch } from "lucide-react";
import InteractionGraph from "../analysis/InteractionGraph.jsx";

const labelOf = (gate) => gate?.label ?? gate?.name ?? gate?.type ?? "Gate";

/**
 * Draws a supplied gate/wire layout. Coordinates are layout-only: no circuit
 * analysis or cutting is performed here.
 *
 * Props: wires: [{ id, label }], gates: [{ id, label|name|type, wireId|wire,
 * x, y }], onGateSelect(gate), selectedGateId.
 */
export function CuttingGraph({
  interactionGraph,
  wires = [],
  gates = [],
  onGateSelect,
  selectedGateId,
  className = "",
}) {
  if (interactionGraph) {
    return (
      <div className={`qpart-frontend-cutting-graph ${className}`.trim()}>
        <InteractionGraph graph={interactionGraph} title="Weighted qubit interaction graph" />
      </div>
    );
  }
  const validWires = Array.isArray(wires) ? wires : [];
  const validGates = Array.isArray(gates) ? gates : [];
  if (!validWires.length) {
    return (
      <div className={`qpart-frontend-cutting-graph qpart-frontend-empty ${className}`.trim()}>
        <GitBranch aria-hidden="true" />
        <p>Provide wire and gate data to view the circuit layout.</p>
      </div>
    );
  }

  const width = Math.max(360, 180 + validGates.length * 86);
  const rowHeight = 64;
  const height = Math.max(110, 44 + validWires.length * rowHeight);
  const wireIndex = (wireId) =>
    validWires.findIndex((wire) => (wire?.id ?? wire) === wireId);

  return (
    <div className={`qpart-frontend-cutting-graph ${className}`.trim()}>
      <svg
        className="qpart-frontend-cutting-graph-canvas"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Circuit gate and wire layout"
      >
        {validWires.map((wire, index) => {
          const y = 42 + index * rowHeight;
          return (
            <g key={wire?.id ?? index}>
              <text x="8" y={y + 4}>{wire?.label ?? `Wire ${index}`}</text>
              <line x1="86" y1={y} x2={width - 18} y2={y} />
            </g>
          );
        })}
        {validGates.map((gate, index) => {
          const x = Number.isFinite(gate?.x) ? gate.x : 126 + index * 86;
          const requestedWire = gate?.wireId ?? gate?.wire;
          const row = requestedWire == null
            ? 0
            : wireIndex(requestedWire);
          if (!Number.isFinite(gate?.y) && row < 0) return null;
          const y = Number.isFinite(gate?.y) ? gate.y : 42 + row * rowHeight;
          const selected = gate?.id != null && gate.id === selectedGateId;
          return (
            <g
              key={gate?.id ?? index}
              className={`qpart-frontend-gate${selected ? " qpart-frontend-selected" : ""}`}
              role={onGateSelect ? "button" : undefined}
              tabIndex={onGateSelect ? 0 : undefined}
              aria-label={labelOf(gate)}
              onClick={() => onGateSelect?.(gate)}
              onKeyDown={(event) => {
                if (onGateSelect && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onGateSelect(gate);
                }
              }}
            >
              <rect x={x - 25} y={y - 18} width="50" height="36" rx="6" />
              <text x={x} y={y + 4} textAnchor="middle">{labelOf(gate)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export { CuttingGraph as default };
