import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exportToCSV } from "@/lib/export";
import { cn } from "@/lib/utils";
import { IconDownload, IconSparkles, IconWand2 } from "@/components/icons"
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORY_INFO, OPTIMIZATION_SUGGESTIONS, PRIORITY_INFO } from "./mock-data";

export function OptimizationSuggestions() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filtered = OPTIMIZATION_SUGGESTIONS.filter(
    (s) => filter === "all" || s.priority === filter,
  );

  const counts = {
    high: OPTIMIZATION_SUGGESTIONS.filter((s) => s.priority === "high").length,
    medium: OPTIMIZATION_SUGGESTIONS.filter((s) => s.priority === "medium").length,
    low: OPTIMIZATION_SUGGESTIONS.filter((s) => s.priority === "low").length,
  };

  const handleExport = () => {
    // 导出当前筛选后的建议, 字段映射成中文列名
    const rows = filtered.map((s) => ({
      ...s,
      priorityLabel: PRIORITY_INFO[s.priority].name,
      categoryLabel: CATEGORY_INFO[s.category].name,
    }));
    exportToCSV(rows, "optimization-suggestions.csv", [
      { key: "id", label: "ID" },
      { key: "title", label: "标题" },
      { key: "detail", label: "说明" },
      { key: "priorityLabel", label: "优先级" },
      { key: "categoryLabel", label: "类别" },
      { key: "effort", label: "工作量" },
      { key: "impact", label: "预期收益" },
    ]);
  };

  const handleApply = (id: string) => {
    toast.info(`已加入待办：${id}`, {
      description: "工单中心可查看进展。",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconSparkles className="h-4 w-4 text-primary" />
            优化建议生成器
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  filter === "all" ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                全部 {OPTIMIZATION_SUGGESTIONS.length}
              </button>
              <button
                type="button"
                onClick={() => setFilter("high")}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  filter === "high"
                    ? "bg-destructive/15 text-destructive"
                    : "text-muted-foreground",
                )}
              >
                高 {counts.high}
              </button>
              <button
                type="button"
                onClick={() => setFilter("medium")}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  filter === "medium" ? "bg-warning/15 text-warning" : "text-muted-foreground",
                )}
              >
                中 {counts.medium}
              </button>
              <button
                type="button"
                onClick={() => setFilter("low")}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  filter === "low" ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                低 {counts.low}
              </button>
            </div>
            <Button variant="outline" size="xs" onClick={handleExport} className="gap-1">
              <IconDownload className="h-3 w-3" />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-2">
          <div className="flex flex-col gap-2">
            {filtered.map((s) => {
              const cat = CATEGORY_INFO[s.category];
              const pr = PRIORITY_INFO[s.priority];
              return (
                <div
                  key={s.id}
                  className="rounded-lg border border-border bg-card/40 p-3 transition-colors hover:bg-card/80"
                >
                  <div className="flex items-start gap-2">
                    <IconWand2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{s.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant={pr.variant} className="text-[10px]">
                          {pr.name}优先级
                        </Badge>
                        <span
                          className={cn("rounded px-1.5 py-0.5 text-[10px]", cat.bg, cat.color)}
                        >
                          {cat.name}
                        </span>
                        <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          工作量 {s.effort}
                        </span>
                        <span className="ml-auto text-[10px] text-success">{s.impact}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleApply(s.id)}
                      className="shrink-0 text-[10px]"
                    >
                      加入待办
                    </Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">无匹配建议</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
