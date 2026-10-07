const gateStyle = { fill: "#211e30", stroke: "#9d87ff", color: "#eee8ff" };
const twoQubitGates = new Set(["cx", "cnot", "cz", "swap", "ecr", "rxx", "ryy", "rzz"]);

function parseOperations(qasm) {
  if (!qasm) return [];
  return qasm.split(/\r?\n/).flatMap((line) => {
    const clean = line.replace(/\/\/.*$/, "").trim();
    if (!clean || /^(OPENQASM|include|qreg|creg|barrier|measure|if)\b/i.test(clean)) return [];
    const name = clean.match(/^([a-z][a-z\d_]*)/i)?.[1]?.toLowerCase();
    const qubits = [...clean.matchAll(/\w+\[(\d+)\]/g)].map((match) => Number(match[1]));
    return name && qubits.length ? [{ name, qubits }] : [];
  });
}

/** SVG circuit schematic from `qasm` plus analysis metadata; input order is preserved. */
export function CircuitViewer({ qasm, analysis, operations, maxQubits = 10, maxOperations = 24, title = "Circuit schematic", className = "" }) {
  const parsed = operations ?? parseOperations(qasm);
  const totalQubits = Number(analysis?.qubits) || Math.max(0, ...parsed.flatMap((operation) => operation.qubits)) + (parsed.length ? 1 : 0);
  const visibleQubits = Math.min(totalQubits, maxQubits);
  const visibleOperations = parsed.slice(0, maxOperations).filter((operation) => operation.qubits.some((index) => index < visibleQubits));
  const width = Math.max(340, 116 + visibleOperations.length * 54);
  const height = Math.max(100, 50 + visibleQubits * 43);
  const yFor = (index) => 34 + index * 43;
  if (!totalQubits || !visibleOperations.length) {
    return <section className={`qpart-frontend-circuit-viewer ${className}`.trim()} aria-label={title} style={{ padding: 16, border: "1px solid #303443", borderRadius: 10, background: "#11141c", color: "#a7adba" }}>
      <h3 style={{ margin: "0 0 6px", color: "#e7e9ef", fontSize: 16 }}>{title}</h3>
      <p style={{ margin: 0 }}>Provide OpenQASM gate instructions to display their order on circuit wires.</p>
      {analysis && <p style={{ margin: "8px 0 0" }}>{analysis.qubits ?? 0} qubits · {analysis.gate_count ?? 0} gates</p>}
    </section>;
  }
  return (
    <section className={`qpart-frontend-circuit-viewer ${className}`.trim()} aria-label={title} style={{ padding: 16, border: "1px solid #303443", borderRadius: 10, background: "#11141c", color: "#e7e9ef" }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{title}</h3>
      <p style={{ margin: "0 0 12px", color: "#9da5b5", fontSize: 13 }}>Showing {visibleOperations.length} source operation{visibleOperations.length === 1 ? "" : "s"} in input order.</p>
      <div className="qpart-frontend-circuit-viewer-scroll" style={{ overflowX: "auto" }}>
        <svg role="img" aria-label={`Circuit diagram with ${visibleQubits} qubits and ${visibleOperations.length} displayed operations`} viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: "block", maxWidth: "none" }}>
          {Array.from({ length: visibleQubits }, (_, index) => <g key={`wire-${index}`}><text x="8" y={yFor(index) + 4} fill="#9da5b5" fontSize="12">q[{index}]</text><line x1="53" x2={width - 12} y1={yFor(index)} y2={yFor(index)} stroke="#535a6a" strokeWidth="1.5" /></g>)}
          {visibleOperations.map((operation, index) => {
            const x = 82 + index * 54;
            const qubits = operation.qubits.filter((qubit) => qubit < visibleQubits);
            const isTwo = qubits.length > 1 || twoQubitGates.has(operation.name);
            const sorted = [...qubits].sort((a, b) => a - b);
            return <g key={`${operation.name}-${index}`} aria-label={`${operation.name} operation`}>
              {isTwo && sorted.length > 1 && <line x1={x} y1={yFor(sorted[0])} x2={x} y2={yFor(sorted[sorted.length - 1])} stroke="#68b8df" strokeWidth="2" />}
              {sorted.map((qubit, targetIndex) => <g key={`${qubit}-${targetIndex}`}>
                {isTwo && (operation.name === "cx" || operation.name === "cnot") && targetIndex === 0
                  ? <circle cx={x} cy={yFor(qubit)} r="5" fill="#68b8df" />
                  : <g><rect x={x - 18} y={yFor(qubit) - 14} width="36" height="28" rx="6" fill={gateStyle.fill} stroke={isTwo ? "#68b8df" : gateStyle.stroke} /><text x={x} y={yFor(qubit) + 4} textAnchor="middle" fill={gateStyle.color} fontSize="10" fontWeight="700">{operation.name.toUpperCase()}</text></g>}
              </g>)}
              <title>{operation.name} on qubit{qubits.length === 1 ? "" : "s"} {qubits.join(", ")}</title>
            </g>;
          })}
        </svg>
      </div>
      {(parsed.length > visibleOperations.length || totalQubits > visibleQubits) && <p style={{ margin: "9px 0 0", color: "#969eae", fontSize: 12 }}>Diagram truncated for readability. {Math.max(0, parsed.length - visibleOperations.length)} operations and {Math.max(0, totalQubits - visibleQubits)} qubits not shown.</p>}
    </section>
  );
}

export default CircuitViewer;
