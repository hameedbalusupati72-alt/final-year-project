const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function apiUrl(path) {
  return `${API_URL}${path}`;
}

export class ApiConnectionError extends Error {}

function backendIsUnavailable(response) {
  const contentType = response.headers.get("content-type") || "";
  return (
    response.status >= 502 ||
    (response.status === 500 && !contentType.includes("application/json"))
  );
}

function backendUnavailableError() {
  return new ApiConnectionError(
    "The backend is unavailable. Start FastAPI with .\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --app-dir backend --reload --reload-dir backend, then retry.",
  );
}

function responseErrorMessage(payload, label, status) {
  if (typeof payload.detail === "string") return payload.detail;
  if (Array.isArray(payload.detail)) {
    const messages = payload.detail
      .map((issue) => issue?.msg)
      .filter((message) => typeof message === "string");
    if (messages.length) {
      const readable = messages.map((message) =>
        message.replace(/^Value error,\s*/i, ""),
      );
      return `${label}: ${readable.join("; ")}`;
    }
  }
  if (status === 404) {
    return `The running backend does not provide ${label.toLowerCase()} yet. Restart it from this project with the documented FastAPI command.`;
  }
  return `${label} failed (${status}).`;
}

export async function checkApiHealth() {
  let response;
  try {
    response = await fetch(apiUrl("/api/health"));
  } catch {
    throw new ApiConnectionError("Could not reach the backend.");
  }
  if (!response.ok) {
    throw new Error(`API health check failed (${response.status}).`);
  }
  return response.json();
}

export async function analyzeCircuit(qasm) {
  let response;
  try {
    response = await fetch(apiUrl("/api/circuits/analyze"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qasm }),
    });
  } catch {
    throw new ApiConnectionError(
      "Could not reach the backend. Start the FastAPI server and try again.",
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (backendIsUnavailable(response)) throw backendUnavailableError();
    throw new Error(
      responseErrorMessage(payload, "Analysis", response.status),
    );
  }
  return payload;
}

async function postCircuitRequest(path, body, label) {
  let response;
  try {
    response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiConnectionError(
      "Could not reach the backend. Start the FastAPI server and try again.",
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (backendIsUnavailable(response)) throw backendUnavailableError();
    throw new Error(responseErrorMessage(payload, label, response.status));
  }
  return payload;
}

export function optimizeCircuit(qasm, options) {
  return postCircuitRequest(
    "/api/optimize",
    { qasm, ...options },
    "Partition planning",
  );
}

export function simulateCircuit(qasm, options) {
  return postCircuitRequest(
    "/api/simulation/original",
    { qasm, ...options },
    "Simulation",
  );
}

export function validateCircuit(qasm) {
  return postCircuitRequest(
    "/api/circuits/validate",
    { qasm },
    "Circuit validation",
  );
}

export function compareProbabilityDistributions(original, comparison) {
  return postCircuitRequest(
    "/api/comparison/distributions",
    {
      original_probabilities: original,
      comparison_probabilities: comparison,
    },
    "Distribution comparison",
  );
}

export function generateTextReport(report) {
  return postCircuitRequest(
    "/api/reports/generate",
    reportRequestBody(report),
    "Report generation",
  );
}

export async function downloadPdfReport(report) {
  let response;
  try {
    response = await fetch(apiUrl("/api/reports/pdf"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportRequestBody(report)),
    });
  } catch {
    throw new ApiConnectionError(
      "Could not reach the backend. Start FastAPI and try again.",
    );
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    if (backendIsUnavailable(response)) throw backendUnavailableError();
    throw new Error(responseErrorMessage(payload, "PDF report", response.status));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quantum-circuit-report.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

function reportRequestBody(report) {
  const sections = Array.isArray(report?.sections)
    ? Object.fromEntries(
        report.sections.map((section, index) => [
          section.title || `Section ${index + 1}`,
          section.content,
        ]),
      )
    : report?.sections;
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) {
    throw new Error("Add at least one analysis result before generating a report.");
  }
  return { title: report.title, sections };
}
