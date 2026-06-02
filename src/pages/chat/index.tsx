import { useCommandPalette } from "@/components/layouts/command-palette-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AgentDomain, ChatMessage, Conversation, SourceRef, ToolCall } from "@/lib/types";
import { randomId } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  ListTree,
  PanelRightOpen,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentSwitcher } from "./agent-switcher";
import { Composer } from "./composer";
import { ConversationList } from "./conversation-list";
import { MessageBubble } from "./message-bubble";
import { AGENTS, type ModelId, createMockStream, getMockResponse } from "./mock-data";
import { SourcesPanel } from "./sources-panel";
import { CrisisBanner, TracePanel } from "./trace-panel";

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "数据结构知识图谱",
    domain: "academic",
    updatedAt: Date.now() - 3_600_000,
    pinned: true,
  },
  { id: "c2", title: "睡眠改善建议", domain: "emotional", updatedAt: Date.now() - 86_400_000 },
  { id: "c3", title: "请假超过 3 天的流程", domain: "affairs", updatedAt: Date.now() - 86_400_000 },
  { id: "c4", title: "周末怎么安排", domain: "general", updatedAt: Date.now() - 172_800_000 },
  { id: "c5", title: "线性代数复习", domain: "academic", updatedAt: Date.now() - 7 * 86_400_000 },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  c1: [
    {
      id: randomId(),
      role: "user",
      content: "帮我梳理《数据结构》的核心知识图谱",
      createdAt: Date.now() - 60_000,
    },
    {
      id: randomId(),
      role: "assistant",
      agent: "academic",
      content: "",
      createdAt: Date.now() - 30_000,
    },
  ],
};

type RightPanel = "trace" | "sources" | null;

export default function ChatPage() {
  const [agent, setAgent] = useState<AgentDomain>("academic");
  const [model, setModel] = useState<ModelId>("claude-sonnet-4.5");
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [currentId, setCurrentId] = useState<string | null>("c1");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [streaming, setStreaming] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanel>("trace");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const openCommand = useCommandPalette((s) => s.toggle);

  // 路由第一个对话
  useEffect(() => {
    if (!currentId && conversations.length > 0) {
      setCurrentId(conversations[0].id);
    }
  }, [currentId, conversations]);

  // 自动滚到底
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const list = currentId ? (messages[currentId] ?? []) : [];
  const lastAssistant = [...list].reverse().find((m) => m.role === "assistant");
  const mockData = lastAssistant?.agent ? getMockResponse(lastAssistant.agent) : null;

  const startStream = (convId: string, domain: AgentDomain) => {
    const data = getMockResponse(domain);
    const assistantId = randomId();
    // 工具调用先全部置为 running
    const toolIds = data.tools.map(() => randomId());

    setMessages((prev) => ({
      ...prev,
      [convId]: [
        ...(prev[convId] ?? []),
        {
          id: assistantId,
          role: "assistant",
          agent: domain,
          content: "",
          createdAt: Date.now(),
        },
      ],
    }));

    setStreaming(true);

    // 模拟工具执行完成
    data.tools.forEach((_t, i) => {
      setTimeout(
        () => {
          setMessages((prev) => {
            const list = prev[convId] ?? [];
            return {
              ...prev,
              [convId]: list.map((m) => (m.id === assistantId ? { ...m } : m)),
            };
          });
          // 工具状态更新直接在右侧 TracePanel 显示
          updateTools(convId, toolIds, data.tools);
        },
        300 + i * 200,
      );
    });

    // 启动流式
    const stop = createMockStream(domain, (delta, done) => {
      setMessages((prev) => {
        const list = prev[convId] ?? [];
        return {
          ...prev,
          [convId]: list.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + delta } : m,
          ),
        };
      });
      if (done) {
        setStreaming(false);
        stopRef.current = null;
      }
    });
    stopRef.current = stop;
  };

  // 工具状态机（独立追踪）
  const [liveTools, setLiveTools] = useState<Record<string, ToolCall[]>>({});
  const updateTools = (
    _convId: string,
    ids: string[],
    defs: { name: string; input?: string; output?: string; durationMs?: number }[],
  ) => {
    setLiveTools((prev) => {
      const cur =
        prev[_convId] ??
        ids.map((id, i) => ({
          id,
          name: defs[i].name,
          status: "running" as const,
          input: defs[i].input,
        }));
      const next = cur.map((t, i) => {
        const def = defs.find((d) => d.name === t.name);
        if (def && def.output != null && t.status === "running") {
          return {
            ...t,
            status: "success" as const,
            output: def.output,
            durationMs: def.durationMs ?? 100 + i * 50,
          };
        }
        return t;
      });
      return { ...prev, [_convId]: next };
    });
  };

  const handleSend = (text: string) => {
    let convId = currentId;
    if (!convId) {
      convId = randomId();
      const newConv: Conversation = {
        id: convId,
        title: text.slice(0, 20) + (text.length > 20 ? "..." : ""),
        domain: agent,
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(convId);
      setMessages((prev) => ({ ...prev, [convId]: [] }));
    }
    // 用户消息
    setMessages((prev) => ({
      ...prev,
      [convId]: [
        ...(prev[convId] ?? []),
        { id: randomId(), role: "user", content: text, createdAt: Date.now() },
      ],
    }));
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, updatedAt: Date.now() } : c)),
    );

    // 启动 AI 流式
    setTimeout(() => startStream(convId, agent), 200);
  };

  const handleStop = () => {
    stopRef.current?.();
    setStreaming(false);
  };

  const handleFeedback = (msgId: string, v: "up" | "down") => {
    if (!currentId) return;
    setMessages((prev) => ({
      ...prev,
      [currentId]: (prev[currentId] ?? []).map((m) => (m.id === msgId ? { ...m, feedback: v } : m)),
    }));
  };

  const toolsForConv = currentId ? (liveTools[currentId] ?? []) : [];
  const sourcesForConv: SourceRef[] = (mockData?.sources ?? []).map((s) => ({
    id: s.title,
    title: s.title,
    url: s.url,
    snippet: s.snippet,
    domain: s.domain,
  }));

  // 检测危机关键词（mock）
  const hasCrisis = list.some(
    (m) => m.role === "user" && /(想死|自杀|自残|活不下去)/.test(m.content),
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 overflow-hidden rounded-lg border border-border bg-card/30">
      {/* 左侧会话列表 */}
      <ConversationList
        conversations={conversations}
        currentId={currentId}
        onSelect={setCurrentId}
        onCreate={() => {
          setCurrentId(null);
        }}
        collapsed={leftCollapsed}
      />

      {/* 中间对话流 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶部：Agent 切换 + 操作 */}
        <div className="flex h-14 items-center gap-2 border-b border-border bg-card/50 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setLeftCollapsed((v) => !v)}
            aria-label="切换会话列表"
          >
            {leftCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
          <AgentSwitcher
            current={agent}
            onChange={setAgent}
            model={model}
            onModelChange={setModel}
            streaming={streaming}
          />
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCommand()}
            className="h-8 gap-1.5 text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden md:inline">命令面板</span>
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] md:inline-flex">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant={rightPanel === "trace" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setRightPanel(rightPanel === "trace" ? null : "trace")}
          >
            <ListTree className="h-3.5 w-3.5" />
            <span className="hidden md:inline">追踪</span>
          </Button>
          <Button
            variant={rightPanel === "sources" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setRightPanel(rightPanel === "sources" ? null : "sources")}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden md:inline">引用</span>
          </Button>
        </div>

        {/* 危机横幅 */}
        {hasCrisis && (
          <div className="border-b border-border bg-background px-4 pt-3">
            <CrisisBanner />
          </div>
        )}

        {/* 消息流 */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
            {list.length === 0 ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-center">
                <div className="text-5xl">{AGENTS[agent].emoji}</div>
                <h2 className="text-lg font-semibold">开始与 {AGENTS[agent].name} 对话</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  {AGENTS[agent].description}
                </p>
                <p className="text-xs text-muted-foreground">
                  按 <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">⌘K</kbd>{" "}
                  打开命令面板跳转到任意页面
                </p>
              </div>
            ) : (
              list.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onFeedback={handleFeedback}
                  sources={
                    m.role === "assistant" && m === lastAssistant ? sourcesForConv : undefined
                  }
                  tools={m.role === "assistant" && m === lastAssistant ? toolsForConv : undefined}
                />
              ))
            )}
            {streaming && (
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
                {AGENTS[agent].name} 正在思考...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 输入区 */}
        <Composer onSend={handleSend} streaming={streaming} onStop={handleStop} agent={agent} />
      </div>

      {/* 右侧面板 */}
      {rightPanel && (
        <div className="hidden w-80 shrink-0 border-l border-border bg-card/30 lg:flex lg:flex-col">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-semibold">
              {rightPanel === "trace" ? "执行追踪" : "引用来源"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setRightPanel(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          {rightPanel === "trace" ? (
            <TracePanel tools={toolsForConv} />
          ) : (
            <SourcesPanel sources={sourcesForConv} />
          )}
        </div>
      )}
      {!rightPanel && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-6 top-20 hidden h-8 w-8 lg:flex"
          onClick={() => setRightPanel("trace")}
        >
          <PanelRightOpen className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
