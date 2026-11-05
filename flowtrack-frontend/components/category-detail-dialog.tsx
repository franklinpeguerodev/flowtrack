"use client";

import { Tag, Receipt, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CategoryResponseDto } from "@/types/category";
import { ExpenseResponseDto } from "@/types/expense";
import { BudgetStatusDto } from "@/types/budget";

interface CategoryDetailDialogProps {
  category: CategoryResponseDto | null;
  expenses: ExpenseResponseDto[];
  budgetStatus: BudgetStatusDto | undefined;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDetailDialog({
  category,
  expenses,
  budgetStatus,
  onOpenChange,
}: CategoryDetailDialogProps) {
  if (!category) return null;

  // El presupuesto es mensual: los gastos asociados se limitan al mes actual
  // para que el total coincida con lo que muestra el estado del presupuesto.
  const now = new Date();
  const categoryExpenses = expenses.filter((e) => {
    if (e.categoryId !== category.id) return false;
    const date = new Date(e.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Dialog open={!!category} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="size-4" />
            </div>
            <div>
              <DialogTitle>{category.name}</DialogTitle>
              <DialogDescription>
                {category.isActive ? "Categoría activa" : "Categoría inactiva"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Presupuesto del mes actual */}
        {budgetStatus ? (
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Wallet className="size-4" />
                Presupuesto este mes
              </span>
              <span className="text-sm text-muted-foreground">
                {budgetStatus.percentageUsed.toFixed(0)}% usado
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(budgetStatus.percentageUsed, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>${budgetStatus.spentAmount.toFixed(2)} gastado</span>
              <span>${budgetStatus.budgetAmount.toFixed(2)} límite</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No tienes un presupuesto configurado para esta categoría este mes.
          </p>
        )}

        <Separator />

        {/* Lista de gastos asociados */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Receipt className="size-4" />
              Gastos del mes
            </span>
            <Badge variant="secondary">{categoryExpenses.length}</Badge>
          </div>

          {categoryExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No hay gastos registrados en esta categoría este mes.
            </p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {categoryExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {expense.description || "Sin descripción"}
                  </span>
                  <span className="text-sm font-medium">
                    ${expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between px-2 text-sm font-semibold">
                <span>Total</span>
                <span>${totalSpent.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
