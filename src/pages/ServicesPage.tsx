/**
 * ServicesPage · Vercel 风格服务大厅
 *
 * Vercel 借皮要点：
 * - 项目列表：状态圆点 + 名称 + 框架 + 域名 + 最后部署
 * - 黑色高对比顶栏（Vercel Dashboard 招牌）
 * - 硬阴影（shadow-vercel）
 * - 圆角 0.5rem (--radius)
 * - 极简 emoji + 短域名 (vercel.com/_components/...)
 * - 0.6s 慢动效（已 token）
 */

import {
  IconArrowUpRight,
  IconClock,
  IconDotsThree,
  IconGitBranch,
  IconLightning,
  IconMagnifyingGlass,
  IconRocket,
} from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  type ServiceCategory,
  type ServiceItem,
} from "./services/mock-data";

/* Vercel 招牌：3 种状态圆点 */
const STATUS_DOT = {
  available: { color: "#10B981", label: "Ready" },
  beta: { color: "#F59E0B", label: "Building" },
  coming_soon: { color: "#7A7A7A", label: "Idle" },
} satisfies Record<ServiceItem["status"], { color: string; label: string }>;

const STATUS_BG = {
  available: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  beta: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  coming_soon: "bg-muted text-muted-foreground",
} satisfies Record<ServiceItem["status"], string>;

const STATUS_LABEL = {
  available: "可用",
  beta: "Beta",
  coming_soon: "敬请期待",
} satisfies Record<ServiceItem["status"], string>;

export default function ServicesPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("academic");

  const filterItems = (items: ServiceItem[]) =>
    items.filter(
      (i) =>
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.description.toLowerCase().includes(q.toLowerCase()),
    );

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 · Vercel 招牌：极简标题 + 搜索栏 + Deploy 按钮 */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
            <IconRocket className="h-5 w-5" weight="fill" />
            Projects
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            学业 · 心理 · 教务 · 生活 · 一站式服务大厅
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <IconMagnifyingGlass className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索服务..."
              className="h-8 pl-8 font-mono text-xs"
            />
          </div>
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            <IconLightning className="h-3.5 w-3.5" weight="fill" />
            Deploy
          </button>
        </div>
      </header>

      {/* 分类切换 · Vercel 风格：下划线式 */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
        <TabsList className="h-9 rounded-none border-b border-border bg-transparent p-0">
          {SERVICE_CATEGORIES.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className={cn(
                "h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs font-medium",
                "data-[state=active]:border-foreground data-[state=active]:bg-transparent",
                "data-[state=active]:text-foreground text-muted-foreground",
              )}
            >
              <span className="mr-1.5 text-sm">{c.emoji}</span>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {SERVICE_CATEGORIES.map((cat) => {
          const items = filterItems(SERVICES[cat.id]);
          const totalUsage = items.reduce((sum, i) => sum + i.usage, 0);

          return (
            <div key={cat.id} className="mt-4 space-y-3">
              {/* 分类描述 + 统计 · Vercel 风格：极简 */}
              <div className="flex items-baseline justify-between px-1">
                <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
                  <span className={cn("font-mono text-[10px] uppercase tracking-wider", cat.color)}>
                    {cat.id}
                  </span>
                  <span>·</span>
                  <span>{cat.description}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                  <span>{items.length} projects</span>
                  <span className="opacity-30">·</span>
                  <span>{totalUsage.toLocaleString()} calls</span>
                </div>
              </div>

              {/* 项目列表 · Vercel 招牌：每行服务 = 一个项目 */}
              <Card className="overflow-hidden rounded-md border-border shadow-vercel">
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/60">
                    {items.map((item, i) => (
                      <ServiceRow
                        key={item.id}
                        item={item}
                        index={i}
                        onClick={() =>
                          toast.info(`进入「${item.name}」服务`, {
                            description: item.description,
                          })
                        }
                      />
                    ))}
                    {items.length === 0 && (
                      <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                        暂无匹配的服务
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </Tabs>
    </div>
  );
}

/* Vercel 招牌项目行：状态圆点 + 名称 + 框架 + 域名 + 最后部署 + 操作 */
function ServiceRow({
  item,
  index,
  onClick,
}: { item: ServiceItem; index: number; onClick: () => void }) {
  const dot = STATUS_DOT[item.status];

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex w-full items-center gap-4 px-4 py-3 text-left transition-colors",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:bg-muted/40",
        )}
      >
        {/* 状态圆点 · Vercel 招牌：8px 实心圆 */}
        <span className="relative flex h-2 w-2 shrink-0" title={dot.label} aria-label={dot.label}>
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: dot.color }}
            aria-hidden
          />
          {item.status === "beta" ? (
            <span
              className="absolute inset-0 animate-pulse-dot rounded-full"
              style={{ backgroundColor: dot.color, opacity: 0.4 }}
              aria-hidden
            />
          ) : null}
        </span>

        {/* Emoji 标识 */}
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-base"
          aria-hidden
        >
          {item.icon}
        </span>

        {/* 名称 + 描述 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-medium text-foreground">
              {item.name}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                STATUS_BG[item.status],
              )}
            >
              {STATUS_LABEL[item.status]}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{item.description}</p>
        </div>

        {/* 中间 meta · Vercel 风格：分支 + 域名 + 调用次数 */}
        <div className="hidden items-center gap-4 text-[11px] text-muted-foreground md:flex">
          <span className="flex items-center gap-1 font-mono">
            <IconGitBranch className="h-3 w-3" />
            main
          </span>
          <span className="flex max-w-[180px] items-center gap-1 truncate font-mono">
            <span className="opacity-50">svc/{item.id}.vercel.app</span>
            <IconArrowUpRight className="h-3 w-3 opacity-50" />
          </span>
        </div>

        {/* 调用次数 · Vercel 招牌：紧凑右对齐 */}
        <div className="hidden w-24 shrink-0 text-right font-mono text-xs text-muted-foreground lg:block">
          {item.usage.toLocaleString()}
          <span className="ml-1 text-[10px] opacity-60">calls</span>
        </div>

        {/* 最后部署时间 · Vercel 风格 */}
        <div className="hidden w-20 shrink-0 text-right text-[10px] text-muted-foreground lg:flex">
          <span className="font-mono">{relativeDeployTime(index)}</span>
        </div>

        {/* 操作按钮 · Vercel 风格：hover 显 */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="查看日志"
            title="查看日志"
          >
            <IconClock className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="更多"
            title="更多"
          >
            <IconDotsThree className="h-3.5 w-3.5" />
          </button>
        </div>
      </button>
    </li>
  );
}

/* Vercel 风格：相对部署时间显示 */
function relativeDeployTime(index: number): string {
  const presets = ["2m", "14m", "1h", "3h", "12h", "1d", "2d", "5d"];
  return presets[index % presets.length] ?? "—";
}
