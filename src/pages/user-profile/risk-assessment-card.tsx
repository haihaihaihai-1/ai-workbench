import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertTriangle, Brain, GraduationCap, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { ACADEMIC_RISK, PSYCH_RISK } from "./mock-data";

type Risk = {
  score: number;
  level: "low" | "medium" | "high";
  factors: { label: string; weight: number }[];
  trend: "rising" | "falling" | "stable";
};

const PSYCH: Risk = PSYCH_RISK as Risk;
const ACADEMIC: Risk = ACADEMIC_RISK as Risk;

const LEVEL_INFO: Record<
  Risk["level"],
  { label: string; variant: "success" | "warning" | "destructive"; tone: string }
> = {
  low: { label: "低风险", variant: "success", tone: "text-success" },
  medium: { label: "中风险", variant: "warning", tone: "text-warning" },
  high: { label: "高风险", variant: "destructive", tone: "text-destructive" },
};

const TREND_INFO: Record<Risk["trend"], { icon: typeof TrendingUp; label: string; tone: string }> =
  {
    rising: { icon: TrendingUp, label: "上升中", tone: "text-destructive" },
    falling: { icon: TrendingDown, label: "下降中", tone: "text-success" },
    stable: { icon: Minus, label: "稳定", tone: "text-muted-foreground" },
  };

function RiskRow({
  icon: Icon,
  title,
  risk,
}: {
  icon: typeof Brain;
  title: string;
  risk: Risk;
}) {
  const lvl = LEVEL_INFO[risk.level];
  const tr = TREND_INFO[risk.trend];

  return (
    <div className="rounded-md border border-border/50 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {title}
        </div>
        <Badge variant={lvl.variant} className="text-[10px]">
          {lvl.label}
        </Badge>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Progress
          value={risk.score}
          className={cn(
            "h-1.5 flex-1",
            risk.level === "high" && "[&>div]:bg-destructive",
            risk.level === "medium" && "[&>div]:bg-warning",
            risk.level === "low" && "[&>div]:bg-success",
          )}
        />
        <span className={cn("w-9 shrink-0 text-right font-mono text-xs", lvl.tone)}>
          {risk.score}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <tr.icon className={cn("h-3 w-3", tr.tone)} />
          {tr.label}
        </span>
        <span>满分 100</span>
      </div>
      <div className="mt-2 flex flex-col gap-1 border-t border-border/50 pt-2">
        {risk.factors.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between text-[10px] text-muted-foreground"
          >
            <span>· {f.label}</span>
            <span className="font-mono">+{f.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RiskAssessmentCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-warning" />
          风险评估
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <RiskRow icon={Brain} title="心理风险" risk={PSYCH} />
        <RiskRow icon={GraduationCap} title="学业风险" risk={ACADEMIC} />
      </CardContent>
    </Card>
  );
}
