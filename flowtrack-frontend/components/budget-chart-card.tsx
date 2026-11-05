"use client";

import { RadialBar, RadialBarChart, PolarGrid, PolarRadiusAxis, Label as RechartsLabel } from "recharts";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { BudgetStatusDto, BudgetUpdateDto, getAlertLevel } from "@/types/budget";
import { ExpenseResponseDto } from "@/types/expense";
import { EditBudgetDialog } from "@/components/edit-budget-dialog";

interface BudgetChartCardProps {
  status: BudgetStatusDto;
  expenses: ExpenseResponseDto[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, dto: BudgetUpdateDto) => Promise<unknown>;
}

export function BudgetChartCard({ status, expenses, onDelete, onUpdate }: BudgetChartCardProps) {
  const percentage = Math.min(status.percentageUsed, 100);
  const alert = getAlertLevel(status.alertLevel);

  const chartData = [{ name: "usado", value: percentage, fill: alert.color }];
  const chartConfig: ChartConfig = {
    value: { label: "Usado" },
  };

  // Solo gastos de la categoría y del mismo mes/año del presupuesto.
  const relatedExpenses = expenses.filter((e) => {
    if (e.categoryId !== status.categoryId) return false;
    const date = new Date(e.date);
    return date.getMonth() + 1 === status.month && date.getFullYear() === status.year;
  });

  const paymentUsage = relatedExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.paymentMethodName] = (acc[e.paymentMethodName] ?? 0) + e.amount;
    return acc;
  }, {});

  const topPaymentMethods = Object.entries(paymentUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxAmount = topPaymentMethods[0]?.[1] ?? 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <div>
          <p className="font-semibold">{status.categoryName}</p>
          <p className="text-xs text-muted-foreground">
            {status.month}/{status.year}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant={alert.variant}>{alert.label}</Badge>
          <EditBudgetDialog
            budgetId={status.id}
            currentAmount={status.budgetAmount}
            onUpdate={onUpdate}
          />
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(status.id)}>
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-4 pt-2">
        {/* Gráfico radial de porcentaje */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-32 w-32">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - percentage * 3.6}
            innerRadius={40}
            outerRadius={60}
          >
            <PolarGrid gridType="circle" radialLines={false} stroke="none" />
            <RadialBar dataKey="value" background cornerRadius={10} fill={alert.color} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <RechartsLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                          {percentage.toFixed(0)}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>

        {/* Info de montos + métodos de pago más usados */}
        <div className="flex-1 space-y-3">
          <div className="text-sm">
            <span className="font-semibold">${status.spentAmount.toFixed(2)}</span>
            <span className="text-muted-foreground"> / ${status.budgetAmount.toFixed(2)}</span>
          </div>

          {topPaymentMethods.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Métodos más usados</p>
              {topPaymentMethods.map(([name, amount]) => (
                <div key={name} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span>{name}</span>
                    <span className="text-muted-foreground">${amount.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
