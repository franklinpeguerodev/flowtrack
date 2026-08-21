export interface ExpenseImportRowResultDto {
  rowNumber: number;
  success: boolean;
  errorMessage: string | null;
}

export interface ExpenseImportResultDto {
  totalRows: number;
  successCount: number;
  errorCount: number;
  rowResults: ExpenseImportRowResultDto[];
}

export type ExportFormat = "Json" | "Txt" | "Excel";

export interface ReportExportRequestDto {
  month: number;
  year: number;
  format: ExportFormat;
}