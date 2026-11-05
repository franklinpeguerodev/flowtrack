"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
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
import { ExpenseResponseDto, ExpenseUpdateDto } from "@/types/expense";
import { useCategories } from "@/hooks/use-categories";
import { usePaymentMethods } from "@/hooks/use-payment-methods";

interface EditExpenseDialogProps {
  expense: ExpenseResponseDto;
  onUpdate: (id: string, dto: ExpenseUpdateDto) => Promise<unknown>;
}

function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function EditExpenseDialog({ expense, onUpdate }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [paymentMethodId, setPaymentMethodId] = useState(expense.paymentMethodId);

  const { categories = [] } = useCategories();
  const { paymentMethods = [] } = usePaymentMethods();

  // Se ofrecen los activos, pero se conserva la selección actual aunque esté inactiva
  // (si no, el select no podría mostrar el valor guardado).
  const availableCategories = categories.filter(
    (c) => c.isActive || c.id === expense.categoryId
  );
  const availablePaymentMethods = paymentMethods.filter(
    (p) => p.isActive || p.id === expense.paymentMethodId
  );

  const selectedCategory = availableCategories.find((c) => c.id === categoryId);
  const selectedPaymentMethod = availablePaymentMethods.find((p) => p.id === paymentMethodId);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      await onUpdate(expense.id, {
        amount: Number(formData.get("amount")),
        date: formData.get("date") as string,
        description: (formData.get("description") as string) || null,
        categoryId,
        paymentMethodId,
      });
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo actualizar el gasto."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setCategoryId(expense.categoryId);
          setPaymentMethodId(expense.paymentMethodId);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Editar gasto</DialogTitle>
          <DialogDescription>Actualiza los datos de este gasto.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto</Label>
            <Input
              key={expense.amount}
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={expense.amount}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">Fecha</Label>
            <Input
              key={expense.date}
              id="date"
              name="date"
              type="date"
              defaultValue={expense.date.slice(0, 10)}
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
                {availableCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}{c.isActive ? "" : " (inactiva)"}
                  </SelectItem>
                ))}
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
                {availablePaymentMethods.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}{p.isActive ? "" : " (inactivo)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              key={expense.description}
              id="description"
              name="description"
              defaultValue={expense.description ?? ""}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
