"use client";

import { useState } from "react";
import { ApiException } from "@/lib/api";
import { ApiError } from "@/types/api";
import { ReportExportRequestDto } from "@/types/file";

export function useExportReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportReport(request: ReportExportRequestDto) {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/file/export/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const errorBody: ApiError = await res.json();
        throw new ApiException(errorBody);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const fileName = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `reporte.${request.format.toLowerCase()}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof ApiException ? err.error.message : "No se pudo exportar el reporte.");
    } finally {
      setIsLoading(false);
    }
  }

  return { exportReport, isLoading, error };
}
