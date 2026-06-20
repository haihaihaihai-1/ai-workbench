/**
 * MemoryCard · Notion 风格记忆卡
 *
 * Notion 借皮要点：
 * - 卡片几乎无边框，柔和阴影 (shadow-notion)
 * - 内容用 font-serif 衬线（Notion 招牌：长文用衬线）
 * - 顶部 emoji 加大（Notion 用 emoji 当图标）
 * - 双向链接 [[ ]] 渲染为高亮 chip
 * - hover 显操作按钮（柔和、不刺眼）
 * - 置信度用微妙的色阶（success/info/warning）
 */

import {
  IconBrain,
  IconCalendar,
  IconDotsThree,
  IconLink,
  IconPin,
  IconTrash,
} from "@/components/icons";
import type { Memory } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo } from "react";
import { MEMORY_TYPE_INFO } from "./mock-data";
import { WikiLink } from "./wiki-link";

type Props = {
  memory: Memory;
  index?: number;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onOpen?: (id: string) => void;
};

export function MemoryCard({ memory, index = 0, onDelete, onTogglePin, onOpen }: Props) {
  const t = MEMORY_TYPE_INFO[memory.type];
  const conf = Math.round(memory.confidence * 100);

  // 解析 [[双向链接]]
  const content = useMemo(() => {
    const parts: React.ReactNode[] = [];
    const re = /\[\[([^\]]+)\]\]/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = re.exec(memory.content)) !== null) {
      if (m.index > last) {
        parts.push(memory.content.slice(last, m.index));
      }
      parts.push(<WikiLink key={`wl-${i++}`} title={m[1]} />);
      last = m.index + m[0].length;
    }
    if (last < memory.content.length) {
      parts.push(memory.content.slice(last));
    }
    return parts;
  }, [memory.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 12) * 0.02,
        duration: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ y: -1 }}
      className="will-change-transform"
    >
      <article
        onClick={() => onOpen?.(memory.id)}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-md",
          "bg-card text-card-foreground shadow-notion",
          "transition-all duration-base ease-spring",
          "hover:-translate-y-0.5 hover:shadow-md",
        )}
      >
        {/* 顶部：emoji + 类型 + 操作 */}
        <header className="flex items-start justify-between gap-2 px-4 pt-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-base leading-none"
              style={{ backgroundColor: t.bgColor }}
              aria-hidden
            >
              {t.emoji}
            </span>
            <div className="min-w-0 flex flex-col">
              <span
                className={cn(
                  "truncate text-[10px] font-semibold uppercase tracking-wider",
                  t.color,
                )}
              >
                {t.name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/70">{memory.id}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {memory.pinned ? <IconPin className="h-3.5 w-3.5 fill-warning text-warning" /> : null}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.(memory.id);
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={memory.pinned ? "取消置顶" : "置顶"}
            >
              <IconPin className="h-3.5 w-3.5" weight={memory.pinned ? "fill" : "regular"} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(memory.id);
              }}
              className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
              aria-label="删除"
            >
              <IconTrash className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="更多"
            >
              <IconDotsThree className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* 内容 · 衬线字体 · 双向链接 [[ ]] */}
        <div className="px-4 pt-2 pb-3">
          <p className="font-serif text-[15px] leading-7 text-foreground/90">{content}</p>
        </div>

        {/* 标签（Notion 风格：淡色背景 + 圆角） */}
        {memory.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 px-4 pb-2">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* 底部 meta · Notion 招牌极简 */}
        <footer className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-1.5 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1">
              <IconBrain className="h-3 w-3" />
              {memory.source}
            </span>
            <span className="flex items-center gap-1">
              <IconCalendar className="h-3 w-3" />
              {relativeTime(memory.createdAt)}
            </span>
            {/* 双向链接计数（mock） */}
            <span className="flex items-center gap-1">
              <IconLink className="h-3 w-3" />
              {Math.floor(Math.random() * 3)}
            </span>
          </div>
          <ConfidencePill conf={conf} />
        </footer>
      </article>
    </motion.div>
  );
}

function ConfidencePill({ conf }: { conf: number }) {
  const color =
    conf >= 90
      ? "text-emerald-700 dark:text-emerald-300"
      : conf >= 75
        ? "text-sky-700 dark:text-sky-300"
        : "text-amber-700 dark:text-amber-300";
  const dot = conf >= 90 ? "bg-emerald-500" : conf >= 75 ? "bg-sky-500" : "bg-amber-500";
  return (
    <span className={cn("flex items-center gap-1 font-mono", color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
      {conf}%
    </span>
  );
}
