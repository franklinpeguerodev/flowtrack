"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useBudgetStatus } from "@/hooks/use-budget-status";
import { useBudgets } from "@/hooks/use-budgets";
import { useExpenses } from "@/hooks/use-expenses";
import { CreateBudgetDialog } from "@/components/create-budget-dialog";
import { BudgetChartCard } from "@/components/budget-chart-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api";
import { PiggyBank } from "lucide-react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function BudgetsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [actionError, setActionError] = useState<string | null>(null);

  const { statuses, isLoading, error, refetch: refetchStatus } = useBudgetStatus(month, year);
  const { createBudget, deleteBudget, updateBudget } = useBudgets();
  const { expenses } = useExpenses();

  async function handleCreate(dto: Parameters<typeof createBudget>[0]) {
    try {
      const result = await createBudget(dto);
      // El listado muestra el periodo seleccionado: se salta al mes del presupuesto creado.
      setMonth(dto.month);
      setYear(dto.year);
      refetchStatus();
      return result;
    } catch (err) {
      setActionError(getErrorMessage(err, "No se pudo crear el presupuesto."));
      throw err;
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteBudget(id);
      refetchStatus();
    } catch (err) {
      setActionError(getErrorMessage(err, "No se pudo eliminar el presupuesto."));
    }
  }

  async function handleUpdate(id: string, dto: { amount: number }) {
    const result = await updateBudget(id, dto);
    refetchStatus();
    return result;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Presupuestos</h1>
          <p className="text-sm text-muted-foreground">
            Controla tus límites de gasto por categoría
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <label htmlFor="budget-month" className="text-sm font-medium">
              Mes
            </label>
            <select
              id="budget-month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-10 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              {MONTHS.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="budget-year" className="text-sm font-medium">
              Año
            </label>
            <input
              id="budget-year"
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 w-28 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            />
          </div>
          <CreateBudgetDialog onCreate={handleCreate} />
        </div>
      </div>

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertDescription>{actionError ?? error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : statuses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <PiggyBank className="size-8 text-muted-foreground" />
          <p className="font-medium">Sin presupuestos para {MONTHS[month - 1]} {year}</p>
          <p className="text-sm text-muted-foreground">
            Crea un presupuesto para empezar a controlar tus gastos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statuses.map((status) => (
            <BudgetChartCard
              key={status.id}
              status={status}
              expenses={expenses}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
