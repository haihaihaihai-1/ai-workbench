import { Card, CardContent } from "@/components/ui/card";
import { IconBrain, IconMessageSquare, IconSmile, IconTrendingUp } from "@/components/icons"
import type { IconComponent } from "@/components/icons";
import { MOCK_USER } from "./mock-data";

type Metric = {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon: IconComponent;
  tone: string;
  bgTone: string;
};

export function KeyMetrics() {
  const metrics: Metric[] = [
    {
      label: "总会话",
      value: MOCK_USER.totalSessions.toString(),
      unit: "次",
      delta: "+12",
      deltaTone: "up",
      icon: IconMessageSquare,
      tone: "text-primary",
      bgTone: "bg-primary/10",
    },
    {
      label: "记忆数",
      value: MOCK_USER.totalMemories.toString(),
      unit: "条",
      delta: "+8",
      deltaTone: "up",
      icon: IconBrain,
      tone: "text-info",
      bgTone: "bg-info/10",
    },
    {
      label: "平均对话轮数",
      value: MOCK_USER.avgTurns.toFixed(1),
      unit: "轮",
      delta: "+0.4",
      deltaTone: "up",
      icon: IconTrendingUp,
      tone: "text-success",
      bgTone: "bg-success/10",
    },
    {
      label: "30 天情绪均值",
      value: MOCK_USER.avgEmotion30d.toFixed(2),
      unit: "/1.0",
      delta: "-0.03",
      deltaTone: "down",
      icon: IconSmile,
      tone: "text-warning",
      bgTone: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-md p-2 ${m.bgTone} ${m.tone}`}>
              <m.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold tabular-nums">{m.value}</span>
                {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
              </div>
              {m.delta && (
                <div
                  className={`mt-0.5 text-[10px] ${
                    m.deltaTone === "up"
                      ? "text-success"
                      : m.deltaTone === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  较上月 {m.delta}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
