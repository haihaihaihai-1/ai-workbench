import { IconActivity, IconBrain, IconChartLine, IconCircleAlert, IconFileText, IconGauge, IconGraduationCap, IconHistory, IconLayoutDashboard, IconListChecks, IconMessageSquare, IconSettings, IconShieldCheck, IconSparkles, IconTarget, IconTicket, IconUserCog, IconUsers, IconWrench } from "@/components/icons"
import type { IconComponent } from "@/components/icons";
import type { ComponentType } from "react";

export type NavItem = {
  titleKey: string;
  url: string;
  icon: IconComponent | ComponentType<{ className?: string }>;
  badgeKey?: string;
};

export type NavGroup = {
  labelKey: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    labelKey: "nav.group.workspace",
    items: [
      { titleKey: "nav.home", url: "/", icon: IconLayoutDashboard },
      { titleKey: "nav.chat", url: "/chat", icon: IconMessageSquare, badgeKey: "badge.core" },
      { titleKey: "nav.memory", url: "/memory", icon: IconBrain, badgeKey: "badge.core" },
    ],
  },
  {
    labelKey: "nav.group.observability",
    items: [
      { titleKey: "nav.monitor", url: "/monitor", icon: IconGauge, badgeKey: "badge.core" },
      { titleKey: "nav.flywheel", url: "/flywheel", icon: IconChartLine },
      { titleKey: "nav.analysis", url: "/analysis", icon: IconActivity },
      { titleKey: "nav.evaluation", url: "/evaluation", icon: IconTarget },
    ],
  },
  {
    labelKey: "nav.group.ticketsCollab",
    items: [
      { titleKey: "nav.tickets", url: "/tickets", icon: IconTicket, badgeKey: "badge.core" },
      { titleKey: "nav.services", url: "/services", icon: IconListChecks },
      { titleKey: "nav.feedback", url: "/feedback", icon: IconFileText },
    ],
  },
  {
    labelKey: "nav.group.admin",
    items: [
      { titleKey: "nav.adminUsers", url: "/admin/users", icon: IconUsers },
      { titleKey: "nav.adminSkills", url: "/admin/skills", icon: IconWrench },
      { titleKey: "nav.skillsMarket", url: "/skills", icon: IconSparkles },
      { titleKey: "nav.adminSafety", url: "/admin/safety", icon: IconShieldCheck },
      { titleKey: "nav.adminSettings", url: "/admin/settings", icon: IconSettings },
    ],
  },
];

export type CommandItem = {
  id: string;
  titleKey: string;
  url: string;
  icon: IconComponent | ComponentType<{ className?: string }>;
  shortcut?: string;
};

export type CommandGroup = {
  groupKey: string;
  items: CommandItem[];
};

export const commandPaletteItems: CommandGroup[] = [
  {
    groupKey: "command.group.chat",
    items: [
      { id: "chat", titleKey: "chat.newChat", url: "/chat", icon: IconMessageSquare, shortcut: "⌘ N" },
      {
        id: "chat-history",
        titleKey: "chat.chatHistory",
        url: "/chat",
        icon: IconHistory,
        shortcut: "⌘ H",
      },
    ],
  },
  {
    groupKey: "command.group.pages",
    items: [
      { id: "home", titleKey: "nav.home", url: "/", icon: IconLayoutDashboard },
      { id: "monitor", titleKey: "nav.monitor", url: "/monitor", icon: IconGauge },
      { id: "tickets", titleKey: "nav.tickets", url: "/tickets", icon: IconTicket },
      { id: "memory", titleKey: "nav.memory", url: "/memory", icon: IconBrain },
      { id: "flywheel", titleKey: "nav.flywheel", url: "/flywheel", icon: IconChartLine },
      { id: "evaluation", titleKey: "nav.evaluation", url: "/evaluation", icon: IconTarget },
      { id: "analysis", titleKey: "nav.analysis", url: "/analysis", icon: IconActivity },
      { id: "skills-market", titleKey: "nav.skillsMarket", url: "/skills", icon: IconSparkles },
      { id: "services", titleKey: "nav.services", url: "/services", icon: IconListChecks },
      { id: "profile", titleKey: "nav.profile", url: "/profile", icon: IconUserCog },
    ],
  },
  {
    groupKey: "command.group.admin",
    items: [
      { id: "admin-users", titleKey: "nav.adminUsers", url: "/admin/users", icon: IconUsers },
      { id: "admin-skills", titleKey: "nav.adminSkills", url: "/admin/skills", icon: IconWrench },
      { id: "admin-safety", titleKey: "nav.adminSafety", url: "/admin/safety", icon: IconShieldCheck },
      {
        id: "admin-settings",
        titleKey: "nav.adminSettings",
        url: "/admin/settings",
        icon: IconSettings,
      },
    ],
  },
  {
    groupKey: "command.group.actions",
    items: [
      {
        id: "action-crisis",
        titleKey: "command.action.crisis",
        url: "/tickets?type=crisis",
        icon: IconCircleAlert,
      },
      {
        id: "action-train",
        titleKey: "command.action.train",
        url: "/flywheel",
        icon: IconGraduationCap,
      },
    ],
  },
];
