export default function OptimizationForm({ value = {}, onChange = () => {}, disabled = false }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  return (
    <section className="qpart-frontend-requirement-form">
      <h2>Partition-planning objective</h2>
      <label>Objective<select disabled={disabled} value={value.objective || "balanced"} onChange={(event) => update("objective", event.target.value)}><option value="balanced">Balanced group sizes</option><option value="minimize_cuts">Minimize crossing interactions</option><option value="minimize_partitions">Minimize number of groups</option></select></label>
      <p>The current solver minimizes interaction-graph boundaries; it does not model gate-cut sampling overhead.</p>
    </section>
  );
}
