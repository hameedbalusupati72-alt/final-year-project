"""Basic UTF-8 text file helpers for explicit paths."""

from pathlib import Path


def read_text_file(path: str | Path) -> str:
    """Read a UTF-8 text file from the supplied path."""
    return Path(path).read_text(encoding="utf-8")


def write_text_file(path: str | Path, content: str) -> None:
    """Write UTF-8 text to the supplied path, creating parent folders."""
    destination = Path(path)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")
