import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Atom,
  BarChart3,
  BookOpen,
  FileCode2,
  FileText,
  Layers3,
  Network,
  Settings2,
  Sparkles,
  Upload,
} from "lucide-react";
import Navbar from "./components/common/Navbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import { useCircuit } from "./hooks/useCircuit.js";
import { useProject } from "./hooks/useProject.js";
import {
  analyzeCircuit,
  ApiConnectionError,
  checkApiHealth,
  downloadPdfReport,
  generateTextReport as requestTextReport,
  optimizeCircuit,
  simulateCircuit,
  validateCircuit,
} from "./services/api.js";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadCircuit from "./pages/UploadCircuit.jsx";
import CircuitAnalysis from "./pages/CircuitAnalysis.jsx";
import Requirements from "./pages/Requirements.jsx";
import CuttingGraphPage from "./pages/CuttingGraph.jsx";
import OptimizationPage from "./pages/Optimization.jsx";
import PartitionsPage from "./pages/Partitions.jsx";
import SimulationPage from "./pages/Simulation.jsx";
import ComparisonPage from "./pages/Comparison.jsx";
import ReportPage from "./pages/Report.jsx";

const STORAGE_KEY = "qpart.analysis-workspace.v1";
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Atom },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "upload", label: "Upload circuit", icon: Upload },
  { id: "analyzer", label: "Circuit analyzer", icon: Activity },
  { id: "requirements", label: "Requirements", icon: Settings2 },
  { id: "cutting", label: "Cutting graph", icon: Network },
  { id: "optimization", label: "Optimization", icon: Sparkles },
  { id: "partitions", label: "Partitions", icon: Layers3 },
  { id: "simulation", label: "Simulation", icon: Activity },
  { id: "comparison", label: "Comparison", icon: BookOpen },
  { id: "report", label: "Report", icon: FileText },
];
const TITLES = Object.fromEntries(NAV_ITEMS.map(({ id, label }) => [id, label]));

export default function App() {
  const {
    qasm,
    setQasm,
    analysis,
    setAnalysis,
    analyzedQasm,
    setAnalyzedQasm,
    lastAnalyzedAt,
    setLastAnalyzedAt,
  } = useCircuit();
  const {
    activePage,
    setActivePage,
    partitionResult,
    setPartitionResult,
    simulationResult,
    setSimulationResult,
    comparisonResult,
    setComparisonResult,
  } = useProject();
  const [apiStatus, setApiStatus] = useState("checking");
  const [analysisError, setAnalysisError] = useState("");
  const [partitionError, setPartitionError] = useState("");
  const [simulationError, setSimulationError] = useState("");
  const [validationState, setValidationState] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [requirements, setRequirements] = useState({
    max_qubits_per_partition: 2,
    max_partitions: 4,
  });
  const healthCheckInProgress = useRef(false);
  const initialAnalysisStarted = useRef(false);
  const isInputChanged = Boolean(analysis) && qasm.trim() !== analyzedQasm.trim();
  const currentTitle = TITLES[activePage] ?? TITLES.analyzer;

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          qasm,
          analysis,
          analyzedQasm,
          lastAnalyzedAt,
          partitionResult,
          simulationResult,
          comparisonResult,
        }),
      );
    } catch {
      setAnalysisError("Your browser could not save this workspace locally.");
    }
  }, [qasm, analysis, analyzedQasm, lastAnalyzedAt, partitionResult, simulationResult, comparisonResult]);

  async function runAnalysis(source = qasm) {
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const result = await analyzeCircuit(source);
      setQasm(source);
      setAnalysis(result);
      setAnalyzedQasm(source);
      setLastAnalyzedAt(new Date().toISOString());
      setApiStatus("online");
      return result;
    } catch (error) {
      setAnalysisError(error.message || "Circuit analysis failed.");
      setApiStatus(error instanceof ApiConnectionError ? "offline" : "online");
      return null;
    } finally {
      setIsAnalyzing(false);
    }

  }

  async function runValidation(source = qasm) {
    setIsValidating(true);
    setValidationError("");
    setValidationState(null);
    try {
      const result = await validateCircuit(source);
      setValidationState({ qasm: source, result });
      setApiStatus("online");
      return result;
    } catch (error) {
      setValidationError(error.message || "Circuit validation failed.");
      setApiStatus(error instanceof ApiConnectionError ? "offline" : "online");
      return null;
    } finally {
      setIsValidating(false);
    }
  }

  useEffect(() => {
    let alive = true;
    async function refreshHealth() {
      if (healthCheckInProgress.current) return;
      healthCheckInProgress.current = true;
      try {
        await checkApiHealth();
        if (!alive) return;
        setApiStatus("online");
        if (!initialAnalysisStarted.current) {
          initialAnalysisStarted.current = true;
          void runAnalysis(qasm);
        }
      } catch {
        if (alive) setApiStatus("offline");
      } finally {
        healthCheckInProgress.current = false;
      }
    }
    void refreshHealth();
    const timer = window.setInterval(() => void refreshHealth(), 5_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const currentPartition = useMemo(
    () => partitionResult?.qasm?.trim() === qasm.trim() ? partitionResult : null,
    [partitionResult, qasm],
  );
  const currentSimulation = useMemo(
    () => simulationResult?.qasm?.trim() === analyzedQasm.trim() ? simulationResult : null,
    [simulationResult, analyzedQasm],
  );

  async function runOptimization(source = qasm, options = requirements) {
    if (!analysis || isInputChanged) {
      setPartitionError("Analyze the current circuit before creating a partition plan.");
      return;
    }
    setIsOptimizing(true);
    setPartitionError("");
    try {
      const result = await optimizeCircuit(source, options);
      setPartitionResult({ qasm: source, result });
      setApiStatus("online");
    } catch (error) {
      setPartitionError(error.message || "Partition planning failed.");
      setApiStatus(error instanceof ApiConnectionError ? "offline" : "online");
    } finally {
      setIsOptimizing(false);
    }
  }

  async function runSimulation(source = analyzedQasm, settings = { shots: 1024, seed: 42 }) {
    if (!source.trim()) {
      setSimulationError("Analyze a circuit first. The original QASM is reused automatically.");
      return;
    }
    setIsSimulating(true);
    setSimulationError("");
    try {
      const result = await simulateCircuit(source, {
        shots: Number(settings.shots),
        random_seed: settings.seed === "" || settings.seed == null ? null : Number(settings.seed),
      });
      setSimulationResult({ qasm: source, result });
      setComparisonResult(null);
      setApiStatus("online");
    } catch (error) {
      setSimulationError(error.message || "Circuit simulation failed.");
      setApiStatus(error instanceof ApiConnectionError ? "offline" : "online");
    } finally {
      setIsSimulating(false);
    }
  }

  async function retryBackend() {
    setApiStatus("checking");
    try {
      await checkApiHealth();
      setApiStatus("online");
      if (!analysis || isInputChanged) await runAnalysis();
    } catch (error) {
      setApiStatus("offline");
      setAnalysisError(error.message || "Could not connect to the backend.");
    }
  }

  function navigate(page) {
    setActivePage(page);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reportData() {
    const sections = [];
    if (analysis) sections.push({ title: "Circuit analysis", content: analysis });
    if (currentPartition) sections.push({ title: "Structural partition plan", content: currentPartition.result });
    if (currentSimulation) sections.push({ title: "Original Circuit Baseline", content: currentSimulation.result });
    if (comparisonResult?.qasm === analyzedQasm) sections.push({ title: "Measurement Distribution Comparison", content: comparisonResult.result });
    return {
      title: "Quantum Circuit Analysis Report",
      generatedAt: new Date().toLocaleString(),
      sections,
      metadata: { analyzedAt: lastAnalyzedAt || "Not analyzed", source: "Local workspace" },
    };
  }

  async function exportPdf() {
    if (!analysis) throw new Error("Analyze a circuit before exporting its report.");
    await downloadPdfReport(reportData());
  }

  async function generateTextReport() {
    if (!analysis) throw new Error("Analyze a circuit before generating a report.");
    return requestTextReport(reportData());
  }

  function exportJson() {
    const body = JSON.stringify(reportData(), null, 2);
    const url = URL.createObjectURL(new Blob([body], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "quantum-circuit-report.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderPage() {
    const sharedNavigate = (page) => navigate(page);
    switch (activePage) {
      case "home":
        return <Home backendOnline={apiStatus === "online"} onStart={() => navigate("upload")} onOpenExample={() => { setQasm(BELL_EXAMPLE); navigate("upload"); }} />;
      case "dashboard":
        return <Dashboard analysis={analysis} partitionResult={currentPartition} simulationResult={currentSimulation} onNavigate={sharedNavigate} />;
      case "upload":
        return <UploadCircuit qasm={qasm} onChange={setQasm} onAnalyze={runAnalysis} isAnalyzing={isAnalyzing} error={analysisError} onError={setAnalysisError} onValidate={runValidation} isValidating={isValidating} validation={validationState?.qasm === qasm ? validationState.result : null} validationError={validationError} />;
      case "analyzer":
        return <><CircuitAnalysis qasm={analyzedQasm || qasm} analysis={analysis && !isInputChanged ? analysis : null} onUpload={() => navigate("upload")} onAnalyze={() => runAnalysis()} isAnalyzing={isAnalyzing} />{analysisError && <div className="qpart-page-error" role="alert">{analysisError}</div>}</>;
      case "requirements":
        return <Requirements settings={requirements} onSave={setRequirements} onNavigate={sharedNavigate} />;
      case "cutting":
        return <CuttingGraphPage analysis={analysis && !isInputChanged ? analysis : null} partitionPlan={currentPartition} onNavigate={sharedNavigate} />;
      case "optimization":
        return <OptimizationPage qasm={qasm} analysis={analysis && !isInputChanged ? analysis : null} initialSettings={requirements} result={currentPartition} error={partitionError} isOptimizing={isOptimizing} onOptimize={(source, options) => runOptimization(source, {
          max_qubits_per_partition: Number(options.max_qubits_per_partition ?? requirements.max_qubits_per_partition),
          max_partitions: Number(options.max_partitions ?? requirements.max_partitions),
          objective: options.objective ?? "balanced",
        })} onNavigate={sharedNavigate} />;
      case "partitions":
        return <PartitionsPage plan={currentPartition} onNavigate={sharedNavigate} />;
      case "simulation":
        return <SimulationPage qasm={analyzedQasm} analysis={analysis && !isInputChanged ? analysis : null} result={currentSimulation} error={simulationError} isSimulating={isSimulating} onSimulate={runSimulation} />;
      case "comparison":
        return <ComparisonPage originalResult={currentSimulation ? { ...currentSimulation.result, qasm: currentSimulation.qasm } : null} savedComparison={comparisonResult?.qasm === currentSimulation?.qasm ? comparisonResult : null} onComparison={setComparisonResult} />;
      case "report":
        return <ReportPage analysis={analysis} simulation={currentSimulation} report={reportData()} onExportPdf={exportPdf} onGenerateReport={generateTextReport} onExportJson={exportJson} />;
      default:
        return <Dashboard analysis={analysis} partitionResult={currentPartition} simulationResult={currentSimulation} onNavigate={sharedNavigate} />;
    }
  }

  return (
    <div className="qpart-frontend-app">
      <Sidebar
        items={NAV_ITEMS}
        activeItem={activePage}
        onNavigate={navigate}
        open
        onClose={() => setMobileNavOpen(false)}
        className={mobileNavOpen ? "qpart-frontend-sidebar-open" : ""}
        footer={<span className={`qpart-frontend-backend-status ${apiStatus}`}>{apiStatus === "online" ? "Backend connected" : apiStatus === "checking" ? "Connecting to backend…" : "Backend offline"}</span>}
      />
      {mobileNavOpen && <button className="qpart-frontend-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <div className="qpart-frontend-main">
        <Navbar
          title={currentTitle}
          subtitle="Quantum Circuit Workspace"
          onMenuClick={() => setMobileNavOpen((open) => !open)}
          menuOpen={mobileNavOpen}
          actions={<span className={`qpart-frontend-status-pill ${apiStatus}`}>{apiStatus === "online" ? "Backend online" : apiStatus === "checking" ? "Connecting" : "Backend offline"}</span>}
        />
        <div className="qpart-frontend-content">
          {renderPage()}
          {apiStatus === "offline" && <div className="qpart-backend-notice" role="status"><span>Start FastAPI with <code>.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --reload-dir backend</code>.</span><button type="button" onClick={retryBackend}>Retry connection</button></div>}
        </div>
      </div>
    </div>
  );
}

const BELL_EXAMPLE = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`;
