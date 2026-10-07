import { Download, FileText } from "lucide-react";

/**
 * Props: report data, filename, onDownload(report) optional. Uses the callback
 * when supplied, otherwise downloads the provided report as JSON.
 */
export function ReportDownload({
  report,
  filename = "report.json",
  onDownload,
  disabled = false,
  className = "",
}) {
  const hasReport = report != null && (typeof report === "object" || typeof report === "string");
  const download = () => {
    if (!hasReport || disabled) return;
    if (onDownload) {
      onDownload(report);
      return;
    }
    if (typeof document === "undefined" || typeof URL === "undefined" || typeof Blob === "undefined") return;
    const body = typeof report === "string" ? report : JSON.stringify(report, null, 2);
    const blob = new Blob([body], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return (
    <button
      type="button"
      className={`qpart-frontend-report-download ${className}`.trim()}
      onClick={download}
      disabled={disabled || !hasReport}
      aria-label="Download report"
    >
      {hasReport ? <Download aria-hidden="true" /> : <FileText aria-hidden="true" />}
      {hasReport ? "Download report" : "No report to download"}
    </button>
  );
}

export { ReportDownload as default };
