"use client";

import { Trash2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethodResponseDto, PaymentMethodUpdateDto } from "@/types/paymentMethod";
import { EditPaymentMethodDialog } from "@/components/edit-payment-method-dialog";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodResponseDto;
  onDelete: (id: string) => void;
  onUpdate: (id: string, dto: PaymentMethodUpdateDto) => Promise<unknown>;
}

export function PaymentMethodCard({ paymentMethod, onDelete, onUpdate }: PaymentMethodCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="size-4" />
          </div>
          <div>
            <p className="font-medium">{paymentMethod.name}</p>
            <Badge variant={paymentMethod.isActive ? "default" : "secondary"} className="mt-1">
              {paymentMethod.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <EditPaymentMethodDialog paymentMethod={paymentMethod} onUpdate={onUpdate} />
          <Button
            variant="ghost"
            size="icon-sm"
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