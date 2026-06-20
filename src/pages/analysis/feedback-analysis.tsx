import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconThumbsUp } from "@/components/icons"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FEEDBACK_DAILY } from "./mock-data";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export function FeedbackAnalysis() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconThumbsUp className="h-4 w-4 text-success" />
          反馈分析
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={FEEDBACK_DAILY}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="positive" stackId="a" fill="#10B981" name="正向" radius={[0, 0, 0, 0]} />
            <Bar dataKey="neutral" stackId="a" fill="#3B82F6" name="中性" />
            <Bar dataKey="negative" stackId="a" fill="#EF4444" name="负向" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
