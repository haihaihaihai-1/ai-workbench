import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconCheckCircle2, IconCompass, IconShieldAlert, IconStar, IconTrendingDown, IconTrendingUp, IconWrench } from "@/components/icons"
import type { IconComponent } from "@/components/icons";
import { QUALITY_METRICS } from "./mock-data";

type Item = {
  label: string;
  value: number;
  prev: number;
  unit: string;
  icon: IconComponent;
  tone: "primary" | "info" | "warning" | "success";
  desc: string;
};

export function QualityMetrics() {
  const items: Item[] = [
    {
      label: "质量评分",
      value: QUALITY_METRICS.qualityScore,
      prev: QUALITY_METRICS.prevQualityScore,
      unit: "/100",
      icon: IconStar,
      tone: "primary",
      desc: "综合质量分",
    },
    {
      label: "路由准确率",
      value: QUALITY_METRICS.routingAccuracy,
      prev: QUALITY_METRICS.prevRoutingAccuracy,
      unit: "%",
      icon: IconCompass,
      tone: "info",
      desc: "意图分类正确",
    },
    {
      label: "危机识别召回",
      value: QUALITY_METRICS.crisisRecall,
      prev: QUALITY_METRICS.prevCrisisRecall,
      unit: "%",
      icon: IconShieldAlert,
      tone: "warning",
      desc: "高敏感样例召回",
    },
    {
      label: "工具调用成功率",
      value: QUALITY_METRICS.toolSuccess,
      prev: QUALITY_METRICS.prevToolSuccess,
      unit: "%",
      icon: IconWrench,
      tone: "success",
      desc: "工具调用合规",
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
        const delta = +(it.value - it.prev).toFixed(2);
        const up = delta >= 0;
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
                  {up ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
                  {up ? "+" : ""}
                  {delta}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={cn("text-3xl font-semibold tabular-nums", toneText[it.tone])}>
                  {it.value}
                </span>
                <span className="text-xs text-muted-foreground">{it.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <IconCheckCircle2 className="h-3 w-3" />
                {it.desc}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
