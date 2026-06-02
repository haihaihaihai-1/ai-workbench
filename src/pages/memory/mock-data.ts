import type { Memory, MemoryType } from "@/lib/types";

const now = Date.now();
const day = 86_400_000;

export const MOCK_MEMORIES: Memory[] = [
  {
    id: "m1",
    type: "fact",
    content: "用户是计算机科学专业大三学生",
    tags: ["专业", "年级"],
    confidence: 0.96,
    source: "对话提取",
    createdAt: now - 30 * day,
    pinned: true,
  },
  {
    id: "m2",
    type: "preference",
    content: "喜欢用 Python 而不是 Java 完成作业",
    tags: ["编程", "Python"],
    confidence: 0.88,
    source: "对话提取",
    createdAt: now - 25 * day,
  },
  {
    id: "m3",
    type: "event",
    content: "2024-12-15 参加了机器学习期末考试",
    tags: ["考试", "ML"],
    confidence: 0.92,
    source: "对话提取",
    createdAt: now - 20 * day,
  },
  {
    id: "m4",
    type: "skill",
    content: "熟练掌握 PyTorch，能搭建简单的 CNN",
    tags: ["ML", "PyTorch"],
    confidence: 0.85,
    source: "对话提取",
    createdAt: now - 18 * day,
  },
  {
    id: "m5",
    type: "preference",
    content: "学习时偏好结构化笔记（标题 + 列表）",
    tags: ["学习风格", "笔记"],
    confidence: 0.79,
    source: "行为分析",
    createdAt: now - 15 * day,
    pinned: true,
  },
  {
    id: "m6",
    type: "fact",
    content: "GPA 3.7/4.0，专业排名前 10%",
    tags: ["成绩", "GPA"],
    confidence: 0.94,
    source: "教务对接",
    createdAt: now - 12 * day,
  },
  {
    id: "m7",
    type: "event",
    content: "上周完成了操作系统课程设计（进程调度）",
    tags: ["OS", "课设"],
    confidence: 0.91,
    source: "对话提取",
    createdAt: now - 7 * day,
  },
  {
    id: "m8",
    type: "preference",
    content: "晚上 22:00 - 24:00 活跃度最高",
    tags: ["活跃时段"],
    confidence: 0.97,
    source: "行为分析",
    createdAt: now - 5 * day,
  },
  {
    id: "m9",
    type: "fact",
    content: "对 AI 和机器学习方向感兴趣，正在考虑读研",
    tags: ["兴趣", "升学"],
    confidence: 0.83,
    source: "对话提取",
    createdAt: now - 3 * day,
  },
  {
    id: "m10",
    type: "skill",
    content: "能熟练使用 Git、Docker、VSCode",
    tags: ["工具"],
    confidence: 0.95,
    source: "行为分析",
    createdAt: now - 2 * day,
  },
  {
    id: "m11",
    type: "event",
    content: "今天咨询了关于线性代数的复习方法",
    tags: ["线性代数", "复习"],
    confidence: 0.89,
    source: "对话提取",
    createdAt: now - 4 * 3600_000,
  },
  {
    id: "m12",
    type: "preference",
    content: "近期压力大，需要更多鼓励性反馈",
    tags: ["情绪", "心理"],
    confidence: 0.76,
    source: "情感分析",
    createdAt: now - 6 * 3600_000,
  },
];

export const MEMORY_TYPE_INFO: Record<
  MemoryType,
  { name: string; emoji: string; color: string; bgColor: string }
> = {
  fact: { name: "事实", emoji: "📌", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  preference: { name: "偏好", emoji: "💜", color: "text-violet-400", bgColor: "bg-violet-500/10" },
  event: { name: "事件", emoji: "🕐", color: "text-amber-400", bgColor: "bg-amber-500/10" },
  skill: { name: "技能", emoji: "🎯", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

export const MEMORY_STATS = {
  total: 124,
  fact: 42,
  preference: 31,
  event: 28,
  skill: 23,
  pinned: 8,
  avgConfidence: 0.87,
};

export const EMOTION_TREND = [
  { day: "周一", score: 0.62 },
  { day: "周二", score: 0.58 },
  { day: "周三", score: 0.55 },
  { day: "周四", score: 0.68 },
  { day: "周五", score: 0.72 },
  { day: "周六", score: 0.78 },
  { day: "周日", score: 0.65 },
];

export const ACTIVE_HOURS = [
  { hour: 0, count: 12 },
  { hour: 6, count: 8 },
  { hour: 9, count: 24 },
  { hour: 12, count: 18 },
  { hour: 15, count: 32 },
  { hour: 18, count: 28 },
  { hour: 21, count: 56 },
  { hour: 23, count: 78 },
];
