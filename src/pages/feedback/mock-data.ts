import type { AgentDomain } from "@/lib/types";

const now = Date.now();

export type Feedback = {
  id: string;
  sessionId: string;
  user: string;
  domain: AgentDomain;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: number;
  status: "pending" | "processed";
  aiReply: string;
  userMessage: string;
};

export const FEEDBACKS: Feedback[] = [
  {
    id: "fb1",
    sessionId: "c-8234",
    user: "user_8234",
    domain: "academic",
    rating: 5,
    tags: ["有帮助", "准确"],
    comment: "知识图谱梳理得特别清晰，复习效率翻倍。",
    createdAt: now - 12 * 60_000,
    status: "pending",
    aiReply: "针对你的问题，我从课程知识图谱和历年考试数据出发...",
    userMessage: "帮我梳理《数据结构》的核心知识图谱",
  },
  {
    id: "fb2",
    sessionId: "c-1290",
    user: "user_1290",
    domain: "emotional",
    rating: 4,
    tags: ["有帮助"],
    comment: "建议比较实用，会继续尝试。",
    createdAt: now - 45 * 60_000,
    status: "pending",
    aiReply: "听起来你最近承受了不小的压力...",
    userMessage: "最近总是睡不好，作业堆积让我喘不过气",
  },
  {
    id: "fb3",
    sessionId: "c-4521",
    user: "user_4521",
    domain: "affairs",
    rating: 2,
    tags: ["不准确", "需要改进"],
    comment: "流程跟实际有出入，缺少一些细节。",
    createdAt: now - 2 * 3600_000,
    status: "pending",
    aiReply: "关于请假流程，按照《学生手册 2024 版》第 5 章规定...",
    userMessage: "请假超过 3 天的具体流程是什么？",
  },
  {
    id: "fb4",
    sessionId: "c-7782",
    user: "user_7782",
    domain: "academic",
    rating: 5,
    tags: ["有帮助", "准确", "清晰"],
    comment: "讲解非常透彻，举例也很贴切。",
    createdAt: now - 4 * 3600_000,
    status: "processed",
    aiReply: "线性代数的核心是空间变换的视角...",
    userMessage: "线性代数的本质是什么？",
  },
  {
    id: "fb5",
    sessionId: "c-3451",
    user: "user_3451",
    domain: "general",
    rating: 3,
    tags: ["一般"],
    comment: "回答有点泛，希望更具体。",
    createdAt: now - 6 * 3600_000,
    status: "processed",
    aiReply: "我理解你的问题了。让我从通用角度给你一些思路...",
    userMessage: "帮我想想周末怎么安排",
  },
  {
    id: "fb6",
    sessionId: "c-9981",
    user: "user_9981",
    domain: "emotional",
    rating: 5,
    tags: ["有帮助", "温暖"],
    comment: "感谢倾听，感觉好多了。",
    createdAt: now - 24 * 3600_000,
    status: "processed",
    aiReply: "我能理解你现在的感受，压力大是很正常的...",
    userMessage: "我最近感觉特别孤独",
  },
  {
    id: "fb7",
    sessionId: "c-1234",
    user: "user_1234",
    domain: "academic",
    rating: 5,
    tags: ["有帮助", "表扬"],
    comment: "回答超出预期，特别有条理！",
    createdAt: now - 2 * 86_400_000,
    status: "processed",
    aiReply: "机器学习入门可以按以下路径推进...",
    userMessage: "机器学习怎么入门？",
  },
  {
    id: "fb8",
    sessionId: "c-5678",
    user: "user_5678",
    domain: "affairs",
    rating: 1,
    tags: ["不准", "答非所问"],
    comment: "完全没有回答我的问题。",
    createdAt: now - 3 * 86_400_000,
    status: "pending",
    aiReply: "我理解你的问题了...",
    userMessage: "奖学金申请的具体条件",
  },
];

export const FEEDBACK_STATS = {
  total: 86,
  avgRating: 4.2,
  positiveRate: 82.4,
  pending: 4,
  distribution: [
    { star: 5, count: 38 },
    { star: 4, count: 22 },
    { star: 3, count: 14 },
    { star: 2, count: 8 },
    { star: 1, count: 4 },
  ],
  trend: Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    positive: 8 + Math.floor(Math.random() * 8),
    negative: 1 + Math.floor(Math.random() * 4),
  })),
};
