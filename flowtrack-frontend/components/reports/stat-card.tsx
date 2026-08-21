"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {trend && (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-destructive" : "text-emerald-600 dark:text-emerald-500"
              )}
            >
              {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
              <span className="font-normal text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}