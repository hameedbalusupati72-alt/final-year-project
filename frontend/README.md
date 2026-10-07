# Quantum Circuit Partitioning Frontend

React 18 and Vite workspace for the OpenQASM 2 analysis, structural planning,
and original-circuit baseline workflow. Circuit source and completed stage
results are saved in browser storage and restored after refresh.

## Run locally

From the repository root, start the FastAPI backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --reload-dir backend
```

In a second PowerShell terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Vite proxies `/api` requests to `http://127.0.0.1:8000`. Configure
`VITE_API_URL` in `frontend/.env` only when using a different API origin.

## Implemented workflow

- Upload or edit OpenQASM 2, validate it through the backend, analyze its gates,
  depth, qubits, and interaction graph, and export results as PDF or JSON.
- Generate and inspect a Z3 structural qubit-group plan.
- Run an ideal, local Qiskit Aer simulation of the analyzed original QASM,
  including an editable shot count and random seed.
- Inspect observed outcomes in descending shot-count order, with a control to
  reveal the complete distribution.
- Compare the saved baseline probabilities with a supplied measured
  distribution using backend-calculated total-variation distance and classical
  distribution fidelity.
- Generate a plain-text report or server-rendered PDF from saved analysis and
  simulation results.
- Navigate all workspace pages from the responsive sidebar.

Gate/wire cut decomposition, executable subcircuits, partitioned simulation,
noise/hardware execution, and reconstructed-distribution comparisons are not
implemented. Pages identify these boundaries and do not fabricate results.
