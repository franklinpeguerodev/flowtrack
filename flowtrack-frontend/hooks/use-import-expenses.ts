"use client";

import { useState } from "react";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { ExpenseImportResultDto } from "@/types/file";

export type ImportState = "idle" | "processing" | "error" | "done";

export function useImportExpenses() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ImportState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ExpenseImportResultDto | null>(null);

  function selectFile(selected: File) {
    setFile(selected);
    setState("idle");
    setErrorMessage(null);
    setResult(null);
  }

  function clearFile() {
    setFile(null);
    setState("idle");
    setErrorMessage(null);
    setResult(null);
  }

  async function upload() {
    if (!file) return;

    // El backend solo lee .xlsx (ClosedXML no soporta el .xls binario).
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setState("error");
      setErrorMessage("El archivo debe ser un Excel con extensión .xlsx.");
      return;
    }

    setState("processing");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiFetch<ExpenseImportResultDto>("/api/file/import/expenses", {
        method: "POST",
        body: formData,
      });
      setResult(data);
      setState("done");
    } catch (err) {
      setState("error");
      setErrorMessage(getErrorMessage(err, "No se pudo importar el archivo."));
    }
  }

  return { file, state, errorMessage, result, selectFile, clearFile, upload };
}
