import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LEARNING_STYLE } from "./mock-data";

function rating(v: number) {
  if (v >= 80) return { label: "强", variant: "success" as const };
  if (v >= 60) return { label: "中", variant: "info" as const };
  if (v >= 40) return { label: "弱", variant: "warning" as const };
  return { label: "极弱", variant: "destructive" as const };
}

export function LearningStylePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Brain className="h-4 w-4 text-primary" />
            学习风格雷达
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={LEARNING_STYLE} margin={{ top: 16, right: 24, bottom: 0, left: 24 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="dim"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                angle={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Radar
                name="学习风格"
                dataKey="value"
                stroke="#5E6AD2"
                fill="#5E6AD2"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Brain className="h-4 w-4 text-info" />
            维度解读
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {LEARNING_STYLE.map((d) => {
            const r = rating(d.value);
            return (
              <div
                key={d.dim}
                className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 p-2.5"
              >
                <span className="w-16 shrink-0 text-xs font-medium">{d.dim}</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${d.value}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums">
                  {d.value}
                </span>
                <Badge variant={r.variant} className="w-12 justify-center text-[10px]">
                  {r.label}
                </Badge>
              </div>
            );
          })}
          <div className="mt-2 rounded-md border border-info/30 bg-info/5 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-info">推荐策略：</span>
            偏好结构化、深度内容，对视觉化与互动性需求一般。建议提供标题分明的步骤化讲解，配以必要图表，避免冗长对话。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
