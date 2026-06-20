import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, relativeTime } from "@/lib/utils";
import { IconChevronDown, IconHistory, IconTrendingUp } from "@/components/icons"
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EVAL_HISTORY, PASS_RATE_TREND } from "./mock-data";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export function PassRateTrend() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconTrendingUp className="h-4 w-4 text-success" />
            通过率趋势
          </CardTitle>
          <Badge variant="success" className="text-[10px]">
            最近 10 次
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={PASS_RATE_TREND}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              domain={[60, 100]}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="passRate"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="通过率 %"
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="#5E6AD2"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="平均分"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function HistoryPanel() {
  const [open, setOpen] = useState(true);
  const recent = EVAL_HISTORY.slice(0, 5);

  return (
    <Card>
      <CardHeader className="cursor-pointer pb-2" onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconHistory className="h-4 w-4 text-info" />
            历史评估记录
            <Badge variant="info" className="ml-1 text-[10px]">
              {recent.length} / {EVAL_HISTORY.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <IconChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <div className="flex flex-col gap-2">
            {recent.map((h) => (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/40 p-3 transition-colors hover:bg-card/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{h.id}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {h.triggeredBy}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-sm font-medium">{h.testSetName}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {relativeTime(h.runAt)} · 耗时 {h.durationSec}s
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">通过率</div>
                    <div
                      className={cn(
                        "font-mono text-sm font-semibold tabular-nums",
                        h.passRate >= 90
                          ? "text-success"
                          : h.passRate >= 80
                            ? "text-info"
                            : "text-warning",
                      )}
                    >
                      {h.passRate}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">平均分</div>
                    <div className="font-mono text-sm font-semibold tabular-nums">{h.avgScore}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">用例</div>
                    <div className="font-mono text-sm tabular-nums">
                      <span className="text-success">{h.passedCases}</span>
                      <span className="text-muted-foreground">/{h.totalCases}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
