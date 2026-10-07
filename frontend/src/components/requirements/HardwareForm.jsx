export default function HardwareForm({ onChange = () => {}, value = {} }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  return (
    <section className="qpart-frontend-requirement-form">
      <header><h2>Hardware profile</h2><p>Hardware mapping is a future stage. These fields are planning notes only and do not affect simulation.</p></header>
      <label>Hardware name<input value={value.name || ""} onChange={(event) => update("name", event.target.value)} placeholder="e.g. target device" /></label>
      <label>Available qubits<input type="number" min="1" value={value.qubits || ""} onChange={(event) => update("qubits", event.target.value)} placeholder="Not configured" /></label>
      <p role="note">No hardware device is contacted by this application.</p>
    </section>
  );
}
