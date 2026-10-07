import { useRef, useState } from "react";
import { FileUp } from "lucide-react";

/** Uploads text/QASM files and calls `onFileSelect(file, text)` after reading. */
export function CircuitUpload({ onFileSelect, onChange, accept = ".qasm,.txt,text/plain", disabled = false, maxFileSize = 1_000_000, label = "Choose a circuit file", className = "" }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  async function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > maxFileSize) {
      setError(`File exceeds the ${Math.round(maxFileSize / 1000)} KB limit.`);
      event.target.value = "";
      return;
    }
    try {
      const text = await file.text();
      onFileSelect?.(file, text);
      onChange?.(text, file);
    } catch {
      setError("The selected file could not be read.");
    } finally {
      event.target.value = "";
    }
  }
  return (
    <div className={`qpart-frontend-circuit-upload ${className}`.trim()}>
      <input ref={inputRef} className="qpart-frontend-circuit-upload-input" type="file" accept={accept} disabled={disabled} onChange={handleChange} tabIndex={-1} aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }} />
      <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} className="qpart-frontend-circuit-upload-button" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 40, padding: "8px 12px", border: "1px solid #3a4050", borderRadius: 8, background: "#191d27", color: "#e0e3ed", cursor: disabled ? "not-allowed" : "pointer" }}>
        <FileUp size={17} aria-hidden="true" />{label}
      </button>
      {error && <p className="qpart-frontend-circuit-upload-error" role="alert" style={{ color: "#f0aeb8", fontSize: 13 }}>{error}</p>}
    </div>
  );
}

export default CircuitUpload;
