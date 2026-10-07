import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CircuitProvider } from "./context/CircuitContext.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CircuitProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </CircuitProvider>
  </React.StrictMode>,
);
