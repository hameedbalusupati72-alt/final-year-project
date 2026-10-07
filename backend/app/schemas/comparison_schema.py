"""Request schema for comparing measured outcome distributions."""

from collections.abc import Mapping
from math import isfinite

from pydantic import BaseModel, Field, field_validator, model_validator


class DistributionComparisonRequest(BaseModel):
    """Two normalized measurement distributions on computational basis keys."""

    original_probabilities: dict[str, float] = Field(min_length=1)
    comparison_probabilities: dict[str, float] = Field(min_length=1)

    @field_validator(
        "original_probabilities", "comparison_probabilities", mode="before"
    )
    @classmethod
    def validate_distribution(cls, distribution: object) -> object:
        if not isinstance(distribution, Mapping) or not distribution:
            raise ValueError("Each probability distribution must contain outcomes.")
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
        total = sum(distribution.values())
        if abs(total - 1.0) > 1e-6:
            raise ValueError("Each probability distribution must sum to 1.")
        return distribution

    @model_validator(mode="after")
    def outcomes_have_matching_widths(self) -> "DistributionComparisonRequest":
        original_widths = {
            len(outcome) for outcome in self.original_probabilities
        }
        comparison_widths = {
            len(outcome) for outcome in self.comparison_probabilities
        }
        if len(original_widths) != 1 or len(comparison_widths) != 1:
            raise ValueError("All outcomes in a distribution must have equal width.")
        if original_widths != comparison_widths:
            raise ValueError(
                "Compared distributions must use outcomes of the same bit width."
            )
        return self
