/**
 * StatusDot · Linear 招牌状态点
 *
 * 卡片或列表项上用的实心圆点
 * size: sm=8px / md=10px / lg=12px
 * shape: dot(圆) / bar(竖条 4px) / badge(带文字)
 */

import type { TicketStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TICKET_STATUS_INFO } from "./mock-data";

type Props = {
  status: TicketStatus;
  shape?: "dot" | "bar" | "badge";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export function StatusDot({ status, shape = "dot", size = "md", showLabel, className }: Props) {
  const info = TICKET_STATUS_INFO[status] ?? TICKET_STATUS_INFO.open;

  if (shape === "bar") {
    return (
      <div
        className={cn("self-stretch w-1 shrink-0 rounded-full", className)}
        style={{ backgroundColor: info.color }}
        aria-hidden
      />
    );
  }

  if (shape === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium",
          className,
        )}
        style={{ backgroundColor: info.bg, color: info.text }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: info.color }}
          aria-hidden
        />
        {info.name}
      </span>
    );
  }

  // 默认 dot
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn("shrink-0 rounded-full", SIZE[size])}
        style={{ backgroundColor: info.color }}
        aria-label={`状态: ${info.name}`}
        title={info.name}
      />
      {showLabel ? <span className="text-xs text-muted-foreground">{info.name}</span> : null}
    </span>
  );
}
