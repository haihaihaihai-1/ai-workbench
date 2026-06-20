// 快捷键帮助弹窗 + 状态 Hook
// 通过 useShortcutsHelp() 暴露 open / setOpen / toggle
// 在 app-shell 中渲染 <ShortcutsHelpDialog />

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconCommand, IconKeyboard, IconSidebar, IconSparkles, IconXCircle } from "@/components/icons"
import { create } from "zustand";

type ShortcutsHelpStore = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

export const useShortcutsHelp = create<ShortcutsHelpStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));

// 展示的快捷键列表 - 6 个核心快捷键
const SHORTCUTS = [
  { key: "⌘ K", description: "打开命令面板", icon: IconCommand },
  { key: "⌘ B", description: "切换侧边栏", icon: IconSidebar },
  { key: "⌘ N", description: "跳转到对话", icon: IconSparkles },
  { key: "⌘ 1-9", description: "快速切换页面", icon: IconKeyboard },
  { key: "?", description: "查看快捷键帮助", icon: IconKeyboard },
  { key: "Esc", description: "关闭弹窗", icon: IconXCircle },
];

export function ShortcutsHelpDialog() {
  const open = useShortcutsHelp((s) => s.open);
  const setOpen = useShortcutsHelp((s) => s.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconKeyboard className="h-4 w-4 text-primary" />
            键盘快捷键
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="flex items-center gap-2.5 rounded-md border border-border bg-card/40 p-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-xs text-foreground/80">{s.description}</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {s.key}
                </kbd>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground">在 Windows / Linux 上 ⌘ 替换为 Ctrl</p>
      </DialogContent>
    </Dialog>
  );
}
