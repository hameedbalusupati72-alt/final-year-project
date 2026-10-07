"""Tests for bounded environment-driven backend settings."""

import pytest

from app.config.settings import Settings


def test_settings_load_environment_overrides(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("APP_NAME", "Test backend")
    monkeypatch.setenv(
        "CORS_ALLOWED_ORIGINS", " https://frontend.example,https://admin.example "
    )
    monkeypatch.setenv("MAX_QASM_CHARACTERS", "200000")
    monkeypatch.setenv("MAX_QUBITS", "32")
    monkeypatch.setenv("MAX_INSTRUCTIONS", "5000")
    monkeypatch.setenv("MAX_SIMULATION_QUBITS", "16")
    monkeypatch.setenv("MAX_SHOTS", "50000")

    settings = Settings.from_environment()

    assert settings.app_name == "Test backend"
    assert settings.cors_allowed_origins == (
        "https://frontend.example",
        "https://admin.example",
    )
    assert settings.max_qasm_characters == 200_000
    assert settings.max_qubits == 32
    assert settings.max_instructions == 5_000
    assert settings.max_simulation_qubits == 16
    assert settings.max_shots == 50_000


def test_settings_default_cors_origins_are_localhost(
    monkeypatch: pytest.MonkeyPatch,
):
    monkeypatch.delenv("CORS_ALLOWED_ORIGINS", raising=False)

    assert Settings.from_environment().cors_allowed_origins == (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://final-year-project-frontend-lyart.vercel.app",
    )


def test_settings_accept_legacy_qasm_byte_limit(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.delenv("MAX_QASM_CHARACTERS", raising=False)
    monkeypatch.setenv("MAX_QASM_BYTES", "150000")

    assert Settings.from_environment().max_qasm_characters == 150_000


def test_settings_reject_limits_above_supported_ceiling(
    monkeypatch: pytest.MonkeyPatch,
):
    monkeypatch.setenv("MAX_SIMULATION_QUBITS", "21")

    with pytest.raises(ValueError, match="supported ceiling of 20"):
        Settings.from_environment()


def test_settings_reject_simulation_limit_above_configured_qubit_limit(
    monkeypatch: pytest.MonkeyPatch,
):
    monkeypatch.setenv("MAX_QUBITS", "8")
    monkeypatch.setenv("MAX_SIMULATION_QUBITS", "12")

    with pytest.raises(ValueError, match="cannot exceed MAX_QUBITS"):
        Settings.from_environment()
