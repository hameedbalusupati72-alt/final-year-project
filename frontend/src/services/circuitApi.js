import { MAX_QASM_CHARACTERS, validateQasmFile, validateQasmInput } from "../utils/validators.js";

export function validateCircuitSource(qasm) {
  return validateQasmInput(qasm);
}

export async function readCircuitFile(file) {
  const error = validateQasmFile(file);
  if (error) throw new Error(error);
  if (file.size > MAX_QASM_CHARACTERS) {
    throw new Error("The selected QASM file exceeds the 1 MB upload limit.");
  }
  const qasm = await file.text();
  const inputError = validateQasmInput(qasm);
  if (inputError) throw new Error(inputError);
  return { qasm, fileName: file.name };
}

export function createCircuitFileDownload(qasm, fileName = "circuit.qasm") {
  const blob = new Blob([qasm], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".qasm") ? fileName : `${fileName}.qasm`;
  link.click();
  URL.revokeObjectURL(url);
}
