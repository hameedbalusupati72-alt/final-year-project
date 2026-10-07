import { LoaderCircle } from "lucide-react";

/** Accessible busy indicator. `label` is announced to assistive technology. */
export function Loading({ label = "Loading", fullScreen = false, className = "" }) {
  return (
    <div className={`qpart-frontend-loading ${fullScreen ? "qpart-frontend-loading-screen" : ""} ${className}`.trim()} role="status" aria-live="polite" aria-busy="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, minHeight: fullScreen ? "100vh" : 44, padding: 12, color: "#c9c1f2" }}>
      <LoaderCircle size={19} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Loading;
