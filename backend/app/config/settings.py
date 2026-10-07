"""Application settings loaded from the backend environment file and process."""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def _environment_integer(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError as exc:
        raise ValueError(f"Environment variable {name} must be an integer.") from exc


def _environment_origins(name: str, default: tuple[str, ...]) -> tuple[str, ...]:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    configured = (origin.strip() for origin in raw_value.split(","))
    return tuple(dict.fromkeys((*default, *(origin for origin in configured if origin))))


@dataclass(frozen=True)
class Settings:
    """Operational settings aligned with implemented analyzer limits."""

    app_name: str = "Quantum Circuit Partitioning Analyzer"
    cors_allowed_origins: tuple[str, ...] = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://final-year-project-frontend-lyart.vercel.app",
    )
    max_qasm_characters: int = 1_000_000
    max_qubits: int = 64
    max_instructions: int = 10_000
    max_simulation_qubits: int = 20
    max_shots: int = 100_000

    def __post_init__(self) -> None:
        """Reject unsafe or contradictory limits at startup."""
        if min(
            self.max_qasm_characters,
            self.max_qubits,
            self.max_instructions,
            self.max_simulation_qubits,
            self.max_shots,
        ) < 1:
            raise ValueError("Backend resource limits must all be positive.")
        if self.max_simulation_qubits > self.max_qubits:
            raise ValueError(
                "MAX_SIMULATION_QUBITS cannot exceed MAX_QUBITS."
            )
        if not self.app_name.strip():
            raise ValueError("APP_NAME must not be blank.")
        ceilings = {
            "MAX_QASM_CHARACTERS": (self.max_qasm_characters, 1_000_000),
            "MAX_QUBITS": (self.max_qubits, 64),
            "MAX_INSTRUCTIONS": (self.max_instructions, 10_000),
            "MAX_SIMULATION_QUBITS": (self.max_simulation_qubits, 20),
            "MAX_SHOTS": (self.max_shots, 100_000),
        }
        for name, (value, ceiling) in ceilings.items():
            if value > ceiling:
                raise ValueError(
                    f"{name} cannot exceed the supported ceiling of {ceiling:,}."
                )

    @classmethod
    def from_environment(cls) -> "Settings":
        """Load supported settings while retaining safe defaults."""
        return cls(
            app_name=os.getenv("APP_NAME", cls.app_name),
            cors_allowed_origins=_environment_origins(
                "CORS_ALLOWED_ORIGINS", cls.cors_allowed_origins
            ),
            max_qasm_characters=_environment_integer(
                "MAX_QASM_CHARACTERS",
                _environment_integer("MAX_QASM_BYTES", cls.max_qasm_characters),
            ),
            max_qubits=_environment_integer("MAX_QUBITS", cls.max_qubits),
            max_instructions=_environment_integer(
                "MAX_INSTRUCTIONS", cls.max_instructions
            ),
            max_simulation_qubits=_environment_integer(
                "MAX_SIMULATION_QUBITS", cls.max_simulation_qubits
            ),
            max_shots=_environment_integer("MAX_SHOTS", cls.max_shots),
        )


settings = Settings.from_environment()
