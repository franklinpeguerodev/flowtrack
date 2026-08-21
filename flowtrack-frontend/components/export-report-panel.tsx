"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExportReport } from "@/hooks/use-export-report";
import { ExportFormat } from "@/types/file";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "Json", label: "JSON" },
  { value: "Txt", label: "Texto plano (.txt)" },
  { value: "Excel", label: "Excel (.xlsx)" },
];

export function ExportReportPanel() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [format, setFormat] = useState<ExportFormat>("Excel");
  const { exportReport, isLoading, error } = useExportReport();

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-medium">Exportar reporte</h2>
        <p className="text-sm text-muted-foreground">
          Descarga tus gastos de un mes específico en el formato que prefieras.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Mes</Label>
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue>{MONTHS[month - 1]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Año</Label>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue>{year}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Formato</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
            <SelectTrigger className="w-full">
              <SelectValue>{FORMATS.find((f) => f.value === format)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={() => exportReport({ month, year, format })} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="animate-spin" /> : <Download />}
        {isLoading ? "Generando..." : "Descargar reporte"}
      </Button>
    </div>
  );
}