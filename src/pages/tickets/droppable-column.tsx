/**
 * DroppableColumn · Linear 风格看板列
 *
 * Linear 借皮要点：
 * - 列头极简：彩色细条 + 文字 + 计数，无边框
 * - 列容器：无边框、透明背景，hover 时显边框
 * - 空状态：虚线框 + "新建" 按钮
 * - 顶部 hover 显示 + 按钮（新建工单）
 * - 拖拽悬停时：列整体高亮，背景变紫
 */

import { IconDotsThree, IconPlus } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import { TICKET_STATUS_INFO } from "./mock-data";

type Props = {
  id: string;
  title: string;
  count: number;
  color: string;
  description: string;
  items: string[];
  children: ReactNode;
  onAddNew?: () => void;
};

export function DroppableColumn({
  id,
  title,
  count,
  color,
  description,
  items,
  children,
  onAddNew,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
  });

  const statusInfo = TICKET_STATUS_INFO[id] ?? TICKET_STATUS_INFO.open;

  return (
    <section
      ref={setNodeRef}
      aria-label={`${title} 工单列,共 ${count} 张`}
      className={cn(
        "group/col flex h-full flex-col rounded-md transition-colors",
        // Linear 风格：列无背景边框
        isOver && "bg-brand-500/5",
      )}
    >
      {/* 列头 · Linear 极简 */}
      <header
        className={cn("flex items-center justify-between px-1 pb-2", isOver && "text-brand-600")}
      >
        <div className="flex min-w-0 items-center gap-2">
          {/* 彩色细条（Linear 招牌） */}
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
            {title}
          </h3>
          <span
            className={cn(
              "rounded-full px-1.5 text-[10px] font-mono font-medium",
              "text-muted-foreground",
              isOver && "bg-brand-500/15 text-brand-700",
            )}
          >
            {count}
          </span>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/col:opacity-100">
          <button
            type="button"
            onClick={onAddNew}
            aria-label="新建工单"
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconPlus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="列操作"
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconDotsThree className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* 列描述（Linear 没有描述，我们保留作为可访问性增强） */}
      {description ? <p className="sr-only">{description}</p> : null}

      <ScrollArea className="h-[calc(100vh-22rem)]">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div
            className={cn(
              "flex min-h-[120px] flex-col gap-1.5 rounded-md p-1.5 transition-colors",
              isOver && "ring-2 ring-brand-500/40",
            )}
          >
            {children}
            {items.length === 0 ? (
              <EmptyState isOver={isOver} onAddNew={onAddNew} statusColor={statusInfo.color} />
            ) : null}
          </div>
        </SortableContext>
      </ScrollArea>
    </section>
  );
}

function EmptyState({
  isOver,
  onAddNew,
  statusColor,
}: {
  isOver: boolean;
  onAddNew?: () => void;
  statusColor: string;
}) {
  if (isOver) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-brand-500/40 bg-brand-500/5 py-10 text-xs font-medium text-brand-700">
        松开放入此列
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onAddNew}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-md py-10 text-xs",
        "border border-dashed border-border/40 text-muted-foreground/60",
        "hover:border-border hover:bg-muted/30 hover:text-muted-foreground",
        "transition-colors",
      )}
    >
      <IconPlus className="h-4 w-4" />
      <span>新建工单</span>
      <span className="text-[10px] opacity-50" style={{ color: statusColor }}>
        拖入此处
      </span>
    </button>
  );
}
