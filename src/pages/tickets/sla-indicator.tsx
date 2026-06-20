import { IconAlertTriangle, IconClock } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = { dueAt: number; compact?: boolean };

export function SlaIndicator({ dueAt, compact }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = dueAt - now;
  const breached = diff < 0;
  const absMs = Math.abs(diff);
  const min = Math.floor(absMs / 60_000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  const s = Math.floor((absMs % 60_000) / 1000);

  let label = "";
  if (h > 0) label = `${h}h ${m}m`;
  else if (m > 0) label = `${m}m ${s}s`;
  else label = `${s}s`;

  const tone = breached ? "destructive" : diff < 30 * 60_000 ? "warning" : "default";

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono",
          tone === "destructive" && "bg-destructive/15 text-destructive",
          tone === "warning" && "bg-warning/15 text-warning",
          tone === "default" && "bg-muted text-muted-foreground",
        )}
      >
        {breached ? <IconAlertTriangle className="h-3 w-3" /> : <IconClock className="h-3 w-3" />}
        {breached ? "超时" : "剩"} {label}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs",
        tone === "destructive" && "text-destructive",
        tone === "warning" && "text-warning",
        tone === "default" && "text-muted-foreground",
      )}
    >
      {breached ? (
        <IconAlertTriangle className="h-3.5 w-3.5" />
      ) : (
        <IconClock className="h-3.5 w-3.5" />
      )}
      <span className="font-mono">
        {breached ? "已超时 " : "剩余 "}
        {label}
      </span>
    </div>
  );
}
