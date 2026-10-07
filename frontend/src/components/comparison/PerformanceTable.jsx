import { TableProperties } from "lucide-react";

/** Props: columns: [{ key, label }], rows: objects keyed by column key. */
export function PerformanceTable({ columns = [], rows = [], title = "Performance", className = "" }) {
  const cols = Array.isArray(columns) ? columns.filter((column) => column && typeof column === "object") : [];
  const data = Array.isArray(rows) ? rows : [];
  if (!cols.length || !data.length) {
    return (
      <section className={`qpart-frontend-performance-table qpart-frontend-empty ${className}`.trim()}>
        <TableProperties aria-hidden="true" />
        <p>No performance table data available.</p>
      </section>
    );
  }
  return (
    <section className={`qpart-frontend-performance-table ${className}`.trim()}>
      <h3><TableProperties aria-hidden="true" /> {title}</h3>
      <div className="qpart-frontend-table-wrap">
        <table>
          <thead><tr>{cols.map((column, index) => <th key={column.key ?? index}>{column.label ?? column.key ?? `Column ${index + 1}`}</th>)}</tr></thead>
          <tbody>{data.map((row, rowIndex) => (
            <tr key={row?.id ?? rowIndex}>
              {cols.map((column, colIndex) => {
                const value = row?.[column.key];
                return <td key={column.key ?? colIndex}>{value == null ? "—" : String(value)}</td>;
              })}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

export { PerformanceTable as default };
