import { useHotkeys } from "@/hooks/use-hotkeys";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

function fireKey(opts: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
}) {
  const ev = new KeyboardEvent("keydown", {
    key: opts.key,
    metaKey: !!opts.metaKey,
    ctrlKey: !!opts.ctrlKey,
    altKey: !!opts.altKey,
    bubbles: true,
  });
  if (opts.target) {
    Object.defineProperty(ev, "target", { value: opts.target, configurable: true });
  }
  act(() => {
    window.dispatchEvent(ev);
  });
  return ev;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useHotkeys", () => {
  it("按下注册的 mod+b 触发回调", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    fireKey({ key: "b", ctrlKey: true });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("小写键名 + 大写 e.key 也能匹配 (lowercase 比较)", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        k: cb,
      }),
    );
    // 不带修饰键, 大写 e.key 应被归一化匹配
    fireKey({ key: "K" });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("不带 mod 时不会触发 mod+b", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    fireKey({ key: "b" });
    expect(cb).not.toHaveBeenCalled();
  });

  it("未注册的按键不触发任何回调", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    fireKey({ key: "x", ctrlKey: true });
    expect(cb).not.toHaveBeenCalled();
  });

  it("输入框 (INPUT) 内不触发业务快捷键", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    const input = document.createElement("input");
    fireKey({ key: "b", ctrlKey: true, target: input });
    expect(cb).not.toHaveBeenCalled();
  });

  it("输入框 (TEXTAREA) 内不触发业务快捷键", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    const ta = document.createElement("textarea");
    fireKey({ key: "b", ctrlKey: true, target: ta });
    expect(cb).not.toHaveBeenCalled();
  });

  it("输入框内仍可触发 Escape", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        escape: cb,
      }),
    );
    const input = document.createElement("input");
    fireKey({ key: "Escape", target: input });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("输入框内仍可触发 ?", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "?": cb,
      }),
    );
    const input = document.createElement("input");
    fireKey({ key: "?", target: input });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("enableInInputs=true 时输入框内也能触发", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys(
        {
          "mod+b": cb,
        },
        { enableInInputs: true },
      ),
    );
    const input = document.createElement("input");
    fireKey({ key: "b", ctrlKey: true, target: input });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("回调会收到原始事件", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    const ev = fireKey({ key: "b", ctrlKey: true });
    expect(cb).toHaveBeenCalledWith(ev);
  });

  it("调用了 preventDefault (jsdom 中以调用次数判定)", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    const preventDefaultSpy = vi.spyOn(KeyboardEvent.prototype, "preventDefault");
    fireKey({ key: "b", ctrlKey: true });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("组件卸载后不再响应", () => {
    const cb = vi.fn();
    const { unmount } = renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    unmount();
    fireKey({ key: "b", ctrlKey: true });
    expect(cb).not.toHaveBeenCalled();
  });

  it("contenteditable=true 的元素被识别为输入态 (jsdom 支持)", () => {
    const cb = vi.fn();
    renderHook(() =>
      useHotkeys({
        "mod+b": cb,
      }),
    );
    const div = document.createElement("div");
    Object.defineProperty(div, "isContentEditable", {
      configurable: true,
      get: () => true,
    });
    fireKey({ key: "b", ctrlKey: true, target: div });
    expect(cb).not.toHaveBeenCalled();
  });
});
