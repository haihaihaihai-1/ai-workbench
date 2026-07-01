// 概览 / Design Tokens
// 展示颜色 / 字体 / 间距 / 圆角 / 阴影

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";
import { DemoCard, SectionFrame } from "./section-frame";

type ColorToken = {
  name: string;
  cssVar: string;
  description: string;
};

const COLOR_TOKENS: ColorToken[] = [
  { name: "Primary", cssVar: "--primary", description: "品牌主色 · #5E6AD2" },
  { name: "Secondary", cssVar: "--secondary", description: "次要背景" },
  { name: "Accent", cssVar: "--accent", description: "强调背景" },
  { name: "Destructive", cssVar: "--destructive", description: "危险 / 错误" },
  { name: "Success", cssVar: "--success", description: "成功 / 通过" },
  { name: "Warning", cssVar: "--warning", description: "警告" },
  { name: "Info", cssVar: "--info", description: "提示信息" },
  { name: "Muted", cssVar: "--muted", description: "次要文字背景" },
];

function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="h-16 w-full" style={{ backgroundColor: `hsl(var(${token.cssVar}))` }} />
      <div className="space-y-0.5 p-2.5">
        <div className="text-xs font-medium">{token.name}</div>
        <div className="font-mono text-[10px] text-muted-foreground">hsl(var({token.cssVar}))</div>
        <div className="text-[10px] text-muted-foreground">{token.description}</div>
      </div>
    </div>
  );
}

const SPACING = [
  { name: "1", value: "0.25rem" },
  { name: "2", value: "0.5rem" },
  { name: "3", value: "0.75rem" },
  { name: "4", value: "1rem" },
  { name: "6", value: "1.5rem" },
  { name: "8", value: "2rem" },
  { name: "12", value: "3rem" },
  { name: "16", value: "4rem" },
];

const RADII = [
  { name: "sm", value: "calc(var(--radius) - 4px)" },
  { name: "md", value: "calc(var(--radius) - 2px)" },
  { name: "lg", value: "var(--radius)" },
  { name: "xl", value: "calc(var(--radius) + 4px)" },
  { name: "full", value: "9999px" },
];

const SHADOWS = [
  { name: "sm", className: "shadow-sm" },
  { name: "md", className: "shadow-md" },
  { name: "lg", className: "shadow-lg" },
  { name: "xl", className: "shadow-xl" },
];

export function SectionOverview() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  return (
    <SectionFrame
      id="overview"
      title="概览 / Design Tokens"
      description="颜色、字体、间距、圆角、阴影。所有值由 CSS 变量驱动，主题自动适配。"
    >
      {/* 主题切换 */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">主题</div>
            <div className="text-xs text-muted-foreground">
              当前:{" "}
              <Badge variant="secondary" className="ml-1">
                {theme}
              </Badge>
              {" → "}
              实际:{" "}
              <Badge variant="info" className="ml-1">
                {resolvedTheme}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-md border bg-muted p-1">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                  theme === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 颜色 */}
      <DemoCard
        title="颜色 Tokens"
        description="点击下方色块查看 CSS 变量值，dark/light 模式自动切换"
      >
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {COLOR_TOKENS.map((t) => (
            <ColorSwatch key={t.name} token={t} />
          ))}
        </div>
      </DemoCard>

      {/* 字体 */}
      <DemoCard title="字体" description="DM Sans (UI) · Instrument Serif (标题) · JetBrains Mono (代码)">
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">DM Sans · UI</div>
            <div className="text-2xl font-semibold tracking-tight">The quick brown fox</div>
            <div className="text-sm text-muted-foreground">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz · 0123456789
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Mono · 代码</div>
            <code className="font-mono text-sm">
              const sum = (a: number, b: number) =&gt; a + b;
            </code>
          </div>
        </div>
      </DemoCard>

      {/* 间距 */}
      <DemoCard title="间距" description="基于 0.25rem (4px) 的等比缩放">
        <div className="space-y-2">
          {SPACING.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-12 font-mono text-xs text-muted-foreground">{s.name}</div>
              <div className="h-3 rounded-sm bg-primary/70" style={{ width: s.value }} />
              <div className="font-mono text-xs text-muted-foreground">{s.value}</div>
            </div>
          ))}
        </div>
      </DemoCard>

      {/* 圆角 */}
      <DemoCard title="圆角" description="由 --radius 变量驱动">
        <div className="flex flex-wrap gap-3">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-1.5">
              <div
                className="h-12 w-12 border-2 border-primary bg-primary/15"
                style={{ borderRadius: r.value }}
              />
              <div className="text-xs font-medium">{r.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{r.value}</div>
            </div>
          ))}
        </div>
      </DemoCard>

      {/* 阴影 */}
      <DemoCard title="阴影" description="使用 Tailwind 内置 shadow-* 工具类">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {SHADOWS.map((s) => (
            <div
              key={s.name}
              className={cn(
                "flex h-20 items-center justify-center rounded-lg border bg-card text-xs font-medium",
                s.className,
              )}
            >
              shadow-{s.name}
            </div>
          ))}
        </div>
      </DemoCard>
    </SectionFrame>
  );
}
