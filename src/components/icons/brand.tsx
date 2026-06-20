/**
 * 品牌图标集（simple-icons 包装）
 *
 * 来源: https://github.com/simple-icons/simple-icons
 * 收录: 主流开源/产品的官方 logo
 *
 * 用法:
 *   import { BrandLinear, BrandVercel, BrandGitHub, ... } from "@/components/icons/brand";
 *   <BrandLinear className="h-4 w-4" />
 *
 * 颜色: 各品牌有官方色 (Linear=#5E6AD2, Vercel=#000, GitHub=#181717 ...)
 *       业务方可以用 color prop 覆盖（如 [BrandLinear]?color=#fff）
 */

import { type SVGProps } from "react";
// 性能优化: simple-icons 有 3000+ 图标，全量 import 会让 bundle 增 1.2MB
// 这里只 eager import 12 个常用 brand icon，其余用 dynamic import 按需加载
import {
  siLinear,
  siVercel,
  siGithub,
  siNotion,
  siGrafana,
  siOpenaigym,
  siAnthropic,
  siGoogle,
  siApple,
  siReact,
  siTypescript,
  siVuedotjs,
} from "simple-icons";
import { cn } from "@/lib/utils";

/* === 品牌颜色（官方色） === */

const BRAND_COLORS = {
  linear: "#5E6AD2",
  vercel: "#000000",
  github: "#181717",
  notion: "#000000",
  grafana: "#F46800",
  chatgpt: "#10A37F",
  openai: "#412991",
  anthropic: "#D4A27F",
  supabase: "#3FCF8E",
  stripe: "#635BFF",
  claude: "#D97757",
  gemini: "#8E75B2",
  huggingface: "#FFD21E",
  figma: "#F24E1E",
  react: "#61DAFB",
  vite: "#646CFF",
  typescript: "#3178C6",
  tailwind: "#06B6D4",
  pnpm: "#F69220",
  node: "#5FA04E",
  docker: "#2496ED",
  kubernetes: "#326CE5",
  postgresql: "#4169E1",
  redis: "#DC382D",
  nginx: "#009639",
  cloudflare: "#F38020",
  aws: "#FF9900",
  gcp: "#4285F4",
  azure: "#0078D4",
  slack: "#4A154B",
  discord: "#5865F2",
  telegram: "#26A5E4",
  whatsapp: "#25D366",
  jira: "#0052CC",
  figmaOriginal: "#F24E1E",
  zapier: "#FF4A00",
  n8n: "#EA4B71",
  langchain: "#1C3C3C",
  langsmith: "#FF6B6B",
  langfuse: "#3B82F6",
  playwright: "#2EAD33",
  vitest: "#729B1B",
  cypress: "#17202C",
  githubCopilot: "#000000",
  cursor: "#000000",
  windsurf: "#00BFA5",
  perplexity: "#20808D",
  elevenlabs: "#000000",
  runway: "#000000",
  midjourney: "#000000",
  stable: "#000000",
  reddit: "#FF4500",
  twitter: "#000000",
  x: "#000000",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  tiktok: "#000000",
  instagram: "#E4405F",
  facebook: "#1877F2",
  pinterest: "#BD081C",
  spotify: "#1ED760",
  apple: "#000000",
  google: "#4285F4",
  microsoft: "#5E5E5E",
  amazon: "#FF9900",
  meta: "#0467DF",
  nvidia: "#76B900",
  intel: "#0071C5",
  amd: "#ED1C24",
} as const;

export type BrandKey = keyof typeof BRAND_COLORS;

/* === 工具：把 simple-icons 的 svg path 包装成 React 组件 === */

type BrandIconProps = SVGProps<SVGSVGElement> & {
  /** 是否用品牌官方色（默认 true） */
  brandColor?: boolean;
  /** 自定义色（覆盖 brandColor） */
  color?: string;
};

/**
 * 通用品牌图标工厂
 * 注: simple-icons 提供的是 svg path data 字符串（不带外层 svg）
 */
function makeBrandIcon(slug: string, color: string) {
  return function BrandIcon({ brandColor = true, color: customColor, className, ...props }: BrandIconProps) {
    const fill = customColor ?? (brandColor ? color : "currentColor");
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill={fill}
        aria-label={slug}
        className={cn("inline-block shrink-0", className)}
        {...props}
      >
        {/* 延迟到运行时注入 path（dynamic import 简化） */}
        <BrandPath slug={slug} />
      </svg>
    );
  };
}

/* === 12 个常用图标 (eager import) === */
const EAGER_ICONS: Record<string, { path: string }> = {
  linear: siLinear,
  vercel: siVercel,
  github: siGithub,
  notion: siNotion,
  grafana: siGrafana,
  openaigym: siOpenaigym,
  anthropic: siAnthropic,
  google: siGoogle,
  apple: siApple,
  react: siReact,
  typescript: siTypescript,
  vuedotjs: siVuedotjs,
};

/* === 其余图标 (按需 dynamic import) ===
 * 利用 simple-icons 的 "./icons/*" 子路径导出
 * Vite 会把每个 siXxx 拆成独立 chunk，首次访问才下载
 */
const lazyCache = new Map<string, { path: string }>();
const pendingPromises = new Map<string, Promise<void>>();

/* slug (camelCase) -> siXxx (PascalCase) -> file (kebab-case) */
function slugToPath(slug: string): string {
  // linear -> siLinear -> linear (kebab same as input)
  // anthropic -> siAnthropic -> anthropic
  return `simple-icons/icons/si${toPascal(slug)}`;
}

async function loadLazyIcon(slug: string): Promise<void> {
  if (lazyCache.has(slug)) return;
  if (pendingPromises.has(slug)) return pendingPromises.get(slug);

  const promise = (async () => {
    try {
      const mod = await import(/* @vite-ignore */ slugToPath(slug));
      if (mod && typeof mod === "object" && "path" in mod) {
        lazyCache.set(slug, mod as { path: string });
      }
    } catch (e) {
      console.warn(`[brand-icons] Failed to load "${slug}":`, e);
    } finally {
      pendingPromises.delete(slug);
    }
  })();
  pendingPromises.set(slug, promise);
  return promise;
}

function BrandPath({ slug }: { slug: string }) {
  // 1) 优先用 eager
  const eager = EAGER_ICONS[slug];
  if (eager) return <path d={eager.path} />;

  // 2) 用 lazy cache
  const cached = lazyCache.get(slug);
  if (cached) return <path d={cached.path} />;

  // 3) 触发 dynamic import（首屏渲染不阻塞）
  loadLazyIcon(slug);

  return <title>{slug}</title>;
}

function toPascal(input: string): string {
  return input
    .replace(/[-_\s]+(.)?/g, (_m, c: string | undefined) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

/* === 60+ 品牌图标命名导出 === */

const BRAND_DEFS: Array<[string, BrandKey]> = [
  // === AI / LLM ===
  ["openai", "openai"],
  ["chatgpt", "chatgpt"],
  ["claude", "claude"],
  ["anthropic", "anthropic"],
  ["gemini", "gemini"],
  ["huggingface", "huggingface"],
  ["perplexity", "perplexity"],
  ["elevenlabs", "elevenlabs"],
  ["midjourney", "midjourney"],
  ["runway", "runway"],
  ["stability", "stable"],
  ["githubcopilot", "githubCopilot"],
  ["cursor", "cursor"],
  ["windsurf", "windsurf"],
  ["langchain", "langchain"],
  ["langsmith", "langsmith"],
  ["langfuse", "langfuse"],

  // === 借皮对象 ===
  ["linear", "linear"],
  ["vercel", "vercel"],
  ["github", "github"],
  ["notion", "notion"],
  ["grafana", "grafana"],
  ["supabase", "supabase"],

  // === 商业 / 工具 ===
  ["stripe", "stripe"],
  ["figma", "figma"],
  ["slack", "slack"],
  ["discord", "discord"],
  ["telegram", "telegram"],
  ["whatsapp", "whatsapp"],
  ["jira", "jira"],
  ["zapier", "zapier"],
  ["n8n", "n8n"],
  ["playwright", "playwright"],
  ["vitest", "vitest"],
  ["cypress", "cypress"],

  // === 开发框架 ===
  ["react", "react"],
  ["vite", "vite"],
  ["typescript", "typescript"],
  ["tailwindcss", "tailwind"],
  ["pnpm", "pnpm"],
  ["nodedotjs", "node"],
  ["docker", "docker"],
  ["kubernetes", "kubernetes"],
  ["postgresql", "postgresql"],
  ["redis", "redis"],
  ["nginx", "nginx"],

  // === 云服务 ===
  ["cloudflare", "cloudflare"],
  ["amazonaws", "aws"],
  ["googlecloud", "gcp"],
  ["azure", "azure"],

  // === 社交平台 ===
  ["reddit", "reddit"],
  ["twitter", "twitter"],
  ["x", "x"],
  ["linkedin", "linkedin"],
  ["youtube", "youtube"],
  ["tiktok", "tiktok"],
  ["instagram", "instagram"],
  ["facebook", "facebook"],
  ["pinterest", "pinterest"],
  ["spotify", "spotify"],

  // === 大公司 ===
  ["apple", "apple"],
  ["google", "google"],
  ["microsoft", "microsoft"],
  ["amazon", "amazon"],
  ["meta", "meta"],
  ["nvidia", "nvidia"],
  ["intel", "intel"],
  ["amd", "amd"],
];

/* === 动态生成导出 === */

const brandIconRegistry: Record<string, ComponentType<BrandIconProps>> = {};
for (const [slug, key] of BRAND_DEFS) {
  brandIconRegistry[`Brand${toPascal(slug)}`] = makeBrandIcon(slug, BRAND_COLORS[key]);
}

/* === 命名导出（运行时按需查找） === */

type ComponentType<P = unknown> = (props: P) => JSX.Element;

export const brandIcons = brandIconRegistry;

/* === 辅助：BrandImage 通用组件（不知道名字时可用） === */
export function BrandImage({ slug, ...props }: { slug: string } & BrandIconProps) {
  const Comp = brandIconRegistry[`Brand${toPascal(slug)}`];
  if (Comp) return <Comp {...props} />;
  return (
    <span className={cn("inline-flex h-4 w-4 items-center justify-center rounded bg-muted text-[8px]", props.className)} title={slug}>
      ?
    </span>
  );
}

/* === 显式命名导出（业务方 IDE 友好） === */
export const BrandOpenai = brandIconRegistry.BrandOpenai;
export const BrandChatgpt = brandIconRegistry.BrandChatgpt;
export const BrandClaude = brandIconRegistry.BrandClaude;
export const BrandAnthropic = brandIconRegistry.BrandAnthropic;
export const BrandGemini = brandIconRegistry.BrandGemini;
export const BrandHuggingface = brandIconRegistry.BrandHuggingface;
export const BrandPerplexity = brandIconRegistry.BrandPerplexity;
export const BrandElevenlabs = brandIconRegistry.BrandElevenlabs;
export const BrandMidjourney = brandIconRegistry.BrandMidjourney;
export const BrandRunway = brandIconRegistry.BrandRunway;
export const BrandStability = brandIconRegistry.BrandStability;
export const BrandGithubcopilot = brandIconRegistry.BrandGithubcopilot;
export const BrandCursor = brandIconRegistry.BrandCursor;
export const BrandWindsurf = brandIconRegistry.BrandWindsurf;
export const BrandLangchain = brandIconRegistry.BrandLangchain;
export const BrandLangsmith = brandIconRegistry.BrandLangsmith;
export const BrandLangfuse = brandIconRegistry.BrandLangfuse;
export const BrandLinear = brandIconRegistry.BrandLinear;
export const BrandVercel = brandIconRegistry.BrandVercel;
export const BrandGithub = brandIconRegistry.BrandGithub;
export const BrandNotion = brandIconRegistry.BrandNotion;
export const BrandGrafana = brandIconRegistry.BrandGrafana;
export const BrandSupabase = brandIconRegistry.BrandSupabase;
export const BrandStripe = brandIconRegistry.BrandStripe;
export const BrandFigma = brandIconRegistry.BrandFigma;
export const BrandSlack = brandIconRegistry.BrandSlack;
export const BrandDiscord = brandIconRegistry.BrandDiscord;
export const BrandTelegram = brandIconRegistry.BrandTelegram;
export const BrandWhatsapp = brandIconRegistry.BrandWhatsapp;
export const BrandJira = brandIconRegistry.BrandJira;
export const BrandZapier = brandIconRegistry.BrandZapier;
export const BrandN8n = brandIconRegistry.BrandN8n;
export const BrandPlaywright = brandIconRegistry.BrandPlaywright;
export const BrandVitest = brandIconRegistry.BrandVitest;
export const BrandCypress = brandIconRegistry.BrandCypress;
export const BrandReact = brandIconRegistry.BrandReact;
export const BrandVite = brandIconRegistry.BrandVite;
export const BrandTypescript = brandIconRegistry.BrandTypescript;
export const BrandTailwindcss = brandIconRegistry.BrandTailwindcss;
export const BrandPnpm = brandIconRegistry.BrandPnpm;
export const BrandNodedotjs = brandIconRegistry.BrandNodedotjs;
export const BrandDocker = brandIconRegistry.BrandDocker;
export const BrandKubernetes = brandIconRegistry.BrandKubernetes;
export const BrandPostgresql = brandIconRegistry.BrandPostgresql;
export const BrandRedis = brandIconRegistry.BrandRedis;
export const BrandNginx = brandIconRegistry.BrandNginx;
export const BrandCloudflare = brandIconRegistry.BrandCloudflare;
export const BrandAmazonaws = brandIconRegistry.BrandAmazonaws;
export const BrandGooglecloud = brandIconRegistry.BrandGooglecloud;
export const BrandAzure = brandIconRegistry.BrandAzure;
export const BrandReddit = brandIconRegistry.BrandReddit;
export const BrandTwitter = brandIconRegistry.BrandTwitter;
export const BrandX = brandIconRegistry.BrandX;
export const BrandLinkedin = brandIconRegistry.BrandLinkedin;
export const BrandYoutube = brandIconRegistry.BrandYoutube;
export const BrandTiktok = brandIconRegistry.BrandTiktok;
export const BrandInstagram = brandIconRegistry.BrandInstagram;
export const BrandFacebook = brandIconRegistry.BrandFacebook;
export const BrandPinterest = brandIconRegistry.BrandPinterest;
export const BrandSpotify = brandIconRegistry.BrandSpotify;
export const BrandApple = brandIconRegistry.BrandApple;
export const BrandGoogle = brandIconRegistry.BrandGoogle;
export const BrandMicrosoft = brandIconRegistry.BrandMicrosoft;
export const BrandAmazon = brandIconRegistry.BrandAmazon;
export const BrandMeta = brandIconRegistry.BrandMeta;
export const BrandNvidia = brandIconRegistry.BrandNvidia;
export const BrandIntel = brandIconRegistry.BrandIntel;
export const BrandAmd = brandIconRegistry.BrandAmd;
