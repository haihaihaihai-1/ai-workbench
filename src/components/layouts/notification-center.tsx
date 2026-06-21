import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { IconBell, IconCheckCheck, IconInbox, IconX } from "@/components/icons"
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type FilterKey, NotificationFilters } from "./notification-filters";
import { NotificationItem } from "./notification-item";
import type { Notification, NotificationType } from "./notification-mock-data";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NotificationCenter({ open, onOpenChange }: Props) {
  const items = useNotifications((s) => s.items);
  const unreadCount = useNotifications((s) => s.unreadCount);
  const markRead = useNotifications((s) => s.markRead);
  const markAllRead = useNotifications((s) => s.markAllRead);
  const [filter, setFilter] = useState<FilterKey>("all");
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((n) => (n.type as NotificationType) === filter);
  }, [items, filter]);

  const handleSelect = (n: Notification) => {
    markRead(n.id);
    if (n.url) {
      onOpenChange(false);
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", n.url);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "fixed left-auto right-0 top-0 z-50 h-full w-full max-w-md translate-x-0 translate-y-0 gap-0 border-l p-0 shadow-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "duration-300",
          "[&>button.absolute]:hidden",
        )}
      >
        <DialogTitle className="sr-only">{t("notification.title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("notification.description")}</DialogDescription>

        <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <IconBell className="h-4 w-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{t("notification.title")}</span>
              <span className="text-[11px] text-muted-foreground">
                {unreadCount > 0
                  ? t("notification.unreadCount", { count: unreadCount })
                  : t("notification.allRead")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <IconCheckCheck className="h-3.5 w-3.5" />
              {t("notification.allRead")}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={t("notification.close")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="border-b border-border px-4 py-3">
          <NotificationFilters active={filter} onChange={setFilter} notifications={items} />
        </div>

        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 px-4 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <IconInbox className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-foreground">{t("notification.empty.title")}</p>
              <p className="text-xs text-muted-foreground">{t("notification.empty.hint")}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1 p-2">
              {filtered.map((n) => (
                <li key={n.id}>
                  <NotificationItem notification={n} onSelect={handleSelect} />
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
