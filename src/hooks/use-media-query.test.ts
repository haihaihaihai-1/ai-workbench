import { useMediaQuery } from "@/hooks/use-media-query";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (e: { matches: boolean }) => void;

class MockMediaQueryList {
  matches: boolean;
  media: string;
  private listeners: Listener[] = [];
  constructor(query: string, initial: boolean) {
    this.media = query;
    this.matches = initial;
  }
  addEventListener = vi.fn((_event: string, cb: Listener) => {
    this.listeners.push(cb);
  });
  removeEventListener = vi.fn((_event: string, cb: Listener) => {
    this.listeners = this.listeners.filter((l) => l !== cb);
  });
  trigger(matches: boolean) {
    this.matches = matches;
    for (const l of this.listeners) l({ matches });
  }
}

let mql: MockMediaQueryList;

beforeEach(() => {
  mql = new MockMediaQueryList("(max-width: 767px)", false);
  vi.spyOn(window, "matchMedia").mockImplementation(
    (() => mql) as unknown as typeof window.matchMedia,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMediaQuery", () => {
  it("初始 matches=false 时返回 false", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(false);
  });

  it("初始 matches=true 时返回 true", () => {
    mql.matches = true;
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(true);
  });

  it("媒体查询变化时更新返回值", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(false);
    act(() => {
      mql.trigger(true);
    });
    expect(result.current).toBe(true);
    act(() => {
      mql.trigger(false);
    });
    expect(result.current).toBe(false);
  });

  it("组件卸载时移除监听器", () => {
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalled();
  });
});
