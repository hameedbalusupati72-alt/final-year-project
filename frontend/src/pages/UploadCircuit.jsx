import { FileUp } from "lucide-react";
import CircuitInput from "../components/circuit/CircuitInput.jsx";

export default function UploadCircuit({ qasm = "", onChange = () => {}, onAnalyze = () => {}, isAnalyzing = false, error = "", onError = () => {}, onValidate = null, isValidating = false, validation = null, validationError = "" }) {
  return (
    <main className="qpart-page qpart-upload-page">
      <header className="qpart-page-heading"><span>STEP 01 · CIRCUIT INPUT</span><h1>Provide your OpenQASM circuit</h1><p>Your source is saved in this browser and reused in each later stage.</p></header>
      <div className="qpart-upload-actions"><FileUp size={17} /> QASM file or editable source · maximum file size 1 MB</div>
      <CircuitInput
        value={qasm}
        onChange={(value) => { onChange(value); onError(""); }}
        onAnalyze={onAnalyze}
        loading={isAnalyzing}
        error={error}
        onValidate={onValidate}
        validating={isValidating}
        validation={validation}
        validationError={validationError}
        accept=".qasm,.qasm2"
        examples={[
          {
            id: "bell",
            label: "Bell state · 2 qubits",
            qasm: `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];\nmeasure q -> c;`,
          },
          {
            id: "ghz",
            label: "GHZ state · 5 qubits",
            qasm: `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[5];\ncreg c[5];\nh q[0];\ncx q[0],q[1];\ncx q[1],q[2];\ncx q[2],q[3];\ncx q[3],q[4];\nmeasure q -> c;`,
          },
        ]}
      />
      <p className="qpart-page-note">Paste an OpenQASM 2 circuit or upload a source file up to 1 MB. Analysis and simulation use this same source.</p>
    </main>
  );
}
