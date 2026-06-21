/**
 * ChatDemoPage · useChatStream 演示页
 *
 * 借皮要点：
 * - ChatGPT 风格对话界面
 * - 流式 token 输出（SSE 风格）
 * - AbortController 中断流
 * - 打字光标动画
 *
 * 实际生产环境只需替换 createLLMStream 内部实现为真实 fetch 调用
 */

import { IconSend, IconSparkles, IconTrash2, IconStopCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStream } from "@/hooks/use-chat-stream";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const SUGGESTED = [
  "你好，介绍一下你自己",
  "数据结构有哪些核心知识点？",
  "最近压力很大，怎么调节？",
  "请假超过 3 天的流程是什么？",
  "帮我写一个 Python 排序算法",
];

export default function ChatDemoPage() {
  const { messages, input, setInput, handleSubmit, isLoading, stop, reset } = useChatStream({
    model: "mock-gpt-4o",
    systemPrompt: "你是 Workbench AI，一个面向高校的多智能体助手。请用中文回答，简洁专业。",
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showCursor, setShowCursor] = useState(true);

  // 打字光标闪烁
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(t);
  }, []);

  // 自动滚到底
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem-3rem)] max-w-3xl flex-col rounded-lg border border-border bg-card/30">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500 text-white">
            <IconSparkles className="h-4 w-4" weight="bold" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Workbench AI · Mock Stream</h1>
            <p className="text-[10px] text-muted-foreground">
              借皮 OpenAI SSE 协议 · useChatStream hook 演示
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={reset}
          aria-label="清空对话"
        >
          <IconTrash2 className="h-3.5 w-3.5" />
        </Button>
      </header>

      {/* 消息流 */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-center">
              <div className="text-5xl">✨</div>
              <h2 className="text-lg font-semibold">开始对话</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                模拟 OpenAI ChatCompletion 流式 API。输入消息后会看到字符级流式输出，可随时中断。
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(s)}
                    className="h-7 text-[11px]"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-violet-500 to-blue-500 text-white",
                )}
              >
                {m.role === "user" ? "U" : "AI"}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                  {m.role === "assistant" && isLoading && m.id === messages[messages.length - 1]?.id && (
                    <span
                      className={cn(
                        "ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-current align-middle",
                        showCursor ? "opacity-100" : "opacity-0",
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
                <span
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary"
                  style={{ animationDelay: "0.4s" }}
                />
              </span>
              AI 正在思考...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 输入区 */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-border bg-card/50 p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
          rows={1}
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:opacity-50",
            "max-h-32 min-h-[36px]",
          )}
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={stop}
            className="h-9 w-9 shrink-0"
            aria-label="停止生成"
          >
            <IconStopCircle className="h-4 w-4" weight="fill" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="h-9 w-9 shrink-0"
            aria-label="发送"
          >
            <IconSend className="h-4 w-4" weight="bold" />
          </Button>
        )}
      </form>
    </div>
  );
}
