import { cn, relativeTime } from "@/lib/utils";
import { IconAlertTriangle, IconInbox, IconMessageSquare, IconTicket } from "@/components/icons"
import type { IconComponent } from "@/components/icons";
import { useTranslation } from "react-i18next";
import type { Notification, NotificationType } from "./notification-mock-data";

const TYPE_META: Record<
  NotificationType,
  { icon: IconComponent; tone: string; labelKey: string }
> = {
  system: {
    icon: IconInbox,
    tone: "text-info bg-info/10 border-info/30",
    labelKey: "notification.type.system",
  },
  ticket: {
    icon: IconTicket,
    tone: "text-primary bg-primary/10 border-primary/30",
    labelKey: "notification.type.ticket",
  },
  feedback: {
    icon: IconMessageSquare,
    tone: "text-success bg-success/10 border-success/30",
    labelKey: "notification.type.feedback",
  },
  crisis: {
    icon: IconAlertTriangle,
    tone: "text-destructive bg-destructive/10 border-destructive/30",
    labelKey: "notification.type.crisis",
  },
};

type Props = {
  notification: Notification;
  onSelect: (n: Notification) => void;
};

export function NotificationItem({ notification, onSelect }: Props) {
  const meta = TYPE_META[notification.type];
  const Icon = meta.icon;
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-md border border-transparent px-3 py-2.5 text-left transition-colors",
        "hover:border-border hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {notification.read ? null : (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
        />
      )}

      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
          meta.tone,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-sm",
              notification.read
                ? "font-normal text-foreground/80"
                : "font-semibold text-foreground",
            )}
          >
            {notification.title}
          </span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {relativeTime(notification.ts)}
          </span>
        </span>
        <span className="line-clamp-2 text-xs text-muted-foreground">{notification.detail}</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
          {t(meta.labelKey)}
          {notification.read ? null : (
            <span className="ml-2 inline-flex items-center gap-1 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("notification.unread")}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
