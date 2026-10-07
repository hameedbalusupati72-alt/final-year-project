export default function NoiseForm({ value = "ideal", onChange = () => {} }) {
  return (
    <section className="qpart-frontend-requirement-form">
      <h2>Simulation mode</h2>
      <label>Execution mode<select value={value} onChange={(event) => onChange(event.target.value)}><option value="ideal">Ideal / noiseless</option></select></label>
      <p>Only ideal local Qiskit Aer simulation is currently available. Noise models and hardware execution are not implemented.</p>
    </section>
  );
}
