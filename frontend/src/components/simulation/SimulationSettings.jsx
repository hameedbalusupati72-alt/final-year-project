import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

/** Props: value ({ shots, seed }), onChange(nextValue), onSubmit(value),
 * disabled. */
export function SimulationSettings({
  value,
  onChange,
  onSubmit,
  disabled = false,
  className = "",
}) {
  const [localSettings, setLocalSettings] = useState({});
  const current = value === undefined ? localSettings : value;
  const settings = current && typeof current === "object" && !Array.isArray(current) ? current : {};
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
    <form className={`qpart-frontend-simulation-settings ${className}`.trim()} onSubmit={submit}>
      <h3><SlidersHorizontal aria-hidden="true" /> Simulation settings</h3>
      <label>
        Shots
        <input
          type="number"
          min="1"
          step="1"
          value={settings.shots ?? ""}
          placeholder="Enter shot count"
          onChange={(event) => update("shots", event.target.value)}
          disabled={disabled}
        />
      </label>
      <label>
        Seed <span>(optional)</span>
        <input
          type="number"
          step="1"
          value={settings.seed ?? ""}
          placeholder="No seed"
          onChange={(event) => update("seed", event.target.value)}
          disabled={disabled}
        />
      </label>
      {onSubmit && <button type="submit" disabled={disabled}>Run simulation</button>}
    </form>
  );
}

export { SimulationSettings as default };
