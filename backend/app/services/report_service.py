"""Service helpers for reporting supported analysis and planning outputs."""

from app.reports.generator import generate_report
from app.reports.pdf_generator import generate_pdf


def create_report(title: str, sections: dict[str, object]) -> str:
    """Create a plain-text report from already available results."""
    return generate_report(title, sections)


def create_pdf_report(title: str, sections: dict[str, object]) -> bytes:
    """Create a PDF report from already available results."""
    return generate_pdf(title, sections)
