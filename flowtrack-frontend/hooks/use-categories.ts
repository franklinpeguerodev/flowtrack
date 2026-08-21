"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiException } from "@/lib/api";
import { CategoryResponseDto, CategoryCreateDto, CategoryUpdateDto } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<CategoryResponseDto[]>("/api/categories");
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiException) {
          setError(err.error.message);
        } else {
          setError("No se pudieron cargar las categorías.");
        }
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

  async function createCategory(dto: CategoryCreateDto) {
    const created = await apiFetch<CategoryResponseDto>("/api/categories", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    setCategories((prev) => [...prev, created]);
    return created;
  }

  async function deleteCategory(id: string) {
    await apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }
async function updateCategory(id: string, dto: CategoryUpdateDto) {
  const updated = await apiFetch<CategoryResponseDto>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
  setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  return updated;
}
  return { categories, isLoading, error, createCategory, deleteCategory,updateCategory, refetch };
}