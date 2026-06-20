import { cn } from "@/lib/utils";
import { IconTrendingDown, IconTrendingUp } from "@/components/icons"

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  trend?: "up" | "down";
  tone?: "default" | "success" | "warning" | "destructive";
  description?: string;
};

export function MetricCard({
  label,
  value,
  unit,
  delta,
  trend,
  tone = "default",
  description,
}: Props) {
  const positive =
    (tone === "success" && trend === "up") || (tone === "destructive" && trend === "down");
  const negative =
    (tone === "destructive" && trend === "up") || (tone === "success" && trend === "down");

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {delta != null && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[10px] font-medium",
              positive && "text-success",
              negative && "text-destructive",
              !positive && !negative && "text-muted-foreground",
            )}
          >
            {trend === "up" ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-semibold tabular-nums",
            tone === "destructive" && "text-destructive",
            tone === "success" && "text-success",
            tone === "warning" && "text-warning",
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {description && <p className="mt-1 text-[10px] text-muted-foreground">{description}</p>}
    </div>
  );
}
