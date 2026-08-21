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

export default function DashboardPage() {
  // 1. AÑADIDO: updateCategory extraído del hook
  const { categories, isLoading, error, createCategory, deleteCategory, updateCategory } = useCategories();
  const { expenses } = useExpenses();
  const { statuses } = useBudgetStatus();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponseDto | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBudgetStatus = selectedCategory
    ? statuses.find((s) => s.categoryId === selectedCategory.id)
    : undefined;

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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
            <div key={category.id} onClick={() => setSelectedCategory(category)} className="cursor-pointer">
              {/* 2. AÑADIDO: onUpdate={updateCategory} pasado como prop */}
              <CategoryCard 
                category={category} 
                onDelete={deleteCategory} 
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