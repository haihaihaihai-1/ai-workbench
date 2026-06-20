import {
  IconActivity,
  IconBrain,
  IconClock,
  IconPin,
  IconSparkles,
  IconTrendingUp,
} from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ACTIVE_HOURS, EMOTION_TREND, MEMORY_STATS } from "./mock-data";

export function MemoryStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="总记忆数"
        value={MEMORY_STATS.total}
        unit="条"
        icon={IconBrain}
        tone="text-primary"
      />
      <StatCard
        label="置顶"
        value={MEMORY_STATS.pinned}
        unit="条"
        icon={IconPin}
        tone="text-warning"
      />
      <StatCard
        label="平均置信度"
        value={Math.round(MEMORY_STATS.avgConfidence * 100)}
        unit="%"
        icon={IconTrendingUp}
        tone="text-success"
      />
      <StatCard label="本周新增" value={12} unit="条" icon={IconSparkles} tone="text-info" />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  unit?: string;
  icon: typeof IconBrain;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className={`rounded-md bg-muted p-2 ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold tabular-nums">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MemoryCharts() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconActivity className="h-4 w-4 text-info" />
            30 天情绪趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={EMOTION_TREND}>
              <defs>
                <linearGradient id="emoG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis hide domain={[0, 1]} />
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
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#emoG)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconClock className="h-4 w-4 text-warning" />
            活跃时段
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={ACTIVE_HOURS}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#5E6AD2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
