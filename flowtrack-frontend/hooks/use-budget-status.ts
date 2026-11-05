"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { BudgetStatusDto } from "@/types/budget";

export function useBudgetStatus(month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const [statuses, setStatuses] = useState<BudgetStatusDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<BudgetStatusDto[]>(
          `/api/budgets/status?month=${targetMonth}&year=${targetYear}`
        );
        if (!cancelled) setStatuses(data);
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
  }, [targetMonth, targetYear, refetchIndex]);

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  return { statuses, isLoading, error, month: targetMonth, year: targetYear, refetch };
}
