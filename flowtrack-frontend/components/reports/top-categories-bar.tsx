"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CategoryBreakdown } from "@/lib/report-utils";

interface TopCategoriesBarProps {
  data: CategoryBreakdown[];
}

export function TopCategoriesBar({ data }: TopCategoriesBarProps) {
  const chartConfig: ChartConfig = {
    total: { label: "Gastado", color: "var(--chart-1)" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top categorías del mes</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin gastos este mes.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="categoryName" type="category" tickLine={false} axisLine={false} width={100} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}