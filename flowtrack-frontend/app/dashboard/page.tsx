"use client";

import { useState } from "react";
import { FolderX } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useBudgetStatus } from "@/hooks/use-budget-status";
import { CategoryCard } from "@/components/category-card";
import { CreateCategoryDialog } from "@/components/create-category-dialog";
import { CategoryDetailDialog } from "@/components/category-detail-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CategoryResponseDto } from "@/types/category";
import { getErrorMessage } from "@/lib/api";

export default function DashboardPage() {
  const {
    categories,
    isLoading,
    error,
    createCategory,
    deleteCategory,
    updateCategory,
  } = useCategories();
  const { expenses } = useExpenses();
  const { statuses } = useBudgetStatus();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBudgetStatus = selectedCategory
    ? statuses.find((s) => s.categoryId === selectedCategory.id)
    : undefined;

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteCategory(id);
    } catch (err) {
      setActionError(
        getErrorMessage(err, "No se pudo eliminar la categoría.")
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus gastos por categoría
          </p>
        </div>
        <CreateCategoryDialog onCreate={createCategory} />
      </div>

      <div className="relative max-w-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar categoría..."
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
        />
      </div>

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertDescription>{actionError ?? error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <FolderX className="size-8 text-muted-foreground" />
          <p className="font-medium">Aún no tienes categorías</p>
          <p className="text-sm text-muted-foreground">
            Crea tu primera categoría para empezar a registrar gastos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer"
            >
              <CategoryCard
                category={category}
                onDelete={handleDelete}
                onUpdate={updateCategory}
              />
            </div>
          ))}
        </div>
      )}

      <CategoryDetailDialog
        category={selectedCategory}
        expenses={expenses}
        budgetStatus={selectedBudgetStatus}
        onOpenChange={(open) => !open && setSelectedCategory(null)}
      />
    </div>
  );
}
