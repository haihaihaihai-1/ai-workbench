import { AppShell } from "@/components/layouts/app-shell";
import { useThemeStore } from "@/stores/theme-store";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

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
