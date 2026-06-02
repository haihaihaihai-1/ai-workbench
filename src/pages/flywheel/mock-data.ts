// 数据飞轮 - Mock 数据

const now = Date.now();
const day = 86_400_000;

// 7 天对话趋势
export const CONVERSATION_TREND = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now - (6 - i) * day);
  const label = `${d.getMonth() + 1}/${d.getDate()}`;
  return {
    day: label,
    conversations: 4200 + Math.round(Math.sin(i / 2) * 800 + Math.random() * 400),
    users: 1200 + Math.round(Math.cos(i / 2) * 300 + Math.random() * 150),
    success: 92 + Math.round(Math.sin(i / 3) * 4 + Math.random() * 2),
  };
});

// 反馈趋势（7 天）
export const FEEDBACK_TREND = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now - (6 - i) * day);
  return {
    day: `${d.getMonth() + 1}/${d.getDate()}`,
    positive: 320 + Math.round(Math.sin(i / 2) * 60 + Math.random() * 40),
    negative: 28 + Math.round(Math.cos(i / 3) * 8 + Math.random() * 6),
    neutral: 92 + Math.round(Math.sin(i / 4) * 15 + Math.random() * 10),
  };
});

// 意图分布变化（横向条形图，对比当前 vs 7 天前）
export const INTENT_CHANGE = [
  { intent: "academic.course", current: 1820, previous: 1620 },
  { intent: "academic.exam", current: 1240, previous: 1100 },
  { intent: "academic.homework", current: 1100, previous: 980 },
  { intent: "emotional.support", current: 980, previous: 720 },
  { intent: "general.chitchat", current: 1560, previous: 1480 },
  { intent: "affairs.leave", current: 720, previous: 680 },
  { intent: "emotional.test", current: 420, previous: 380 },
  { intent: "affairs.scholarship", current: 380, previous: 360 },
];

// 飞轮健康度 - 4 个核心评分
export const HEALTH_SCORES = {
  overall: 87,
  intentCoverage: 84,
  feedbackQuality: 91,
  responseQuality: 88,
};

// 关键指标卡（今日）
export const KEY_METRICS = {
  todayConversations: 6240,
  activeUsers: 1820,
  avgRounds: 4.7,
  successRate: 96.3,
  prevTodayConversations: 5820,
  prevActiveUsers: 1740,
  prevAvgRounds: 4.4,
  prevSuccessRate: 95.8,
};

// 意图覆盖（高/中/低 置信度）
export const INTENT_COVERAGE = [
  { name: "高置信度 (≥0.85)", value: 6840, color: "#10B981" },
  { name: "中置信度 (0.7-0.85)", value: 2120, color: "#F59E0B" },
  { name: "低置信度 (<0.7)", value: 480, color: "#EF4444" },
];

// 新发现意图候选
export type NewIntent = {
  id: string;
  name: string;
  count: number;
  confidence: number;
  category: "academic" | "emotional" | "affairs" | "general";
  examples: string[];
};

export const NEW_INTENTS: NewIntent[] = [
  {
    id: "ni1",
    name: "academic.career_planning",
    count: 184,
    confidence: 0.82,
    category: "academic",
    examples: ["毕业后想往 AI 方向发展", "如何准备保研面试", "考公还是读研"],
  },
  {
    id: "ni2",
    name: "emotional.peer_pressure",
    count: 142,
    confidence: 0.78,
    category: "emotional",
    examples: ["室友都很优秀压力很大", "看到同学拿到 offer 焦虑"],
  },
  {
    id: "ni3",
    name: "affairs.dorm_change",
    count: 98,
    confidence: 0.86,
    category: "affairs",
    examples: ["申请调宿舍流程", "和室友关系紧张想换宿舍"],
  },
  {
    id: "ni4",
    name: "academic.thesis_writing",
    count: 76,
    confidence: 0.74,
    category: "academic",
    examples: ["毕业论文文献综述怎么写", "查重率太高怎么办"],
  },
  {
    id: "ni5",
    name: "general.entertainment",
    count: 65,
    confidence: 0.69,
    category: "general",
    examples: ["最近有什么好看的电影", "推荐几本书"],
  },
  {
    id: "ni6",
    name: "emotional.relationship",
    count: 52,
    confidence: 0.81,
    category: "emotional",
    examples: ["和男朋友异地很难熬", "和父母沟通问题"],
  },
];

// 工具健康度报告
export const TOOL_HEALTH_REPORT = [
  { name: "image_gen", calls: 180, errorRate: 5.0, timeoutRate: 4.5, p99: 4820 },
  { name: "translation", calls: 420, errorRate: 3.5, timeoutRate: 2.4, p99: 2140 },
  { name: "calendar_query", calls: 560, errorRate: 2.1, timeoutRate: 1.8, p99: 1820 },
  { name: "policy_lookup", calls: 980, errorRate: 1.4, timeoutRate: 0.6, p99: 980 },
  { name: "knowledge_search", calls: 2340, errorRate: 0.8, timeoutRate: 1.2, p99: 1240 },
  { name: "exam_stats", calls: 1240, errorRate: 0.5, timeoutRate: 0.3, p99: 540 },
  { name: "emotion_detect", calls: 720, errorRate: 0.0, timeoutRate: 0.0, p99: 320 },
];

// 优化建议
export type OptimizationSuggestion = {
  id: string;
  title: string;
  category: "intent" | "tool" | "prompt" | "data";
  priority: "high" | "medium" | "low";
  impact: string;
  detail: string;
  effort: "S" | "M" | "L";
};

export const OPTIMIZATION_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    id: "op1",
    title: "新增 academic.career_planning 意图",
    category: "intent",
    priority: "high",
    impact: "提升 2.1% 意图覆盖率",
    detail: "近 7 天累计 184 条与职业规划相关的查询被归到 general，建议训练专门的意图分类器。",
    effort: "M",
  },
  {
    id: "op2",
    title: "优化 image_gen 工具超时配置",
    category: "tool",
    priority: "high",
    impact: "降低 4.5% 工具超时率",
    detail: "image_gen P99 达 4.8s，建议增加超时阈值至 8s，或引入异步队列。",
    effort: "S",
  },
  {
    id: "op3",
    title: "扩充 emotional.support 训练样本",
    category: "data",
    priority: "medium",
    impact: "提升 5% 心理咨询准确率",
    detail: "心理类对话量增长 36%，但训练集只有 320 条，建议增加到 1000+ 条。",
    effort: "L",
  },
  {
    id: "op4",
    title: "调整 supervisor 路由 prompt",
    category: "prompt",
    priority: "medium",
    impact: "减少 8% 兜底路由",
    detail: "通用助手承接了大量学业类问题，建议在 prompt 中强化学业关键词识别。",
    effort: "S",
  },
  {
    id: "op5",
    title: "为 affairs.dorm_change 添加专用工具",
    category: "tool",
    priority: "medium",
    impact: "提升 12% 教务问题解决率",
    detail: "宿舍调整流程查询正在快速增长，建议对接学工系统提供查询工具。",
    effort: "L",
  },
  {
    id: "op6",
    title: "压缩 calendar_query 响应字段",
    category: "tool",
    priority: "low",
    impact: "降低 30% 延迟",
    detail: "返回字段中包含大量未使用元数据，建议精简至 6 个核心字段。",
    effort: "S",
  },
  {
    id: "op7",
    title: "新增 general.entertainment 兜底回复模板",
    category: "prompt",
    priority: "low",
    impact: "提升 4% 用户满意度",
    detail: "娱乐类查询当前回复较生硬，建议加入推荐模板和拒答机制。",
    effort: "S",
  },
];

export const CATEGORY_INFO = {
  intent: { name: "意图", color: "text-info", bg: "bg-info/15" },
  tool: { name: "工具", color: "text-warning", bg: "bg-warning/15" },
  prompt: { name: "Prompt", color: "text-primary", bg: "bg-primary/15" },
  data: { name: "数据", color: "text-success", bg: "bg-success/15" },
} as const;

export const PRIORITY_INFO = {
  high: { name: "高", variant: "destructive" as const },
  medium: { name: "中", variant: "warning" as const },
  low: { name: "低", variant: "secondary" as const },
};
