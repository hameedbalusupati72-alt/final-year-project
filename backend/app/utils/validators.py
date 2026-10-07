"""Small validations for common request values."""


def require_non_empty_text(value: str, *, field_name: str) -> str:
    """Return nonblank text or raise a field-specific ValueError."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string.")
    return value


def require_positive_integer(value: int, *, field_name: str) -> int:
    """Return a positive non-boolean integer."""
    if not isinstance(value, int) or isinstance(value, bool) or value < 1:
        raise ValueError(f"{field_name} must be a positive integer.")
    return value
