"""SMT model boundary for future lower-level optimization APIs."""


def build_smt_model(*_args: object, **_kwargs: object) -> None:
    """Build a generic cutting model (not implemented)."""
    raise NotImplementedError(
        "A generic gate/wire-cut SMT model is not available. Use "
        "app.optimization.partitioner.optimize_partitions for the supported "
        "structural planner."
    )
