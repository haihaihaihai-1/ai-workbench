// 全局快捷键 Hook - 解析 mod+K / mod+B / mod+N / mod+1-9 / ? / Escape
// 使用 ref 缓存 handler 避免每次 render 重建监听

import { useEffect, useRef } from "react";

type HotkeyHandler = (e: KeyboardEvent) => void;
export type HotkeyMap = Record<string, HotkeyHandler>;
export type HotkeyOptions = { enableInInputs?: boolean };

// Mac 用 ⌘，其他平台用 Ctrl
const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function isTypingTarget(target: EventTarget | null): boolean {
  // input / textarea / select / contenteditable 都算"输入态"
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

type ParsedCombo = {
  key: string;
  needsMod: boolean;
  raw: string;
};

function parseCombo(combo: string): ParsedCombo {
  // 拆 + 后归一: mod/cmd/ctrl -> needsMod=true, 其余当作 key
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());
  let needsMod = false;
  let key = "";
  for (const p of parts) {
    if (p === "mod" || p === "cmd" || p === "ctrl" || p === "meta" || p === "command") {
      needsMod = true;
    } else {
      key = p;
    }
  }
  return { key, needsMod, raw: combo };
}

function matchCombo(parsed: ParsedCombo, e: KeyboardEvent): boolean {
  const { key, needsMod } = parsed;

  // 问号键在多数键盘上是 Shift+/,允许无修饰键触发
  if (key === "?") {
    return e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey;
  }

  // Escape 无修饰键
  if (key === "escape") {
    return e.key === "Escape" && !e.metaKey && !e.ctrlKey && !e.altKey;
  }

  // 修饰键组合: Mac 优先 Meta, 其他平台优先 Ctrl
  if (needsMod) {
    const modPressed = IS_MAC ? e.metaKey : e.ctrlKey;
    if (!modPressed) return false;
  } else {
    // 无修饰键组合: 排除修饰键冲突
    if (e.metaKey || e.ctrlKey) return false;
  }

  return e.key.toLowerCase() === key;
}

export function useHotkeys(map: HotkeyMap, options: HotkeyOptions = {}) {
  // 用 ref 存最新回调, 避免依赖对象导致 effect 反复执行
  const mapRef = useRef(map);
  mapRef.current = map;
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const inInput = isTypingTarget(e.target);
      const current = mapRef.current;
      const opts = optsRef.current;

      for (const combo of Object.keys(current)) {
        const parsed = parseCombo(combo);
        const isUniversal = parsed.key === "?" || parsed.key === "escape";

        // 输入态下默认不响应, 但 ? 和 Escape 总是响应
        if (inInput && !opts.enableInInputs && !isUniversal) continue;

        if (!matchCombo(parsed, e)) continue;

        e.preventDefault();
        current[combo](e);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
