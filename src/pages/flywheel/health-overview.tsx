import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, Gauge, type LucideIcon, MessageSquare, ThumbsUp } from "lucide-react";
import { HEALTH_SCORES } from "./mock-data";

type ScoreItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "primary" | "success" | "info" | "warning";
  desc: string;
};

const items: ScoreItem[] = [
  {
    label: "飞轮总分",
    value: HEALTH_SCORES.overall,
    icon: Gauge,
    tone: "primary",
    desc: "综合健康度",
  },
  {
    label: "意图覆盖",
    value: HEALTH_SCORES.intentCoverage,
    icon: Activity,
    tone: "info",
    desc: "已识别意图占比",
  },
  {
    label: "反馈质量",
    value: HEALTH_SCORES.feedbackQuality,
    icon: ThumbsUp,
    tone: "success",
    desc: "正向反馈率",
  },
  {
    label: "响应质量",
    value: HEALTH_SCORES.responseQuality,
    icon: MessageSquare,
    tone: "warning",
    desc: "回答有用率",
  },
];

const toneClass = {
  primary: "text-primary",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

const toneBg = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  info: "bg-info/10",
  warning: "bg-warning/10",
};

export function HealthOverview() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-md p-1.5", toneBg[it.tone], toneClass[it.tone])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{it.label}</span>
                </div>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-medium",
                    it.value >= 85
                      ? "bg-success/15 text-success"
                      : it.value >= 70
                        ? "bg-warning/15 text-warning"
                        : "bg-destructive/15 text-destructive",
                  )}
                >
                  {it.value >= 85 ? "健康" : it.value >= 70 ? "一般" : "异常"}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className={cn("text-3xl font-semibold tabular-nums", toneClass[it.tone])}>
                  {it.value}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
              <Progress value={it.value} className="mt-2 h-1" />
              <p className="mt-2 text-[10px] text-muted-foreground">{it.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
