import { Card, CardContent } from "@/components/ui/card";
import { cn, shortNumber } from "@/lib/utils";
import { IconBarChart3, IconCheckCircle2, IconDownload, IconSparkles } from "@/components/icons"
import type { SKILL_STATS } from "./mock-data";

type Props = { stats: typeof SKILL_STATS };

export function StatsOverview({ stats }: Props) {
  const items = [
    {
      label: "总技能",
      value: stats.total,
      icon: IconSparkles,
      tone: "text-primary",
    },
    {
      label: "已启用",
      value: `${stats.enabled}/${stats.total}`,
      icon: IconCheckCircle2,
      tone: "text-success",
    },
    {
      label: "总调用次数",
      value: shortNumber(stats.calls),
      icon: IconBarChart3,
      tone: "text-info",
    },
    {
      label: "最热门",
      value: stats.popular,
      icon: IconDownload,
      tone: "text-warning",
    },
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
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{it.label}</div>
                <div className="truncate text-lg font-semibold tabular-nums">{it.value}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
