// 服务大厅 mock 数据
export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "available" | "beta" | "coming_soon";
  usage: number;
};

export type ServiceCategory = "academic" | "emotional" | "affairs" | "life";

export const SERVICE_CATEGORIES: {
  id: ServiceCategory;
  name: string;
  emoji: string;
  color: string;
  bg: string;
  description: string;
}[] = [
  {
    id: "academic",
    name: "学业服务",
    emoji: "📚",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    description: "课程、成绩、作业、考试",
  },
  {
    id: "emotional",
    name: "心理服务",
    emoji: "💚",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    description: "情绪、测评、咨询、音乐",
  },
  {
    id: "affairs",
    name: "教务服务",
    emoji: "📋",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    description: "请假、选课、学籍、奖学金",
  },
  {
    id: "life",
    name: "生活服务",
    emoji: "🏠",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    description: "地图、失物、活动、校历",
  },
];

export const SERVICES: Record<ServiceCategory, ServiceItem[]> = {
  academic: [
    {
      id: "s1",
      name: "课程查询",
      description: "查询本学期课程安排",
      icon: "📖",
      status: "available",
      usage: 2340,
    },
    {
      id: "s2",
      name: "成绩分析",
      description: "GPA 趋势 + 学科强弱",
      icon: "📊",
      status: "available",
      usage: 1820,
    },
    {
      id: "s3",
      name: "作业辅导",
      description: "AI 辅助解题思路",
      icon: "✍️",
      status: "available",
      usage: 4120,
    },
    {
      id: "s4",
      name: "课表管理",
      description: "导入 + 冲突检测",
      icon: "📅",
      status: "available",
      usage: 980,
    },
    {
      id: "s5",
      name: "考试安排",
      description: "考试时间 + 备考建议",
      icon: "⏰",
      status: "available",
      usage: 1240,
    },
    {
      id: "s6",
      name: "作业提交",
      description: "一键提交到教务系统",
      icon: "📤",
      status: "beta",
      usage: 320,
    },
  ],
  emotional: [
    {
      id: "e1",
      name: "情绪日记",
      description: "每日情绪记录 + 趋势",
      icon: "📔",
      status: "available",
      usage: 720,
    },
    {
      id: "e2",
      name: "心理测评",
      description: "SCL-90 / 焦虑 / 抑郁",
      icon: "📋",
      status: "available",
      usage: 540,
    },
    {
      id: "e3",
      name: "减压音乐",
      description: "白噪音 + 自然音",
      icon: "🎵",
      status: "available",
      usage: 1280,
    },
    {
      id: "e4",
      name: "预约咨询",
      description: "校园心理咨询师",
      icon: "🧑‍⚕️",
      status: "available",
      usage: 240,
    },
    {
      id: "e5",
      name: "正念冥想",
      description: "5-30 分钟引导",
      icon: "🧘",
      status: "beta",
      usage: 380,
    },
  ],
  affairs: [
    {
      id: "a1",
      name: "请假申请",
      description: "事假 / 病假 / 紧急",
      icon: "📝",
      status: "available",
      usage: 1620,
    },
    {
      id: "a2",
      name: "选课系统",
      description: "一键选退 + 冲突提醒",
      icon: "🎯",
      status: "available",
      usage: 980,
    },
    {
      id: "a3",
      name: "学籍查询",
      description: "基本信息 + 学籍状态",
      icon: "🪪",
      status: "available",
      usage: 420,
    },
    {
      id: "a4",
      name: "奖学金申请",
      description: "国奖 / 校奖 / 院奖",
      icon: "🏆",
      status: "available",
      usage: 380,
    },
    {
      id: "a5",
      name: "证明开具",
      description: "在读 / 成绩单 / 学历",
      icon: "📃",
      status: "coming_soon",
      usage: 0,
    },
  ],
  life: [
    {
      id: "l1",
      name: "校园地图",
      description: "建筑 + 路线 + 导航",
      icon: "🗺",
      status: "available",
      usage: 1840,
    },
    {
      id: "l2",
      name: "失物招领",
      description: "拍照识别 + 智能匹配",
      icon: "🔍",
      status: "beta",
      usage: 420,
    },
    {
      id: "l3",
      name: "活动日历",
      description: "讲座 / 比赛 / 社团",
      icon: "📅",
      status: "available",
      usage: 1120,
    },
    {
      id: "l4",
      name: "校园卡充值",
      description: "线上充值 + 余额查询",
      icon: "💳",
      status: "coming_soon",
      usage: 0,
    },
    {
      id: "l5",
      name: "校历查询",
      description: "学期 + 假期 + 考试周",
      icon: "📆",
      status: "available",
      usage: 680,
    },
  ],
};
