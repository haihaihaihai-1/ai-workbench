// 用户画像详情 - Mock 数据

const now = Date.now();
const day = 86_400_000;

// ============ 用户基础档案 ============
export type UserProfile = {
  id: string;
  name: string;
  avatar: string; // 字母 fallback
  major: string;
  grade: string;
  studentId: string;
  email: string;
  phone: string;
  region: string;
  joinedAt: number;
  lastActiveAt: number;
  gpa: number;
  totalSessions: number;
  totalMemories: number;
  avgTurns: number;
  avgEmotion30d: number; // 0-1
  tags: string[]; // 专业/年级/兴趣
  role: string; // 学生/教师/管理员
  status: "active" | "inactive" | "dormant";
};

export const MOCK_USER: UserProfile = {
  id: "u20241037",
  name: "许泉兴",
  avatar: "许",
  major: "计算机科学与技术",
  grade: "大三",
  studentId: "2022030514",
  email: "xuquanxing@stu.edu.cn",
  phone: "+86 138****8821",
  region: "浙江 · 杭州",
  joinedAt: now - 320 * day,
  lastActiveAt: now - 2 * 3600_000,
  gpa: 3.72,
  totalSessions: 187,
  totalMemories: 124,
  avgTurns: 8.4,
  avgEmotion30d: 0.68,
  tags: ["AI/ML", "Python", "PyTorch", "算法", "升学", "结构化笔记", "夜猫子"],
  role: "学生",
  status: "active",
};

// ============ 画像摘要（3 段）============
export const PROFILE_SUMMARY = [
  "计算机科学专业大三学生（GPA 3.72/4.0），主攻 AI/ML 方向。已系统学习 Python 生态与 PyTorch 框架，能独立完成 CNN 等基础模型的搭建与训练，熟练使用 Git/Docker/VSCode 等工程化工具。",
  "近期处于研究生升学决策期，关注国内 985 院校的机器学习与数据挖掘方向。日常偏好结构化笔记（标题 + 列表），对带示例的代码解释接受度最高，倾向于一次性获取完整方案而非多次追问。",
  "作息偏夜猫子型，22:00 - 24:00 活跃度最高。近期因竞赛与项目压力出现轻度焦虑，对鼓励性反馈和分步引导有较强需求。语言风格偏简洁直接，反感冗长说教。",
];

// ============ 兴趣标签（TOP 10 + 详细）============
export const TOP_INTERESTS = [
  { name: "机器学习", score: 92 },
  { name: "深度学习", score: 88 },
  { name: "Python", score: 85 },
  { name: "算法", score: 78 },
  { name: "PyTorch", score: 75 },
  { name: "数据结构", score: 70 },
  { name: "操作系统", score: 62 },
  { name: "数学建模", score: 58 },
  { name: "论文阅读", score: 52 },
  { name: "英语学习", score: 45 },
];

export const ALL_INTEREST_TAGS = [
  { name: "AI/ML", count: 42 },
  { name: "Python", count: 38 },
  { name: "PyTorch", count: 31 },
  { name: "算法", count: 28 },
  { name: "数据结构", count: 24 },
  { name: "升学", count: 22 },
  { name: "结构化笔记", count: 19 },
  { name: "夜猫子", count: 17 },
  { name: "CNN", count: 15 },
  { name: "GPA", count: 14 },
  { name: "操作系统", count: 12 },
  { name: "数学", count: 11 },
  { name: "Git", count: 10 },
  { name: "Docker", count: 9 },
  { name: "英语", count: 8 },
  { name: "考研", count: 7 },
  { name: "数学建模", count: 6 },
  { name: "竞赛", count: 5 },
];

// ============ 24h 活跃热力图（24 小时 x 强度）============
export const ACTIVITY_24H = [
  { hour: 0, count: 12 },
  { hour: 1, count: 6 },
  { hour: 2, count: 3 },
  { hour: 3, count: 1 },
  { hour: 4, count: 0 },
  { hour: 5, count: 0 },
  { hour: 6, count: 2 },
  { hour: 7, count: 8 },
  { hour: 8, count: 18 },
  { hour: 9, count: 32 },
  { hour: 10, count: 28 },
  { hour: 11, count: 22 },
  { hour: 12, count: 16 },
  { hour: 13, count: 14 },
  { hour: 14, count: 24 },
  { hour: 15, count: 38 },
  { hour: 16, count: 42 },
  { hour: 17, count: 35 },
  { hour: 18, count: 30 },
  { hour: 19, count: 38 },
  { hour: 20, count: 52 },
  { hour: 21, count: 68 },
  { hour: 22, count: 86 },
  { hour: 23, count: 78 },
];

// 周活跃
export const WEEKLY_ACTIVITY = [
  { day: "周一", sessions: 6, messages: 42 },
  { day: "周二", sessions: 8, messages: 56 },
  { day: "周三", sessions: 5, messages: 38 },
  { day: "周四", sessions: 7, messages: 48 },
  { day: "周五", sessions: 9, messages: 64 },
  { day: "周六", sessions: 11, messages: 78 },
  { day: "周日", sessions: 7, messages: 52 },
];

// 30 天趋势
export const ACTIVITY_30D = Array.from({ length: 30 }, (_, i) => {
  const d = 30 - i;
  const base = 5 + Math.sin((i / 30) * Math.PI * 2) * 2;
  const noise = ((i * 7) % 5) - 2;
  return {
    date: `${d}天前`,
    sessions: Math.max(1, Math.round(base + noise)),
    messages: Math.max(8, Math.round((base + noise) * 8)),
  };
});

// ============ 情绪追踪（30 天）============
export const EMOTION_30D = Array.from({ length: 30 }, (_, i) => {
  const d = 30 - i;
  const base = 0.65 + Math.sin((i / 30) * Math.PI * 2) * 0.12;
  const noise = ((i * 11) % 7) / 100;
  return {
    date: `${d}天前`,
    score: Math.max(0.1, Math.min(0.95, +(base + noise - 0.03).toFixed(2))),
  };
});

export const EMOTION_EVENTS = [
  {
    id: "e1",
    date: "3 天前",
    type: "high",
    title: "完成 ML 项目答辩",
    detail: "情绪显著回升，连续咨询时间缩短 30%",
    delta: +0.18,
  },
  {
    id: "e2",
    date: "8 天前",
    type: "low",
    title: "OS 课设延期压力",
    detail: "夜间活跃度激增，连续 3 天 24:00 后仍在对话",
    delta: -0.21,
  },
  {
    id: "e3",
    date: "14 天前",
    type: "high",
    title: "GPA 公布：3.72",
    detail: "专业排名前 10%，情绪稳定",
    delta: +0.12,
  },
  {
    id: "e4",
    date: "20 天前",
    type: "low",
    title: "考研方向选择焦虑",
    detail: "连续咨询 5 轮以上寻求建议",
    delta: -0.15,
  },
  {
    id: "e5",
    date: "26 天前",
    type: "high",
    title: "PyTorch 模型训练成功",
    detail: "首次完整跑通 CNN 流程，积极反馈",
    delta: +0.22,
  },
];

// ============ 学习风格（6 维度雷达）============
export const LEARNING_STYLE = [
  { dim: "结构化", value: 88 },
  { dim: "视觉化", value: 65 },
  { dim: "互动性", value: 52 },
  { dim: "深度", value: 78 },
  { dim: "广度", value: 70 },
  { dim: "速度", value: 60 },
];

// ============ 风险评估 ============
export const PSYCH_RISK = {
  score: 38, // 0-100
  level: "low" as const, // low / medium / high
  factors: [
    { label: "近期焦虑信号", weight: 12 },
    { label: "睡眠偏移", weight: 10 },
    { label: "学业压力强度", weight: 16 },
  ],
  trend: "stable" as const,
};

export const ACADEMIC_RISK = {
  score: 42, // 0-100
  level: "medium" as const,
  factors: [
    { label: "未完成作业数", weight: 14 },
    { label: "课设延期", weight: 18 },
    { label: "出勤波动", weight: 10 },
  ],
  trend: "rising" as const,
};

// ============ 沟通偏好（1-5 评分）============
export const COMMUNICATION_PREF = {
  language: { label: "语言风格", value: 4, hint: "简洁直接" },
  length: { label: "响应长度", value: 3, hint: "中等偏长" },
  detail: { label: "详细度", value: 4, hint: "需要示例" },
  tone: { label: "语气偏好", value: 2, hint: "专业而非说教" },
};

// ============ 快速操作 mock 响应 ============
export const QUICK_ACTIONS = {
  sendMessage: "已创建会话：与许泉兴对话",
  viewConversations: "正在打开对话列表...",
  exportProfile: "画像已导出为 JSON 文件",
  resetMemory: "记忆重置功能 v7.2 即将上线",
};
