"use client";

import { useState } from "react";
import { Search, WalletCards } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { PaymentMethodCard } from "@/components/payment-method-card";
import { CreatePaymentMethodDialog } from "@/components/create-payment-method-dialog";

export default function PaymentMethodsPage() {
  const { paymentMethods, isLoading, error, createPaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const [search, setSearch] = useState("");

  const filtered = paymentMethods.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Métodos de pago</h1>
          <p className="text-sm text-muted-foreground">
            Administra tus formas de pago
          </p>
        </div>
        <CreatePaymentMethodDialog onCreate={createPaymentMethod} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar método de pago..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <WalletCards   className="size-8 text-muted-foreground" />
          <p className="font-medium">Aún no tienes métodos de pago</p>
          <p className="text-sm text-muted-foreground">
            Crea tu primer método para empezar a registrar gastos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((paymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              onDelete={deletePaymentMethod}
            />
          ))}
        </div>
      )}
    </div>
  );
}