/**
 * TicketList · Linear 风格工单列表视图
 *
 * Linear 借皮要点：
 * - 极紧凑行（py-2）
 * - hover 行高亮（bg-accent/30）
 * - 选中行：紫色 ring
 * - 状态点用 StatusDot（小圆点，不带文字）
 * - 优先级用 PriorityDots（三圆点）
 * - 标签：极小、灰背景
 * - 整行可点击（无按钮外显）
 * - 选中态可见
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Ticket, TicketStatus } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { TICKET_TYPE_INFO } from "./mock-data";
import { PriorityDots } from "./priority-dots";
import { SlaIndicator } from "./sla-indicator";
import { StatusDot } from "./status-dot";

type Props = {
  tickets: Ticket[];
  selectedId?: string;
  onSelect: (t: Ticket) => void;
  onStatusChange: (id: string, s: TicketStatus) => void;
};

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/40 py-16 text-sm text-muted-foreground">
        <p>暂无符合条件的工单</p>
        <p className="text-[10px] text-muted-foreground/60">按 C 创建新工单</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border/60 bg-card/30">
      {/* 表头 · Linear 风：极小字号 + 大写 */}
      <div className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_80px_60px_60px_120px_80px_80px] items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>工单</span>
        <span>状态</span>
        <span>优先级</span>
        <span>类型</span>
        <span>受理人</span>
        <span>SLA</span>
        <span className="text-right">更新</span>
      </div>

      <ScrollArea className="max-h-[calc(100vh-24rem)]">
        <div className="divide-y divide-border/40">
          {tickets.map((t) => (
            <TicketRow
              key={t.id}
              ticket={t}
              isSelected={selectedId === t.id}
              onClick={() => onSelect(t)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function TicketRow({
  ticket,
  isSelected,
  onClick,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}) {
  const t = TICKET_TYPE_INFO[ticket.type];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group grid w-full grid-cols-[minmax(0,1fr)_80px_60px_60px_120px_80px_80px] items-center gap-3 px-4 py-2 text-left",
        "transition-colors hover:bg-accent/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-inset",
        isSelected && "bg-brand-500/8 hover:bg-brand-500/12",
      )}
    >
      {/* 工单标题 + code */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-sm" aria-hidden>
          {t.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium leading-tight">{ticket.title}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">{ticket.code}</span>
            {ticket.tags.length > 0 ? (
              <>
                <span className="text-muted-foreground/30">·</span>
                <div className="flex gap-1 truncate">
                  {ticket.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted/60 px-1 py-px text-[9px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* 状态点 */}
      <StatusDot status={ticket.status} showLabel size="sm" />

      {/* 优先级三圆点 */}
      <PriorityDots priority={ticket.priority} />

      {/* 类型 */}
      <span className="truncate text-[10px] text-muted-foreground">{t.name}</span>

      {/* 受理人 */}
      <div className="flex items-center gap-1.5">
        {ticket.assignee ? (
          <>
            <Avatar className="h-4 w-4">
              <AvatarFallback className="bg-brand-500/15 text-[8px] text-brand-700">
                {ticket.assignee[0]}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-[10px] text-muted-foreground">{ticket.assignee}</span>
          </>
        ) : (
          <span className="text-[10px] italic text-muted-foreground/50">未分配</span>
        )}
      </div>

      {/* SLA */}
      <SlaIndicator dueAt={ticket.slaDueAt} compact />

      {/* 更新时间 */}
      <span className="text-right text-[10px] text-muted-foreground">
        {relativeTime(ticket.updatedAt)}
      </span>
    </button>
  );
}
