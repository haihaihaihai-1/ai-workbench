/**
 * MessageBubble · ChatGPT 风格对话气泡
 *
 * ChatGPT 借皮要点：
 * - AI 气泡无边框、无背景（极简）
 * - 用户气泡无背景（用户消息右对齐，文字为主）
 * - 字号 15px，行高 1.6（line-height-relaxed）
 * - 圆角统一 22px (2xl)
 * - 操作栏 hover 显示，浅灰背景
 * - 流式输出时显示闪烁光标
 * - 引用来源：底部小标 + 数字脚注样式
 */

import {
  IconCheck,
  IconCopy,
  IconPencil,
  IconSparkles,
  IconSpeakerHigh,
  IconThumbsDown,
  IconThumbsUp,
  IconUser,
} from "@/components/icons";
import { messageEnter } from "@/lib/motion-presets";
import type { ChatMessage, SourceRef, ToolCall } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AGENTS } from "./mock-data";

type Props = {
  message: ChatMessage;
  onFeedback?: (msgId: string, v: "up" | "down") => void;
  sources?: SourceRef[];
  tools?: ToolCall[];
};

export function MessageBubble({ message, onFeedback, sources, tools }: Props) {
  const isUser = message.role === "user";
  const agent = message.agent ? AGENTS[message.agent] : null;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("已复制到剪贴板");
  };

  return (
    <motion.div
      key={message.id}
      initial={messageEnter.initial}
      animate={messageEnter.animate}
      transition={messageEnter.transition}
      className={cn(
        "group/message w-full",
        isUser ? "bg-transparent" : "bg-muted/30", // ChatGPT 风格：AI 消息浅灰背景
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl gap-4 px-4 py-6">
        {/* 头像（ChatGPT 风格：左侧小圆形） */}
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            isUser
              ? "bg-gradient-to-br from-brand-500 to-[#8B5CF6] text-white"
              : "bg-emerald-500 text-white", // ChatGPT 绿
          )}
          aria-hidden
        >
          {isUser ? (
            <IconUser className="h-3.5 w-3.5" weight="bold" />
          ) : (
            <IconSparkles className="h-3.5 w-3.5" weight="fill" />
          )}
        </div>

        {/* 气泡内容 */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* 头部：名字 + 时间 + Agent 徽章 */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">
              {isUser ? "你" : (agent?.name ?? "Assistant")}
            </span>
            <span className="text-muted-foreground/60">{relativeTime(message.createdAt)}</span>
            {!isUser && agent ? (
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                {agent.emoji} {agent.name}
              </span>
            ) : null}
          </div>

          {/* 消息正文（ChatGPT 风：15px、leading-7、无背景框） */}
          <div className="text-[15px] leading-7 text-foreground/90">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <>
                <MarkdownContent content={message.content} />
              </>
            )}
          </div>

          {/* 工具调用（紧凑标签） */}
          {!isUser && tools && tools.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tools.map((t) => (
                <span
                  key={t.id}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    t.status === "error"
                      ? "bg-red-500/10 text-red-700"
                      : t.status === "running"
                        ? "bg-blue-500/10 text-blue-700"
                        : "bg-emerald-500/10 text-emerald-700",
                  )}
                >
                  {t.status === "running" ? "⏳" : t.status === "success" ? "✓" : "✗"} {t.name}
                </span>
              ))}
            </div>
          ) : null}

          {/* 引用来源（脚注样式） */}
          {!isUser && sources && sources.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] text-muted-foreground">
              <span className="font-medium">引用：</span>
              {sources.map((s, i) => (
                <sup
                  key={s.id}
                  className="rounded bg-muted px-1 font-mono text-[10px] text-foreground/70"
                  title={s.title}
                >
                  [{i + 1}]
                </sup>
              ))}
            </div>
          ) : null}

          {/* 操作栏（hover 显 · ChatGPT 风格：浅灰圆角小按钮） */}
          {!isUser ? (
            <div className="flex items-center gap-0.5 pt-1 opacity-0 transition-opacity group-hover/message:opacity-100">
              <ChatActionButton onClick={handleCopy} aria-label="复制">
                {copied ? (
                  <IconCheck className="h-3.5 w-3.5" />
                ) : (
                  <IconCopy className="h-3.5 w-3.5" />
                )}
              </ChatActionButton>
              <ChatActionButton
                onClick={() => onFeedback?.(message.id, "up")}
                active={message.feedback === "up"}
                aria-label="点赞"
              >
                <IconThumbsUp
                  className="h-3.5 w-3.5"
                  weight={message.feedback === "up" ? "fill" : "regular"}
                />
              </ChatActionButton>
              <ChatActionButton
                onClick={() => onFeedback?.(message.id, "down")}
                active={message.feedback === "down"}
                destructive={message.feedback === "down"}
                aria-label="点踩"
              >
                <IconThumbsDown
                  className="h-3.5 w-3.5"
                  weight={message.feedback === "down" ? "fill" : "regular"}
                />
              </ChatActionButton>
              <ChatActionButton aria-label="朗读">
                <IconSpeakerHigh className="h-3.5 w-3.5" />
              </ChatActionButton>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 pt-1 opacity-0 transition-opacity group-hover/message:opacity-100">
              <ChatActionButton aria-label="编辑">
                <IconPencil className="h-3.5 w-3.5" />
              </ChatActionButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ChatGPT 风操作按钮 */
function ChatActionButton({
  children,
  active,
  destructive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; destructive?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        active && !destructive && "bg-brand-500/10 text-brand-600",
        destructive && "bg-red-500/10 text-red-600",
      )}
    >
      {children}
    </button>
  );
}

/* 闪烁光标（流式输出 · 备用）
 * 用法: {isStreaming ? <BlinkingCursor /> : null}
 */
function BlinkingCursor() {
  return (
    <span
      className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse-dot bg-foreground/70"
      aria-hidden
    />
  );
}
void BlinkingCursor;

/* ── Markdown 渲染（保持原版，做了 ChatGPT 风格微调） ───────────────── */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const out: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    out.push(
      <div key={`t-${out.length}`} className="my-3 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {tableRows[0].map((c, i) => (
                <th key={i} className="border-b border-border px-3 py-1.5 text-left font-medium">
                  {c.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(2).map((row, ri) => (
              <tr key={ri}>
                {row.map((c, i) => (
                  <td key={i} className="border-b border-border px-3 py-1.5">
                    {c.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, idx) => {
    if (line.includes("|") && line.split("|").length > 2) {
      inTable = true;
      tableRows.push(line.split("|").slice(1, -1));
      return;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("## ")) {
      out.push(
        <h2 key={idx} className="mt-4 mb-2 text-base font-semibold text-foreground">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      out.push(
        <h1 key={idx} className="mt-4 mb-2 text-lg font-semibold text-foreground">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={idx}
          className="my-2 border-l-2 border-muted-foreground/30 bg-muted/40 px-3 py-1.5 text-sm italic"
        >
          {line.slice(2)}
        </blockquote>,
      );
    } else if (/^\d+\. /.test(line)) {
      out.push(
        <div key={idx} className="ml-5 flex gap-2 text-[15px] leading-7">
          <span className="text-muted-foreground">{line.match(/^\d+/)?.[0]}.</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.replace(/^\d+\. /, "")) }} />
        </div>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      out.push(
        <div key={idx} className="ml-5 flex gap-2 text-[15px] leading-7">
          <span className="text-muted-foreground">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
        </div>,
      );
    } else if (line.trim() === "") {
      out.push(<div key={idx} className="h-2" />);
    } else {
      out.push(
        <p
          key={idx}
          className="text-[15px] leading-7"
          dangerouslySetInnerHTML={{ __html: inlineMd(line) }}
        />,
      );
    }
  });
  flushTable();

  return <div className="flex flex-col">{out}</div>;
}

function inlineMd(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(
      /`(.+?)`/g,
      '<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/90">$1</code>',
    )
    .replace(/⚠️/g, '<span class="text-warning">⚠️</span>')
    .replace(/💡/g, "<span>💡</span>");
}
