import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, shortNumber } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { IconChevronsLeft, IconChevronsRight, IconCircleHelp, IconLifeBuoy, IconSparkles } from "@/components/icons"
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { navGroups } from "./nav-config";

export function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const { t } = useTranslation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          // 移动端彻底隐藏，主侧边栏由 MobileDrawer 提供
          "hidden h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground shadow-md">
            <IconSparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold tracking-tight">
                {t("common.appName")}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {t("common.version")}
              </span>
            </div>
          )}
        </div>

        {/* Nav (复用 SidebarContent，移动端 drawer 也用同一组件) */}
        <SidebarContent collapsed={collapsed} />

        <Separator />

        {/* Footer */}
        <div className="flex flex-col gap-1 p-3">
          <SidebarFooterItem icon={IconLifeBuoy} label={t("footer.support")} collapsed={collapsed} />
          <SidebarFooterItem icon={IconCircleHelp} label={t("footer.help")} collapsed={collapsed} />
          <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2">
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-primary to-[#8B5CF6] text-center text-xs leading-7 text-primary-foreground">
              {t("footer.user").charAt(0)}
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-xs font-medium">{t("footer.user")}</span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {t("footer.sessions", { count: shortNumber(12) })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={toggle}
                  aria-label={t("footer.collapseSidebar")}
                >
                  <IconChevronsLeft className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="mt-1"
              onClick={toggle}
              aria-label={t("footer.expandSidebar")}
            >
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

// 抽离的导航内容组件 - 桌面端 Sidebar 与移动端 MobileDrawer 复用
export function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <ScrollArea className="flex-1">
      <nav className="flex flex-col gap-4 p-3">
        {navGroups.map((group) => (
          <div key={group.labelKey} className="flex flex-col gap-1">
            {!collapsed && (
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(group.labelKey)}
              </div>
            )}
            {group.items.map((item) => {
              const active = location.pathname === item.url;
              const Icon = item.icon;
              const title = t(item.titleKey);
              const badge = item.badgeKey ? t(item.badgeKey) : undefined;
              const link = (
                <Link
                  to={item.url}
                  onClick={onNavigate}
                  className={cn(
                    "group flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{title}</span>
                      {badge && (
                        <Badge
                          variant={badgeKeyToVariant(item.badgeKey)}
                          className="ml-auto h-4 px-1 text-[10px]"
                        >
                          {badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.url}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{title}</TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={item.url}>{link}</div>;
            })}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}

function badgeKeyToVariant(key: string | undefined): "default" | "secondary" {
  return key === "badge.core" ? "default" : "secondary";
}

function SidebarFooterItem({
  icon: Icon,
  label,
  collapsed,
}: {
  icon: typeof IconCircleHelp;
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex h-8 w-full items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <button
      type="button"
      className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
