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
  title: string;
  url: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "工作区",
    items: [
      { title: "首页", url: "/", icon: LayoutDashboard },
      { title: "对话工作台", url: "/chat", icon: MessageSquare, badge: "核心" },
      { title: "记忆中心", url: "/memory", icon: Brain, badge: "核心" },
    ],
  },
  {
    label: "可观测",
    items: [
      { title: "实时监控", url: "/monitor", icon: Gauge, badge: "核心" },
      { title: "数据飞轮", url: "/flywheel", icon: ChartLine },
      { title: "数据分析", url: "/analysis", icon: Activity },
      { title: "系统评估", url: "/evaluation", icon: Target },
    ],
  },
  {
    label: "工单与协作",
    items: [
      { title: "工单中心", url: "/tickets", icon: Ticket, badge: "核心" },
      { title: "服务大厅", url: "/services", icon: ListChecks },
      { title: "反馈管理", url: "/feedback", icon: FileText },
    ],
  },
  {
    label: "管理后台",
    items: [
      { title: "用户管理", url: "/admin/users", icon: Users },
      { title: "技能管理", url: "/admin/skills", icon: Wrench },
      { title: "技能市场", url: "/skills", icon: Sparkles },
      { title: "安全监控", url: "/admin/safety", icon: ShieldCheck },
      { title: "系统设置", url: "/admin/settings", icon: Settings },
    ],
  },
];

export const commandPaletteItems = [
  {
    group: "对话",
    items: [
      { id: "chat", title: "新建对话", url: "/chat", icon: MessageSquare, shortcut: "⌘ N" },
      { id: "chat-history", title: "对话历史", url: "/chat", icon: History, shortcut: "⌘ H" },
    ],
  },
  {
    group: "页面",
    items: [
      { id: "home", title: "首页", url: "/", icon: LayoutDashboard },
      { id: "monitor", title: "实时监控", url: "/monitor", icon: Gauge },
      { id: "tickets", title: "工单中心", url: "/tickets", icon: Ticket },
      { id: "memory", title: "记忆中心", url: "/memory", icon: Brain },
      { id: "flywheel", title: "数据飞轮", url: "/flywheel", icon: ChartLine },
      { id: "evaluation", title: "系统评估", url: "/evaluation", icon: Target },
      { id: "analysis", title: "数据分析", url: "/analysis", icon: Activity },
      { id: "skills-market", title: "技能市场", url: "/skills", icon: Sparkles },
      { id: "services", title: "服务大厅", url: "/services", icon: ListChecks },
      { id: "profile", title: "个人中心", url: "/profile", icon: UserCog },
    ],
  },
  {
    group: "管理",
    items: [
      { id: "admin-users", title: "用户管理", url: "/admin/users", icon: Users },
      { id: "admin-skills", title: "技能管理", url: "/admin/skills", icon: Wrench },
      { id: "admin-safety", title: "安全监控", url: "/admin/safety", icon: ShieldCheck },
      { id: "admin-settings", title: "系统设置", url: "/admin/settings", icon: Settings },
    ],
  },
  {
    group: "操作",
    items: [
      {
        id: "action-crisis",
        title: "模拟危机干预",
        url: "/tickets?type=crisis",
        icon: CircleAlert,
      },
      { id: "action-train", title: "训练意图分类器", url: "/flywheel", icon: GraduationCap },
    ],
  },
];
