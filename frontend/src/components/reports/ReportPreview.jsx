import { FileText } from "lucide-react";

const renderValue = (value) => {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <p>{String(value)}</p>;
  }
  if (Array.isArray(value)) {
    return value.length ? <ul>{value.map((item, index) => <li key={item?.id ?? index}>{renderValue(item)}</li>)}</ul> : <p>No items supplied.</p>;
  }
  if (typeof value === "object") {
    return (
      <dl>
        {Object.entries(value).filter(([, item]) => item != null && typeof item !== "object").map(([key, item]) => (
          <div key={key}><dt>{key}</dt><dd>{String(item)}</dd></div>
        ))}
      </dl>
    );
  }
  return null;
};

/** Props: report ({ title, generatedAt, sections: [{ title, content }] }). */
export function ReportPreview({ report, className = "" }) {
  if (!report || typeof report !== "object") {
    return (
      <section className={`qpart-frontend-report-preview qpart-frontend-empty ${className}`.trim()}>
        <FileText aria-hidden="true" />
        <p>No report data available to preview.</p>
      </section>
    );
  }
  const sections = Array.isArray(report.sections) ? report.sections : [];
  const metadata = report.metadata && typeof report.metadata === "object" ? report.metadata : null;
  return (
    <article className={`qpart-frontend-report-preview ${className}`.trim()}>
      <header>
        <h3><FileText aria-hidden="true" /> {report.title ?? "Report preview"}</h3>
        {report.generatedAt != null && <p>Generated: {String(report.generatedAt)}</p>}
      </header>
      {sections.length ? sections.map((section, index) => (
        <section key={section?.id ?? index}>
          <h4>{section?.title ?? `Section ${index + 1}`}</h4>
          {renderValue(section?.content)}
        </section>
      )) : <p>No report sections were supplied.</p>}
      {metadata && <footer>{renderValue(metadata)}</footer>}
    </article>
  );
}

export { ReportPreview as default };
