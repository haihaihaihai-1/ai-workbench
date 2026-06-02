import { type ResolvedTheme, type Theme, useThemeStore } from "@/stores/theme-store";
import { useEffect } from "react";

type UseThemeReturn = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
};

export function useTheme(): UseThemeReturn {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setSystemResolved = useThemeStore((s) => s.setSystemResolved);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setSystemResolved();
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, [setSystemResolved]);

  return { theme, setTheme, resolvedTheme };
}
