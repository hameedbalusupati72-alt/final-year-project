import { useState } from "react";
import ReportPreview from "../components/reports/ReportPreview.jsx";
import ReportDownload from "../components/reports/ReportDownload.jsx";

export default function ReportPage({ report = null, analysis = null, simulation = null, onExportPdf = async () => {}, onGenerateReport = async () => {}, onExportJson = () => {} }) {
  const [error, setError] = useState("");
  const [generatedReport, setGeneratedReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState("");
  async function exportPdf() {
    setError("");
    setNotice("");
    try {
      await onExportPdf();
      setNotice("Your PDF report was generated and downloaded.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the PDF report.");
    }
  }
  async function generateText() {
    setError("");
    setNotice("");
    setIsGenerating(true);
    try {
      const result = await onGenerateReport();
      setGeneratedReport(result.report);
      setNotice("Text report generated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate the report.");
    } finally {
      setIsGenerating(false);
    }
  }
  return (
    <main className="qpart-page">
      <header className="qpart-page-heading"><span>PROJECT OUTPUT</span><h1>Analysis report</h1><p>Export the measured analysis and original-circuit baseline; no missing partition results are synthesized.</p></header>
      <ReportPreview report={report} />
      <div className="qpart-report-actions">
        <ReportDownload report={report} filename="quantum-circuit-report.json" onDownload={onExportJson} disabled={!analysis} />
        <button type="button" onClick={generateText} disabled={!analysis || isGenerating}>{isGenerating ? "Generating…" : "Generate text report"}</button>
        <button type="button" onClick={exportPdf} disabled={!analysis}>Download PDF report</button>
      </div>
      {error && <div role="alert" className="qpart-page-error">{error}</div>}
      {notice && <p className="qpart-validation-success" role="status">{notice}</p>}
      {generatedReport && <section className="qpart-generated-report"><h2>Generated report</h2><pre>{generatedReport}</pre></section>}
    </main>
  );
}
