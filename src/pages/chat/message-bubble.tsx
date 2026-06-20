import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { messageEnter } from "@/lib/motion-presets";
import type { ChatMessage, SourceRef, ToolCall } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { IconBot, IconCopy, IconThumbsDown, IconThumbsUp } from "@/components/icons"
import { motion } from "motion/react";
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success("已复制到剪贴板");
  };

  return (
    <motion.div
      key={message.id}
      initial={messageEnter.initial}
      animate={messageEnter.animate}
      transition={messageEnter.transition}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground text-xs">
            许
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-primary/15 text-primary">
            <IconBot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", isUser && "items-end")}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {isUser ? "你" : (agent?.name ?? "AI")}
          </span>
          <span>{relativeTime(message.createdAt)}</span>
          {!isUser && agent && (
            <Badge variant="outline" className="text-[10px]">
              {agent.emoji} {agent.name}
            </Badge>
          )}
        </div>

        <div
          className={cn(
            "group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownContent content={message.content} />
          )}

          {/* 工具调用摘要（小气泡内） */}
          {!isUser && tools && tools.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-2">
              {tools.map((t) => (
                <Badge
                  key={t.id}
                  variant={
                    t.status === "error"
                      ? "destructive"
                      : t.status === "running"
                        ? "info"
                        : "success"
                  }
                  className="text-[10px]"
                >
                  {t.status === "running" ? "⏳" : t.status === "success" ? "✓" : "✗"} {t.name}
                </Badge>
              ))}
            </div>
          )}

          {/* 引用来源摘要 */}
          {!isUser && sources && sources.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
              <span>引用：</span>
              {sources.map((s, i) => (
                <span key={s.id} className="rounded bg-muted px-1.5 py-0.5 font-mono">
                  [{i + 1}] {s.domain}
                </span>
              ))}
            </div>
          )}

          {/* 操作栏（hover 显示） */}
          {!isUser && (
            <div className="absolute -bottom-3 right-3 flex items-center gap-1 rounded-md border border-border bg-background p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleCopy}
                aria-label="复制"
              >
                <IconCopy className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant={message.feedback === "up" ? "default" : "ghost"}
                className="h-6 w-6"
                onClick={() => onFeedback?.(message.id, "up")}
                aria-label="有帮助"
              >
                <IconThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant={message.feedback === "down" ? "destructive" : "ghost"}
                className="h-6 w-6"
                onClick={() => onFeedback?.(message.id, "down")}
                aria-label="没帮助"
              >
                <IconThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 极简 Markdown 渲染（标题、粗体、列表、代码、引用、表格）
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const out: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    out.push(
      <div key={`t-${out.length}`} className="my-2 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              {tableRows[0].map((c, i) => (
                <th key={i} className="border-b border-border px-2 py-1 text-left font-medium">
                  {c.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(2).map((row, ri) => (
              <tr key={ri}>
                {row.map((c, i) => (
                  <td key={i} className="border-b border-border px-2 py-1">
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
    // 表格
    if (line.includes("|") && line.split("|").length > 2) {
      inTable = true;
      tableRows.push(line.split("|").slice(1, -1));
      return;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("## ")) {
      out.push(
        <h2 key={idx} className="mt-3 mb-1 text-sm font-semibold">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      out.push(
        <h1 key={idx} className="mt-3 mb-1 text-base font-semibold">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={idx}
          className="my-1.5 border-l-2 border-primary/60 bg-primary/5 px-3 py-1.5 text-xs italic"
        >
          {line.slice(2)}
        </blockquote>,
      );
    } else if (/^\d+\. /.test(line)) {
      out.push(
        <div key={idx} className="ml-4 flex gap-2 text-sm">
          <span className="text-primary">{line.match(/^\d+/)?.[0]}.</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.replace(/^\d+\. /, "")) }} />
        </div>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      out.push(
        <div key={idx} className="ml-4 flex gap-2 text-sm">
          <span className="text-primary">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
        </div>,
      );
    } else if (line.trim() === "") {
      out.push(<div key={idx} className="h-1.5" />);
    } else {
      out.push(
        <p
          key={idx}
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: inlineMd(line) }}
        />,
      );
    }
  });
  flushTable();

  return <div className="flex flex-col gap-0.5">{out}</div>;
}

function inlineMd(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">$1</code>')
    .replace(/⚠️/g, '<span class="text-warning">⚠️</span>')
    .replace(/💡/g, "<span>💡</span>");
}
