import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconFlame } from "@/components/icons"
import { ACTIVITY_HEATMAP } from "./mock-data";

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const hours = Array.from({ length: 24 }, (_, i) => i);

function getColorClass(v: number) {
  if (v < 15) return "bg-muted/40";
  if (v < 30) return "bg-primary/15";
  if (v < 50) return "bg-primary/30";
  if (v < 70) return "bg-primary/50";
  if (v < 85) return "bg-primary/70";
  return "bg-primary";
}

export function ActivityHeatmap() {
  const lookup = new Map(ACTIVITY_HEATMAP.map((c) => [`${c.day}-${c.hour}`, c.value]));
  const max = Math.max(...ACTIVITY_HEATMAP.map((c) => c.value));
  const peak = ACTIVITY_HEATMAP.find((c) => c.value === max);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconFlame className="h-4 w-4 text-warning" />
            用户活跃热力图
          </CardTitle>
          {peak && (
            <Badge variant="warning" className="text-[10px]">
              峰值 {peak.day} {peak.hour}:00 · {peak.value}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* 横轴 - 小时 */}
            <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-px text-[9px] text-muted-foreground">
              <div />
              {hours.map((h) => (
                <div key={h} className="text-center font-mono">
                  {h % 3 === 0 ? h : ""}
                </div>
              ))}
            </div>

            {/* 7 行 × 24 列 */}
            {days.map((d) => (
              <div key={d} className="mt-px grid grid-cols-[40px_repeat(24,1fr)] gap-px">
                <div className="flex items-center justify-end pr-2 text-[10px] text-muted-foreground">
                  {d}
                </div>
                {hours.map((h) => {
                  const v = lookup.get(`${d}-${h}`) ?? 0;
                  return (
                    <div
                      key={h}
                      className={cn(
                        "h-5 cursor-pointer rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-primary",
                        getColorClass(v),
                      )}
                      title={`${d} ${h}:00 · ${v} 活跃`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
          <span>低</span>
          {[
            "bg-muted/40",
            "bg-primary/15",
            "bg-primary/30",
            "bg-primary/50",
            "bg-primary/70",
            "bg-primary",
          ].map((c) => (
            <span key={c} className={cn("h-3 w-3 rounded-sm", c)} />
          ))}
          <span>高</span>
        </div>
      </CardContent>
    </Card>
  );
}
