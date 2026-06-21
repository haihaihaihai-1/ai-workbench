/**
 * MobileNav · 移动端底部 Tab Bar（4 个核心页面）
 *
 * 借皮：iOS/Android 原生 Tab Bar + 微信底部导航
 * - 始终渲染组件，通过 md:hidden 在桌面端隐藏
 * - 父级不需额外控制，使用 useIsMobile 可在桌面端跳过无意义的 active 计算（性能优化）
 *
 * i18n: tab label 使用 useTranslation 注入，支持中英文切换
 */

import { IconBrain, IconGauge, IconMessageSquare, IconTicket } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

type Tab = {
  href: string;
  labelKey: string;
  icon: typeof IconMessageSquare;
};

const TABS: Tab[] = [
  { href: "/chat", labelKey: "nav.chat", icon: IconMessageSquare },
  { href: "/memory", labelKey: "nav.memory", icon: IconBrain },
  { href: "/monitor", labelKey: "nav.monitor", icon: IconGauge },
  { href: "/tickets", labelKey: "nav.tickets", icon: IconTicket },
];

function isActiveTab(pathname: string, href: string): boolean {
  // 严格匹配 - 避免 /chat 与 /tickets 互相误匹配
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("nav.mobileAriaLabel")}
      className={cn(
        "flex h-14 shrink-0 items-stretch justify-around border-t border-border bg-background/95 backdrop-blur md:hidden",
        // 桌面端完全隐藏（包括占位）
        "md:hidden",
      )}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActiveTab(location.pathname, tab.href);
        return (
          <Link
            key={tab.href}
            to={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
            <span>{t(tab.labelKey)}</span>
            {active && <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
