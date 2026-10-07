"""Plain-text report formatting."""

from collections.abc import Mapping
from pprint import pformat


def render_report(title: str, sections: Mapping[str, object]) -> str:
    """Render report sections without implying unsupported results."""
    report_title = title.strip() or "Circuit analysis report"
    lines = [report_title, "=" * len(report_title)]
    for heading, content in sections.items():
        section_title = heading.strip() or "Results"
        lines.extend(
            ("", section_title, "-" * len(section_title), pformat(content))
        )
    return "\n".join(lines)
