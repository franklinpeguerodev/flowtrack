"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportExpensesPanel } from "@/components/import-expenses-panel";
import { ExportReportPanel } from "@/components/export-report-panel";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Archivos</h1>
        <p className="text-sm text-muted-foreground">
          Importa gastos desde Excel o exporta tus reportes mensuales.
        </p>
      </div>

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">Importar</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="pt-4">
          <ImportExpensesPanel />
        </TabsContent>
        <TabsContent value="export" className="pt-4">
          <ExportReportPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}