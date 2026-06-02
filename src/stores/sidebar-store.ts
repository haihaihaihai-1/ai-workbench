import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  // 桌面端主侧边栏折叠状态
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
  // 移动端抽屉开关
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (v: boolean) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
};

// 持久化主侧边栏折叠状态 - 刷新后保持用户偏好
// 移动端抽屉状态不持久化（每次进入移动端应默认关闭）
export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
      mobileDrawerOpen: false,
      setMobileDrawerOpen: (mobileDrawerOpen) => set({ mobileDrawerOpen }),
      openMobileDrawer: () => set({ mobileDrawerOpen: true }),
      closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
    }),
    {
      name: "ai-workbench-sidebar",
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
);
