import { jsPDF } from "jspdf";

const COLORS = {
  ink: [30, 34, 48],
  muted: [105, 113, 130],
  purple: [112, 88, 190],
  lightPurple: [242, 239, 251],
  line: [224, 226, 233],
  white: [255, 255, 255],
  blue: [74, 115, 190],
};

function sectionTitle(pdf, title, x, y) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.ink);
  pdf.text(title, x, y);
  pdf.setDrawColor(...COLORS.line);
  pdf.line(x, y + 3, 196, y + 3);
  return y + 12;
}

function addFooter(pdf, pageNumber, pageCount) {
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor(...COLORS.line);
  pdf.line(14, pageHeight - 13, 196, pageHeight - 13);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
  pdf.text("QPart · OpenQASM 2 circuit analysis", 14, pageHeight - 7);
  pdf.text(`${pageNumber} / ${pageCount}`, 196, pageHeight - 7, {
    align: "right",
  });
}

function drawInteractionGraph(pdf, graph, startY) {
  const { nodes, edges } = graph;
  let y = startY;

  if (nodes.length <= 12) {
    const centerX = 105;
    const centerY = y + 39;
    const radius = nodes.length <= 2 ? 30 : 35;
    const positions = new Map(
      nodes.map((node, index) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * index) / nodes.length;
        return [
          node,
          {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
        ];
      }),
    );

    edges.forEach((edge) => {
      const source = positions.get(edge.source);
      const target = positions.get(edge.target);
      if (!source || !target) return;
      pdf.setDrawColor(...COLORS.blue);
      pdf.setLineWidth(Math.min(1.2, 0.35 + edge.weight * 0.15));
      pdf.line(source.x, source.y, target.x, target.y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(...COLORS.muted);
      pdf.text(String(edge.weight), (source.x + target.x) / 2, (source.y + target.y) / 2);
    });

    positions.forEach((point, node) => {
      pdf.setFillColor(...COLORS.lightPurple);
      pdf.setDrawColor(...COLORS.purple);
      pdf.circle(point.x, point.y, 7, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(...COLORS.ink);
      pdf.text(`q${node}`, point.x, point.y + 2, { align: "center" });
    });

    y = centerY + radius + 15;
  } else {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.muted);
    pdf.text(
      `Graph contains ${nodes.length} qubits; listing interactions instead of drawing a crowded graph.`,
      14,
      y,
    );
    y += 8;
    for (const edge of edges) {
      pdf.setTextColor(...COLORS.ink);
      pdf.text(`q${edge.source} — q${edge.target}`, 18, y);
      pdf.text(`${edge.weight} gate${edge.weight === 1 ? "" : "s"}`, 80, y);
      y += 5;
      if (y > 276) {
        pdf.addPage();
        y = 20;
      }
    }
    y += 3;
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
  pdf.text("Nodes are qubits; edge labels are two-qubit gate counts.", 14, y);
  return y + 8;
}

export function downloadAnalysisPdf(analysis) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = { left: 14, right: 14 };
  const contentWidth = pageWidth - margins.left - margins.right;
  const generatedAt = new Date().toLocaleString();

  pdf.setFillColor(22, 20, 34);
  pdf.rect(0, 0, pageWidth, 39, "F");
  pdf.setFillColor(144, 119, 220);
  pdf.roundedRect(14, 10, 9, 9, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(...COLORS.white);
  pdf.text("QPart", 27, 17);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(204, 197, 223);
  pdf.text("QUANTUM CIRCUIT ANALYSIS REPORT", 14, 29);
  pdf.text(`Generated ${generatedAt}`, 196, 29, { align: "right" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(...COLORS.ink);
  pdf.text("Analysis summary", 14, 51);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.muted);
  pdf.text(
    "Metrics calculated from the submitted OpenQASM 2 circuit.",
    14,
    57,
  );

  let y = 68;
  const metrics = [
    ["Qubits", String(analysis.qubits)],
    ["Classical bits", String(analysis.classical_bits)],
    ["Circuit depth", String(analysis.depth)],
    ["Gate count", String(analysis.gate_count)],
    ["Single-qubit gates", String(analysis.single_qubit_gates)],
    ["Two-qubit gates", String(analysis.two_qubit_gates)],
    ["CNOT count", String(analysis.cnot_count)],
    ["Gate density", Number(analysis.gate_density).toFixed(3)],
  ];
  const gap = 4;
  const cardWidth = (contentWidth - gap) / 2;
  const cardHeight = 15;
  metrics.forEach(([label, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = margins.left + column * (cardWidth + gap);
    const cardY = y + row * (cardHeight + gap);
    pdf.setFillColor(247, 247, 250);
    pdf.setDrawColor(...COLORS.line);
    pdf.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, "FD");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.muted);
    pdf.text(label, x + 4, cardY + 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.ink);
    pdf.text(value, x + cardWidth - 4, cardY + 10, { align: "right" });
  });
  y += 4 * (cardHeight + gap) + 4;

  y = sectionTitle(pdf, "Gate breakdown", margins.left, y);
  const gateEntries = Object.entries(analysis.gate_counts).sort(
    (first, second) => second[1] - first[1],
  );
  const totalGates = gateEntries.reduce((sum, [, count]) => sum + count, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
  pdf.text("GATE", 16, y);
  pdf.text("COUNT", 99, y, { align: "right" });
  pdf.text("SHARE", 132, y, { align: "right" });
  pdf.text("DISTRIBUTION", 142, y);
  y += 5;

  for (const [name, count] of gateEntries) {
    if (y > pageHeight - 35) {
      pdf.addPage();
      y = 20;
      y = sectionTitle(pdf, "Gate breakdown (continued)", margins.left, y);
    }
    const share = totalGates ? count / totalGates : 0;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.ink);
    pdf.text(name.toUpperCase(), 16, y);
    pdf.text(String(count), 99, y, { align: "right" });
    pdf.setTextColor(...COLORS.muted);
    pdf.text(`${(share * 100).toFixed(1)}%`, 132, y, { align: "right" });
    pdf.setFillColor(235, 233, 242);
    pdf.roundedRect(142, y - 3, 45, 3, 1, 1, "F");
    if (share > 0) {
      pdf.setFillColor(...COLORS.purple);
      pdf.roundedRect(142, y - 3, Math.max(1, 45 * share), 3, 1, 1, "F");
    }
    y += 7;
  }

  y += 3;
  if (y > pageHeight - 75) {
    pdf.addPage();
    y = 20;
  }
  y = sectionTitle(pdf, "Qubit interaction graph", margins.left, y);
  if (analysis.interaction_graph.edges.length) {
    drawInteractionGraph(pdf, analysis.interaction_graph, y);
  } else {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.muted);
    pdf.text("No two-qubit interactions found in this circuit.", 14, y + 5);
  }

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    addFooter(pdf, page, pageCount);
  }

  pdf.save("qpart-circuit-analysis.pdf");
}
