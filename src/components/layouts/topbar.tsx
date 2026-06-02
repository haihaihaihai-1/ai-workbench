import { useCommandPalette } from "@/components/layouts/command-palette-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme-store";
import { Bell, Moon, Search, Sun } from "lucide-react";

export function Topbar() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const openCommand = useCommandPalette((s) => s.toggle);

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 px-4">
      {/* Search / Command */}
      <button
        type="button"
        onClick={() => openCommand()}
        className="group flex h-9 w-full max-w-xl items-center gap-2 rounded-md border border-input bg-background/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-background"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">搜索页面、功能、对话...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Quick actions */}
      <Badge variant="success" className="hidden gap-1.5 md:inline-flex">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
        所有服务正常
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="切换主题"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative" aria-label="通知">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
      </Button>

      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground text-xs">
          许
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
