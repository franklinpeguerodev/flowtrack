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
import { ExpenseCreateDto } from "@/types/expense";
import { useCategories } from "@/hooks/use-categories";
import { usePaymentMethods } from "@/hooks/use-payment-methods";

interface CreateExpenseDialogProps {
  onCreate: (dto: ExpenseCreateDto) => Promise<unknown>;
}

export function CreateExpenseDialog({ onCreate }: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al inicializar como string vacío (""), le decimos a React que este componente
  // SIEMPRE estará controlado, eliminando el error de "uncontrolled to controlled"
  const [categoryId, setCategoryId] = useState<string>("");
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  const { categories = [] } = useCategories();
  const { paymentMethods = [] } = usePaymentMethods();

  // FIX (Base UI): SelectValue no resuelve el label automáticamente si el
  // dropdown nunca se abrió (SelectItem vive dentro de un Portal, y Base UI
  // solo "aprende" el texto de cada item cuando se monta). Por eso buscamos
  // el nombre manualmente y se lo pasamos como children a <SelectValue>.
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedPaymentMethod = paymentMethods.find((p) => p.id === paymentMethodId);

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
      setError(err instanceof ApiException ? err.error.message : "No se pudo crear el gasto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Se usa 'render' (no 'asChild') porque DialogTrigger en Base UI
          compone así, evitando el error de <button> anidado dentro de otro <button> */}
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
            <Input id="date" name="date" type="date" required />
          </div>

          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")}>
              <SelectTrigger>
                {/* FIX: children explícito en vez de depender del auto-registro de items */}
                <SelectValue placeholder="Selecciona una categoría">
                  {selectedCategory?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* FIX: era "categories.map  0 ?" (typo), debe ser "categories.length === 0 ?" */}
                {categories.length === 0 ? (
                  <SelectItem value="loading-cat" disabled>Cargando categorías...</SelectItem>
                ) : (
                  categories.map((c) => (
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
                {/* FIX: mismo patrón aplicado también acá — antes le faltaba el children */}
                <SelectValue placeholder="Selecciona un método de pago">
                  {selectedPaymentMethod?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.length === 0 ? (
                  <SelectItem value="loading-pay" disabled>Cargando métodos...</SelectItem>
                ) : (
                  paymentMethods.map((p) => (
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