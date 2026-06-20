import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconActivity, IconCalendar, IconClock } from "@/components/icons"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ACTIVITY_24H, ACTIVITY_30D, WEEKLY_ACTIVITY } from "./mock-data";

function heatColor(value: number, max: number) {
  const r = value / max;
  if (r === 0) return "bg-muted/40";
  if (r < 0.15) return "bg-primary/15";
  if (r < 0.3) return "bg-primary/30";
  if (r < 0.5) return "bg-primary/50";
  if (r < 0.7) return "bg-primary/70";
  return "bg-primary";
}

export function ActivityPanel() {
  const max = Math.max(...ACTIVITY_24H.map((h) => h.count));
  const max30 = Math.max(...ACTIVITY_30D.map((h) => h.sessions));

  return (
    <div className="flex flex-col gap-4">
      {/* 24h 热力图 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <IconClock className="h-4 w-4 text-primary" />
              24h 活跃时段热力图
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">峰值：22:00 - 23:00（86 次）</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {ACTIVITY_24H.map((h) => (
              <div
                key={h.hour}
                className="group flex flex-col items-center gap-1"
                title={`${h.hour}:00 - ${h.count} 次`}
              >
                <div
                  className={cn(
                    "h-9 w-full rounded-sm transition-transform group-hover:scale-110",
                    heatColor(h.count, max),
                  )}
                />
                <span className="font-mono text-[9px] text-muted-foreground">{h.hour}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>少</span>
            <div className="flex gap-0.5">
              <span className="h-3 w-3 rounded-sm bg-muted/40" />
              <span className="h-3 w-3 rounded-sm bg-primary/15" />
              <span className="h-3 w-3 rounded-sm bg-primary/30" />
              <span className="h-3 w-3 rounded-sm bg-primary/50" />
              <span className="h-3 w-3 rounded-sm bg-primary/70" />
              <span className="h-3 w-3 rounded-sm bg-primary" />
            </div>
            <span>多</span>
            <span className="ml-auto">结论：典型夜猫子型，22 点后活跃度激增</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 周活跃 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <IconCalendar className="h-4 w-4 text-info" />
              本周活跃分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEKLY_ACTIVITY}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sessions" fill="#3B82F6" name="会话数" radius={[4, 4, 0, 0]} />
                <Bar dataKey="messages" fill="#10B981" name="消息数" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-1 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-info" />
                会话数
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-success" />
                消息数
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 30 天趋势 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <IconActivity className="h-4 w-4 text-success" />
              30 天活跃趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ACTIVITY_30D}>
                <defs>
                  <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  interval={4}
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="sessions"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#actG)"
                  name="会话数"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-1 text-center text-[10px] text-muted-foreground">
              峰值 {max30} 次/天 · 日均{" "}
              {(ACTIVITY_30D.reduce((a, b) => a + b.sessions, 0) / ACTIVITY_30D.length).toFixed(1)}{" "}
              次
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
