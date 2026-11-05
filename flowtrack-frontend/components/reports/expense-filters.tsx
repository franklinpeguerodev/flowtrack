"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { CategoryResponseDto } from "@/types/category";
import { PaymentMethodResponseDto } from "@/types/paymentMethod";

export interface ReportFilters {
  from: string;
  to: string;
  categoryId: string;
  paymentMethodId: string;
}

interface ExpenseFiltersProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  categories: CategoryResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
}

const ALL = "__all__";

export function ExpenseFilters({ filters, onChange, categories, paymentMethods }: ExpenseFiltersProps) {
  function update(partial: Partial<ReportFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clear() {
    onChange({ from: "", to: "", categoryId: "", paymentMethodId: "" });
  }

  const hasActiveFilters = filters.from || filters.to || filters.categoryId || filters.paymentMethodId;

  // Base UI no resuelve la etiqueta de SelectValue si el item nunca se montó
  // (el valor se fija por estado), y termina mostrando el id. Se resuelve aquí.
  const selectedCategory = categories.find((c) => c.id === filters.categoryId);
  const selectedPaymentMethod = paymentMethods.find(
    (p) => p.id === filters.paymentMethodId
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="from">Desde</Label>
        <Input
          id="from"
          type="date"
          value={filters.from}
          onChange={(e) => update({ from: e.target.value })}
          className="w-40"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="to">Hasta</Label>
        <Input
          id="to"
          type="date"
          value={filters.to}
          onChange={(e) => update({ to: e.target.value })}
          className="w-40"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Categoría</Label>
        <Select
          value={filters.categoryId || ALL}
          onValueChange={(val) => update({ categoryId: val === ALL ? "" : val ?? "" })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todas las categorías">
              {selectedCategory?.name ?? "Todas las categorías"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Método de pago</Label>
        <Select
          value={filters.paymentMethodId || ALL}
          onValueChange={(val) => update({ paymentMethodId: val === ALL ? "" : val ?? "" })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos los métodos">
              {selectedPaymentMethod?.name ?? "Todos los métodos"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los métodos</SelectItem>
            {paymentMethods.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clear}>
          <X className="size-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}