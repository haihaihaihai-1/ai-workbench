// 聊天会话状态持久化 Store
// 只持久化元数据 (会话列表 + 当前选中 + 聊天页侧边栏折叠)
// 消息内容不持久化, 每次进入页面重新加载

import type { Conversation } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 默认示例会话 - 模块加载时计算一次时间戳
const now = Date.now();
const DEFAULT_CONVERSATIONS: Conversation[] = [
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
];

export type ChatStore = {
  conversations: Conversation[];
  currentId: string | null;
  sidebarCollapsed: boolean;
  setConversations: (c: Conversation[]) => void;
  setCurrentId: (id: string | null) => void;
  addConversation: (c: Conversation) => void;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversations: DEFAULT_CONVERSATIONS,
      currentId: "c1",
      sidebarCollapsed: false,
      setConversations: (conversations) => set({ conversations }),
      setCurrentId: (currentId) => set({ currentId }),
      addConversation: (c) => set((s) => ({ conversations: [c, ...s.conversations] })),
      updateConversation: (id, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          currentId: s.currentId === id ? null : s.currentId,
        })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: "ai-workbench-chat",
      // 只持久化元数据字段, 不影响 setXxx 等方法名
      partialize: (state) => ({
        conversations: state.conversations,
        currentId: state.currentId,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
