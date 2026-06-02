import type { AgentDomain } from "@/lib/types";

const now = Date.now();

export const recentConversations: (import("@/lib/types").Conversation & {
  preview: string;
  messageCount: number;
})[] = [
  {
    id: "p1",
    title: "数据结构知识图谱复习",
    domain: "academic",
    updatedAt: now - 3 * 3600_000,
    preview: "需要梳理《数据结构》核心知识图谱...",
    messageCount: 12,
  },
  {
    id: "p2",
    title: "最近压力大想倾诉",
    domain: "emotional",
    updatedAt: now - 5 * 3600_000,
    preview: "最近总感觉睡不好...",
    messageCount: 8,
  },
  {
    id: "p3",
    title: "请假 3 天流程",
    domain: "affairs",
    updatedAt: now - 26 * 3600_000,
    preview: "想回家参加家人葬礼...",
    messageCount: 6,
  },
  {
    id: "p4",
    title: "周末怎么安排",
    domain: "general",
    updatedAt: now - 3 * 86_400_000,
    preview: "周末想平衡复习和休息...",
    messageCount: 4,
  },
];

export type FeedbackItem = {
  id: string;
  conversationTitle: string;
  domain: AgentDomain;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: number;
  status: "pending" | "processed";
};

export const myFeedbacks: FeedbackItem[] = [
  {
    id: "f1",
    conversationTitle: "数据结构知识图谱复习",
    domain: "academic",
    rating: 5,
    tags: ["有帮助"],
    comment: "梳理得很清楚，复习效率提高很多",
    createdAt: now - 2 * 3600_000,
    status: "processed",
  },
  {
    id: "f2",
    conversationTitle: "请假 3 天流程",
    domain: "affairs",
    rating: 4,
    tags: ["准确"],
    comment: "流程基本准确",
    createdAt: now - 24 * 3600_000,
    status: "processed",
  },
  {
    id: "f3",
    conversationTitle: "周末怎么安排",
    domain: "general",
    rating: 3,
    tags: ["一般"],
    comment: "建议比较常规，希望更有针对性",
    createdAt: now - 3 * 86_400_000,
    status: "pending",
  },
];

export type FavoriteItem = {
  id: string;
  title: string;
  excerpt: string;
  domain: AgentDomain;
  createdAt: number;
};

export const myFavorites: FavoriteItem[] = [
  {
    id: "fv1",
    title: "线性代数复习方法",
    excerpt: "按题型分三轮 + 错题本策略...",
    domain: "academic",
    createdAt: now - 5 * 86_400_000,
  },
  {
    id: "fv2",
    title: "睡眠改善方案",
    excerpt: "固定作息 + 睡前 1h 远离手机...",
    domain: "emotional",
    createdAt: now - 7 * 86_400_000,
  },
  {
    id: "fv3",
    title: "请假申请模板",
    excerpt: "标准请假申请文本 + 注意事项...",
    domain: "affairs",
    createdAt: now - 10 * 86_400_000,
  },
  {
    id: "fv4",
    title: "时间管理四象限",
    excerpt: "重要 × 紧急 的科学分配...",
    domain: "general",
    createdAt: now - 14 * 86_400_000,
  },
];
