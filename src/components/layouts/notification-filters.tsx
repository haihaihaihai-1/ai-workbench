import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Notification, NotificationType } from "./notification-mock-data";

export type FilterKey = "all" | NotificationType;

type Props = {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  notifications: Notification[];
};

const TABS: { key: FilterKey; labelKey: string }[] = [
  { key: "all", labelKey: "notification.filter.all" },
  { key: "system", labelKey: "notification.filter.system" },
  { key: "ticket", labelKey: "notification.filter.ticket" },
  { key: "feedback", labelKey: "notification.filter.feedback" },
  { key: "crisis", labelKey: "notification.filter.crisis" },
];

export function NotificationFilters({ active, onChange, notifications }: Props) {
  const { t } = useTranslation();
  const countOf = (key: FilterKey) =>
    key === "all" ? notifications.length : notifications.filter((n) => n.type === key).length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TABS.map((tab) => {
        const count = countOf(tab.key);
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {t(tab.labelKey)}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] tabular-nums",
                isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
