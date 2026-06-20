import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSmile, IconTrendingDown, IconTrendingUp } from "@/components/icons"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EMOTION_30D, EMOTION_EVENTS } from "./mock-data";

export function EmotionPanel() {
  const peak = EMOTION_30D.reduce((a, b) => (b.score > a.score ? b : a), EMOTION_30D[0]);
  const valley = EMOTION_30D.reduce((a, b) => (b.score < a.score ? b : a), EMOTION_30D[0]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <IconSmile className="h-4 w-4 text-primary" />
              30 天情绪曲线
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-success">
                <IconTrendingUp className="h-3 w-3" />
                峰值 {peak.score.toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <IconTrendingDown className="h-3 w-3" />
                低谷 {valley.score.toFixed(2)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={EMOTION_30D} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="emoG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9 }}
                stroke="hsl(var(--muted-foreground))"
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#emoG2)"
              />
              <ReferenceDot
                x={peak.date}
                y={peak.score}
                r={5}
                fill="#10B981"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
              <ReferenceDot
                x={valley.date}
                y={valley.score}
                r={5}
                fill="#EF4444"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconSmile className="h-4 w-4 text-warning" />
            关键情绪事件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col gap-3 pl-5">
            <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-px bg-border" />
            {EMOTION_EVENTS.map((e) => (
              <div key={e.id} className="relative">
                <span
                  className={`absolute -left-[14px] top-1.5 h-2.5 w-2.5 rounded-full ${
                    e.type === "high" ? "bg-success" : "bg-destructive"
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{e.date}</span>
                  <span className="text-sm font-medium">{e.title}</span>
                  <Badge
                    variant={e.type === "high" ? "success" : "destructive"}
                    className="font-mono text-[10px]"
                  >
                    {e.delta > 0 ? "+" : ""}
                    {e.delta.toFixed(2)}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
