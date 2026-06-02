export type NotificationType = "system" | "ticket" | "feedback" | "crisis";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  ts: number;
  read: boolean;
  url?: string;
};

const now = Date.now();
const min = 60_000;

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n-001",
    type: "crisis",
    title: "P0 危机：核心服务异常",
    detail: "ChatGateway 在过去 5 分钟内错误率超过 12%，已自动触发告警链路。",
    ts: now - 2 * min,
    read: false,
    url: "/observability",
  },
  {
    id: "n-002",
    type: "ticket",
    title: "工单 #T-2031 升级",
    detail: "用户「星尘」将工单从 P2 升级至 P1，等待工程师接手。",
    ts: now - 5 * min,
    read: false,
    url: "/tickets/T-2031",
  },
  {
    id: "n-003",
    type: "feedback",
    title: "新反馈：对话质量评分",
    detail: "最近 100 条会话中，平均 CSAT 得分从 4.6 下降至 4.2。",
    ts: now - 8 * min,
    read: false,
    url: "/feedback",
  },
  {
    id: "n-004",
    type: "system",
    title: "系统升级完成",
    detail: "Workbench v7.3.0 已成功部署到生产环境，建议刷新页面。",
    ts: now - 12 * min,
    read: false,
    url: "/changelog",
  },
  {
    id: "n-005",
    type: "ticket",
    title: "工单 #T-2028 已解决",
    detail: "「Hud 渲染闪烁」由前端工程师 莫言 处理完毕，等待用户确认。",
    ts: now - 14 * min,
    read: true,
    url: "/tickets/T-2028",
  },
  {
    id: "n-006",
    type: "system",
    title: "数据库自动备份完成",
    detail: "今日 03:00 完成全量备份，体积 2.3 GB，校验通过。",
    ts: now - 16 * min,
    read: true,
  },
  {
    id: "n-007",
    type: "feedback",
    title: "用户提交了 3 条反馈",
    detail: "均为「搜索结果排序」相关问题，已聚合到 #FB-118。",
    ts: now - 19 * min,
    read: true,
    url: "/feedback/FB-118",
  },
  {
    id: "n-008",
    type: "crisis",
    title: "P1 危机：API 延迟升高",
    detail: "/v1/chat 平均响应时间从 220ms 升至 980ms，已通知 SRE。",
    ts: now - 22 * min,
    read: true,
    url: "/observability",
  },
  {
    id: "n-009",
    type: "ticket",
    title: "新工单：导出 CSV 报错",
    detail: "「凛冬」反馈导出超过 5 万行时浏览器崩溃。",
    ts: now - 24 * min,
    read: true,
    url: "/tickets/T-2032",
  },
  {
    id: "n-010",
    type: "system",
    title: "新版本预览可用",
    detail: "v7.4.0-rc.1 已发布到 staging 环境，可前往体验。",
    ts: now - 26 * min,
    read: true,
  },
  {
    id: "n-011",
    type: "feedback",
    title: "NPS 月度报告已生成",
    detail: "本月 NPS 得分 47，相比上月 +6，达到年度新高。",
    ts: now - 28 * min,
    read: true,
    url: "/feedback/report",
  },
  {
    id: "n-012",
    type: "ticket",
    title: "工单 #T-2030 已分配",
    detail: "分配给工程师「夜航」，预计 2 小时内响应。",
    ts: now - 30 * min,
    read: true,
    url: "/tickets/T-2030",
  },
  {
    id: "n-013",
    type: "system",
    title: "依赖库安全更新",
    detail: "检测到 2 个中级 CVE，建议在 24 小时内执行 npm 升级。",
    ts: now - 30 * min,
    read: true,
  },
];
