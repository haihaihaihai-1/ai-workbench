import { AppShell } from "@/components/layouts/app-shell";
import { useThemeStore } from "@/stores/theme-store";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.setProperty("color-scheme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.themeMode = theme;
  }, [theme]);

  return (
    <AppShell>
      <Routes>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </AppShell>
  );
}
