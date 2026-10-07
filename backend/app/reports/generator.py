"""Generate reports from currently supported backend results."""

from collections.abc import Mapping

from app.reports.template import render_report


def generate_report(title: str, sections: Mapping[str, object]) -> str:
    """Return a human-readable report containing supplied results."""
    return render_report(title, sections)
