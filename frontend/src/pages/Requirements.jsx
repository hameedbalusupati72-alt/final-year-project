import { useState } from "react";
import RequirementForm from "../components/requirements/RequirementForm.jsx";
import HardwareForm from "../components/requirements/HardwareForm.jsx";
import OptimizationForm from "../components/requirements/OptimizationForm.jsx";
import NoiseForm from "../components/requirements/NoiseForm.jsx";

export default function Requirements({ settings = {}, onSave = () => {}, onNavigate = () => {} }) {
  const [optimization, setOptimization] = useState({ objective: settings.objective || "balanced" });
  const [hardware, setHardware] = useState({});
  const [mode, setMode] = useState("ideal");
  const [resourceLimits, setResourceLimits] = useState({
    maxQubits: settings.max_qubits_per_partition ?? 2,
    maxPartitions: settings.max_partitions ?? 4,
  });
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>PROJECT SETTINGS</span><h1>Requirements and run settings</h1><p>Configure the currently supported planning and baseline simulation controls.</p></header>
      <RequirementForm initialValues={resourceLimits} onSubmit={(values) => { setResourceLimits({ maxQubits: values.max_qubits_per_partition, maxPartitions: values.max_partitions }); onSave({ ...values, objective: optimization.objective }); }} />
      <div className="qpart-requirements-grid"><HardwareForm value={hardware} onChange={setHardware} /><OptimizationForm value={optimization} onChange={(value) => { setOptimization(value); onSave({ max_qubits_per_partition: resourceLimits.maxQubits, max_partitions: resourceLimits.maxPartitions, objective: value.objective }); }} /><NoiseForm value={mode} onChange={setMode} /></div>
      <div className="qpart-page-note">Hardware mapping and noise simulation are settings placeholders only and do not affect current ideal Aer runs.</div>
      <button type="button" onClick={() => onNavigate("optimization")}>Continue to optimization</button>
    </main>
  );
}
