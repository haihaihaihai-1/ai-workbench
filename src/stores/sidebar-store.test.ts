import { useSidebarStore } from "@/stores/sidebar-store";
import { beforeEach, describe, expect, it } from "vitest";

describe("sidebar-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useSidebarStore.setState({ collapsed: false, mobileDrawerOpen: false });
  });

  it("默认 collapsed=false", () => {
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("toggle() 切换 collapsed", () => {
    const s = useSidebarStore.getState();
    s.toggle();
    expect(useSidebarStore.getState().collapsed).toBe(true);
    s.toggle();
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("setCollapsed(true/false) 直接设置", () => {
    useSidebarStore.getState().setCollapsed(true);
    expect(useSidebarStore.getState().collapsed).toBe(true);
    useSidebarStore.getState().setCollapsed(false);
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("移动端 drawer: 默认关闭", () => {
    expect(useSidebarStore.getState().mobileDrawerOpen).toBe(false);
  });

  it("openMobileDrawer / closeMobileDrawer 切换", () => {
    useSidebarStore.getState().openMobileDrawer();
    expect(useSidebarStore.getState().mobileDrawerOpen).toBe(true);
    useSidebarStore.getState().closeMobileDrawer();
    expect(useSidebarStore.getState().mobileDrawerOpen).toBe(false);
  });

  it("setMobileDrawerOpen 接受布尔值", () => {
    useSidebarStore.getState().setMobileDrawerOpen(true);
    expect(useSidebarStore.getState().mobileDrawerOpen).toBe(true);
  });

  it("持久化只保留 collapsed 字段 (partialize)", () => {
    useSidebarStore.getState().setCollapsed(true);
    useSidebarStore.getState().openMobileDrawer();
    const raw = window.localStorage.getItem("ai-workbench-sidebar");
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.state.collapsed).toBe(true);
    // mobileDrawerOpen 不参与持久化
    expect(parsed.state.mobileDrawerOpen).toBeUndefined();
  });
});
