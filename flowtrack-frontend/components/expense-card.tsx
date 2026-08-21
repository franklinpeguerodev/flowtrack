"use client";

import { BarChart3, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpenseResponseDto, ExpenseUpdateDto } from "@/types/expense";
import { EditExpenseDialog } from "@/components/edit-expense-dialog";

interface ExpenseCardProps {
  expense: ExpenseResponseDto;
  onDelete: (id: string) => void;
  onUpdate: (id: string, dto: ExpenseUpdateDto) => Promise<unknown>;
}

export function ExpenseCard({ expense, onDelete, onUpdate }: ExpenseCardProps) {
  const formattedDate = new Date(expense.date).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{expense.categoryName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {expense.description || "Sin descripción"}
            </p>
            <p className="text-xs text-muted-foreground">Fecha: {formattedDate}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <span className="font-semibold">${expense.amount.toFixed(2)}</span>
          
          <div className="flex items-center gap-1">
            <EditExpenseDialog expense={expense} onUpdate={onUpdate} />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(expense.id);
              }}
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}