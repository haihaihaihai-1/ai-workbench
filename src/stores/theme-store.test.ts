import { useThemeStore } from "@/stores/theme-store";
import { beforeEach, describe, expect, it } from "vitest";

describe("theme-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useThemeStore.setState({ theme: "dark", resolvedTheme: "dark" });
  });

  it("默认 dark", () => {
    const s = useThemeStore.getState();
    expect(s.theme).toBe("dark");
    expect(s.resolvedTheme).toBe("dark");
  });

  it("setTheme('light') 切换到 light", () => {
    useThemeStore.getState().setTheme("light");
    const s = useThemeStore.getState();
    expect(s.theme).toBe("light");
    expect(s.resolvedTheme).toBe("light");
  });

  it("setTheme('dark') 切换到 dark", () => {
    useThemeStore.getState().setTheme("light");
    useThemeStore.getState().setTheme("dark");
    const s = useThemeStore.getState();
    expect(s.theme).toBe("dark");
    expect(s.resolvedTheme).toBe("dark");
  });

  it("setTheme('system') 时 resolvedTheme 跟随系统", () => {
    // jsdom 默认 matchMedia.matches = false ⇒ light
    useThemeStore.getState().setTheme("system");
    const s = useThemeStore.getState();
    expect(s.theme).toBe("system");
    expect(s.resolvedTheme).toBe("light");
  });

  it("setResolvedTheme 直接覆写", () => {
    useThemeStore.getState().setResolvedTheme("light");
    expect(useThemeStore.getState().resolvedTheme).toBe("light");
  });

  it("setSystemResolved 仅在 theme=system 时更新", () => {
    useThemeStore.getState().setTheme("light");
    useThemeStore.getState().setResolvedTheme("dark");
    useThemeStore.getState().setSystemResolved();
    // theme=light → 不应刷新
    expect(useThemeStore.getState().resolvedTheme).toBe("dark");
  });

  it("持久化 key 为 'ai-workbench-theme'", () => {
    useThemeStore.getState().setTheme("light");
    const raw = window.localStorage.getItem("ai-workbench-theme");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.state.theme).toBe("light");
  });
});
