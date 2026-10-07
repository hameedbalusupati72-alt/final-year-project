import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_QASM = """OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
h q[0];
cx q[0],q[1];
"""


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "ideal-simulation" in response.json()["features"]


def test_root_endpoint_reports_service_and_health_path():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["health"] == "/api/health"


def test_local_vite_alt_port_is_allowed_by_cors():
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://127.0.0.1:5174",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5174"


def test_deployed_vercel_frontend_is_allowed_by_cors():
    origin = "https://final-year-project-frontend-lyart.vercel.app"
    response = client.options(
        "/api/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_analyze_endpoint_returns_circuit_metrics():
    response = client.post("/api/circuits/analyze", json={"qasm": VALID_QASM})

    assert response.status_code == 200
    assert response.json()["qubits"] == 2
    assert response.json()["two_qubit_gates"] == 1
    assert response.json()["interaction_graph"]["edges"] == [
        {"source": 0, "target": 1, "weight": 1}
    ]


def test_analyze_endpoint_returns_readable_invalid_qasm_error():
    response = client.post(
        "/api/circuits/analyze",
        json={"qasm": "this is not valid qasm"},
    )

    assert response.status_code == 422
    assert "Invalid OpenQASM 2 input" in response.json()["detail"]


def test_circuit_validation_endpoint_returns_validated_register_sizes():
    response = client.post("/api/circuits/validate", json={"qasm": VALID_QASM})

    assert response.status_code == 200
    assert response.json() == {
        "status": "valid",
        "qubits": 2,
        "classical_bits": 0,
        "operations": 2,
    }


def test_optimize_endpoint_returns_z3_interaction_partition_plan():
    qasm = """OPENQASM 2.0;
include "qelib1.inc";
qreg q[4];
cx q[0],q[1];
cx q[1],q[2];
cx q[2],q[3];
"""
    response = client.post(
        "/api/optimize",
        json={
            "qasm": qasm,
            "max_qubits_per_partition": 2,
            "max_partitions": 2,
            "objective": "minimize_cuts",
        },
    )

    assert response.status_code == 200
    result = response.json()
    assert result["partition_count"] == 2
    assert result["crossing_gate_count"] == 1
    assert len(result["partitions"]) == 2


def test_simulation_endpoint_runs_original_circuit():
    response = client.post(
        "/api/simulation/original",
        json={"qasm": VALID_QASM, "shots": 128, "random_seed": 7},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["simulation_status"] == "completed"
    assert result["backend"] == "Qiskit Aer"
    assert result["mode"] == "ideal"
    assert result["shots"] == 128
    assert result["random_seed"] == 7
    assert result["qubit_count"] == 2
    assert result["distinct_outcomes"] == len(result["counts"])
    assert result["most_probable_outcome"] in result["counts"]
    assert result["most_probable_probability"] == result["probabilities"][
        result["most_probable_outcome"]
    ]
    assert set(result["counts"]).issubset({"00", "11"})
    assert sum(result["counts"].values()) == 128
    assert sum(result["probabilities"].values()) == 1


def test_simulation_endpoint_rejects_missing_or_blank_circuit():
    missing = client.post(
        "/api/simulation/original",
        json={"shots": 100},
    )
    blank = client.post(
        "/api/simulation/original",
        json={"qasm": "   ", "shots": 100},
    )

    assert missing.status_code == 422
    assert blank.status_code == 422
    assert "Circuit QASM must not be blank" in blank.json()["detail"][0]["msg"]


def test_simulation_endpoint_rejects_invalid_qasm_and_limits():
    invalid_qasm = client.post(
        "/api/simulation/original",
        json={"qasm": "invalid"},
    )
    too_many_qubits = client.post(
        "/api/simulation/original",
        json={
            "qasm": 'OPENQASM 2.0; include "qelib1.inc"; qreg q[21];',
        },
    )

    assert invalid_qasm.status_code == 422
    assert "Invalid OpenQASM 2 input" in invalid_qasm.json()["detail"]
    assert too_many_qubits.status_code == 422
    assert "at most 20 qubits" in too_many_qubits.json()["detail"]


def test_simulation_endpoint_rejects_invalid_shots_and_seed():
    invalid_shots = client.post(
        "/api/simulation/original",
        json={"qasm": VALID_QASM, "shots": 0},
    )
    invalid_seed = client.post(
        "/api/simulation/original",
        json={"qasm": VALID_QASM, "random_seed": -1},
    )

    assert invalid_shots.status_code == 422
    assert invalid_seed.status_code == 422


def test_legacy_simulation_route_remains_compatible():
    response = client.post(
        "/api/simulate",
        json={"qasm": VALID_QASM, "shots": 32, "seed": 9},
    )

    assert response.status_code == 200
    assert response.json()["random_seed"] == 9


def test_simulation_endpoint_accepts_null_random_seed():
    response = client.post(
        "/api/simulation/original",
        json={"qasm": VALID_QASM, "shots": 16, "random_seed": None},
    )

    assert response.status_code == 200
    assert response.json()["random_seed"] is None
    assert response.json()["shots"] == 16


def test_optimize_endpoint_explains_infeasible_constraints():
    response = client.post(
        "/api/optimize",
        json={
            "qasm": VALID_QASM,
            "max_qubits_per_partition": 1,
            "max_partitions": 1,
        },
    )

    assert response.status_code == 422
    assert "No feasible partition" in response.json()["detail"]


def test_partition_plan_alias_uses_structural_optimizer():
    response = client.post(
        "/api/partitions/plan",
        json={
            "qasm": VALID_QASM,
            "max_qubits_per_partition": 1,
            "max_partitions": 2,
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "structural_partition_plan"
    assert response.json()["partition_count"] == 2
    assert response.json()["cut_edges"][0]["kind"] == "interaction_boundary"


def test_distribution_comparison_returns_classical_metrics():
    response = client.post(
        "/api/comparison/distributions",
        json={
            "original_probabilities": {"00": 0.5, "11": 0.5},
            "comparison_probabilities": {"00": 0.75, "11": 0.25},
        },
    )

    assert response.status_code == 200
    result = response.json()
    assert result["total_variation_distance"] == 0.25
    assert result["l1_probability_distance"] == 0.5
    assert result["classical_distribution_fidelity"] == pytest.approx(
        (0.5**0.5 * 0.75**0.5 + 0.5**0.5 * 0.25**0.5) ** 2
    )
    assert "quantum state fidelity" in result["scope"]


def test_distribution_comparison_rejects_unnormalized_probabilities():
    response = client.post(
        "/api/comparison/distributions",
        json={
            "original_probabilities": {"00": 0.7},
            "comparison_probabilities": {"00": 1.0},
        },
    )

    assert response.status_code == 422
    assert "sum to 1" in response.json()["detail"][0]["msg"]


def test_distribution_comparison_rejects_mismatched_bit_widths():
    response = client.post(
        "/api/comparison/distributions",
        json={
            "original_probabilities": {"00": 1.0},
            "comparison_probabilities": {"000": 1.0},
        },
    )

    assert response.status_code == 422


def test_report_endpoint_returns_readable_result_sections():
    response = client.post(
        "/api/reports/generate",
        json={
            "title": "Circuit report",
            "sections": {"Analysis": {"qubits": 2, "depth": 3}},
        },
    )

    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "completed"
    assert "Circuit report" in result["report"]
    assert "Analysis" in result["report"]
    assert "'qubits': 2" in result["report"]


def test_report_endpoint_rejects_empty_sections():
    response = client.post("/api/reports/generate", json={"sections": {}})

    assert response.status_code == 422


def test_pdf_report_endpoint_returns_a_pdf_document():
    response = client.post(
        "/api/reports/pdf",
        json={
            "title": "Circuit report",
            "sections": {"Analysis": {"qubits": 2, "depth": 3}},
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"].endswith(
        'filename="qpart-report.pdf"'
    )
    assert response.content.startswith(b"%PDF-")
