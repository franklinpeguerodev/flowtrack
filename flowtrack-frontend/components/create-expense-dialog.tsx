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
import { getErrorMessage } from "@/lib/api";
import { ExpenseCreateDto } from "@/types/expense";
import { useCategories } from "@/hooks/use-categories";
import { usePaymentMethods } from "@/hooks/use-payment-methods";

interface CreateExpenseDialogProps {
  onCreate: (dto: ExpenseCreateDto) => Promise<unknown>;
}

function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function CreateExpenseDialog({ onCreate }: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState<string>("");
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  const { categories = [] } = useCategories();
  const { paymentMethods = [] } = usePaymentMethods();

  // Solo se ofrecen registros activos en los formularios de captura.
  const activeCategories = categories.filter((c) => c.isActive);
  const activePaymentMethods = paymentMethods.filter((p) => p.isActive);

  const selectedCategory = activeCategories.find((c) => c.id === categoryId);
  const selectedPaymentMethod = activePaymentMethods.find((p) => p.id === paymentMethodId);

  async function handleSubmit(formData: FormData) {
    setError(null);

    if (!categoryId || !paymentMethodId) {
      setError("Selecciona una categoría y un método de pago.");
      return;
    }

    setIsLoading(true);
    try {
      await onCreate({
        amount: Number(formData.get("amount")),
        date: formData.get("date") as string,
        description: (formData.get("description") as string) || null,
        categoryId,
        paymentMethodId,
      });
      setOpen(false);
      setCategoryId("");
      setPaymentMethodId("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear el gasto."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo gasto
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar gasto</DialogTitle>
          <DialogDescription>Agrega un nuevo gasto a tu registro.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={todayLocal()}
              max={todayLocal()}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría">
                  {selectedCategory?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeCategories.length === 0 ? (
                  <SelectItem value="loading-cat" disabled>
                    No hay categorías activas
                  </SelectItem>
                ) : (
                  activeCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Método de pago</Label>
            <Select value={paymentMethodId} onValueChange={(val) => setPaymentMethodId(val ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un método de pago">
                  {selectedPaymentMethod?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activePaymentMethods.length === 0 ? (
                  <SelectItem value="loading-pay" disabled>
                    No hay métodos activos
                  </SelectItem>
                ) : (
                  activePaymentMethods.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input id="description" name="description" placeholder="Ej: Supermercado" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
