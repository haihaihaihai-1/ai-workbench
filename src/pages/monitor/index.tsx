import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDate, relativeTime, shortNumber } from "@/lib/utils";
import { Activity, AlertTriangle, CheckCircle2, Gauge, RefreshCw, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "./metric-card";
import {
  AGENT_INFO,
  hitlDistribution,
  intentDistribution,
  llmMetrics,
  realtimeMetrics,
  safetyEvents,
  sampleTraceSteps,
  toolHealth,
} from "./mock-data";

const COLORS = [
  "#5E6AD2",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#3B82F6",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
];

const timeRanges = [
  { id: "1h", label: "1 小时" },
  { id: "6h", label: "6 小时" },
  { id: "24h", label: "24 小时" },
  { id: "7d", label: "7 天" },
];

export default function MonitorPage() {
  const [range, setRange] = useState("1h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // 30s 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => setLastRefresh(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  // 模拟最新指标
  const last = realtimeMetrics[realtimeMetrics.length - 1];
  const prev = realtimeMetrics[realtimeMetrics.length - 2] ?? last;
  const pct = (a: number, b: number) => (b === 0 ? 0 : +(((a - b) / b) * 100).toFixed(1));

  // 图表数据
  const seriesData = realtimeMetrics.map((m) => ({
    time: formatDate(m.ts, "HH:mm"),
    qps: +m.qps.toFixed(1),
    latency: +m.latencyMs.toFixed(0),
    error: +m.errorRate.toFixed(2),
    sessions: Math.round(m.activeSessions),
  }));

  const agentPie = agentMetricsData();
  const severityData = [
    {
      name: "严重",
      value: safetyEvents.filter((e) => e.severity === "critical").length,
      color: "#EF4444",
    },
    {
      name: "高",
      value: safetyEvents.filter((e) => e.severity === "high").length,
      color: "#F59E0B",
    },
    {
      name: "中",
      value: safetyEvents.filter((e) => e.severity === "medium").length,
      color: "#3B82F6",
    },
    {
      name: "低",
      value: safetyEvents.filter((e) => e.severity === "low").length,
      color: "#10B981",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部：标题 + 工具栏 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Gauge className="h-6 w-6 text-primary" />
            可观测中心
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            实时指标 · Agent 路由 · LLM 追踪 · 工具健康度 · 安全监控
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            最后更新{" "}
            <span className="font-mono text-foreground">{formatDate(lastRefresh, "HH:mm:ss")}</span>
          </span>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              {timeRanges.map((r) => (
                <TabsTrigger key={r.id} value={r.id} className="h-7 px-2.5 text-xs">
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh((v) => !v)}
            className="h-7 gap-1.5"
          >
            <RefreshCw className={cn("h-3 w-3", autoRefresh && "animate-spin-slow")} />
            {autoRefresh ? "30s 自动" : "已暂停"}
          </Button>
        </div>
      </header>

      {/* 顶部 4 大指标卡 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="QPS"
          value={last.qps.toFixed(1)}
          unit="req/s"
          delta={pct(last.qps, prev.qps)}
          trend={last.qps > prev.qps ? "up" : "down"}
          description="每请求数"
        />
        <MetricCard
          label="平均延迟"
          value={Math.round(last.latencyMs)}
          unit="ms"
          delta={pct(last.latencyMs, prev.latencyMs)}
          trend={last.latencyMs > prev.latencyMs ? "up" : "down"}
          tone="default"
          description="P50 响应时间"
        />
        <MetricCard
          label="错误率"
          value={last.errorRate.toFixed(2)}
          unit="%"
          delta={pct(last.errorRate, prev.errorRate)}
          trend={last.errorRate > prev.errorRate ? "up" : "down"}
          tone={last.errorRate > 1 ? "destructive" : "success"}
          description="5xx + 工具失败"
        />
        <MetricCard
          label="活跃会话"
          value={Math.round(last.activeSessions)}
          delta={pct(last.activeSessions, prev.activeSessions)}
          trend={last.activeSessions > prev.activeSessions ? "up" : "down"}
          tone="success"
          description="30 分钟内活跃"
        />
      </div>

      {/* 时序图区 */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                <Zap className="h-4 w-4 text-primary" />
                请求趋势
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                实时
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={seriesData}>
                <defs>
                  <linearGradient id="qpsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5E6AD2" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#5E6AD2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="time"
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
                <Area
                  type="monotone"
                  dataKey="qps"
                  stroke="#5E6AD2"
                  strokeWidth={2}
                  fill="url(#qpsG)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                <Activity className="h-4 w-4 text-info" />
                延迟 / 错误率
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                实时
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={seriesData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="latency"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="延迟 (ms)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="error"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name="错误率 (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent 路由 + LLM 调用 */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Agent 路由分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={agentPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {agentPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
              {agentPie.map((a, i) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="flex-1 truncate">{a.name}</span>
                  <span className="font-mono text-muted-foreground">{a.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Zap className="h-4 w-4 text-warning" />
              LLM 模型调用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={llmMetrics.map((m) => ({ name: m.model.split("-")[0], calls: m.calls }))}
              >
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="calls" fill="#5E6AD2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" />
              HITL 自动化率
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="text-center">
              <div className="text-3xl font-semibold text-success">78.4%</div>
              <div className="text-xs text-muted-foreground">全自动处理</div>
            </div>
            <div className="space-y-1.5">
              {hitlDistribution.map((h) => (
                <div key={h.level} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 truncate text-muted-foreground">{h.level}</span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary"
                      style={{ width: `${h.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                    {h.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具健康度 + 意图分布 + Trace */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-success" />
              工具健康度 TOP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">工具</TableHead>
                  <TableHead className="text-right text-[10px]">调用</TableHead>
                  <TableHead className="text-right text-[10px]">错误</TableHead>
                  <TableHead className="text-right text-[10px]">可靠性</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toolHealth.map((t) => (
                  <TableRow key={t.name}>
                    <TableCell className="py-2 font-mono text-xs">{t.name}</TableCell>
                    <TableCell className="py-2 text-right text-xs tabular-nums">
                      {shortNumber(t.calls)}
                    </TableCell>
                    <TableCell className="py-2 text-right text-xs tabular-nums">
                      <span
                        className={cn(
                          t.errorRate > 3
                            ? "text-destructive"
                            : t.errorRate > 1
                              ? "text-warning"
                              : "text-muted-foreground",
                        )}
                      >
                        {t.errorRate}%
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          t.reliability >= 99
                            ? "bg-success/15 text-success"
                            : t.reliability >= 95
                              ? "bg-warning/15 text-warning"
                              : "bg-destructive/15 text-destructive",
                        )}
                      >
                        {t.reliability}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Activity className="h-4 w-4 text-info" />
              意图分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[260px] pr-2">
              <div className="flex flex-col gap-1.5">
                {intentDistribution.map((i) => (
                  <div key={i.intent} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 truncate font-mono">{i.intent}</span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 bg-info"
                        style={{ width: `${(i.count / 2000) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right tabular-nums">
                      {shortNumber(i.count)}
                    </span>
                    <span className="w-10 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                      {i.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              最新 Trace 时间线
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[260px] pr-2">
              <div className="relative flex flex-col gap-2 pl-4">
                <div className="absolute left-1.5 top-1 h-[calc(100%-8px)] w-px bg-border" />
                {sampleTraceSteps.map((s, i) => (
                  <div key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-3 top-1 h-2 w-2 rounded-full",
                        s.status === "success" ? "bg-success" : "bg-destructive",
                      )}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium">{s.step}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {s.duration}ms
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{s.detail}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 安全监控 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              安全监控
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-[10px]">
                严重 {severityData[0].value}
              </Badge>
              <Badge variant="warning" className="text-[10px]">
                高 {severityData[1].value}
              </Badge>
              <Badge variant="info" className="text-[10px]">
                中 {severityData[2].value}
              </Badge>
              <Badge variant="success" className="text-[10px]">
                低 {severityData[3].value}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px]">时间</TableHead>
                <TableHead className="text-[10px]">类型</TableHead>
                <TableHead className="text-[10px]">严重级别</TableHead>
                <TableHead className="text-[10px]">内容</TableHead>
                <TableHead className="text-[10px]">用户</TableHead>
                <TableHead className="text-[10px]">处置</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safetyEvents.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="py-2 text-[11px] text-muted-foreground">
                    {relativeTime(e.createdAt)}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    <Badge
                      variant={
                        e.type === "pii"
                          ? "info"
                          : e.type === "injection"
                            ? "destructive"
                            : "warning"
                      }
                    >
                      {e.type === "pii" ? "PII" : e.type === "injection" ? "提示注入" : "内容违规"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        e.severity === "critical" && "bg-destructive/15 text-destructive",
                        e.severity === "high" && "bg-warning/15 text-warning",
                        e.severity === "medium" && "bg-info/15 text-info",
                        e.severity === "low" && "bg-success/15 text-success",
                      )}
                    >
                      {e.severity.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 max-w-md truncate font-mono text-[11px]">
                    {e.content}
                  </TableCell>
                  <TableCell className="py-2 font-mono text-[11px] text-muted-foreground">
                    {e.user}
                  </TableCell>
                  <TableCell className="py-2 text-xs">{e.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function agentMetricsData() {
  return Object.entries(AGENT_INFO).map(([k, v]) => ({
    name: v.name,
    value: [
      { academic: 4280, emotional: 1840, affairs: 2100, general: 3560 }[
        k as keyof typeof AGENT_INFO
      ],
    ][0],
  }));
}
