import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

// 持久化主侧边栏折叠状态 - 刷新后保持用户偏好
export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    { name: "ai-workbench-sidebar" },
  ),
);
