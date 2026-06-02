import { useThemeStore } from "@/stores/theme-store";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  return { theme, setTheme, resolvedTheme };
}
