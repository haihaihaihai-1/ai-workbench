import { IconActivity, IconBrain, IconChartLine, IconCircleAlert, IconFileText, IconGauge, IconGraduationCap, IconHistory, IconLayoutDashboard, IconListChecks, IconMessageSquare, IconSettings, IconShieldCheck, IconSparkles, IconTarget, IconTicket, IconUserCog, IconUsers, IconWrench } from "@/components/icons"
import type { IconComponent } from "@/components/icons";
import type { UserRole } from "@/lib/types";
import type { ComponentType } from "react";

export type NavItem = {
  titleKey: string;
  url: string;
  icon: IconComponent | ComponentType<{ className?: string }>;
  badgeKey?: string;
  roles?: UserRole[];
};

export type NavGroup = {
  labelKey: string;
  items: NavItem[];
  roles?: UserRole[];
};

const ALL: UserRole[] | undefined = undefined;
const STAFF: UserRole[] = ["teacher", "counselor", "admin"];
const ADMIN: UserRole[] = ["admin"];

export const navGroups: NavGroup[] = [
  {
    labelKey: "nav.group.workspace",
    items: [
      { titleKey: "nav.home", url: "/", icon: IconLayoutDashboard, roles: ALL },
      { titleKey: "nav.chat", url: "/chat", icon: IconMessageSquare, badgeKey: "badge.core", roles: ALL },
      { titleKey: "nav.memory", url: "/memory", icon: IconBrain, badgeKey: "badge.core", roles: ALL },
    ],
  },
  {
    labelKey: "nav.group.observability",
    roles: STAFF,
    items: [
      { titleKey: "nav.monitor", url: "/monitor", icon: IconGauge, badgeKey: "badge.core", roles: STAFF },
      { titleKey: "nav.flywheel", url: "/flywheel", icon: IconChartLine, roles: STAFF },
      { titleKey: "nav.analysis", url: "/analysis", icon: IconActivity, roles: STAFF },
      { titleKey: "nav.evaluation", url: "/evaluation", icon: IconTarget, roles: STAFF },
    ],
  },
  {
    labelKey: "nav.group.ticketsCollab",
    roles: STAFF,
    items: [
      { titleKey: "nav.tickets", url: "/tickets", icon: IconTicket, badgeKey: "badge.core", roles: STAFF },
      { titleKey: "nav.services", url: "/services", icon: IconListChecks, roles: ALL },
      { titleKey: "nav.feedback", url: "/feedback", icon: IconFileText, roles: STAFF },
    ],
  },
  {
    labelKey: "nav.group.admin",
    roles: ADMIN,
    items: [
      { titleKey: "nav.adminUsers", url: "/admin/users", icon: IconUsers, roles: ADMIN },
      { titleKey: "nav.adminSkills", url: "/admin/skills", icon: IconWrench, roles: ADMIN },
      { titleKey: "nav.skillsMarket", url: "/skills", icon: IconSparkles, roles: ALL },
      { titleKey: "nav.adminSafety", url: "/admin/safety", icon: IconShieldCheck, roles: ADMIN },
      { titleKey: "nav.adminSettings", url: "/admin/settings", icon: IconSettings, roles: ADMIN },
    ],
  },
];

export type CommandItem = {
  id: string;
  titleKey: string;
  url: string;
  icon: IconComponent | ComponentType<{ className?: string }>;
  shortcut?: string;
  roles?: UserRole[];
};

export type CommandGroup = {
  groupKey: string;
  items: CommandItem[];
  roles?: UserRole[];
};

export const commandPaletteItems: CommandGroup[] = [
  {
    groupKey: "command.group.chat",
    items: [
      { id: "chat", titleKey: "chat.newChat", url: "/chat", icon: IconMessageSquare, shortcut: "⌘ N", roles: ALL },
      {
        id: "chat-history",
        titleKey: "chat.chatHistory",
        url: "/chat",
        icon: IconHistory,
        shortcut: "⌘ H",
        roles: ALL,
      },
    ],
  },
  {
    groupKey: "command.group.pages",
    items: [
      { id: "home", titleKey: "nav.home", url: "/", icon: IconLayoutDashboard, roles: ALL },
      { id: "monitor", titleKey: "nav.monitor", url: "/monitor", icon: IconGauge, roles: STAFF },
      { id: "tickets", titleKey: "nav.tickets", url: "/tickets", icon: IconTicket, roles: STAFF },
      { id: "memory", titleKey: "nav.memory", url: "/memory", icon: IconBrain, roles: ALL },
      { id: "flywheel", titleKey: "nav.flywheel", url: "/flywheel", icon: IconChartLine, roles: STAFF },
      { id: "evaluation", titleKey: "nav.evaluation", url: "/evaluation", icon: IconTarget, roles: STAFF },
      { id: "analysis", titleKey: "nav.analysis", url: "/analysis", icon: IconActivity, roles: STAFF },
      { id: "skills-market", titleKey: "nav.skillsMarket", url: "/skills", icon: IconSparkles, roles: ALL },
      { id: "services", titleKey: "nav.services", url: "/services", icon: IconListChecks, roles: ALL },
      { id: "profile", titleKey: "nav.profile", url: "/profile", icon: IconUserCog, roles: ALL },
    ],
  },
  {
    groupKey: "command.group.admin",
    roles: ADMIN,
    items: [
      { id: "admin-users", titleKey: "nav.adminUsers", url: "/admin/users", icon: IconUsers, roles: ADMIN },
      { id: "admin-skills", titleKey: "nav.adminSkills", url: "/admin/skills", icon: IconWrench, roles: ADMIN },
      { id: "admin-safety", titleKey: "nav.adminSafety", url: "/admin/safety", icon: IconShieldCheck, roles: ADMIN },
      {
        id: "admin-settings",
        titleKey: "nav.adminSettings",
        url: "/admin/settings",
        icon: IconSettings,
        roles: ADMIN,
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
        roles: STAFF,
      },
      {
        id: "action-train",
        titleKey: "command.action.train",
        url: "/flywheel",
        icon: IconGraduationCap,
        roles: STAFF,
      },
    ],
  },
];
