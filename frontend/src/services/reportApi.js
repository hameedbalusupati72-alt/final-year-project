import { downloadPdfReport, generateTextReport } from "./api.js";

export function generateAnalysisReport(report) {
  return generateTextReport(report);
}

export function downloadAnalysisReport(report) {
  return downloadPdfReport(report);
}

export function downloadJsonReport(result, filename = "circuit-report.json") {
  if (!result) throw new Error("There is no result to export.");
  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
