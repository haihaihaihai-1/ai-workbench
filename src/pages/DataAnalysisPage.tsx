import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ActivityHeatmap } from "./analysis/activity-heatmap";
import { AgentDistribution } from "./analysis/agent-distribution";
import { FeedbackAnalysis } from "./analysis/feedback-analysis";
import { IntentHeatmap } from "./analysis/intent-heatmap";
import { OverviewMetrics } from "./analysis/overview-metrics";
import { SessionDistribution } from "./analysis/session-distribution";
import { UserFunnel } from "./analysis/user-funnel";
import { UserSegments } from "./analysis/user-segments";

const ranges = [
  { id: "7d", label: "7 天" },
  { id: "30d", label: "30 天" },
  { id: "90d", label: "90 天" },
];

export default function DataAnalysisPage() {
  const [range, setRange] = useState("30d");

  const handleExport = (fmt: "csv" | "excel" | "pdf") => {
    toast.success(`数据已导出为 ${fmt.toUpperCase()}`, {
      description: `范围 ${range} · 已下载到本地。`,
    });
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              className="h-8 gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("excel")}
              className="h-8 gap-1"
            >
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
