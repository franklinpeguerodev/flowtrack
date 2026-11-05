"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { PaymentMethodResponseDto, PaymentMethodUpdateDto } from "@/types/paymentMethod";

interface EditPaymentMethodDialogProps {
  paymentMethod: PaymentMethodResponseDto;
  onUpdate: (id: string, dto: PaymentMethodUpdateDto) => Promise<unknown>;
}

export function EditPaymentMethodDialog({ paymentMethod, onUpdate }: EditPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(paymentMethod.isActive);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      await onUpdate(paymentMethod.id, {
        name: formData.get("name") as string,
        isActive,
      });
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo actualizar el método de pago."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(o) => { 
        setOpen(o); 
        if (o) setIsActive(paymentMethod.isActive); 
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
          <DialogTitle>Editar método de pago</DialogTitle>
          <DialogDescription>Actualiza el nombre o el estado.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input key={paymentMethod.name} id="name" name="name" defaultValue={paymentMethod.name} required />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Activo</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
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