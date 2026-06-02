// 技能管理（管理员） - 模拟数据

export type SkillCategory = "tool" | "data" | "cognitive" | "creative";
export type ExecutionMode = "AUTO" | "ASK_CONFIRM" | "INTERACTIVE";
export type SkillStatus = "enabled" | "disabled" | "pending";
export type PermissionLevel = "all" | "role" | "user" | "admin_only";

export type AdminSkill = {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  icon: string;
  status: SkillStatus;
  executionMode: ExecutionMode;
  calls: number;
  errorRate: number;
  p50LatencyMs: number;
  author: string;
  version: string;
  tags: string[];
  permissions: string[];
  permissionLevel: PermissionLevel;
  allowedRoles: string[];
  allowedUsers: string[];
  lastAudit: number;
  createdAt: number;
  updatedAt: number;
};

export const CATEGORY_INFO: Record<
  SkillCategory,
  { name: string; emoji: string; color: string; bg: string }
> = {
  tool: { name: "工具", emoji: "🔧", color: "text-info", bg: "bg-info/10" },
  data: { name: "数据", emoji: "📊", color: "text-success", bg: "bg-success/10" },
  cognitive: { name: "认知", emoji: "🧠", color: "text-primary", bg: "bg-primary/10" },
  creative: { name: "创作", emoji: "✨", color: "text-warning", bg: "bg-warning/10" },
};

export const EXECUTION_MODE_INFO: Record<
  ExecutionMode,
  { name: string; tone: "info" | "warning" | "secondary" }
> = {
  AUTO: { name: "自动", tone: "info" },
  ASK_CONFIRM: { name: "需确认", tone: "warning" },
  INTERACTIVE: { name: "交互式", tone: "secondary" },
};

export const STATUS_INFO: Record<
  SkillStatus,
  { name: string; tone: "success" | "destructive" | "warning" }
> = {
  enabled: { name: "已启用", tone: "success" },
  disabled: { name: "已禁用", tone: "destructive" },
  pending: { name: "待审核", tone: "warning" },
};

export const PERMISSION_LEVEL_INFO: Record<
  PermissionLevel,
  { name: string; description: string; tone: "info" | "warning" | "destructive" | "secondary" }
> = {
  all: { name: "全员", description: "所有用户可调用", tone: "info" },
  role: { name: "按角色", description: "指定角色可调用", tone: "warning" },
  user: { name: "按用户", description: "指定用户可调用", tone: "secondary" },
  admin_only: { name: "仅管理员", description: "仅管理员可调用", tone: "destructive" },
};

const now = Date.now();
const day = 86_400_000;

export const MOCK_ADMIN_SKILLS: AdminSkill[] = [
  {
    id: "sk_web_search",
    name: "联网搜索",
    description: "实时搜索互联网最新信息，集成多源学术资源、新闻、博客。",
    category: "tool",
    icon: "🔍",
    status: "enabled",
    executionMode: "AUTO",
    calls: 12_840,
    errorRate: 1.8,
    p50LatencyMs: 1240,
    author: "Workbench Team",
    version: "2.4.1",
    tags: ["搜索", "实时", "学术"],
    permissions: ["网络访问"],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 3 * day,
    createdAt: now - 90 * day,
    updatedAt: now - 5 * day,
  },
  {
    id: "sk_calendar",
    name: "日历查询",
    description: "查询校内课程表、放假安排、个人日程。",
    category: "tool",
    icon: "📅",
    status: "enabled",
    executionMode: "AUTO",
    calls: 8_520,
    errorRate: 3.5,
    p50LatencyMs: 320,
    author: "教务处集成",
    version: "1.8.0",
    tags: ["日程", "教务"],
    permissions: ["读取教务数据"],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 7 * day,
    createdAt: now - 120 * day,
    updatedAt: now - 12 * day,
  },
  {
    id: "sk_translate",
    name: "学术翻译",
    description: "中英文学术论文双向翻译，保留公式和引用格式。",
    category: "tool",
    icon: "🌐",
    status: "enabled",
    executionMode: "AUTO",
    calls: 4_320,
    errorRate: 5.9,
    p50LatencyMs: 2100,
    author: "Workbench Team",
    version: "3.1.2",
    tags: ["翻译", "学术"],
    permissions: [],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 10 * day,
    createdAt: now - 200 * day,
    updatedAt: now - 30 * day,
  },
  {
    id: "sk_sql",
    name: "数据库查询",
    description: "自然语言转 SQL，自动查询教学数据库（成绩、出勤）。",
    category: "data",
    icon: "🗄️",
    status: "enabled",
    executionMode: "ASK_CONFIRM",
    calls: 6_180,
    errorRate: 7.7,
    p50LatencyMs: 480,
    author: "数据团队",
    version: "2.0.5",
    tags: ["SQL", "数据库", "教务"],
    permissions: ["读取教学数据"],
    permissionLevel: "role",
    allowedRoles: ["teacher", "admin"],
    allowedUsers: [],
    lastAudit: now - 2 * day,
    createdAt: now - 60 * day,
    updatedAt: now - 6 * day,
  },
  {
    id: "sk_chart",
    name: "可视化生成",
    description: "根据数据自动生成柱状图、折线图、饼图、热力图。",
    category: "data",
    icon: "📈",
    status: "enabled",
    executionMode: "AUTO",
    calls: 3_240,
    errorRate: 2.2,
    p50LatencyMs: 620,
    author: "Workbench Team",
    version: "1.5.0",
    tags: ["图表", "可视化"],
    permissions: [],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 14 * day,
    createdAt: now - 45 * day,
    updatedAt: now - 8 * day,
  },
  {
    id: "sk_pdf_parser",
    name: "PDF 解析",
    description: "提取 PDF 中的文本、表格、公式，生成结构化摘要。",
    category: "data",
    icon: "📄",
    status: "disabled",
    executionMode: "AUTO",
    calls: 1_890,
    errorRate: 10.8,
    p50LatencyMs: 3400,
    author: "Workbench Team",
    version: "2.2.0",
    tags: ["PDF", "解析", "文档"],
    permissions: ["读取文件"],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 20 * day,
    createdAt: now - 80 * day,
    updatedAt: now - 1 * day,
  },
  {
    id: "sk_knowledge_graph",
    name: "知识图谱",
    description: "构建学科知识图谱，可视化概念之间的关系。",
    category: "cognitive",
    icon: "🕸️",
    status: "enabled",
    executionMode: "INTERACTIVE",
    calls: 2_140,
    errorRate: 4.4,
    p50LatencyMs: 2100,
    author: "学术团队",
    version: "1.2.0",
    tags: ["图谱", "知识", "可视化"],
    permissions: [],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 5 * day,
    createdAt: now - 30 * day,
    updatedAt: now - 2 * day,
  },
  {
    id: "sk_concept_explain",
    name: "概念解释",
    description: "针对学术概念生成多层次解释（初学者/进阶/专家）。",
    category: "cognitive",
    icon: "💡",
    status: "enabled",
    executionMode: "AUTO",
    calls: 5_620,
    errorRate: 3.6,
    p50LatencyMs: 880,
    author: "Workbench Team",
    version: "2.0.1",
    tags: ["解释", "教学"],
    permissions: [],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 4 * day,
    createdAt: now - 50 * day,
    updatedAt: now - 9 * day,
  },
  {
    id: "sk_mindmap",
    name: "思维导图",
    description: "一键生成结构化思维导图，支持导出 Markdown / 图片。",
    category: "creative",
    icon: "🗺️",
    status: "enabled",
    executionMode: "AUTO",
    calls: 1_960,
    errorRate: 6.0,
    p50LatencyMs: 1400,
    author: "Workbench Team",
    version: "1.3.2",
    tags: ["导图", "结构化"],
    permissions: [],
    permissionLevel: "all",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 6 * day,
    createdAt: now - 25 * day,
    updatedAt: now - 1 * day,
  },
  {
    id: "sk_email_draft",
    name: "邮件草稿",
    description: "根据场景生成专业邮件草稿（请假、咨询、感谢等）。",
    category: "creative",
    icon: "✉️",
    status: "enabled",
    executionMode: "ASK_CONFIRM",
    calls: 2_780,
    errorRate: 2.9,
    p50LatencyMs: 720,
    author: "Workbench Team",
    version: "1.1.5",
    tags: ["邮件", "办公"],
    permissions: ["发送邮件"],
    permissionLevel: "user",
    allowedRoles: [],
    allowedUsers: ["u_8234", "u_1234"],
    lastAudit: now - 1 * day,
    createdAt: now - 70 * day,
    updatedAt: now - 3 * day,
  },
  {
    id: "sk_send_email",
    name: "邮件发送",
    description: "代表用户发送邮件（高风险操作）。",
    category: "tool",
    icon: "📤",
    status: "pending",
    executionMode: "ASK_CONFIRM",
    calls: 0,
    errorRate: 0,
    p50LatencyMs: 0,
    author: "外部贡献者",
    version: "0.1.0",
    tags: ["邮件", "高风险"],
    permissions: ["发送邮件", "读取通讯录"],
    permissionLevel: "admin_only",
    allowedRoles: [],
    allowedUsers: [],
    lastAudit: now - 1 * day,
    createdAt: now - 3 * day,
    updatedAt: now - 1 * day,
  },
  {
    id: "sk_code_runner",
    name: "代码执行",
    description: "沙箱中安全执行 Python / JS 代码，输出结果与图表。",
    category: "tool",
    icon: "▶️",
    status: "pending",
    executionMode: "ASK_CONFIRM",
    calls: 0,
    errorRate: 0,
    p50LatencyMs: 0,
    author: "Workbench Team",
    version: "1.0.0",
    tags: ["代码", "沙箱"],
    permissions: ["执行代码", "访问网络"],
    permissionLevel: "role",
    allowedRoles: ["teacher", "student"],
    allowedUsers: [],
    lastAudit: now - 6 * 3600_000,
    createdAt: now - 10 * day,
    updatedAt: now - 6 * 3600_000,
  },
];

export const ADMIN_SKILL_STATS = {
  total: MOCK_ADMIN_SKILLS.length,
  enabled: MOCK_ADMIN_SKILLS.filter((s) => s.status === "enabled").length,
  pending: MOCK_ADMIN_SKILLS.filter((s) => s.status === "pending").length,
  disabled: MOCK_ADMIN_SKILLS.filter((s) => s.status === "disabled").length,
};

export const MOCK_AUDIT_LOG = [
  {
    ts: now - 1 * 3600_000,
    user: "赵磊",
    action: "更新配置",
    detail: "执行模式 ASK_CONFIRM → AUTO",
  },
  { ts: now - 5 * 3600_000, user: "周婷", action: "权限变更", detail: "邮件草稿 分配给 李明" },
  { ts: now - 1 * day, user: "赵磊", action: "审核通过", detail: "代码执行 v1.0.0" },
  { ts: now - 2 * day, user: "周婷", action: "禁用", detail: "PDF 解析（错误率过高）" },
  { ts: now - 3 * day, user: "赵磊", action: "新增技能", detail: "邮件发送 v0.1.0" },
];

export const MOCK_CALL_LOG = (skillId: string) =>
  [
    {
      ts: now - 12 * 60_000,
      user: "李明",
      success: true,
      durationMs: 1240,
      input: "search('2026 强化学习')",
    },
    {
      ts: now - 4 * 3600_000,
      user: "王雪",
      success: true,
      durationMs: 980,
      input: "search('transformer 综述')",
    },
    {
      ts: now - 12 * 3600_000,
      user: "张伟",
      success: false,
      durationMs: 5200,
      input: "search('复杂 query')",
    },
    {
      ts: now - 1 * day,
      user: "陈思",
      success: true,
      durationMs: 1620,
      input: "search('机器学习入门')",
    },
  ].filter(() => skillId);
