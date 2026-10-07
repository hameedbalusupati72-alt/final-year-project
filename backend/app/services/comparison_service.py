"""Compare measured outcome distributions using classical statistical metrics."""

from math import isfinite, sqrt


def compare_simulations(
    original_probabilities: dict[str, float],
    comparison_probabilities: dict[str, float],
) -> dict:
    """Compare two normalized measurement distributions.

    The fidelity value is classical distribution fidelity (squared
    Bhattacharyya coefficient), not quantum-state fidelity.
    """
    for distribution in (original_probabilities, comparison_probabilities):
        if not distribution:
            raise ValueError("Both probability distributions must contain outcomes.")
        if any(
            not isinstance(outcome, str)
            or not outcome
            or any(bit not in "01" for bit in outcome)
            for outcome in distribution
        ):
            raise ValueError("Outcome keys must be non-empty binary bitstrings.")
        if any(
            isinstance(probability, bool)
            or not isinstance(probability, (int, float))
            or not isfinite(probability)
            or probability < 0
            for probability in distribution.values()
        ):
            raise ValueError("Probabilities must be finite, non-negative numbers.")
        if len({len(outcome) for outcome in distribution}) != 1:
            raise ValueError("All outcomes in a distribution must have equal width.")

    if {
        len(outcome) for outcome in original_probabilities
    } != {len(outcome) for outcome in comparison_probabilities}:
        raise ValueError(
            "Compared distributions must use outcomes of the same bit width."
        )

    outcomes = sorted(set(original_probabilities) | set(comparison_probabilities))
    original_total = sum(original_probabilities.values())
    comparison_total = sum(comparison_probabilities.values())
    if abs(original_total - 1.0) > 1e-6 or abs(comparison_total - 1.0) > 1e-6:
        raise ValueError("Both probability distributions must sum to 1.")
    l1_distance = sum(
        abs(
            original_probabilities.get(outcome, 0.0)
            - comparison_probabilities.get(outcome, 0.0)
        )
        for outcome in outcomes
    )
    coefficient = sum(
        sqrt(original_probabilities.get(outcome, 0.0))
        * sqrt(comparison_probabilities.get(outcome, 0.0))
        for outcome in outcomes
    )
    return {
        "status": "completed",
        "comparison_type": "measurement_probability_distributions",
        "total_variation_distance": l1_distance / 2,
        "l1_probability_distance": l1_distance,
        "classical_distribution_fidelity": coefficient**2,
        "outcomes_compared": len(outcomes),
        "scope": (
            "Classical comparison of supplied measurement distributions only; "
            "this does not imply circuit cutting, reconstruction, or quantum "
            "state fidelity."
        ),
    }
