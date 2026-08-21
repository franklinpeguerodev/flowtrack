import { ExpenseResponseDto } from "@/types/expense";

export interface CategoryBreakdown {
  categoryName: string;
  total: number;
  count: number;
}

export function getMonthRange(month: number, year: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  return { start, end };
}

export function filterExpensesByMonth(
  expenses: ExpenseResponseDto[],
  month: number,
  year: number
): ExpenseResponseDto[] {
  const { start, end } = getMonthRange(month, year);
  return expenses.filter((e) => {
    const date = new Date(e.date);
    return date >= start && date <= end;
  });
}

export function filterExpensesByRange(
  expenses: ExpenseResponseDto[],
  from: Date | null,
  to: Date | null
): ExpenseResponseDto[] {
  return expenses.filter((e) => {
    const date = new Date(e.date);
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });
}

export function sumAmount(expenses: ExpenseResponseDto[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function groupByCategory(expenses: ExpenseResponseDto[]): CategoryBreakdown[] {
  const map = new Map<string, { total: number; count: number }>();

  for (const e of expenses) {
    const current = map.get(e.categoryName) ?? { total: 0, count: 0 };
    map.set(e.categoryName, { total: current.total + e.amount, count: current.count + 1 });
  }

  return Array.from(map.entries())
    .map(([categoryName, data]) => ({ categoryName, ...data }))
    .sort((a, b) => b.total - a.total);
}

export function groupByPaymentMethod(expenses: ExpenseResponseDto[]): CategoryBreakdown[] {
  const map = new Map<string, { total: number; count: number }>();

  for (const e of expenses) {
    const current = map.get(e.paymentMethodName) ?? { total: 0, count: 0 };
    map.set(e.paymentMethodName, { total: current.total + e.amount, count: current.count + 1 });
  }

  return Array.from(map.entries())
    .map(([categoryName, data]) => ({ categoryName, ...data }))
    .sort((a, b) => b.total - a.total);
}

export function getTopCategories(expenses: ExpenseResponseDto[], n: number): CategoryBreakdown[] {
  return groupByCategory(expenses).slice(0, n);
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getPreviousMonth(month: number, year: number): { month: number; year: number } {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}