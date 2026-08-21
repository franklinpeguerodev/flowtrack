"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CategoryBreakdown } from "@/lib/report-utils";

interface CategoryBreakdownChartProps {
  title: string;
  data: CategoryBreakdown[];
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function CategoryBreakdownChart({ title, data }: CategoryBreakdownChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
    config[item.categoryName] = { label: item.categoryName, color: COLORS[index % COLORS.length] };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin datos para este periodo.</p>
        ) : (
          <div className="flex items-center gap-4">
            <ChartContainer config={chartConfig} className="h-40 w-40 shrink-0">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="categoryName" hideLabel />} />
                <Pie data={chartData} dataKey="total" nameKey="categoryName" innerRadius={35} outerRadius={65} strokeWidth={2}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex-1 space-y-1.5">
              {chartData.map((item) => (
                <div key={item.categoryName} className="flex items-center gap-2 text-sm">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="flex-1 truncate text-muted-foreground">{item.categoryName}</span>
                  <span className="font-medium">${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}