"use client";

import { useBudgetStatus } from "@/hooks/use-budget-status";
import { useBudgets } from "@/hooks/use-budgets";
import { useExpenses } from "@/hooks/use-expenses";
import { CreateBudgetDialog } from "@/components/create-budget-dialog";
import { BudgetChartCard } from "@/components/budget-chart-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank } from "lucide-react";

export default function BudgetsPage() {
  const { statuses, isLoading, refetch: refetchStatus } = useBudgetStatus();
  const { createBudget, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();

  async function handleCreate(dto: Parameters<typeof createBudget>[0]) {
    const result = await createBudget(dto);
    refetchStatus();
    return result;
  }

  async function handleDelete(id: string) {
    await deleteBudget(id);
    refetchStatus();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Presupuestos</h1>
          <p className="text-sm text-muted-foreground">
            Controla tus límites de gasto por categoría este mes
          </p>
        </div>
        <CreateBudgetDialog onCreate={handleCreate} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : statuses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <PiggyBank className="size-8 text-muted-foreground" />
          <p className="font-medium">Sin presupuestos este mes</p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}