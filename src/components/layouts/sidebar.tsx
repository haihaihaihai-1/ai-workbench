import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, shortNumber } from "@/lib/utils";
import type { CurrentUser } from "@/stores/auth-store";
import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { IconChevronsRight, IconCircleHelp, IconLifeBuoy, IconArrowRight, IconSparkles } from "@/components/icons"
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navGroups } from "./nav-config";

function hasRole(user: CurrentUser | null, allowed: UserRole[] | undefined): boolean {
  if (!allowed) return true;
  if (!user) return false;
  return allowed.includes(user.role);
}

export function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
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

        <SidebarContent collapsed={collapsed} />

        <Separator />

        <div className="flex flex-col gap-1 p-3">
          <SidebarFooterItem icon={IconLifeBuoy} label={t("footer.support")} collapsed={collapsed} />
          <SidebarFooterItem icon={IconCircleHelp} label={t("footer.help")} collapsed={collapsed} />
          {user && (
            <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-primary to-[#8B5CF6] text-center text-xs leading-7 text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <>
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium">{user.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {ROLE_LABEL[user.role]} · {shortNumber(user.sessions ?? 0)} 会话
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleLogout}
                    aria-label="登出"
                  >
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          )}
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

const ROLE_LABEL: Record<UserRole, string> = {
  student: "学生",
  teacher: "教师",
  admin: "管理员",
  counselor: "咨询师",
};

export function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  return (
    <ScrollArea className="flex-1">
      <nav className="flex flex-col gap-4 p-3">
        {navGroups.map((group) => {
          if (!hasRole(user, group.roles)) return null;
          const visibleItems = group.items.filter((item) => hasRole(user, item.roles));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.labelKey} className="flex flex-col gap-1">
              {!collapsed && (
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.labelKey)}
                </div>
              )}
              {visibleItems.map((item) => {
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
          );
        })}
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
