/**
 * WikiLink · Notion 风格双向链接 [[ ]]
 *
 * 用法：
 *   <p>
 *     详见 <WikiLink title="前端架构笔记" />
 *   </p>
 *
 * 视觉：紫色文字 + 浅紫背景，hover 显下划线
 * 类似 Notion 的 [[ ]] 渲染
 */

import { IconHash } from "@/components/icons";
import { cn } from "@/lib/utils";
import { type MouseEvent, useState } from "react";

type Props = {
  title: string;
  /** 不存在时点击回调（用于"创建新页面"） */
  onCreate?: (title: string) => void;
  /** 已存在时点击回调（用于"打开页面"） */
  onOpen?: (title: string) => void;
  className?: string;
};

export function WikiLink({ title, onCreate, onOpen, className }: Props) {
  const [exists] = useState(() => Math.random() > 0.3); // 演示用：70% 概率存在

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (exists) onOpen?.(title);
    else onCreate?.(title);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={exists ? `打开：${title}` : `创建：${title}`}
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1 py-0.5",
        "bg-[#8463FF]/10 font-medium text-[#8463FF] underline-offset-2",
        "transition-all hover:bg-[#8463FF]/20 hover:underline",
        className,
      )}
    >
      <IconHash className="h-3 w-3 opacity-60" />
      {title}
    </button>
  );
}
