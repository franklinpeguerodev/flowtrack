"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, getErrorMessage } from "@/lib/api";
import {
  ExpenseResponseDto,
  ExpenseCreateDto,
  ExpenseUpdateDto,
} from "@/types/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ExpenseResponseDto[]>("/api/expenses");
        if (!cancelled) setExpenses(data);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "No se pudieron cargar los gastos."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refetchIndex]);

  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  async function createExpense(dto: ExpenseCreateDto) {
    const created = await apiFetch<ExpenseResponseDto>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    setExpenses((prev) => [...prev, created]);
    // El DTO devuelto por el POST ya trae los nombres, pero se refresca para
    // mantener el listado como única fuente de verdad.
    refetch();
    return created;
  }

  async function deleteExpense(id: string) {
    await apiFetch<void>(`/api/expenses/${id}`, { method: "DELETE" });
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function updateExpense(id: string, dto: ExpenseUpdateDto) {
    const updated = await apiFetch<ExpenseResponseDto>(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }

  return {
    expenses,
    isLoading,
    error,
    createExpense,
    deleteExpense,
    updateExpense,
    refetch,
  };
}
