import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportToJSON } from "@/lib/export";
import { cn } from "@/lib/utils";
import { IconDownload, IconFileText, IconPlay, IconTarget } from "@/components/icons";
import { useState } from "react";
import { toast } from "sonner";
import { EvalTable } from "./evaluation/eval-table";
import { HistoryPanel, PassRateTrend } from "./evaluation/history-panel";
import { QUALITY_METRICS, TEST_SETS, type TestSet } from "./evaluation/mock-data";
import { QualityMetrics } from "./evaluation/quality-metrics";
import { TestsetSelector } from "./evaluation/testset-selector";

export default function EvaluationPage() {
  const [currentSetId, setCurrentSetId] = useState<string>(TEST_SETS[0].id);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const current = TEST_SETS.find((ts) => ts.id === currentSetId) as TestSet;

  const handleRun = () => {
    setRunning(true);
    setProgress(0);
    toast.info("开始离线评估...", {
      description: `${current.name} · 共 ${current.caseCount} 条用例`,
    });
    // 模拟进度
    let tick = 0;
    const total = 22;
    const timer = setInterval(() => {
      tick++;
      setProgress(Math.min(100, Math.round((tick / total) * 100)));
      if (tick >= total) {
        clearInterval(timer);
        setRunning(false);
        toast.success("评估完成", {
          description: "通过率 87.5% · 平均分 88.4",
        });
      }
    }, 80);
  };

  const handleExport = () => {
    // 导出当前测试集与质量指标的 JSON 报告
    const report = {
      generatedAt: new Date().toISOString(),
      testSet: current,
      qualityMetrics: QUALITY_METRICS,
    };
    exportToJSON([report], `evaluation-${current.id}.json`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 · Langfuse 招牌：蓝色 (#3B82F6) logo + 紧凑监控 */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#3B82F6] text-white shadow-vercel">
            <IconTarget className="h-4 w-4" weight="bold" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Evaluation · Langfuse
            </h1>
            <p className="text-[11px] text-muted-foreground">
              离线评估 · 测试集管理 · 通过率趋势 · 评估报告导出
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8 gap-1.5">
            <IconDownload className="h-3.5 w-3.5" />
            导出报告
          </Button>
          <Button size="sm" onClick={handleRun} disabled={running} className="h-8 gap-1.5">
            <IconPlay className={cn("h-3.5 w-3.5", running && "animate-pulse-dot")} />
            {running ? `运行中 ${progress}%` : "运行评估"}
          </Button>
        </div>
      </header>

      {/* 运行进度条 */}
      {running && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-primary">正在执行 {current.name}</span>
            <span className="font-mono tabular-nums text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            {Math.round((progress / 100) * current.caseCount)} / {current.caseCount} 条用例已完成
          </p>
        </div>
      )}

      {/* 4 个质量指标卡 */}
      <QualityMetrics />

      {/* 测试集选择器 */}
      <TestsetSelector current={current} onChange={setCurrentSetId} />

      {/* 详细评估表格 */}
      <EvalTable />

      {/* 通过率趋势 + 历史记录 */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <PassRateTrend />
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <IconFileText className="h-4 w-4 text-info" />
            评估摘要
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">当前测试集</span>
              <span className="font-mono">{current.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">总用例</span>
              <span className="font-mono tabular-nums">{current.caseCount} 条</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">最新通过率</span>
              <span className="font-mono tabular-nums text-success">87.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">较上次变化</span>
              <Badge variant="success" className="text-[10px]">
                +1.3%
              </Badge>
            </div>
            <div className="border-t border-border pt-2">
              <div className="mb-1 text-[10px] uppercase text-muted-foreground">关键发现</div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex gap-1.5">
                  <span className="text-success">✓</span>
                  <span>危机识别召回率达到 98.1%，符合发布标准</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-warning">!</span>
                  <span>记忆召回类用例失败 1 条 (tc-008)，需排查</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-warning">!</span>
                  <span>policy_lookup 工具调用未带链接 (tc-003)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 历史评估记录 */}
      <HistoryPanel />
    </div>
  );
}
