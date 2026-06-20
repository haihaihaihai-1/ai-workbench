import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { IconChartLine, IconCompass, IconPlay, IconSliders, IconSparkles, IconWorkflow } from "@/components/icons"
import { useState } from "react";
import { toast } from "sonner";
import { HealthOverview } from "./flywheel/health-overview";
import { IntentCoverage } from "./flywheel/intent-coverage";
import { NewIntents } from "./flywheel/new-intents";
import { OptimizationSuggestions } from "./flywheel/optimization-suggestions";
import { ToolHealthReport } from "./flywheel/tool-health-report";
import {
  ConversationTrendChart,
  FeedbackTrendChart,
  IntentChangeChart,
  KeyMetrics,
} from "./flywheel/trend-charts";

const ranges = [
  { id: "7d", label: "7 天" },
  { id: "14d", label: "14 天" },
  { id: "30d", label: "30 天" },
];

export default function FlywheelPage() {
  const [range, setRange] = useState("7d");
  const [tab, setTab] = useState<"health" | "evolve">("health");
  const [analyzing, setAnalyzing] = useState(false);
  const [minConfidence, setMinConfidence] = useState(70);
  const [scope, setScope] = useState("all");
  const [autoApply, setAutoApply] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    toast.info("开始飞轮分析...", {
      description: `范围: ${range} · 置信度门槛: ${minConfidence}%`,
    });
    setTimeout(() => {
      setAnalyzing(false);
      toast.success("分析完成", { description: "已生成 7 条优化建议。" });
    }, 1600);
  };

  const handleEvolveRun = () => {
    setAnalyzing(true);
    toast.info("正在扫描新意图...", {
      description: `范围: ${scope} · 最低置信度: ${minConfidence / 100}`,
    });
    setTimeout(() => {
      setAnalyzing(false);
      toast.success("意图进化完成", { description: "发现 6 个新意图候选。" });
    }, 1400);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <IconChartLine className="h-6 w-6 text-primary" />
            数据飞轮
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            意图进化 · 反馈分析 · 工具健康度 · 优化建议
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
          <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="h-8 gap-1.5">
            <IconPlay className={cn("h-3.5 w-3.5", analyzing && "animate-pulse-dot")} />
            {analyzing ? "分析中..." : "触发分析"}
          </Button>
        </div>
      </header>

      {/* 4 个健康度卡 */}
      <HealthOverview />

      {/* Tab 切换 */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="health" className="gap-1.5">
            <IconWorkflow className="h-3.5 w-3.5" />
            飞轮健康度
          </TabsTrigger>
          <TabsTrigger value="evolve" className="gap-1.5">
            <IconCompass className="h-3.5 w-3.5" />
            意图进化
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 飞轮健康度 */}
        <TabsContent value="health" className="flex flex-col gap-4">
          <KeyMetrics />

          <div className="grid gap-3 lg:grid-cols-2">
            <ConversationTrendChart />
            <FeedbackTrendChart />
          </div>

          <IntentChangeChart />
        </TabsContent>

        {/* Tab 2: 意图进化 */}
        <TabsContent value="evolve" className="flex flex-col gap-4">
          {/* 分析控制区 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                <IconSliders className="h-4 w-4 text-primary" />
                分析控制
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="conf-slider" className="text-muted-foreground">
                      最小置信度
                    </label>
                    <span className="font-mono tabular-nums">
                      {(minConfidence / 100).toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="conf-slider"
                    type="range"
                    min={50}
                    max={95}
                    step={1}
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0.50</span>
                    <span>0.95</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="scope-sel" className="text-xs text-muted-foreground">
                    分析范围
                  </label>
                  <Select value={scope} onValueChange={setScope}>
                    <SelectTrigger id="scope-sel" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部领域</SelectItem>
                      <SelectItem value="academic">学业</SelectItem>
                      <SelectItem value="emotional">心理</SelectItem>
                      <SelectItem value="affairs">教务</SelectItem>
                      <SelectItem value="general">通用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="block text-xs text-muted-foreground">自动应用</span>
                  <div className="flex h-8 items-center gap-2">
                    <Switch checked={autoApply} onCheckedChange={setAutoApply} />
                    <span className="text-xs text-muted-foreground">
                      {autoApply ? "采纳即生效" : "需人工审批"}
                    </span>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleEvolveRun}
                    disabled={analyzing}
                    size="sm"
                    className="h-8 w-full gap-1.5 md:w-auto"
                  >
                    <IconSparkles className={cn("h-3.5 w-3.5", analyzing && "animate-pulse-dot")} />
                    {analyzing ? "扫描中..." : "启动扫描"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 意图覆盖分析 + 高/低 占比卡 */}
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
            <IntentCoverage />
            <ConfidenceMix />
          </div>

          {/* 新意图发现 + 工具健康度 */}
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <NewIntents />
            <ToolHealthReport />
          </div>

          {/* 优化建议 */}
          <OptimizationSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConfidenceMix() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconWorkflow className="h-4 w-4 text-info" />
          置信度概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-success/30 bg-success/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">高置信度</span>
            <Badge variant="success" className="text-[10px]">
              健康
            </Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-success">72.4</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">6840 / 9440 条对话</p>
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">中置信度</span>
            <Badge variant="warning" className="text-[10px]">
              关注
            </Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-warning">22.5</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">2120 条 · 建议补充样本</p>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">低置信度</span>
            <Badge variant="destructive" className="text-[10px]">
              异常
            </Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-destructive">5.1</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">480 条 · 触发兜底路由</p>
        </div>
      </CardContent>
    </Card>
  );
}
