import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconHourglass } from "@/components/icons"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SESSION_DURATION_BINS } from "./mock-data";

const COLORS = {
  短: "#3B82F6",
  中: "#5E6AD2",
  长: "#F59E0B",
  超长: "#EF4444",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export function SessionDistribution() {
  const total = SESSION_DURATION_BINS.reduce((s, b) => s + b.count, 0);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconHourglass className="h-4 w-4 text-info" />
            会话时长分布
          </CardTitle>
          <Badge variant="info" className="text-[10px]">
            共 {total.toLocaleString()} 次
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={SESSION_DURATION_BINS}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {SESSION_DURATION_BINS.map((b) => (
                <Cell key={b.range} fill={COLORS[b.bucket as keyof typeof COLORS] ?? "#5E6AD2"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* 图例 */}
        <div className="mt-2 grid grid-cols-4 gap-1.5 text-[10px]">
          {Object.entries(COLORS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v }} />
              <span className="text-muted-foreground">{k}时段</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
