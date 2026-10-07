import { useState } from "react";
import { Settings2 } from "lucide-react";

const DEFAULT_SETTINGS = {
  max_qubits_per_partition: 2,
  max_partitions: 4,
  objective: "balanced",
};

/** Controls for the supported Z3 qubit-group planning request. */
export function OptimizationSettings({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxQubits = 64,
  className = "",
}) {
  const [localSettings, setLocalSettings] = useState(() => ({ ...DEFAULT_SETTINGS }));
  const current = value === undefined ? localSettings : value;
  const settings = {
    ...DEFAULT_SETTINGS,
    ...(current && typeof current === "object" && !Array.isArray(current) ? current : {}),
  };
  const update = (key, nextValue) => {
    const next = { ...settings, [key]: nextValue };
    if (value === undefined) setLocalSettings(next);
    onChange?.(next);
  };
  const submit = (event) => {
    event.preventDefault();
    onSubmit?.(settings);
  };
  return (
    <form className={`qpart-frontend-optimization-settings ${className}`.trim()} onSubmit={submit}>
      <h3><Settings2 aria-hidden="true" /> Optimization settings</h3>
      <label>
        Max qubits per group
        <input
          type="number"
          min="1"
          max={Math.max(1, maxQubits)}
          value={settings.max_qubits_per_partition}
          onChange={(event) => update("max_qubits_per_partition", event.target.value)}
          disabled={disabled}
        />
      </label>
      <label>
        Maximum groups
        <input
          type="number"
          min="1"
          max="16"
          value={settings.max_partitions}
          onChange={(event) => update("max_partitions", event.target.value)}
          disabled={disabled}
        />
      </label>
      <label>
        Solver objective
        <select
          value={settings.objective}
          onChange={(event) => update("objective", event.target.value)}
          disabled={disabled}
        >
          <option value="balanced">Balanced groups</option>
          <option value="minimize_cuts">Fewer crossing interactions</option>
          <option value="minimize_partitions">Fewer groups</option>
        </select>
      </label>
      {onSubmit && <button type="submit" disabled={disabled}>Apply settings</button>}
    </form>
  );
}

export { OptimizationSettings as default };
