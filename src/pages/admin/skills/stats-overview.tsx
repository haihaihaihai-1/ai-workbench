import { IconAlertCircle, IconCheckCircle2, IconShieldOff, IconWrench } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ADMIN_SKILL_STATS } from "./mock-data";

type Props = { stats: typeof ADMIN_SKILL_STATS };

export function StatsOverview({ stats }: Props) {
  const items = [
    { label: "总技能", value: stats.total, icon: IconWrench, tone: "text-primary" },
    { label: "已启用", value: stats.enabled, icon: IconCheckCircle2, tone: "text-success" },
    { label: "待审核", value: stats.pending, icon: IconAlertCircle, tone: "text-warning" },
    { label: "已禁用", value: stats.disabled, icon: IconShieldOff, tone: "text-destructive" },
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
