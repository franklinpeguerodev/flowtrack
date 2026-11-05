"use client";

import { Trash2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethodResponseDto, PaymentMethodUpdateDto } from "@/types/paymentMethod";
import { EditPaymentMethodDialog } from "@/components/edit-payment-method-dialog";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodResponseDto;
  expenseCount?: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, dto: PaymentMethodUpdateDto) => Promise<unknown>;
}

export function PaymentMethodCard({
  paymentMethod,
  expenseCount = 0,
  onDelete,
  onUpdate,
}: PaymentMethodCardProps) {
  const hasExpenses = expenseCount > 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="size-4" />
          </div>
          <div>
            <p className="font-medium">{paymentMethod.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={paymentMethod.isActive ? "default" : "secondary"}>
                {paymentMethod.isActive ? "Activo" : "Inactivo"}
              </Badge>
              {hasExpenses && (
                <span className="text-xs text-muted-foreground">
                  {expenseCount} gasto{expenseCount === 1 ? "" : "s"} asociado
                  {expenseCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <EditPaymentMethodDialog paymentMethod={paymentMethod} onUpdate={onUpdate} />
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={hasExpenses}
            title={
              hasExpenses
                ? "No se puede eliminar: tiene gastos asociados"
                : "Eliminar método de pago"
            }
            onClick={(e) => {
              e.stopPropagation();
              onDelete(paymentMethod.id);
            }}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
