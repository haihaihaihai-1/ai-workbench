import type { AgentDomain, Conversation, Ticket, TicketPriority } from "@/lib/types";

const now = Date.now();

// 首页今日概览指标
export const HOME_OVERVIEW = {
  todayConversations: 28,
  totalConversations: 1248,
  avgResponseMs: 720,
  flywheelHealth: 87, // 0-100
};

// 飞轮健康度子指标
export const FLYWHEEL_SUB_METRICS = [
  { label: "用户满意度", value: 4.6, suffix: "/ 5", percent: 92, tone: "success" as const },
  { label: "数据回流率", value: 76.4, suffix: "%", percent: 76, tone: "info" as const },
  { label: "模型对齐度", value: 89.2, suffix: "%", percent: 89, tone: "primary" as const },
  { label: "知识新鲜度", value: 91, suffix: "%", percent: 91, tone: "success" as const },
];

// 最近对话 - 复用 chat 中的 conversation 风格
export const RECENT_CONVERSATIONS: (Conversation & { preview: string; messageCount: number })[] = [
  {
    id: "rc1",
    title: "数据结构知识图谱复习",
    preview: "需要梳理《数据结构》核心知识图谱，覆盖线性表/树/图...",
    domain: "academic",
    updatedAt: now - 8 * 60_000,
    pinned: true,
    messageCount: 12,
  },
  {
    id: "rc2",
    title: "最近压力大想倾诉",
    preview: "最近总感觉睡不好，作业堆积让我有点喘不过气...",
    domain: "emotional",
    updatedAt: now - 42 * 60_000,
    messageCount: 8,
  },
  {
    id: "rc3",
    title: "请假 3 天流程",
    preview: "想回家参加家人葬礼，请假超过 3 天的流程是什么？",
    domain: "affairs",
    updatedAt: now - 3 * 3600_000,
    messageCount: 6,
  },
  {
    id: "rc4",
    title: "周末怎么安排学习",
    preview: "周末想平衡复习和休息，帮我列个简单计划...",
    domain: "general",
    updatedAt: now - 5 * 3600_000,
    messageCount: 4,
  },
  {
    id: "rc5",
    title: "操作系统进程调度",
    preview: "对比 FCFS、SJF、RR 三种调度算法的优缺点...",
    domain: "academic",
    updatedAt: now - 26 * 3600_000,
    messageCount: 15,
  },
];

// 待办工单（精简版） - 来自 tickets 体系
export const PENDING_TICKETS: Pick<
  Ticket,
  "id" | "code" | "title" | "type" | "priority" | "updatedAt" | "reporter" | "assignee"
>[] = [
  {
    id: "pt1",
    code: "CW-1024",
    title: "学生申请缓考 - 操作系统课程",
    type: "hitl",
    priority: "high",
    updatedAt: now - 5 * 60_000,
    reporter: "user_8234",
    assignee: "王老师",
  },
  {
    id: "pt2",
    code: "CW-1023",
    title: "【危机】学生表达轻生念头",
    type: "crisis",
    priority: "urgent",
    updatedAt: now - 1 * 60_000,
    reporter: "user_1290",
    assignee: "李咨询师",
  },
  {
    id: "pt3",
    code: "CW-1022",
    title: "用户对 AI 回答质量不满",
    type: "complaint",
    priority: "medium",
    updatedAt: now - 30 * 60_000,
    reporter: "user_4521",
    assignee: undefined,
  },
  {
    id: "pt4",
    code: "CW-1021",
    title: "路由分析异常 - 高频 general 兜底",
    type: "feedback",
    priority: "high",
    updatedAt: now - 22 * 60_000,
    reporter: "system",
    assignee: "张工程师",
  },
  {
    id: "pt5",
    code: "CW-1018",
    title: "用户请求删除对话历史",
    type: "complaint",
    priority: "low",
    updatedAt: now - 1 * 3600_000,
    reporter: "user_9981",
    assignee: undefined,
  },
];

// 实时事件流
export type HomeEvent = {
  id: string;
  type: "info" | "warning" | "success" | "error";
  icon: string;
  title: string;
  detail?: string;
  ts: number;
};

export const RECENT_EVENTS: HomeEvent[] = [
  {
    id: "ev1",
    type: "info",
    icon: "💬",
    title: "学业助手完成 1 次工具调用",
    detail: "knowledge_search 返回 5 条结果 · 234ms",
    ts: now - 2 * 60_000,
  },
  {
    id: "ev2",
    type: "warning",
    icon: "🛡",
    title: "安全拦截 - 提示注入尝试",
    detail: "user_1290 触发，已阻断",
    ts: now - 6 * 60_000,
  },
  {
    id: "ev3",
    type: "success",
    icon: "🧠",
    title: "记忆已合并 3 条相似条目",
    detail: "置信度提升 0.78 → 0.92",
    ts: now - 18 * 60_000,
  },
  {
    id: "ev4",
    type: "info",
    icon: "🎯",
    title: "飞轮训练批次完成",
    detail: "本批 1240 条反馈已用于增量训练",
    ts: now - 35 * 60_000,
  },
  {
    id: "ev5",
    type: "error",
    icon: "⚠",
    title: "工具超时 - calendar_query",
    detail: "P99 超过 5s，自动重试成功",
    ts: now - 52 * 60_000,
  },
  {
    id: "ev6",
    type: "info",
    icon: "✨",
    title: "新技能上架 - 论文速读",
    detail: "由安全团队审核通过",
    ts: now - 78 * 60_000,
  },
  {
    id: "ev7",
    type: "success",
    icon: "📊",
    title: "数据飞轮指标刷新",
    detail: "对齐度 89.2% (+1.4)",
    ts: now - 120 * 60_000,
  },
  {
    id: "ev8",
    type: "warning",
    icon: "🧾",
    title: "工单 CW-1023 已升级 L3",
    detail: "危机干预类型，已分配李咨询师",
    ts: now - 145 * 60_000,
  },
];

// Agent 表情与颜色（与 chat 同步）
export const AGENT_VISUAL: Record<AgentDomain, { emoji: string; color: string; name: string }> = {
  academic: { emoji: "📚", color: "#3B82F6", name: "学业助手" },
  emotional: { emoji: "💚", color: "#10B981", name: "心理助手" },
  affairs: { emoji: "📋", color: "#F59E0B", name: "教务助手" },
  general: { emoji: "✨", color: "#8B5CF6", name: "通用助手" },
};

// 工单类型 - 复用 tickets 体系
export const TICKET_TYPE_META: Record<string, { icon: string; name: string }> = {
  hitl: { icon: "🤝", name: "HITL" },
  crisis: { icon: "🚨", name: "危机" },
  complaint: { icon: "😤", name: "投诉" },
  feedback: { icon: "💬", name: "反馈" },
};

// 工单优先级映射 Badge variant
export const PRIORITY_VARIANT: Record<
  TicketPriority,
  "destructive" | "warning" | "info" | "secondary"
> = {
  urgent: "destructive",
  high: "warning",
  medium: "info",
  low: "secondary",
};

export const PRIORITY_NAME: Record<TicketPriority, string> = {
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低",
};
