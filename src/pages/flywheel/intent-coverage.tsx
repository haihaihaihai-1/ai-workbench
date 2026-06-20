import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shortNumber } from "@/lib/utils";
import { IconPieChart as PieChartIcon } from "@/components/icons"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { INTENT_COVERAGE } from "./mock-data";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export function IntentCoverage() {
  const total = INTENT_COVERAGE.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <PieChartIcon className="h-4 w-4 text-primary" />
            意图覆盖分析
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            最近 7 天 · 共 {shortNumber(total)} 条
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={INTENT_COVERAGE}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {INTENT_COVERAGE.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center gap-2.5">
            {INTENT_COVERAGE.map((item) => {
              const pct = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-mono tabular-nums">
                      {shortNumber(item.value)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
