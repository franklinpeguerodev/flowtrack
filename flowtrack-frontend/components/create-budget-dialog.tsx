"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiException } from "@/lib/api";
import { BudgetCreateDto } from "@/types/budget";
import { useCategories } from "@/hooks/use-categories";

interface CreateBudgetDialogProps {
  onCreate: (dto: BudgetCreateDto) => Promise<unknown>;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function CreateBudgetDialog({ onCreate }: CreateBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const now = new Date();
  const { categories = [] } = useCategories();
  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handleSubmit(formData: FormData) {
    setError(null);

    if (!categoryId) {
      setError("Selecciona una categoría.");
      return;
    }

    setIsLoading(true);
    try {
      await onCreate({
        categoryId,
        amount: Number(formData.get("amount")),
        month: Number(formData.get("month")),
        year: Number(formData.get("year")),
      });
      setOpen(false);
      setCategoryId("");
    } catch (err) {
      setError(err instanceof ApiException ? err.error.message : "No se pudo crear el presupuesto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus />Nuevo presupuesto</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear presupuesto</DialogTitle>
          <DialogDescription>
            Define un límite de gasto mensual para una categoría.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría">
                  {selectedCategory?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto límite</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="month">Mes</Label>
              <select
                id="month"
                name="month"
                defaultValue={now.getMonth() + 1}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                required
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Año</Label>
              <Input id="year" name="year" type="number" defaultValue={now.getFullYear()} required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {isLoading ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}