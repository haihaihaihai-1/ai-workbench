/**
 * 可嵌入资源（L1 拼图清单）
 *
 * 每个 entry 是一张"拼图"，可以被 SafeEmbed 嵌入。
 * 字段说明见 EmbedEntry。
 *
 * 后续要新增嵌入资源：
 *   1. 确认目标站 X-Frame-Options / CSP 允许嵌入
 *   2. 加一条 entry
 *   3. 在对应页面用 <SafeEmbed {...entry} />
 */

export type EmbedCategory = "status" | "docs" | "dashboard" | "playground" | "roadmap" | "blog";

export type EmbedEntry = {
  /** 唯一 id */
  id: string;
  /** 显示标题 */
  title: string;
  /** 嵌入 URL */
  src: string;
  /** 分类 */
  category: EmbedCategory;
  /** 来源描述（Grafana / Langfuse / Vercel ...） */
  source: string;
  /** 是否允许脚本 */
  allowScripts?: boolean;
  /** 是否允许同源 */
  allowSameOrigin?: boolean;
  /** 是否允许弹窗 */
  allowPopups?: boolean;
  /** 自动刷新间隔（秒），0 = 不刷新 */
  refreshIntervalSec?: number;
  /** 嵌入页主题（用于 iframe 背景，避免对比刺眼） */
  embedTheme?: "light" | "dark" | "auto";
  /** 简短说明 */
  note?: string;
};

/**
 * 当前已收录的可嵌入资源。
 *
 * 注意事项：
 *   - 这些 URL 都是公共页，不携带凭据
 *   - 如果某条在浏览器内被 X-Frame-Options 拒绝，SafeEmbed 会自动回退
 *   - 生产部署后可补充内网服务/自部署镜像，src 换成自己的子域
 */
export const embeds: EmbedEntry[] = [
  // ---------- 监控 / 观测 ----------
  {
    id: "grafana-status",
    title: "Grafana Cloud Status",
    src: "https://status.grafana.com",
    category: "status",
    source: "Grafana Labs",
    allowScripts: true,
    allowSameOrigin: false,
    embedTheme: "dark",
    note: "Grafana 官方 status 页面（公共可访问，iframe 友好）",
  },
  {
    id: "github-status",
    title: "GitHub Status",
    src: "https://www.githubstatus.com",
    category: "status",
    source: "GitHub",
    allowScripts: true,
    allowSameOrigin: false,
    embedTheme: "light",
    note: "GitHub 服务状态页（Atlassian Statuspage，公共嵌入友好）",
  },

  // ---------- 文档 ----------
  {
    id: "vite-docs",
    title: "Vite Docs",
    src: "https://vite.dev",
    category: "docs",
    source: "Vite",
    allowScripts: true,
    allowSameOrigin: false,
    embedTheme: "auto",
    note: "Vite 官方文档首页（演示用）",
  },

  // ---------- 仪表盘（Grafana 公开 demo） ----------
  {
    id: "grafana-demo",
    title: "Grafana Public Dashboard",
    src: "https://play.grafana.org/d/000000012/grafana-play-home",
    category: "dashboard",
    source: "Grafana Play",
    allowScripts: true,
    allowSameOrigin: false,
    embedTheme: "dark",
    refreshIntervalSec: 60,
    note: "Grafana 公开 Play 实例，演示 Grafana 仪表盘能力",
  },

  // ---------- Playground ----------
  {
    id: "tailwind-play",
    title: "Tailwind CSS Play CDN",
    src: "https://play.tailwindcss.com",
    category: "playground",
    source: "Tailwind Labs",
    allowScripts: true,
    allowSameOrigin: false,
    embedTheme: "light",
    note: "Tailwind 官方 Playground，可即时编写并预览",
  },
];

/** 按 category 分组 */
export const embedsByCategory = (): Record<EmbedCategory, EmbedEntry[]> => {
  const out: Record<EmbedCategory, EmbedEntry[]> = {
    status: [],
    docs: [],
    dashboard: [],
    playground: [],
    roadmap: [],
    blog: [],
  };
  for (const e of embeds) out[e.category].push(e);
  return out;
};

export const findEmbed = (id: string): EmbedEntry | undefined => embeds.find((e) => e.id === id);
