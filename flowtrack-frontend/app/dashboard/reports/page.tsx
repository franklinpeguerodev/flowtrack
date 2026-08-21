"use client";

import { useMemo, useState } from "react";
import { Wallet, TrendingUp, Receipt } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { StatCard } from "@/components/reports/stat-card";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { TopCategoriesBar } from "@/components/reports/top-categories-bar";
import { ExpenseFilters, ReportFilters } from "@/components/reports/expense-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
  filterExpensesByMonth,
  filterExpensesByRange,
  sumAmount,
  groupByCategory,
  groupByPaymentMethod,
  getTopCategories,
  percentChange,
  getPreviousMonth,
} from "@/lib/report-utils";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function ReportsPage() {
  const { expenses, isLoading } = useExpenses();
  const { categories } = useCategories();
  const { paymentMethods } = usePaymentMethods();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previous = getPreviousMonth(currentMonth, currentYear);

  // --- Sección fija: mes actual ---
  const currentMonthExpenses = useMemo(
    () => filterExpensesByMonth(expenses, currentMonth, currentYear),
    [expenses, currentMonth, currentYear]
  );
  const previousMonthExpenses = useMemo(
    () => filterExpensesByMonth(expenses, previous.month, previous.year),
    [expenses, previous.month, previous.year]
  );

  const totalCurrent = sumAmount(currentMonthExpenses);
  const totalPrevious = sumAmount(previousMonthExpenses);
  const change = percentChange(totalCurrent, totalPrevious);
  const topCategories = getTopCategories(currentMonthExpenses, 5);
  const categoryBreakdown = groupByCategory(currentMonthExpenses);

  // --- Sección dinámica: filtros libres ---
  const [filters, setFilters] = useState<ReportFilters>({
    from: "",
    to: "",
    categoryId: "",
    paymentMethodId: "",
  });

  const filteredExpenses = useMemo(() => {
    let result = expenses;

    if (filters.from || filters.to) {
      result = filterExpensesByRange(
        result,
        filters.from ? new Date(filters.from) : null,
        filters.to ? new Date(`${filters.to}T23:59:59`) : null
      );
    }
    if (filters.categoryId) {
      result = result.filter((e) => e.categoryId === filters.categoryId);
    }
    if (filters.paymentMethodId) {
      result = result.filter((e) => e.paymentMethodId === filters.paymentMethodId);
    }
    return result;
  }, [expenses, filters]);

  const filteredTotal = sumAmount(filteredExpenses);
  const filteredByCategory = groupByCategory(filteredExpenses);
  const filteredByPaymentMethod = groupByPaymentMethod(filteredExpenses);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---------- SECCIÓN FIJA: MES ACTUAL ---------- */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reporte de gastos</h1>
        <p className="text-sm text-muted-foreground">
          Resumen de {MONTH_NAMES[currentMonth - 1]} {currentYear}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total gastado este mes"
          value={`$${totalCurrent.toFixed(2)}`}
          trend={{
            value: change,
            label: `vs ${MONTH_NAMES[previous.month - 1]}`,
          }}
        />
        <StatCard
          icon={Receipt}
          label="Gastos registrados"
          value={String(currentMonthExpenses.length)}
        />
        <StatCard
          icon={TrendingUp}
          label="Categoría con más gasto"
          value={topCategories[0]?.categoryName ?? "—"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdownChart title="Desglose por categoría (este mes)" data={categoryBreakdown} />
        <TopCategoriesBar data={topCategories} />
      </div>

      {/* ---------- SECCIÓN DINÁMICA: FILTROS LIBRES ---------- */}
      <div className="space-y-4 border-t pt-6">
        <div>
          <h2 className="text-xl font-semibold">Explorar por periodo</h2>
          <p className="text-sm text-muted-foreground">
            Filtra tus gastos por fecha, categoría o método de pago
          </p>
        </div>

        <ExpenseFilters
          filters={filters}
          onChange={setFilters}
          categories={categories}
          paymentMethods={paymentMethods}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Wallet} label="Total filtrado" value={`$${filteredTotal.toFixed(2)}`} />
          <StatCard icon={Receipt} label="Gastos encontrados" value={String(filteredExpenses.length)} />
          <StatCard
            icon={TrendingUp}
            label="Promedio por gasto"
            value={`$${filteredExpenses.length ? (filteredTotal / filteredExpenses.length).toFixed(2) : "0.00"}`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CategoryBreakdownChart title="Por categoría (filtrado)" data={filteredByCategory} />
          <CategoryBreakdownChart title="Por método de pago (filtrado)" data={filteredByPaymentMethod} />
        </div>
      </div>
    </div>
  );
}