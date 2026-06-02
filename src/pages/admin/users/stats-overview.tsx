import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, ShieldOff, UserPlus, Users } from "lucide-react";
import type { USER_STATS } from "./mock-data";

type Props = { stats: typeof USER_STATS };

export function StatsOverview({ stats }: Props) {
  const items = [
    { label: "总用户", value: stats.total, icon: Users, tone: "text-primary" },
    { label: "活跃", value: stats.active, icon: Activity, tone: "text-success" },
    { label: "禁用", value: stats.disabled, icon: ShieldOff, tone: "text-destructive" },
    { label: "今日新增", value: stats.todayNew, icon: UserPlus, tone: "text-info" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
