"use client";

import { useRef } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImportExpenses } from "@/hooks/use-import-expenses";

function formatSize(bytes: number) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function ImportExpensesPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, state, errorMessage, result, selectFile, clearFile, upload } =
    useImportExpenses();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) selectFile(selected);
    e.target.value = "";
  }

  function description() {
    if (state === "processing") return "Validando filas...";
    if (state === "error") return errorMessage ?? "Ocurrió un error";
    if (state === "done" && result)
      return `${result.successCount} de ${result.totalRows} filas importadas`;
    if (file) return `Excel · ${formatSize(file.size)} · Listo para importar`;
    return "";
  }

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12 text-center transition-colors hover:bg-muted/50"
        >
          <Upload className="size-6 text-muted-foreground" />
          <p className="font-medium">Selecciona un archivo Excel</p>
          <p className="text-sm text-muted-foreground">
            Formato .xlsx con Monto, Fecha, Descripción, Categoría y Método de pago
          </p>
        </button>
      ) : (
        <Attachment state={state === "processing" ? "processing" : state === "error" ? "error" : "idle"}>
          <AttachmentMedia>
            <FileSpreadsheet />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{description()}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Quitar ${file.name}`}
              onClick={clearFile}
              disabled={state === "processing"}
            >
              <X />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      )}

      {file && state !== "done" && (
        <Button onClick={upload} disabled={state === "processing"} className="w-full">
          {state === "processing" ? "Importando..." : "Importar gastos"}
        </Button>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">Reporte de importación</h2>
            <Badge variant="secondary">{result.totalRows} filas</Badge>
            <Badge variant="default">{result.successCount} OK</Badge>
            {result.errorCount > 0 && (
              <Badge variant="destructive">{result.errorCount} con error</Badge>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Fila</TableHead>
                <TableHead className="w-24">Estado</TableHead>
                <TableHead>Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.rowResults.map((row) => (
                <TableRow key={row.rowNumber}>
                  <TableCell>{row.rowNumber}</TableCell>
                  <TableCell>
                    <Badge variant={row.success ? "default" : "destructive"}>
                      {row.success ? "OK" : "Error"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.errorMessage ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}