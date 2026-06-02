// 响应式媒体查询 hook - 监听 viewport 变化
// SSR 安全: 无 window 时返回初始值

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // 立即同步一次（处理首屏 / 异步 hydration）
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

// 常用断点快捷方式（与 Tailwind 的 md / lg 对齐）
export const MOBILE_BREAKPOINT = "(max-width: 767px)";
export const TABLET_BREAKPOINT = "(min-width: 768px) and (max-width: 1023px)";
export const DESKTOP_BREAKPOINT = "(min-width: 1024px)";

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_BREAKPOINT);
}
