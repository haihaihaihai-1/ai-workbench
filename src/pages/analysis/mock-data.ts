// 数据分析 - Mock 数据

const now = Date.now();
const day = 86_400_000;

// 顶部 4 个总览指标
export const OVERVIEW_METRICS = {
  activeUsers: 8240,
  prevActiveUsers: 7920,
  sessions: 12480,
  prevSessions: 11260,
  avgDurationMin: 7.8,
  prevAvgDurationMin: 7.2,
  retention7d: 64.3,
  prevRetention7d: 61.8,
};

// 24h × 7d 用户活跃热力图（168 单元）
const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
export type HeatmapCell = { day: string; hour: number; value: number };
export const ACTIVITY_HEATMAP: HeatmapCell[] = days.flatMap((d, di) =>
  Array.from({ length: 24 }, (_, h) => {
    // 工作日早上、晚上活跃；周末更平均
    const weekend = di >= 5;
    let v =
      h < 6
        ? 5 + Math.random() * 8
        : h < 9
          ? 20 + Math.random() * 25
          : h < 12
            ? 55 + Math.random() * 30
            : h < 14
              ? 35 + Math.random() * 20
              : h < 18
                ? 60 + Math.random() * 35
                : h < 22
                  ? 78 + Math.random() * 25
                  : 30 + Math.random() * 20;
    if (weekend) v *= 0.85;
    return { day: d, hour: h, value: Math.round(v) };
  }),
);

// 会话时长分布（直方图）
export const SESSION_DURATION_BINS = [
  { range: "0-1 分钟", count: 1240, bucket: "短" },
  { range: "1-3 分钟", count: 2820, bucket: "短" },
  { range: "3-5 分钟", count: 3680, bucket: "中" },
  { range: "5-10 分钟", count: 2960, bucket: "中" },
  { range: "10-20 分钟", count: 1340, bucket: "长" },
  { range: "20-30 分钟", count: 380, bucket: "长" },
  { range: "30+ 分钟", count: 60, bucket: "超长" },
];

// Agent 路由分布
export const AGENT_DISTRIBUTION = [
  { name: "学业助手", value: 4280, color: "#3B82F6" },
  { name: "心理助手", value: 1840, color: "#10B981" },
  { name: "教务助手", value: 2100, color: "#F59E0B" },
  { name: "通用助手", value: 3560, color: "#8B5CF6" },
];

// 反馈分析（堆叠柱状图，按天）
export const FEEDBACK_DAILY = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now - (6 - i) * day);
  return {
    day: `${d.getMonth() + 1}/${d.getDate()}`,
    positive: 280 + Math.round(Math.sin(i / 2) * 60 + Math.random() * 30),
    neutral: 84 + Math.round(Math.cos(i / 3) * 15 + Math.random() * 12),
    negative: 22 + Math.round(Math.sin(i / 4) * 8 + Math.random() * 5),
  };
});

// 意图热度（横向 TOP 10）
export const INTENT_HEAT = [
  { intent: "academic.course", count: 1820, change: 12.3 },
  { intent: "general.chitchat", count: 1560, change: -3.2 },
  { intent: "academic.exam", count: 1240, change: 8.4 },
  { intent: "academic.homework", count: 1100, change: 15.7 },
  { intent: "emotional.support", count: 980, change: 36.1 },
  { intent: "affairs.leave", count: 720, change: 4.1 },
  { intent: "emotional.test", count: 420, change: 10.5 },
  { intent: "affairs.scholarship", count: 380, change: 5.6 },
  { intent: "general.translation", count: 240, change: -8.0 },
  { intent: "academic.career", count: 184, change: 42.0 },
];

// 用户行为漏斗（5 步）
export const USER_FUNNEL = [
  { step: "访问", users: 10000, rate: 100, drop: 0 },
  { step: "提问", users: 8240, rate: 82.4, drop: 17.6 },
  { step: "追问", users: 5120, rate: 51.2, drop: 31.2 },
  { step: "反馈", users: 1640, rate: 16.4, drop: 34.8 },
  { step: "收藏", users: 620, rate: 6.2, drop: 10.2 },
];

// 用户分群
export type UserSegment = "high" | "medium" | "silent" | "churned";
export type UserSample = {
  id: string;
  username: string;
  lastActive: string;
  sessions: number;
  totalQuestions: number;
  satisfaction: number;
};

export const USER_SEGMENTS: Record<
  UserSegment,
  { name: string; description: string; color: string; bg: string; samples: UserSample[] }
> = {
  high: {
    name: "高活跃",
    description: "近 7 天 ≥ 5 次会话",
    color: "text-success",
    bg: "bg-success/15",
    samples: [
      {
        id: "u_8234",
        username: "study_master",
        lastActive: "刚刚",
        sessions: 18,
        totalQuestions: 142,
        satisfaction: 92,
      },
      {
        id: "u_4521",
        username: "ml_learner",
        lastActive: "5 分钟前",
        sessions: 14,
        totalQuestions: 98,
        satisfaction: 88,
      },
      {
        id: "u_7782",
        username: "exam_prep",
        lastActive: "12 分钟前",
        sessions: 12,
        totalQuestions: 84,
        satisfaction: 94,
      },
      {
        id: "u_1290",
        username: "cs_grad",
        lastActive: "1 小时前",
        sessions: 9,
        totalQuestions: 76,
        satisfaction: 91,
      },
      {
        id: "u_3451",
        username: "physics_fan",
        lastActive: "2 小时前",
        sessions: 8,
        totalQuestions: 62,
        satisfaction: 86,
      },
    ],
  },
  medium: {
    name: "中等活跃",
    description: "近 7 天 2-4 次会话",
    color: "text-info",
    bg: "bg-info/15",
    samples: [
      {
        id: "u_2240",
        username: "weekly_check",
        lastActive: "1 天前",
        sessions: 4,
        totalQuestions: 28,
        satisfaction: 82,
      },
      {
        id: "u_6671",
        username: "design_student",
        lastActive: "2 天前",
        sessions: 3,
        totalQuestions: 19,
        satisfaction: 78,
      },
      {
        id: "u_5582",
        username: "art_major",
        lastActive: "2 天前",
        sessions: 3,
        totalQuestions: 16,
        satisfaction: 80,
      },
      {
        id: "u_9023",
        username: "lit_lover",
        lastActive: "3 天前",
        sessions: 2,
        totalQuestions: 12,
        satisfaction: 75,
      },
      {
        id: "u_3344",
        username: "math_curious",
        lastActive: "4 天前",
        sessions: 2,
        totalQuestions: 10,
        satisfaction: 84,
      },
    ],
  },
  silent: {
    name: "沉默用户",
    description: "近 7 天仅 1 次或未活跃",
    color: "text-warning",
    bg: "bg-warning/15",
    samples: [
      {
        id: "u_1199",
        username: "lurker_a",
        lastActive: "8 天前",
        sessions: 1,
        totalQuestions: 4,
        satisfaction: 60,
      },
      {
        id: "u_7788",
        username: "quiet_user",
        lastActive: "10 天前",
        sessions: 1,
        totalQuestions: 3,
        satisfaction: 72,
      },
      {
        id: "u_5566",
        username: "first_try",
        lastActive: "12 天前",
        sessions: 1,
        totalQuestions: 2,
        satisfaction: 55,
      },
      {
        id: "u_2233",
        username: "watch_only",
        lastActive: "13 天前",
        sessions: 1,
        totalQuestions: 1,
        satisfaction: 50,
      },
      {
        id: "u_4499",
        username: "shy_visitor",
        lastActive: "14 天前",
        sessions: 1,
        totalQuestions: 2,
        satisfaction: 68,
      },
    ],
  },
  churned: {
    name: "流失用户",
    description: "近 30 天未登录",
    color: "text-destructive",
    bg: "bg-destructive/15",
    samples: [
      {
        id: "u_0011",
        username: "old_active",
        lastActive: "32 天前",
        sessions: 0,
        totalQuestions: 0,
        satisfaction: 0,
      },
      {
        id: "u_0022",
        username: "left_user",
        lastActive: "38 天前",
        sessions: 0,
        totalQuestions: 0,
        satisfaction: 0,
      },
      {
        id: "u_0033",
        username: "gone_user",
        lastActive: "45 天前",
        sessions: 0,
        totalQuestions: 0,
        satisfaction: 0,
      },
      {
        id: "u_0044",
        username: "former_fan",
        lastActive: "51 天前",
        sessions: 0,
        totalQuestions: 0,
        satisfaction: 0,
      },
      {
        id: "u_0055",
        username: "missing",
        lastActive: "67 天前",
        sessions: 0,
        totalQuestions: 0,
        satisfaction: 0,
      },
    ],
  },
};
