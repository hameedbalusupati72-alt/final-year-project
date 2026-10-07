# Backend

FastAPI backend for OpenQASM 2 validation and analysis, Z3 structural
interaction-graph planning, ideal simulation of the original circuit with
Qiskit Aer, outcome-distribution comparisons, and text report generation.

## Install and run

From the repository root in PowerShell:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --reload-dir backend
```

The API listens on `http://127.0.0.1:8000`. OpenAPI docs are available at
`/docs`. The root-level entry point can also start the development server:

```powershell
.\.venv\Scripts\python.exe backend\app.py
```

Backend defaults are in `backend\.env.example`; local overrides can be set in
`backend\.env` or in the process environment. The configurable resource limits
can be lowered from their supported ceilings, but not raised above them. The
`CORS_ALLOWED_ORIGINS` setting is a comma-separated list of frontend origins
that may call the API from a browser. Configured origins are added to the
default local Vite origins and deployed frontend origin; set the frontend's
origin here (for example, `https://your-frontend.example`), not the backend
API URL.
standalone analyzer CLI can be run with:

```powershell
python backend\run_analyzer.py
python backend\run_analyzer.py path\to\circuit.qasm
```

## Endpoints

- `GET /` (service status and links)
- `GET /api/health`
- `POST /api/circuits/validate`
- `POST /api/circuits/analyze`
- `POST /api/optimize`
- `POST /api/partitions/plan` (structural-plan alias)
- `POST /api/simulation/original` (`/api/simulate` remains as a compatibility
  alias)
- `POST /api/comparison/distributions`
- `POST /api/reports/generate`
- `POST /api/reports/pdf`

Circuit endpoints accept `{"qasm": "<OpenQASM 2 source>"}`. The optimizer
accepts that source plus `max_qubits_per_partition`, `max_partitions`,
`objective` (`balanced`, `minimize_cuts`, or `minimize_partitions`), and
`timeout_ms`. Simulation accepts the original QASM, `shots`, and an optional
`random_seed`.

Distribution comparison accepts two normalized probability maps:

```json
{
  "original_probabilities": {"00": 0.5, "11": 0.5},
  "comparison_probabilities": {"00": 0.75, "11": 0.25}
}
```

It returns total-variation distance, L1 distance, and classical distribution
fidelity (squared Bhattacharyya coefficient). This is not quantum-state
fidelity and does not claim that a circuit was cut or reconstructed. Report
generation returns formatted plain text; the PDF endpoint returns a
downloadable server-rendered report.

The optimizer assigns qubits to bounded groups and reports two-qubit
interactions crossing group boundaries. It does not generate exact cuts or
executable subcircuits. The simulator runs the original circuit only; it does
not simulate cut partitions or reconstruct their combined output. Exact
gate/wire cutting, executable subcircuit generation, partitioned simulation,
noise, hardware mapping, and result reconstruction remain unavailable and
are not represented as completed functionality. The simulation response
contains actual shot counts and probabilities. Shots
default to 1024 and are limited to 100,000; the optional random seed defaults
to 42.

OpenQASM 2 input is limited to 1 MB, 64 qubits, 10,000 instructions, and gates
of at most two qubits. Local Aer simulation is limited to 20 qubits and
100,000 shots.

## Tests

```powershell
python -m pytest backend\tests -q
```
