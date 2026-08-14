"use client";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  trend?: number;
  gradient?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, gradient = "from-indigo-500 to-blue-500", className }: StatCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <Card className={cn("p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
          <p className={cn("text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent", gradient)}>
            {displayValue}
          </p>
          {trend !== undefined && (
            <p className={cn("text-xs flex items-center gap-1", trend >= 0 ? "text-green-400" : "text-red-400")}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      <div className={cn("absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-50", gradient)} />
    </Card>
  );
}
