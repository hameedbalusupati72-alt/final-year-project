"""Request and metadata schemas for source circuits."""

from pydantic import BaseModel, Field, field_validator

from app.config.settings import settings


class CircuitRequest(BaseModel):
    """OpenQASM 2 source submitted for analysis or planning."""

    qasm: str = Field(min_length=1, max_length=settings.max_qasm_characters)

    @field_validator("qasm")
    @classmethod
    def qasm_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Circuit QASM must not be blank.")
        return value


class CircuitMetadata(BaseModel):
    """Basic validated circuit analysis metrics."""

    qubits: int = Field(ge=1)
    classical_bits: int = Field(ge=0)
    depth: int = Field(ge=0)
    operation_count: int = Field(ge=0)
    gate_count: int = Field(ge=0)
    single_qubit_gates: int = Field(ge=0)
    two_qubit_gates: int = Field(ge=0)
    cnot_count: int = Field(ge=0)
    gate_density: float = Field(ge=0)
    gate_counts: dict[str, int]
    interaction_graph: dict[str, list]
