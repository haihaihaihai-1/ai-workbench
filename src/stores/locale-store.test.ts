import { useLocaleStore } from "@/stores/locale-store";
import { beforeEach, describe, expect, it } from "vitest";

describe("locale-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useLocaleStore.setState({ locale: "zh" });
  });

  it("默认 locale = 'zh'", () => {
    expect(useLocaleStore.getState().locale).toBe("zh");
  });

  it("setLocale('en') 切换到 en", () => {
    useLocaleStore.getState().setLocale("en");
    expect(useLocaleStore.getState().locale).toBe("en");
  });

  it("setLocale('zh') 切换到 zh", () => {
    useLocaleStore.getState().setLocale("en");
    useLocaleStore.getState().setLocale("zh");
    expect(useLocaleStore.getState().locale).toBe("zh");
  });

  it("toggle() 在 zh / en 之间切换", () => {
    useLocaleStore.getState().toggle();
    expect(useLocaleStore.getState().locale).toBe("en");
    useLocaleStore.getState().toggle();
    expect(useLocaleStore.getState().locale).toBe("zh");
  });

  it("持久化 key 为 'ai-workbench-locale'", () => {
    useLocaleStore.getState().setLocale("en");
    const raw = window.localStorage.getItem("ai-workbench-locale");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.state.locale).toBe("en");
  });
});
