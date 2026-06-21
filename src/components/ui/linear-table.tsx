/**
 * LinearTable · 通用 Linear 风格紧凑表格
 *
 * 借皮要点（与 /tickets ticket-list /feedback 列表保持一致）:
 * - grid 紧凑行（替代 shadcn Table）
 * - 极小字号 header (text-[10px] uppercase tracking-wider)
 * - hover 显背景 (hover:bg-accent/40)
 * - 选中态 focus ring
 * - sticky 表头
 * - ScrollArea 包装大列表
 *
 * 用法:
 *   <LinearTable
 *     columns={[
 *       { key: 'id', label: 'ID', width: '100px' },
 *       { key: 'name', label: '名称', render: (row) => <span>{row.name}</span> },
 *     ]}
 *     rows={data}
 *     rowKey="id"
 *     onRowClick={(row) => openDetail(row)}
 *   />
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type LinearTableColumn<T> = {
  key: string;
  label: string;
  /** Tailwind grid 宽度, 如 '100px' / 'minmax(0,1fr)' / '120px' */
  width: string;
  /** 隐藏列（响应式） */
  hidden?: boolean;
  /** 自定义渲染 */
  render: (row: T, index: number) => ReactNode;
  /** 列内容对齐 */
  align?: "left" | "right" | "center";
};

type Props<T> = {
  columns: LinearTableColumn<T>[];
  rows: T[];
  /** 行唯一 key 字段名 */
  rowKey: keyof T | ((row: T) => string);
  onRowClick?: (row: T) => void;
  /** 选中行 id 列表 */
  selectedKeys?: string[];
  /** 空状态 */
  emptyText?: string;
  /** 最大高度（默认 calc(100vh-24rem)） */
  maxHeight?: string;
  className?: string;
};

export function LinearTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKeys,
  emptyText = "暂无数据",
  maxHeight = "calc(100vh-24rem)",
  className,
}: Props<T>) {
  const getKey = (row: T): string => {
    if (typeof rowKey === "function") return rowKey(row);
    return String(row[rowKey]);
  };

  const gridCols = columns.map((c) => c.width).join(" ");
  const visibleCols = columns.filter((c) => !c.hidden);

  return (
    <div className={cn("overflow-hidden rounded-md border border-border/60 bg-card/30", className)}>
      {/* 表头 · Linear 风：极小字号 + 大写 + 跟踪 */}
      <div
        className="sticky top-0 z-10 grid items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        style={{ gridTemplateColumns: gridCols }}
      >
        {visibleCols.map((col) => (
          <span
            key={col.key}
            className={cn(
              col.align === "right" && "text-right",
              col.align === "center" && "text-center",
            )}
          >
            {col.label}
          </span>
        ))}
      </div>

      <ScrollArea style={{ maxHeight }}>
        {rows.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">{emptyText}</div>
        ) : (
          <div className="divide-y divide-border/40">
            {rows.map((row, index) => {
              const key = getKey(row);
              const isSelected = selectedKeys?.includes(key) ?? false;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "grid w-full items-center gap-3 px-4 py-2 text-left transition-colors",
                    "hover:bg-accent/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-inset",
                    onRowClick && "cursor-pointer",
                    isSelected && "bg-brand-500/8 hover:bg-brand-500/12",
                  )}
                  style={{ gridTemplateColumns: gridCols }}
                  disabled={!onRowClick}
                >
                  {visibleCols.map((col) => (
                    <div
                      key={col.key}
                      className={cn(
                        "min-w-0",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {col.render(row, index)}
                    </div>
                  ))}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
