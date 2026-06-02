import { Card, CardContent } from "@/components/ui/card";
import { cn, shortNumber } from "@/lib/utils";
import {
  Activity,
  Clock,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { OVERVIEW_METRICS } from "./mock-data";

type Item = {
  label: string;
  value: number;
  prev: number;
  unit: string;
  icon: LucideIcon;
  tone: "primary" | "info" | "warning" | "success";
  format?: "number" | "minutes" | "percent";
};

export function OverviewMetrics() {
  const items: Item[] = [
    {
      label: "活跃用户",
      value: OVERVIEW_METRICS.activeUsers,
      prev: OVERVIEW_METRICS.prevActiveUsers,
      unit: "人",
      icon: Users,
      tone: "primary",
      format: "number",
    },
    {
      label: "会话数",
      value: OVERVIEW_METRICS.sessions,
      prev: OVERVIEW_METRICS.prevSessions,
      unit: "次",
      icon: Activity,
      tone: "info",
      format: "number",
    },
    {
      label: "平均时长",
      value: OVERVIEW_METRICS.avgDurationMin,
      prev: OVERVIEW_METRICS.prevAvgDurationMin,
      unit: "分钟",
      icon: Clock,
      tone: "warning",
      format: "minutes",
    },
    {
      label: "7 日留存率",
      value: OVERVIEW_METRICS.retention7d,
      prev: OVERVIEW_METRICS.prevRetention7d,
      unit: "%",
      icon: UserCheck,
      tone: "success",
      format: "percent",
    },
  ];
  const toneText = {
    primary: "text-primary",
    info: "text-info",
    warning: "text-warning",
    success: "text-success",
  };
  const toneBg = {
    primary: "bg-primary/10",
    info: "bg-info/10",
    warning: "bg-warning/10",
    success: "bg-success/10",
  };
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        const delta = it.prev === 0 ? 0 : +(((it.value - it.prev) / it.prev) * 100).toFixed(1);
        const up = delta >= 0;
        const display =
          it.format === "number"
            ? shortNumber(it.value)
            : it.format === "percent"
              ? it.value.toFixed(1)
              : it.value.toFixed(1);
        return (
          <Card key={it.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-md p-1.5", toneBg[it.tone], toneText[it.tone])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{it.label}</span>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] font-medium",
                    up ? "text-success" : "text-destructive",
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? "+" : ""}
                  {delta}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={cn("text-2xl font-semibold tabular-nums", toneText[it.tone])}>
                  {display}
                </span>
                <span className="text-xs text-muted-foreground">{it.unit}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">较上周期</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
