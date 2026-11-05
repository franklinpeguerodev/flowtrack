"use client";

import { useState } from "react";
import { ApiException } from "@/lib/api";
import { ApiError } from "@/types/api";
import { readableErrorMessage } from "@/lib/error-messages";
import { ReportExportRequestDto } from "@/types/file";

function parseFileName(disposition: string | null, format: string): string {
  if (!disposition) return `reporte.${format.toLowerCase()}`;

  // Soporta: filename="x.xlsx" y filename*=UTF-8''x.xlsx
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8?.[1]) return decodeURIComponent(utf8[1].trim().replace(/["']/g, ""));

  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  if (plain?.[1]) return plain[1].trim();

  return `reporte.${format.toLowerCase()}`;
}

export function useExportReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportReport(request: ReportExportRequestDto) {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5106"}/api/file/export/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(request),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let errorBody: ApiError = {
          statusCode: res.status,
          errorType: "INTERNAL_ERROR",
          message: "",
          errors: null,
          requestId: "",
        };

        try {
          const parsed = JSON.parse(text) as Partial<ApiError>;
          errorBody = {
            statusCode: parsed.statusCode ?? res.status,
            errorType: parsed.errorType ?? "INTERNAL_ERROR",
            message: parsed.message ?? "",
            errors: parsed.errors ?? null,
            requestId: parsed.requestId ?? "",
          };
        } catch {
          // respuesta sin cuerpo JSON: se usa el fallback por tipo
        }

        throw new ApiException(errorBody);
      }

      const blob = await res.blob();
      const fileName = parseFileName(
        res.headers.get("Content-Disposition"),
        request.format
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof ApiException
          ? readableErrorMessage(err.error, "No se pudo exportar el reporte.")
          : "No se pudo exportar el reporte."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { exportReport, isLoading, error };
}
