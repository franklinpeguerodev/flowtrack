"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiException } from "@/lib/api";
import { BudgetStatusDto } from "@/types/budget";

export function useBudgetStatus(month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const [statuses, setStatuses] = useState<BudgetStatusDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await apiFetch<BudgetStatusDto[]>(
          `/api/budgets/status?month=${targetMonth}&year=${targetYear}`
        );
        if (!cancelled) setStatuses(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiException) {
          console.error(err.error.message);
        }
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

  return { statuses, isLoading, refetch };
}