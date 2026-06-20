import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, shortNumber } from "@/lib/utils";
import { IconFilter, IconTrendingDown } from "@/components/icons"
import { USER_FUNNEL } from "./mock-data";

const colors = ["#5E6AD2", "#6E78D8", "#8588DF", "#9D99E6", "#B8AAF0"];

export function UserFunnel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconFilter className="h-4 w-4 text-primary" />
            用户行为漏斗
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            访问 → 提问 → 追问 → 反馈 → 收藏
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          {USER_FUNNEL.map((step, idx) => {
            const prevRate = idx === 0 ? 100 : USER_FUNNEL[idx - 1].rate;
            const stepLoss = prevRate - step.rate;
            return (
              <div
                key={step.step}
                className="relative rounded-lg border border-border bg-card/40 p-3 transition-colors hover:bg-card/80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{step.step}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {idx + 1} / {USER_FUNNEL.length}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-semibold tabular-nums">
                    {shortNumber(step.users)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">人</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono",
                      step.rate >= 50
                        ? "bg-success/15 text-success"
                        : step.rate >= 15
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {step.rate.toFixed(1)}%
                  </span>
                  {idx > 0 && stepLoss > 0 && (
                    <span className="flex items-center gap-0.5 text-destructive">
                      <IconTrendingDown className="h-3 w-3" />-{stepLoss.toFixed(1)}%
                    </span>
                  )}
                </div>
                {/* 视觉条形 */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${step.rate}%`,
                      backgroundColor: colors[idx],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 漏斗汇总 */}
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground">入口流量</div>
              <div className="font-mono text-base font-semibold tabular-nums">
                {shortNumber(USER_FUNNEL[0].users)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">最终转化</div>
              <div className="font-mono text-base font-semibold tabular-nums text-success">
                {shortNumber(USER_FUNNEL[USER_FUNNEL.length - 1].users)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">整体转化率</div>
              <div className="font-mono text-base font-semibold tabular-nums text-primary">
                {USER_FUNNEL[USER_FUNNEL.length - 1].rate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
