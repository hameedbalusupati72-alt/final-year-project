import { LoaderCircle } from "lucide-react";

/** Props: progress (0–100), status, message, active. */
export function OptimizationProgress({
  progress,
  status = "idle",
  message,
  active = false,
  className = "",
}) {
  const hasProgress = typeof progress === "number" && Number.isFinite(progress);
  const boundedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : null;
  if (!active && !status && message == null && !hasProgress) return null;
  return (
    <section className={`qpart-frontend-optimization-progress ${className}`.trim()} aria-live="polite">
      <div className="qpart-frontend-progress-heading">
        {active && <LoaderCircle aria-hidden="true" className="qpart-frontend-spinner" />}
        <strong>{message ?? (status || "Optimization status")}</strong>
        {boundedProgress != null && <span>{Math.round(boundedProgress)}%</span>}
      </div>
      {boundedProgress != null && (
        <progress value={boundedProgress} max="100" aria-label="Optimization progress">
          {boundedProgress}%
        </progress>
      )}
      {status && message != null && <p>{status}</p>}
    </section>
  );
}

export { OptimizationProgress as default };
