/**
 * Composer · ChatGPT 风格输入框
 *
 * ChatGPT 借皮要点：
 * - 圆角 28px (rounded-3xl)
 * - 底部居中，最大宽 768px (max-w-3xl)
 * - 多行自动扩展（高度自适应）
 * - 大尺寸 placeholder：'Message Assistant...'
 * - 左侧：附件按钮
 * - 右侧：发送按钮（圆形 32px，仅输入后启用）
 * - 流式时显示停止按钮（红色方块）
 * - 底部小字提示：AI 不完美 + 快捷键
 */

import { IconArrowUp, IconPaperclip, IconSquare } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { AgentDomain } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AGENTS, SUGGESTED_PROMPTS } from "./mock-data";

type Props = {
  onSend: (text: string) => void;
  streaming: boolean;
  onStop: () => void;
  agent: AgentDomain;
};

export function Composer({ onSend, streaming, onStop, agent }: Props) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度（ChatGPT 风：1-6 行）
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [text]);

  const submit = () => {
    const v = text.trim();
    if (!v || streaming) return;
    onSend(v);
    setText("");
  };

  return (
    <div className="border-t border-border/40 bg-background/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-3xl">
        {/* 推荐问题（仅在空状态显示） */}
        {text.length === 0 ? (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {SUGGESTED_PROMPTS.slice(0, 4).map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSend(p.text)}
                disabled={streaming}
                className={cn(
                  "group flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs",
                  "transition-all hover:border-foreground/30 hover:bg-card",
                  streaming && "pointer-events-none opacity-50",
                )}
              >
                <span className="text-sm">{p.icon}</span>
                <span className="text-muted-foreground group-hover:text-foreground">{p.text}</span>
              </button>
            ))}
          </div>
        ) : null}

        {/* 输入框 · ChatGPT 招牌：圆角 28px + 灰色描边 + 大尺寸 padding */}
        <div
          className={cn(
            "flex items-end gap-2 rounded-3xl border border-border bg-card/60 px-3 py-2 shadow-sm",
            "transition-shadow focus-within:border-foreground/30 focus-within:shadow-md",
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground"
            aria-label="附件"
            disabled={streaming}
          >
            <IconPaperclip className="h-4 w-4" />
          </Button>

          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={`Message ${AGENTS[agent].name}…`}
            className={cn(
              "scrollbar-none max-h-52 min-h-7 flex-1 resize-none bg-transparent px-1 py-1.5",
              "text-[15px] leading-6 outline-none placeholder:text-muted-foreground",
            )}
            disabled={streaming}
          />

          {streaming ? (
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={onStop}
              aria-label="停止生成"
              title="停止生成"
            >
              <IconSquare className="h-3 w-3" weight="fill" />
            </Button>
          ) : (
            <Button
              size="icon"
              disabled={!text.trim()}
              onClick={submit}
              className={cn(
                "h-8 w-8 shrink-0 rounded-full transition-opacity",
                !text.trim() && "opacity-30",
              )}
              aria-label="发送"
              title="发送 (Enter)"
            >
              <IconArrowUp className="h-4 w-4" weight="bold" />
            </Button>
          )}
        </div>

        {/* 底部小字 · ChatGPT 风格 */}
        <p className="mt-2 text-center text-[11px] text-muted-foreground/80">
          AI 生成内容仅供参考 · 涉及关键决策请核实 ·{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          发送 ·{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            Shift+Enter
          </kbd>{" "}
          换行
        </p>
      </div>
    </div>
  );
}
