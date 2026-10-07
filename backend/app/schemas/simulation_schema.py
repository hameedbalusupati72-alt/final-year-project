"""Request schema for original-circuit baseline simulation."""

from pydantic import AliasChoices, BaseModel, Field, StrictInt, field_validator

from app.config.settings import settings


class OriginalSimulationRequest(BaseModel):
    """Circuit source and bounded shot-simulation controls."""

    qasm: str = Field(min_length=1, max_length=settings.max_qasm_characters)
    shots: StrictInt = Field(default=1024, ge=1, le=settings.max_shots)
    random_seed: StrictInt | None = Field(
        default=42,
        ge=0,
        le=4_294_967_295,
        validation_alias=AliasChoices("random_seed", "seed"),
    )

    @field_validator("qasm")
    @classmethod
    def qasm_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Circuit QASM must not be blank.")
        return value
