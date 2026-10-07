import { useState } from "react";
import { Play } from "lucide-react";
import Button from "../common/Button.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import CircuitUpload from "./CircuitUpload.jsx";

/** Editable QASM input. `onChange` receives source text; `onAnalyze` submits it. */
export function CircuitInput({ value = "", onChange, onAnalyze, onValidate, validating = false, validation = null, validationError = "", placeholder = 'OPENQASM 2.0;\\ninclude "qelib1.inc";\\nqreg q[2];', loading = false, disabled = false, error, examples = [], onFileSelect, accept = ".qasm,.qasm2,text/plain", className = "" }) {
  const [localError, setLocalError] = useState("");
  const selectedExample =
    examples.find((example) => example.qasm === value)?.id ?? "";
  function loadFile(file, text) {
    setLocalError("");
    onChange?.(text);
    onFileSelect?.(file, text);
  }
  return (
    <section className={`qpart-frontend-circuit-input ${className}`.trim()} aria-label="Circuit source input" style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <label htmlFor="qpart-frontend-qasm-input" style={{ fontWeight: 600 }}>OpenQASM 2 source</label>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {examples.length > 0 && <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>Examples
            <select aria-label="Load an example circuit" value={selectedExample} disabled={disabled} onChange={(event) => { const example = examples.find((item) => item.id === event.target.value); if (example) { setLocalError(""); onChange?.(example.qasm); } }} style={{ minHeight: 34, border: "1px solid #3a4050", borderRadius: 6, background: "#151821", color: "inherit" }}>
              <option value="" disabled>Select…</option>{examples.map((example) => <option key={example.id} value={example.id}>{example.label}</option>)}
            </select>
          </label>}
          <CircuitUpload onFileSelect={loadFile} accept={accept} disabled={disabled || loading} />
        </div>
      </div>
      <textarea id="qpart-frontend-qasm-input" className="qpart-frontend-qasm-textarea" value={value} onChange={(event) => { setLocalError(""); onChange?.(event.target.value); }} placeholder={placeholder} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" aria-describedby={error || localError ? "qpart-frontend-qasm-error" : undefined} disabled={disabled} style={{ boxSizing: "border-box", width: "100%", minHeight: 230, resize: "vertical", padding: 14, border: "1px solid #353b4b", borderRadius: 9, background: "#0d1016", color: "#dce2f0", font: "13px/1.65 ui-monospace, monospace" }} />
      {(error || localError) && <div id="qpart-frontend-qasm-error"><ErrorMessage error={error || localError} title="Circuit input error" /></div>}
      {validationError && <div role="alert"><ErrorMessage error={validationError} title="Circuit validation error" /></div>}
      {validation && <p className="qpart-validation-success" role="status">Circuit source is valid · {validation.qubits} qubits · {validation.classical_bits} classical bits · {validation.operations} operations</p>}
      {(onAnalyze || onValidate) && <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
        {onValidate && <Button variant="secondary" onClick={() => onValidate(value)} loading={validating} disabled={disabled || !value.trim()}>Validate source</Button>}
        {onAnalyze && <Button onClick={() => onAnalyze(value)} icon={Play} loading={loading} disabled={disabled || !value.trim()}>Analyze circuit</Button>}
      </div>}
    </section>
  );
}

export default CircuitInput;
