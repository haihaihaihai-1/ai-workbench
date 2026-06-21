/**
 * useChatStream · 流式 LLM 聊天 hook
 *
 * 借皮：
 * - Vercel AI SDK (`useChat`) 形态：messages + input + handleSubmit + isLoading
 * - OpenAI ChatCompletion API 流式
 *
 * 用法：
 *   const { messages, input, setInput, handleSubmit, isLoading, stop } = useChatStream({
 *     model: 'gpt-4o',
 *     onError: (err) => toast.error(err.message),
 *   })
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={input} onChange={e => setInput(e.target.value)} />
 *       {isLoading && <button onClick={stop}>Stop</button>}
 *       {messages.map(m => <div>{m.content}</div>)}
 *     </form>
 *   )
 */

import { useCallback, useRef, useState } from "react";
import { createLLMStream, parseSSEStream, type LLMMessage } from "@/lib/llm-client";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

type Options = {
  model?: string;
  systemPrompt?: string;
  initialMessages?: ChatMessage[];
  onError?: (err: Error) => void;
  onFinish?: (message: ChatMessage) => void;
  chunkDelayMs?: number;
  chunkSize?: number;
};

const randomId = () => Math.random().toString(36).slice(2, 12);

export function useChatStream(options: Options = {}) {
  const { model, systemPrompt, initialMessages = [], onError, onFinish, chunkDelayMs, chunkSize } =
    options;

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const append = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isLoading) return;

      // 1. 添加用户消息
      const userMsg: ChatMessage = {
        id: randomId(),
        role: "user",
        content: userContent,
        createdAt: Date.now(),
      };
      const assistantId = randomId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      // 2. 构建 LLM 请求消息
      const llmMessages: LLMMessage[] = [];
      if (systemPrompt) {
        llmMessages.push({ role: "system", content: systemPrompt });
      }
      // 历史消息
      for (const m of [...messages, userMsg]) {
        if (m.role === "user" || m.role === "assistant") {
          llmMessages.push({ role: m.role, content: m.content });
        }
      }

      // 3. 启动流
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const stream = createLLMStream({
          messages: llmMessages,
          model,
          signal: controller.signal,
          chunkDelayMs,
          chunkSize,
        });

        for await (const chunk of parseSSEStream(stream)) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
            );
          }
          if (chunk.choices[0]?.finish_reason === "stop") {
            break;
          }
        }

        // 获取最终消息
        setMessages((prev) => {
          const final = prev.find((m) => m.id === assistantId);
          if (final) onFinish?.(final);
          return prev;
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // 用户主动停止，安静处理
          return;
        }
        onError?.(err instanceof Error ? err : new Error(String(err)));
        // 移除空 assistant
        setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content !== ""));
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [isLoading, messages, model, systemPrompt, onError, onFinish, chunkDelayMs, chunkSize],
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const value = input.trim();
      if (!value) return;
      setInput("");
      void append(value);
    },
    [input, append],
  );

  const reset = useCallback(() => {
    stop();
    setMessages(initialMessages);
    setInput("");
  }, [stop, initialMessages]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    append,
    stop,
    reset,
    setMessages,
  };
}
