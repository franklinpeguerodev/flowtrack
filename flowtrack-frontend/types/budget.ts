// El backend serializa BudgetAlertLevel como número (0..3): el enum no tiene
// [JsonConverter(typeof(JsonStringEnumConverter))], así que viaja como entero.
export type AlertLevelName = "Normal" | "Warning50" | "Warning80" | "Exceeded" | "Warning100";

export interface AlertLevelMeta {
  name: AlertLevelName;
  label: string;
  color: string;
  variant: "default" | "secondary" | "destructive";
}

export const ALERT_LEVELS: Record<number, AlertLevelMeta> = {
  0: { name: "Normal", label: "En regla", color: "var(--chart-1)", variant: "secondary" },
  1: { name: "Warning50", label: "50% usado", color: "var(--chart-2)", variant: "secondary" },
  2: { name: "Warning80", label: "80% usado", color: "var(--chart-4)", variant: "secondary" },
  3: { name: "Exceeded", label: "Excedido", color: "var(--destructive)", variant: "destructive" },
  4: { name: "Warning100", label: "100% usado", color: "var(--chart-3)", variant: "secondary" },
};

export function getAlertLevel(level: number): AlertLevelMeta {
  return ALERT_LEVELS[level] ?? ALERT_LEVELS[0];
}

export interface BudgetStatusDto {
  id: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount: number;
  percentageUsed: number;
  alertLevel: number;
}

export interface BudgetCreateDto {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface BudgetUpdateDto {
  amount: number;
}

export interface BudgetResponseDto {
  id: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
}
