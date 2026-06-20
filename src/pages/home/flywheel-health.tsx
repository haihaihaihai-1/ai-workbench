import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { IconTrendingUp, IconWaves } from "@/components/icons"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FLYWHEEL_SUB_METRICS, HOME_OVERVIEW } from "./mock-data";

export function FlywheelHealth() {
  const navigate = useNavigate();
  const score = HOME_OVERVIEW.flywheelHealth;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconWaves className="h-4 w-4 text-primary" />
          飞轮健康度
        </CardTitle>
        <button
          type="button"
          onClick={() => {
            navigate("/flywheel");
            toast.info("已跳转到数据飞轮");
          }}
          className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
        >
          详情 →
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 64 64"
              role="img"
              aria-label={`飞轮健康度 ${score} / 100`}
            >
              <title>{`飞轮健康度 ${score} / 100`}</title>
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeDasharray={`${(score / 100) * 176} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <div className="text-xl font-semibold text-primary tabular-nums">{score}</div>
              <div className="text-[9px] text-muted-foreground">/ 100</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-1.5 text-xs">
              <IconTrendingUp className="h-3 w-3 text-success" />
              <span className="font-medium">状态：良好</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              飞轮运转顺畅，意图分类、反馈回流、知识更新均处于健康区间。
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {FLYWHEEL_SUB_METRICS.map((m) => (
            <div key={m.label} className="flex items-center gap-2 text-xs">
              <span className="w-20 shrink-0 text-muted-foreground">{m.label}</span>
              <Progress
                value={m.percent}
                className={cn(
                  "h-1.5 flex-1",
                  m.tone === "success" && "[&>div]:bg-success",
                  m.tone === "info" && "[&>div]:bg-info",
                  m.tone === "primary" && "[&>div]:bg-primary",
                )}
              />
              <span className="w-14 shrink-0 text-right font-mono text-[10px] tabular-nums">
                {m.value}
                {m.suffix}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
