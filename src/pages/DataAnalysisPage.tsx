import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV, exportToJSON } from "@/lib/export";
import { Activity, Download } from "lucide-react";
import { useState } from "react";
import { ActivityHeatmap } from "./analysis/activity-heatmap";
import { AgentDistribution } from "./analysis/agent-distribution";
import { FeedbackAnalysis } from "./analysis/feedback-analysis";
import { IntentHeatmap } from "./analysis/intent-heatmap";
import { OVERVIEW_METRICS } from "./analysis/mock-data";
import { OverviewMetrics } from "./analysis/overview-metrics";
import { SessionDistribution } from "./analysis/session-distribution";
import { UserFunnel } from "./analysis/user-funnel";
import { UserSegments } from "./analysis/user-segments";

const ranges = [
  { id: "7d", label: "7 天" },
  { id: "30d", label: "30 天" },
  { id: "90d", label: "90 天" },
];

// 把 4 个总览指标摊平为可导出行
function buildMetricsRows() {
  return [
    {
      metric: "活跃用户",
      value: OVERVIEW_METRICS.activeUsers,
      previous: OVERVIEW_METRICS.prevActiveUsers,
    },
    { metric: "会话数", value: OVERVIEW_METRICS.sessions, previous: OVERVIEW_METRICS.prevSessions },
    {
      metric: "平均时长(分钟)",
      value: OVERVIEW_METRICS.avgDurationMin,
      previous: OVERVIEW_METRICS.prevAvgDurationMin,
    },
    {
      metric: "7 天留存(%)",
      value: OVERVIEW_METRICS.retention7d,
      previous: OVERVIEW_METRICS.prevRetention7d,
    },
  ];
}

export default function DataAnalysisPage() {
  const [range, setRange] = useState("30d");

  // CSV: 导出当前总览指标
  const handleExportCSV = () => {
    const data = buildMetricsRows().map((r) => ({ ...r, range }));
    exportToCSV(data, `analysis-${range}.csv`, [
      { key: "metric", label: "指标" },
      { key: "value", label: "当前" },
      { key: "previous", label: "上期" },
      { key: "range", label: "范围" },
    ]);
  };

  // JSON: 导出带元数据的完整结构, 模拟 "Excel" 报告
  const handleExportExcel = () => {
    const payload = {
      range,
      generatedAt: new Date().toISOString(),
      overview: OVERVIEW_METRICS,
    };
    exportToJSON([payload], `analysis-${range}.json`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Activity className="h-6 w-6 text-primary" />
            数据分析
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            活跃度 · 会话分布 · 路由分布 · 反馈分析 · 用户分群
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              {ranges.map((r) => (
                <TabsTrigger key={r.id} value={r.id} className="h-7 px-2.5 text-xs">
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              Excel
            </Button>
          </div>
        </div>
      </header>

      {/* 第一行: 4 总览指标卡 */}
      <OverviewMetrics />

      {/* 第二行: 热力图 + 时长分布 */}
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <ActivityHeatmap />
        <SessionDistribution />
      </div>

      {/* 第三行: Agent 分布 + 反馈 + 意图热度 */}
      <div className="grid gap-3 lg:grid-cols-3">
        <AgentDistribution />
        <FeedbackAnalysis />
        <IntentHeatmap />
      </div>

      {/* 第四行: 用户漏斗 */}
      <UserFunnel />

      {/* 第五行: 用户分群 */}
      <UserSegments />
    </div>
  );
}
