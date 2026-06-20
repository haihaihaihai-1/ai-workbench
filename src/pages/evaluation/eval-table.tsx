import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { IconCheckCircle2, IconChevronDown, IconChevronRight, IconEye, IconXCircle } from "@/components/icons"
import { useState } from "react";
import { toast } from "sonner";
import { CORE_CASES, type EvalCase } from "./mock-data";

export function EvalTable() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  const filtered = CORE_CASES.filter((c) => {
    if (filter === "passed") return c.passed;
    if (filter === "failed") return !c.passed;
    return true;
  });

  const stats = {
    total: CORE_CASES.length,
    passed: CORE_CASES.filter((c) => c.passed).length,
    failed: CORE_CASES.filter((c) => !c.passed).length,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconEye className="h-4 w-4 text-primary" />
            详细评估结果
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded px-1.5 py-0.5",
                filter === "all" ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              全部 {stats.total}
            </button>
            <button
              type="button"
              onClick={() => setFilter("passed")}
              className={cn(
                "rounded px-1.5 py-0.5",
                filter === "passed" ? "bg-success/15 text-success" : "text-muted-foreground",
              )}
            >
              通过 {stats.passed}
            </button>
            <button
              type="button"
              onClick={() => setFilter("failed")}
              className={cn(
                "rounded px-1.5 py-0.5",
                filter === "failed"
                  ? "bg-destructive/15 text-destructive"
                  : "text-muted-foreground",
              )}
            >
              失败 {stats.failed}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-3 text-[10px]" />
              <TableHead className="text-[10px]">用例 / 查询</TableHead>
              <TableHead className="text-[10px]">期望 / 实际</TableHead>
              <TableHead className="text-right text-[10px]">评分</TableHead>
              <TableHead className="text-right text-[10px]">通过</TableHead>
              <TableHead className="text-right text-[10px]">耗时</TableHead>
              <TableHead className="text-right text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <CaseRow
                key={c.id}
                eval={c}
                open={expanded === c.id}
                onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
              />
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">无匹配用例</div>
        )}
      </CardContent>
    </Card>
  );
}

function CaseRow({
  eval: c,
  open,
  onToggle,
}: {
  eval: EvalCase;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
        <TableCell className="px-3 py-2">
          {open ? (
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="py-2">
          <div className="space-y-1">
            <div className="font-mono text-[10px] text-muted-foreground">{c.id}</div>
            <div className="line-clamp-1 max-w-md text-xs">{c.query}</div>
            <div className="flex flex-wrap gap-1">
              {c.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </TableCell>
        <TableCell className="py-2">
          <div className="space-y-1 text-[11px]">
            <div className="line-clamp-1 max-w-md text-muted-foreground">
              <span className="text-success">期望:</span> {c.expected}
            </div>
            <div className="line-clamp-1 max-w-md text-muted-foreground">
              <span className={c.passed ? "text-info" : "text-warning"}>实际:</span> {c.actual}
            </div>
          </div>
        </TableCell>
        <TableCell className="py-2 text-right">
          <span
            className={cn(
              "font-mono text-sm font-semibold tabular-nums",
              c.score >= 90 && "text-success",
              c.score >= 75 && c.score < 90 && "text-info",
              c.score < 75 && "text-destructive",
            )}
          >
            {c.score}
          </span>
        </TableCell>
        <TableCell className="py-2 text-right">
          {c.passed ? (
            <IconCheckCircle2 className="ml-auto h-4 w-4 text-success" />
          ) : (
            <IconXCircle className="ml-auto h-4 w-4 text-destructive" />
          )}
        </TableCell>
        <TableCell className="py-2 text-right font-mono text-xs text-muted-foreground tabular-nums">
          {c.durationMs}ms
        </TableCell>
        <TableCell className="py-2 text-right">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`查看 ${c.id} 的 Trace`);
            }}
            className="h-6"
          >
            Trace
          </Button>
        </TableCell>
      </TableRow>
      {open && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
                  完整查询
                </div>
                <div className="rounded-md border border-border bg-card p-2 text-xs">{c.query}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase text-success">
                    期望输出
                  </div>
                  <div className="rounded-md border border-success/30 bg-success/5 p-2 text-xs">
                    {c.expected}
                  </div>
                </div>
                <div>
                  <div
                    className={cn(
                      "mb-1 text-[10px] font-semibold uppercase",
                      c.passed ? "text-info" : "text-warning",
                    )}
                  >
                    实际输出
                  </div>
                  <div
                    className={cn(
                      "rounded-md border p-2 text-xs",
                      c.passed ? "border-info/30 bg-info/5" : "border-warning/30 bg-warning/5",
                    )}
                  >
                    {c.actual}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
