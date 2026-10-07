"""Explicit boundary for configured noise models."""


def create_noise_model(*_args: object, **_kwargs: object) -> object:
    """Create a simulation noise model (not implemented)."""
    raise NotImplementedError(
        "Noise models are not configured or applied in the current ideal-only "
        "simulation scope."
    )
