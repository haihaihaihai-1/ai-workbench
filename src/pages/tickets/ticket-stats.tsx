import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Flame, ListChecks, Timer, TrendingUp } from "lucide-react";
import type { TICKET_STATS } from "./mock-data";

type Props = { stats: typeof TICKET_STATS };

export function TicketStats({ stats }: Props) {
  const items = [
    { label: "待处理", value: stats.open, icon: Flame, tone: "text-info" },
    { label: "处理中", value: stats.inProgress, icon: Clock, tone: "text-warning" },
    { label: "已完成", value: stats.resolved, icon: CheckCircle2, tone: "text-success" },
    { label: "已超时", value: stats.breached, icon: Timer, tone: "text-destructive" },
    {
      label: "平均响应",
      value: `${stats.avgResponseMin}m`,
      icon: TrendingUp,
      tone: "text-primary",
    },
    {
      label: "平均解决",
      value: `${stats.avgResolveHour}h`,
      icon: ListChecks,
      tone: "text-muted-foreground",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className={cn("rounded-md bg-muted p-2", it.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{it.label}</div>
                <div className="text-lg font-semibold tabular-nums">{it.value}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
