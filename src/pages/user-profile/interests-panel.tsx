import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ALL_INTEREST_TAGS, TOP_INTERESTS } from "./mock-data";

const TIER_COLORS = [
  "bg-primary/20 text-primary",
  "bg-info/20 text-info",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
  "bg-violet-500/20 text-violet-400",
  "bg-muted text-muted-foreground",
];

function tagTier(count: number, max: number) {
  const r = count / max;
  if (r > 0.7) return 0;
  if (r > 0.5) return 1;
  if (r > 0.35) return 2;
  if (r > 0.2) return 3;
  if (r > 0.1) return 4;
  return 5;
}

export function InterestsPanel() {
  const max = Math.max(...ALL_INTEREST_TAGS.map((t) => t.count));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Heart className="h-4 w-4 text-primary" />
              TOP 10 兴趣领域
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">对话主题提取</span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={TOP_INTERESTS} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                width={72}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="score" fill="#5E6AD2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Heart className="h-4 w-4 text-primary" />
              完整标签云
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">
              {ALL_INTEREST_TAGS.length} 个标签
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {ALL_INTEREST_TAGS.map((t) => {
              const tier = tagTier(t.count, max);
              return (
                <span
                  key={t.name}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-transform hover:scale-105 ${TIER_COLORS[tier]}`}
                  style={{
                    fontSize: `${Math.max(10, 11 + tier * 0.5)}px`,
                  }}
                  title={`出现 ${t.count} 次`}
                >
                  {t.name}
                  <span className="font-mono text-[9px] opacity-70">{t.count}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px] text-muted-foreground">
            <span>大小/颜色代表出现频次：</span>
            {TIER_COLORS.map((c, i) => (
              <span key={i} className={`rounded px-1.5 py-0.5 font-medium ${c}`}>
                {i === 0
                  ? "极高"
                  : i === 1
                    ? "高"
                    : i === 2
                      ? "中"
                      : i === 3
                        ? "低"
                        : i === 4
                          ? "极低"
                          : "偶发"}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
