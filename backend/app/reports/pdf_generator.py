"""PDF report rendering for the supported analysis and planning results."""

from io import BytesIO
from pprint import pformat
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def generate_pdf(title: str, sections: dict[str, object]) -> bytes:
    """Render a multi-page PDF using only supplied, already-computed results."""
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        textColor=colors.HexColor("#253858"),
        spaceAfter=18,
    )
    heading_style = ParagraphStyle(
        "ReportSectionHeading",
        parent=styles["Heading2"],
        textColor=colors.HexColor("#284b7a"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "ReportSectionBody",
        parent=styles["BodyText"],
        fontName="Courier",
        fontSize=8.5,
        leading=12,
        wordWrap="CJK",
    )
    story = [Paragraph(escape(title.strip()), title_style)]
    for heading, content in sections.items():
        story.extend(
            [
                Paragraph(escape(heading.strip()), heading_style),
                Paragraph(
                    escape(pformat(content, width=88)).replace("\n", "<br/>"),
                    body_style,
                ),
                Spacer(1, 5),
            ]
        )

    def add_page_number(canvas: object, doc: object) -> None:
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#667085"))
        canvas.drawRightString(
            letter[0] - 0.65 * inch,
            0.38 * inch,
            f"Page {doc.page}",
        )
        canvas.restoreState()

    document.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    return buffer.getvalue()
