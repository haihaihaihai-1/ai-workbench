import { useCommandPalette } from "@/components/layouts/command-palette-context";
import { LocaleSwitcher } from "@/components/layouts/locale-switcher";
import { NotificationCenter } from "@/components/layouts/notification-center";
import { ThemeSwitcher } from "@/components/layouts/theme-switcher";
import { ThemePicker } from "@/components/layouts/ThemePicker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { IconBell, IconSearch } from "@/components/icons"
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Topbar() {
  const openCommand = useCommandPalette((s) => s.toggle);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useNotifications((s) => s.unreadCount);
  const { t } = useTranslation();
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <>
      <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => openCommand()}
          className="group flex h-9 w-full max-w-xl items-center gap-2 rounded-md border border-input bg-background/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-background"
        >
          <IconSearch className="h-4 w-4" />
          <span className="flex-1 text-left">{t("common.search")}</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="flex-1" />

        <Badge variant="success" className="hidden gap-1.5 md:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
          {t("common.allServicesHealthy")}
        </Badge>

        <ThemeSwitcher />
        <ThemePicker />
        <LocaleSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("common.notifications")}
          onClick={() => setNotifOpen(true)}
        >
          <IconBell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground shadow-sm ring-2 ring-background">
              {badgeText}
            </span>
          )}
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground text-xs">
            {t("footer.user").charAt(0)}
          </AvatarFallback>
        </Avatar>
      </header>

      <NotificationCenter open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  );
}
