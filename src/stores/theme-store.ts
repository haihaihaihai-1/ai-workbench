import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  setResolvedTheme: (t: ResolvedTheme) => void;
  setSystemResolved: () => void;
};

const computeSystemResolved = (): ResolvedTheme => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: (theme) => {
        if (theme === "system") {
          set({ theme, resolvedTheme: computeSystemResolved() });
        } else {
          set({ theme, resolvedTheme: theme });
        }
      },
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      setSystemResolved: () => {
        if (get().theme === "system") {
          set({ resolvedTheme: computeSystemResolved() });
        }
      },
    }),
    {
      name: "ai-workbench-theme",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.theme === "system") {
          state.resolvedTheme = computeSystemResolved();
        } else {
          state.resolvedTheme = state.theme;
        }
      },
    },
  ),
);
