import { Fragment } from "react";
import { Scissors } from "lucide-react";

/** Props: summary: object of supplied summary fields; cuts: optional cut list. */
export function CutSummary({ summary, cuts, title = "Cut summary", className = "" }) {
  const fields =
    summary && typeof summary === "object" && !Array.isArray(summary)
      ? Object.entries(summary).filter(([, value]) => value != null && typeof value !== "object")
      : [];
  const cutCount = Array.isArray(cuts) ? cuts.length : null;
  if (!fields.length && cutCount == null) {
    return (
      <section className={`qpart-frontend-cut-summary qpart-frontend-empty ${className}`.trim()}>
        <Scissors aria-hidden="true" />
        <p>No cut summary data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-cut-summary ${className}`.trim()}>
      <h3>{title}</h3>
      <dl>
        {cutCount != null && <><dt>Provided cuts</dt><dd>{cutCount}</dd></>}
        {fields.map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ")}</dt>
            <dd>{String(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}

export { CutSummary as default };
