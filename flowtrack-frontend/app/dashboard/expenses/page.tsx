"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ExpenseCard } from "@/components/expense-card";
import { CreateExpenseDialog } from "@/components/create-expense-dialog";
import { useExpenses } from "@/hooks/use-expenses";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExpensesPage() {
  const { expenses, isLoading, createExpense, deleteExpense } = useExpenses();
  const [search, setSearch] = useState("");

  const filtered = expenses.filter(
    (e) =>
      e.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground">Registra y organiza tus gastos</p>
        </div>
        <CreateExpenseDialog onCreate={createExpense} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por categoría o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          No hay gastos registrados todavía.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={deleteExpense} />
          ))}
        </div>
      )}
    </div>
  );
}