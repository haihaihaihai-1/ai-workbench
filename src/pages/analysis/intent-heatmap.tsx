import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, shortNumber } from "@/lib/utils";
import { IconFlame, IconTrendingDown, IconTrendingUp } from "@/components/icons"
import { INTENT_HEAT } from "./mock-data";

export function IntentHeatmap() {
  const max = Math.max(...INTENT_HEAT.map((i) => i.count));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconFlame className="h-4 w-4 text-warning" />
          意图热度 TOP 10
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {INTENT_HEAT.map((i, idx) => {
            const pct = (i.count / max) * 100;
            const up = i.change >= 0;
            return (
              <div key={i.intent} className="flex items-center gap-2 text-xs">
                <span className="w-5 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                  {idx + 1}
                </span>
                <span className="w-28 shrink-0 truncate font-mono">{i.intent}</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-warning transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono tabular-nums">
                  {shortNumber(i.count)}
                </span>
                <span
                  className={cn(
                    "flex w-14 shrink-0 items-center justify-end gap-0.5 font-mono text-[10px]",
                    up ? "text-success" : "text-destructive",
                  )}
                >
                  {up ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
                  {up ? "+" : ""}
                  {i.change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
