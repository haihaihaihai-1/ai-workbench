import type { Conversation } from "@/lib/types";
import { useChatStore } from "@/stores/chat-store";
import { beforeEach, describe, expect, it } from "vitest";

const newConv = (id: string, title = "新会话"): Conversation => ({
  id,
  title,
  domain: "general",
  updatedAt: Date.now(),
});

describe("chat-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // 重置到默认 5 条
    const now = Date.now();
    useChatStore.setState({
      conversations: [
        {
          id: "c1",
          title: "数据结构知识图谱",
          domain: "academic",
          updatedAt: now - 3_600_000,
          pinned: true,
        },
        { id: "c2", title: "睡眠改善建议", domain: "emotional", updatedAt: now - 86_400_000 },
        { id: "c3", title: "请假超过 3 天的流程", domain: "affairs", updatedAt: now - 86_400_000 },
        { id: "c4", title: "周末怎么安排", domain: "general", updatedAt: now - 172_800_000 },
        { id: "c5", title: "线性代数复习", domain: "academic", updatedAt: now - 7 * 86_400_000 },
      ],
      currentId: "c1",
      sidebarCollapsed: false,
    });
  });

  it("默认 currentId = 'c1' 且 conversations 含 5 条", () => {
    const s = useChatStore.getState();
    expect(s.currentId).toBe("c1");
    expect(s.conversations.length).toBe(5);
  });

  it("addConversation 在头部插入", () => {
    const before = useChatStore.getState().conversations.length;
    useChatStore.getState().addConversation(newConv("c-new", "新"));
    const s = useChatStore.getState();
    expect(s.conversations.length).toBe(before + 1);
    expect(s.conversations[0].id).toBe("c-new");
  });

  it("deleteConversation 按 id 移除", () => {
    useChatStore.getState().deleteConversation("c2");
    const ids = useChatStore.getState().conversations.map((c) => c.id);
    expect(ids).not.toContain("c2");
  });

  it("deleteConversation 删除当前会话时清空 currentId", () => {
    useChatStore.setState({ currentId: "c2" });
    useChatStore.getState().deleteConversation("c2");
    expect(useChatStore.getState().currentId).toBeNull();
  });

  it("deleteConversation 不影响其他会话的 currentId", () => {
    useChatStore.setState({ currentId: "c1" });
    useChatStore.getState().deleteConversation("c3");
    expect(useChatStore.getState().currentId).toBe("c1");
  });

  it("updateConversation 合并 patch", () => {
    useChatStore.getState().updateConversation("c2", { title: "新标题", pinned: true });
    const target = useChatStore.getState().conversations.find((c) => c.id === "c2");
    expect(target?.title).toBe("新标题");
    expect(target?.pinned).toBe(true);
  });

  it("setCurrentId 设置当前会话", () => {
    useChatStore.getState().setCurrentId("c3");
    expect(useChatStore.getState().currentId).toBe("c3");
  });

  it("toggleSidebar 切换 sidebarCollapsed", () => {
    useChatStore.getState().toggleSidebar();
    expect(useChatStore.getState().sidebarCollapsed).toBe(true);
    useChatStore.getState().toggleSidebar();
    expect(useChatStore.getState().sidebarCollapsed).toBe(false);
  });

  it("持久化包含 conversations / currentId / sidebarCollapsed", () => {
    useChatStore.getState().setCurrentId("c4");
    useChatStore.getState().toggleSidebar();
    const raw = window.localStorage.getItem("ai-workbench-chat");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.state.currentId).toBe("c4");
    expect(parsed.state.sidebarCollapsed).toBe(true);
    expect(Array.isArray(parsed.state.conversations)).toBe(true);
  });
});
