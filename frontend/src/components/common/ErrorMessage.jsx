import { AlertCircle, RotateCw, X } from "lucide-react";

/** Inline error notice. `error` may be an Error or a displayable value. */
export function ErrorMessage({ error, title = "Something went wrong", onRetry, onDismiss, className = "" }) {
  const message = typeof error === "string" ? error : error?.message;
  return (
    <div className={`qpart-frontend-error ${className}`.trim()} role="alert" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, border: "1px solid #713b48", borderRadius: 9, background: "#291920", color: "#f0c2c8" }}>
      <AlertCircle size={19} aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>{title}</strong>
        {message && <p style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{message}</p>}
        {onRetry && <button className="qpart-frontend-error-retry" type="button" onClick={onRetry} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 9, padding: 0, border: 0, background: "none", color: "inherit", cursor: "pointer" }}><RotateCw size={14} aria-hidden="true" /> Try again</button>}
      </div>
      {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss error" style={{ display: "grid", placeItems: "center", width: 30, height: 30, border: 0, background: "transparent", color: "inherit", cursor: "pointer" }}><X size={16} aria-hidden="true" /></button>}
    </div>
  );
}

export default ErrorMessage;
