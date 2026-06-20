import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, shortNumber } from "@/lib/utils";
import { IconActivity, IconMessageSquare, IconRepeat2, IconThumbsUp, IconTrendingDown, IconTrendingUp, IconUsers, IconZap } from "@/components/icons"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CONVERSATION_TREND, FEEDBACK_TREND, INTENT_CHANGE, KEY_METRICS } from "./mock-data";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

const axisStyle = {
  tick: { fontSize: 10 },
  stroke: "hsl(var(--muted-foreground))",
};

function MetricMini({
  label,
  value,
  prev,
  unit,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  prev: number;
  unit?: string;
  icon: typeof IconUsers;
  tone: "primary" | "info" | "warning" | "success";
}) {
  const delta = prev === 0 ? 0 : +(((value - prev) / prev) * 100).toFixed(1);
  const up = delta >= 0;
  const toneClass = {
    primary: "text-primary",
    info: "text-info",
    warning: "text-warning",
    success: "text-success",
  }[tone];
  const bgClass = {
    primary: "bg-primary/10",
    info: "bg-info/10",
    warning: "bg-warning/10",
    success: "bg-success/10",
  }[tone];
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("rounded-md p-1.5", bgClass, toneClass)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <span
            className={cn(
              "flex items-center gap-0.5 text-[10px] font-medium",
              up ? "text-success" : "text-destructive",
            )}
          >
            {up ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}
            {delta}%
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {typeof value === "number" && value > 1000 ? shortNumber(value) : value}
          </span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">较昨日</p>
      </CardContent>
    </Card>
  );
}

export function KeyMetrics() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricMini
        label="今日对话"
        value={KEY_METRICS.todayConversations}
        prev={KEY_METRICS.prevTodayConversations}
        unit="次"
        icon={IconMessageSquare}
        tone="primary"
      />
      <MetricMini
        label="活跃用户"
        value={KEY_METRICS.activeUsers}
        prev={KEY_METRICS.prevActiveUsers}
        unit="人"
        icon={IconUsers}
        tone="info"
      />
      <MetricMini
        label="平均轮数"
        value={KEY_METRICS.avgRounds}
        prev={KEY_METRICS.prevAvgRounds}
        unit="轮"
        icon={IconRepeat2}
        tone="warning"
      />
      <MetricMini
        label="成功率"
        value={KEY_METRICS.successRate}
        prev={KEY_METRICS.prevSuccessRate}
        unit="%"
        icon={IconThumbsUp}
        tone="success"
      />
    </div>
  );
}

export function ConversationTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconZap className="h-4 w-4 text-primary" />7 天对话趋势
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            会话 · 用户 · 成功率
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={CONVERSATION_TREND}>
            <defs>
              <linearGradient id="convG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5E6AD2" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#5E6AD2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="userG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="day" {...axisStyle} />
            <YAxis {...axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="conversations"
              stroke="#5E6AD2"
              strokeWidth={2}
              fill="url(#convG)"
              name="对话数"
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#userG)"
              name="用户数"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IntentChangeChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconActivity className="h-4 w-4 text-info" />
            意图分布变化
          </CardTitle>
          <Badge variant="info" className="text-[10px]">
            当前 vs 7 天前
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={INTENT_CHANGE} layout="vertical" margin={{ left: 110 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" horizontal={false} />
            <XAxis type="number" {...axisStyle} />
            <YAxis
              type="category"
              dataKey="intent"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              width={100}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="previous" fill="#475569" name="7 天前" radius={[0, 4, 4, 0]} />
            <Bar dataKey="current" fill="#5E6AD2" name="当前" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function FeedbackTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconThumbsUp className="h-4 w-4 text-success" />
            反馈趋势
          </CardTitle>
          <Badge variant="success" className="text-[10px]">
            正向 / 负向 / 中性
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={FEEDBACK_TREND}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="day" {...axisStyle} />
            <YAxis {...axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="正向"
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="中性"
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="负向"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
