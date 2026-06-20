import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shortNumber } from "@/lib/utils";
import { IconUsers } from "@/components/icons"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AGENT_DISTRIBUTION } from "./mock-data";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export function AgentDistribution() {
  const total = AGENT_DISTRIBUTION.reduce((s, a) => s + a.value, 0);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconUsers className="h-4 w-4 text-primary" />
          Agent 路由分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={AGENT_DISTRIBUTION}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {AGENT_DISTRIBUTION.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
          {AGENT_DISTRIBUTION.map((a) => {
            const pct = ((a.value / total) * 100).toFixed(1);
            return (
              <div key={a.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="flex-1 truncate text-muted-foreground">{a.name}</span>
                <span className="font-mono tabular-nums">{shortNumber(a.value)}</span>
                <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
