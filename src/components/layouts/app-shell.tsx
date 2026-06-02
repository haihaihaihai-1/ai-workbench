// 应用外壳 - 集成全局快捷键 + 命令面板 + 快捷键帮助弹窗

import { Toaster } from "@/components/ui/sonner";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { ShortcutsHelpDialog, useShortcutsHelp } from "@/hooks/use-shortcuts-help";
import { pageVariants } from "@/lib/motion-presets";
import { useSidebarStore } from "@/stores/sidebar-store";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CommandPalette } from "./command-palette";
import { useCommandPalette } from "./command-palette-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

// mod+1..9 数字键跳转映射
const NAV_HOTKEYS: Array<[string, string]> = [
  ["1", "/"],
  ["2", "/chat"],
  ["3", "/memory"],
  ["4", "/monitor"],
  ["5", "/tickets"],
  ["6", "/flywheel"],
  ["7", "/evaluation"],
  ["8", "/analysis"],
  ["9", "/skills"],
];

// 全局快捷键: 命令面板 / 侧边栏 / 跳页 / 帮助
function GlobalHotkeys() {
  const navigate = useNavigate();
  const setPaletteOpen = useCommandPalette((s) => s.setOpen);
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const setShortcutsOpen = useShortcutsHelp((s) => s.setOpen);

  // 数字键跳转 map 在 hook 内部按需构建
  const navMap: Record<string, () => void> = Object.fromEntries(
    NAV_HOTKEYS.map(([num, path]) => [`mod+${num}`, () => navigate(path)]),
  );

  useHotkeys({
    "mod+k": () => setPaletteOpen(true),
    "mod+b": () => toggleSidebar(),
    "mod+n": () => navigate("/chat"),
    "?": () => setShortcutsOpen(true),
    ...navMap,
  });
  return null;
}

// Escape 关闭顶层全局弹窗 (命令面板 / 快捷键帮助)
function GlobalEscape() {
  const paletteOpen = useCommandPalette((s) => s.open);
  const setPaletteOpen = useCommandPalette((s) => s.setOpen);
  const shortcutsOpen = useShortcutsHelp((s) => s.open);
  const setShortcutsOpen = useShortcutsHelp((s) => s.setOpen);

  useHotkeys({
    escape: () => {
      if (paletteOpen) setPaletteOpen(false);
      else if (shortcutsOpen) setShortcutsOpen(false);
    },
  });
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <GlobalHotkeys />
      <GlobalEscape />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="will-change-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
      <ShortcutsHelpDialog />
      <Toaster richColors position="top-right" />
    </div>
  );
}
