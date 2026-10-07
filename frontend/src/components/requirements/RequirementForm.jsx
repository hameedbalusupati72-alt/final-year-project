import { useState } from "react";
import { Check, Settings2 } from "lucide-react";

export default function RequirementForm({ initialValues = {}, onSubmit = () => {} }) {
  const [values, setValues] = useState({
    maxQubits: initialValues.maxQubits ?? 2,
    maxPartitions: initialValues.maxPartitions ?? 4,
  });

  function submit(event) {
    event.preventDefault();
    onSubmit({
      max_qubits_per_partition: Number(values.maxQubits),
      max_partitions: Number(values.maxPartitions),
    });
  }

  return (
    <form className="qpart-frontend-requirement-form" onSubmit={submit}>
      <header><Settings2 size={18} /><div><h2>Resource requirements</h2><p>Choose limits for the structural qubit-group planner.</p></div></header>
      <label>Maximum qubits per group<input min="1" max="64" type="number" required value={values.maxQubits} onChange={(event) => setValues({ ...values, maxQubits: event.target.value })} /></label>
      <label>Maximum number of groups<input min="1" max="16" type="number" required value={values.maxPartitions} onChange={(event) => setValues({ ...values, maxPartitions: event.target.value })} /></label>
      <button type="submit"><Check size={15} /> Save requirements</button>
    </form>
  );
}
