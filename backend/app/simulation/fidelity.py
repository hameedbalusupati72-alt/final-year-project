"""Explicit boundary for fidelity calculations."""


def calculate_fidelity(*_args: object, **_kwargs: object) -> float:
    """Calculate reconstructed-state fidelity (not implemented)."""
    raise NotImplementedError(
        "Reconstructed-state fidelity is not supported because circuit "
        "reconstruction is not implemented."
    )
