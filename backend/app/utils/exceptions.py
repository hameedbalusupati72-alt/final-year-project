"""Application-level exception types."""


class ApplicationError(Exception):
    """Base class for expected application errors."""


class UnsupportedFeatureError(NotImplementedError):
    """Raised when a feature is outside the implemented backend scope."""
