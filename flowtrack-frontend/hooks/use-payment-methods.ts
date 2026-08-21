"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiException } from "@/lib/api";
import { PaymentMethodResponseDto, PaymentMethodCreateDto, PaymentMethodUpdateDto } from "@/types/paymentMethod";

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<PaymentMethodResponseDto[]>("/api/paymentmethods");
        if (!cancelled) setPaymentMethods(data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiException ? err.error.message : "No se pudieron cargar los métodos de pago.");
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

  async function createPaymentMethod(dto: PaymentMethodCreateDto) {
    const created = await apiFetch<PaymentMethodResponseDto>("/api/paymentmethods", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    setPaymentMethods((prev) => [...prev, created]);
    return created;
  }

  async function deletePaymentMethod(id: string) {
    await apiFetch<void>(`/api/paymentmethods/${id}`, { method: "DELETE" });
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  }
async function updatePaymentMethod(id: string, dto: PaymentMethodUpdateDto) {
  const updated = await apiFetch<PaymentMethodResponseDto>(`/api/paymentmethod/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
  setPaymentMethods((prev) => prev.map((p) => (p.id === id ? updated : p)));
  return updated;
}
  return { paymentMethods, isLoading, error, createPaymentMethod, deletePaymentMethod,updatePaymentMethod, refetch };
}