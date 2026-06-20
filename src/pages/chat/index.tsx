import {
  IconChevronsLeft,
  IconChevronsRight,
  IconFileText,
  IconListTree,
  IconPanelRightOpen,
  IconSparkles,
  IconX,
} from "@/components/icons";
import { useCommandPalette } from "@/components/layouts/command-palette-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-media-query";
import type { AgentDomain, ChatMessage, Conversation, SourceRef, ToolCall } from "@/lib/types";
import { cn, randomId } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { useEffect, useRef, useState } from "react";
import { AgentSwitcher } from "./agent-switcher";
import { Composer } from "./composer";
import { ConversationList } from "./conversation-list";
import { MessageBubble } from "./message-bubble";
import { AGENTS, type ModelId, createMockStream, getMockResponse } from "./mock-data";
import { SourcesPanel } from "./sources-panel";
import { CrisisBanner, TracePanel } from "./trace-panel";

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
  const isMobile = useIsMobile();
  const [agent, setAgent] = useState<AgentDomain>("academic");
  const [model, setModel] = useState<ModelId>("claude-sonnet-4.5");
  // 会话列表与当前选中来自持久化 store
  const conversations = useChatStore((s) => s.conversations);
  const currentId = useChatStore((s) => s.currentId);
  const setCurrentId = useChatStore((s) => s.setCurrentId);
  const addConversation = useChatStore((s) => s.addConversation);
  const updateConversation = useChatStore((s) => s.updateConversation);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [streaming, setStreaming] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanel>("trace");
  // 移动端默认折叠会话列表（仅图标），桌面端默认展开
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(isMobile);
  const stopRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const openCommand = useCommandPalette((s) => s.toggle);

  // 移动端 / 桌面端切换时同步默认折叠状态
  useEffect(() => {
    setLeftCollapsed(isMobile);
  }, [isMobile]);

  /* ChatGPT 风格快捷键:
   * - Cmd/Ctrl + Shift + O  →  新建对话
   * - Cmd/Ctrl + Shift + S  →  切换左侧会话列表
   * - Esc                   →  关闭右侧详情面板
   */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const k = e.key.toLowerCase();
      if (k === "o" && e.shiftKey) {
        e.preventDefault();
        // TODO: 触发新建对话
      } else if (k === "s" && e.shiftKey) {
        e.preventDefault();
        setLeftCollapsed((v) => !v);
      } else if (k === "b" && e.shiftKey) {
        // ChatGPT: Cmd+B 切侧边栏
        e.preventDefault();
        setLeftCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // 持久化数据为空时回退到第一个示例会话
  useEffect(() => {
    if (!currentId && conversations.length > 0) {
      setCurrentId(conversations[0].id);
    }
  }, [currentId, conversations, setCurrentId]);

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
    let convId: string;
    if (currentId) {
      convId = currentId;
    } else {
      convId = randomId();
      const newConv: Conversation = {
        id: convId,
        title: text.slice(0, 20) + (text.length > 20 ? "..." : ""),
        domain: agent,
        updatedAt: Date.now(),
      };
      addConversation(newConv);
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
    updateConversation(convId, { updatedAt: Date.now() });

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
    <div
      className={cn(
        "flex gap-0 overflow-hidden rounded-lg border border-border bg-card/30",
        // 桌面端固定高度（视口 - topbar - main padding），移动端交给内容自然撑高
        "h-[calc(100vh-3.5rem-3rem)] md:h-[calc(100vh-3.5rem-3rem)]",
        isMobile && "h-[calc(100vh-3.5rem-3.5rem-0.5rem)]",
      )}
    >
      {/* 左侧会话列表 - 移动端彻底隐藏（图标也省了），桌面端保留折叠/展开 */}
      <div className={cn("hidden md:flex", isMobile ? "hidden" : "")}>
        <ConversationList
          conversations={conversations}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreate={() => {
            setCurrentId(null);
          }}
          collapsed={leftCollapsed}
        />
      </div>

      {/* 中间对话流 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶部：Agent 切换 + 操作 */}
        <div className="flex h-14 items-center gap-1 border-b border-border bg-card/50 px-2 md:gap-2 md:px-4">
          {/* 移动端：会话列表入口按钮（唤起 MobileConvSheet） */}
          <MobileConvSheet
            conversations={conversations}
            currentId={currentId}
            onSelect={(id) => {
              setCurrentId(id);
            }}
            onCreate={() => {
              setCurrentId(null);
            }}
          />

          {/* 桌面端：折叠/展开侧栏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 md:inline-flex"
            onClick={() => setLeftCollapsed((v) => !v)}
            aria-label="切换会话列表"
          >
            {leftCollapsed ? (
              <IconChevronsRight className="h-4 w-4" />
            ) : (
              <IconChevronsLeft className="h-4 w-4" />
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
            className="hidden h-8 gap-1.5 text-muted-foreground md:inline-flex"
          >
            <IconSparkles className="h-3.5 w-3.5" />
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
            <IconListTree className="h-3.5 w-3.5" />
            <span className="hidden md:inline">追踪</span>
          </Button>
          <Button
            variant={rightPanel === "sources" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setRightPanel(rightPanel === "sources" ? null : "sources")}
          >
            <IconFileText className="h-3.5 w-3.5" />
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
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
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

      {/* 右侧面板 - 桌面端侧栏 / 移动端底部 Sheet */}
      {rightPanel && !isMobile && (
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
              <IconX className="h-3.5 w-3.5" />
            </Button>
          </div>
          {rightPanel === "trace" ? (
            <TracePanel tools={toolsForConv} />
          ) : (
            <SourcesPanel sources={sourcesForConv} />
          )}
        </div>
      )}
      {!rightPanel && !isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-6 top-20 hidden h-8 w-8 lg:flex"
          onClick={() => setRightPanel("trace")}
        >
          <IconPanelRightOpen className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* 移动端右侧面板 - 底部 Sheet */}
      {isMobile && (
        <Dialog open={rightPanel !== null} onOpenChange={(o) => !o && setRightPanel(null)}>
          <DialogContent
            className={cn(
              "fixed bottom-0 left-0 right-0 top-auto z-50 max-h-[80vh] w-full -translate-x-0 -translate-y-0 gap-0 rounded-t-xl border-t border-border p-0",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
              "duration-300",
            )}
          >
            <DialogTitle className="sr-only">
              {rightPanel === "trace" ? "执行追踪" : "引用来源"}
            </DialogTitle>
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-muted" />
                <span className="text-sm font-semibold">
                  {rightPanel === "trace" ? "执行追踪" : "引用来源"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setRightPanel(null)}
                aria-label="关闭"
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
            {rightPanel === "trace" ? (
              <TracePanel tools={toolsForConv} />
            ) : (
              <SourcesPanel sources={sourcesForConv} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// 移动端会话列表 - 左侧滑入的 Drawer
// 仅在 < 768px 渲染（父级控制显示）
function MobileConvSheet({
  conversations,
  currentId,
  onSelect,
  onCreate,
}: {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="打开会话列表"
      >
        <IconListTree className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-[80vw] max-w-[320px] -translate-x-0 -translate-y-0 gap-0 rounded-none border-r border-border p-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "duration-300",
            "[&>button.absolute]:hidden",
          )}
        >
          <DialogTitle className="sr-only">会话列表</DialogTitle>
          <ConversationList
            conversations={conversations}
            currentId={currentId}
            onSelect={(id) => {
              onSelect(id);
              setOpen(false);
            }}
            onCreate={() => {
              onCreate();
              setOpen(false);
            }}
            collapsed={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
