"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { BudgetResponseDto, BudgetCreateDto, BudgetUpdateDto } from "@/types/budget";

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<BudgetResponseDto[]>("/api/budgets");
        if (!cancelled) setBudgets(data);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "No se pudieron cargar los presupuestos."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refetchIndex]);

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  async function createBudget(dto: BudgetCreateDto) {
    const created = await apiFetch<BudgetResponseDto>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    refetch();
    return created;
  }

  async function deleteBudget(id: string) {
    await apiFetch<void>(`/api/budgets/${id}`, { method: "DELETE" });
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  async function updateBudget(id: string, dto: BudgetUpdateDto) {
    const updated = await apiFetch<BudgetResponseDto>(`/api/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
    refetch();
    return updated;
  }

  return {
    budgets,
    isLoading,
    error,
    createBudget,
    deleteBudget,
    updateBudget,
    refetch,
  };
}
