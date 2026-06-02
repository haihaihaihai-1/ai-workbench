import {
  Activity,
  Brain,
  ChartLine,
  CircleAlert,
  FileText,
  Gauge,
  GraduationCap,
  History,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Ticket,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  titleKey: string;
  url: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
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
      { titleKey: "nav.home", url: "/", icon: LayoutDashboard },
      { titleKey: "nav.chat", url: "/chat", icon: MessageSquare, badgeKey: "badge.core" },
      { titleKey: "nav.memory", url: "/memory", icon: Brain, badgeKey: "badge.core" },
    ],
  },
  {
    labelKey: "nav.group.observability",
    items: [
      { titleKey: "nav.monitor", url: "/monitor", icon: Gauge, badgeKey: "badge.core" },
      { titleKey: "nav.flywheel", url: "/flywheel", icon: ChartLine },
      { titleKey: "nav.analysis", url: "/analysis", icon: Activity },
      { titleKey: "nav.evaluation", url: "/evaluation", icon: Target },
    ],
  },
  {
    labelKey: "nav.group.ticketsCollab",
    items: [
      { titleKey: "nav.tickets", url: "/tickets", icon: Ticket, badgeKey: "badge.core" },
      { titleKey: "nav.services", url: "/services", icon: ListChecks },
      { titleKey: "nav.feedback", url: "/feedback", icon: FileText },
    ],
  },
  {
    labelKey: "nav.group.admin",
    items: [
      { titleKey: "nav.adminUsers", url: "/admin/users", icon: Users },
      { titleKey: "nav.adminSkills", url: "/admin/skills", icon: Wrench },
      { titleKey: "nav.skillsMarket", url: "/skills", icon: Sparkles },
      { titleKey: "nav.adminSafety", url: "/admin/safety", icon: ShieldCheck },
      { titleKey: "nav.adminSettings", url: "/admin/settings", icon: Settings },
    ],
  },
];

export type CommandItem = {
  id: string;
  titleKey: string;
  url: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
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
      { id: "chat", titleKey: "chat.newChat", url: "/chat", icon: MessageSquare, shortcut: "⌘ N" },
      {
        id: "chat-history",
        titleKey: "chat.chatHistory",
        url: "/chat",
        icon: History,
        shortcut: "⌘ H",
      },
    ],
  },
  {
    groupKey: "command.group.pages",
    items: [
      { id: "home", titleKey: "nav.home", url: "/", icon: LayoutDashboard },
      { id: "monitor", titleKey: "nav.monitor", url: "/monitor", icon: Gauge },
      { id: "tickets", titleKey: "nav.tickets", url: "/tickets", icon: Ticket },
      { id: "memory", titleKey: "nav.memory", url: "/memory", icon: Brain },
      { id: "flywheel", titleKey: "nav.flywheel", url: "/flywheel", icon: ChartLine },
      { id: "evaluation", titleKey: "nav.evaluation", url: "/evaluation", icon: Target },
      { id: "analysis", titleKey: "nav.analysis", url: "/analysis", icon: Activity },
      { id: "skills-market", titleKey: "nav.skillsMarket", url: "/skills", icon: Sparkles },
      { id: "services", titleKey: "nav.services", url: "/services", icon: ListChecks },
      { id: "profile", titleKey: "nav.profile", url: "/profile", icon: UserCog },
    ],
  },
  {
    groupKey: "command.group.admin",
    items: [
      { id: "admin-users", titleKey: "nav.adminUsers", url: "/admin/users", icon: Users },
      { id: "admin-skills", titleKey: "nav.adminSkills", url: "/admin/skills", icon: Wrench },
      { id: "admin-safety", titleKey: "nav.adminSafety", url: "/admin/safety", icon: ShieldCheck },
      {
        id: "admin-settings",
        titleKey: "nav.adminSettings",
        url: "/admin/settings",
        icon: Settings,
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
        icon: CircleAlert,
      },
      {
        id: "action-train",
        titleKey: "command.action.train",
        url: "/flywheel",
        icon: GraduationCap,
      },
    ],
  },
];
