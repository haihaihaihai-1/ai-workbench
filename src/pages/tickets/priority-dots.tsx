/**
 * PriorityDots · Linear 招牌三圆点优先级
 *
 * 紧急 ●●● 红色
 * 高   ●●○ 橙色
 * 中   ●○○ 黄色
 * 低   ○○○ 灰色
 *
 * 放在行的左侧，hover 显示 tooltip
 */

import type { TicketPriority } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  priority: TicketPriority;
  /** 是否显示文字标签 */
  showLabel?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md";
};

const SIZE_TO_DOT: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低",
};

export function PriorityDots({ priority, showLabel = false, className, size = "sm" }: Props) {
  const filled =
    priority === "urgent" ? 3 : priority === "high" ? 2 : priority === "medium" ? 1 : 0;
  const color =
    priority === "urgent"
      ? "bg-[#EF4444]"
      : priority === "high"
        ? "bg-[#F2994A]"
        : priority === "medium"
          ? "bg-[#F2C94C]"
          : "bg-[#7A7A7A]";

  const dotSize = SIZE_TO_DOT[size];

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      title={`优先级: ${PRIORITY_LABELS[priority]}`}
      aria-label={`优先级 ${PRIORITY_LABELS[priority]}`}
    >
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full transition-colors",
              dotSize,
              i < filled ? color : "bg-border",
            )}
          />
        ))}
      </div>
      {showLabel ? (
        <span className="text-xs text-muted-foreground">{PRIORITY_LABELS[priority]}</span>
      ) : null}
    </div>
  );
}
