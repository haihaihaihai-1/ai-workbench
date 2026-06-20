/**
 * DraggableTicketCard · Linear 风格工单卡
 *
 * Linear 借皮要点：
 * - 极薄边框 + 背景几乎透明（hover 显边框）
 * - 左侧 4px 状态色条
 * - 紧凑间距 (p-2.5)
 * - 优先级三圆点（招牌）
 * - 状态点 + code 同行
 * - hover 时显示 grip + 操作按钮
 * - selected 时背景高亮 + 紫色 ring
 */

import { IconArchive, IconCopy, IconDotsThree, IconGripVertical } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TICKET_TYPE_INFO } from "./mock-data";
import { PriorityDots } from "./priority-dots";
import { SlaIndicator } from "./sla-indicator";

type Props = { ticket: Ticket; onClick?: () => void };

export function DraggableTicketCard({ ticket, onClick }: Props) {
  const t = TICKET_TYPE_INFO[ticket.type];
  const isLocked = ticket.status === "closed";
  const isSelected = false; // TODO: 接入 selected state

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { type: "ticket", status: ticket.status },
    disabled: isLocked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex w-full overflow-hidden rounded-md",
        "border border-transparent bg-card/40 text-left",
        "transition-all duration-fast",
        "hover:border-border/80 hover:bg-card hover:shadow-xs",
        "focus-within:ring-2 focus-within:ring-brand-500/30",
        isDragging && "z-50 cursor-grabbing border-primary opacity-60 shadow-lg",
        isDragging && "rotate-1 scale-[1.02]",
        isLocked && "cursor-not-allowed opacity-60",
        !isDragging && !isLocked && "cursor-pointer",
        isSelected && "border-brand-500/40 bg-brand-500/5",
      )}
      onClick={isDragging ? undefined : onClick}
    >
      {/* 左侧 4px 状态色条 · Linear 招牌 */}
      <StatusBar status={ticket.status} />

      <button
        type="button"
        aria-label={`工单 ${ticket.code} ${ticket.title}`}
        className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5"
        {...attributes}
        {...listeners}
      >
        {/* 第一行：状态点 + code + 优先级 + 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-sm leading-none" aria-hidden>
              {t.icon}
            </span>
            <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {ticket.code}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="truncate text-[10px] text-muted-foreground">{t.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <PriorityDots priority={ticket.priority} />
            <button
              type="button"
              className={cn(
                "rounded-sm p-0.5 text-muted-foreground/0 transition-colors",
                "group-hover:text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label="更多操作"
              onClick={(e) => e.stopPropagation()}
            >
              <IconDotsThree className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground/90">
          {ticket.title}
        </h3>

        {/* 标签（Linear 风格：圆角小、半透明背景） */}
        {ticket.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {ticket.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {ticket.tags.length > 3 ? (
              <span className="text-[10px] text-muted-foreground/60">
                +{ticket.tags.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* 底部：受理人 + SLA + 快捷操作 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {ticket.assignee ? (
              <>
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="bg-brand-500/15 text-[8px] text-brand-700">
                    {ticket.assignee[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-[10px] text-muted-foreground">
                  {ticket.assignee}
                </span>
              </>
            ) : (
              <span className="text-[10px] italic text-muted-foreground/60">未分配</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <SlaIndicator dueAt={ticket.slaDueAt} compact />
            {/* hover 操作按钮 */}
            <div
              className={cn(
                "flex items-center gap-0.5 opacity-0 transition-opacity",
                "group-hover:opacity-100",
              )}
            >
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="复制"
                title="复制"
              >
                <IconCopy className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="归档"
                title="归档"
              >
                <IconArchive className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </button>

      {/* drag handle · 悬停时显示在卡片最左 */}
      <div
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity",
          "group-hover:opacity-60",
          isLocked && "hidden",
        )}
        aria-hidden
      >
        <IconGripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}

/* StatusBar · 4px 竖条 */
function StatusBar({ status }: { status: Ticket["status"] }) {
  const color =
    status === "open"
      ? "#5E6AD2"
      : status === "in_progress"
        ? "#F2C94C"
        : status === "resolved"
          ? "#4FAA52"
          : "#7A7A7A";
  return (
    <div
      className="w-1 shrink-0 transition-all group-hover:w-1.5"
      style={{ backgroundColor: color }}
      aria-hidden
    />
  );
}
