/**
 * WelcomeBanner · Vercel + Linear 混合风格首页 hero
 *
 * 招牌元素:
 * - 黑色高对比渐变 banner (Vercel 招牌)
 * - 大字标题 + 紧凑 metadata (Linear 风)
 * - 4 列指标卡片 (Linear 紧凑行)
 * - 主 CTA 按钮 (Vercel 黑底白字 Deploy 风) + 次 CTA (Linear 风 边框)
 * - fadeInUp 动画
 */

import {
  IconArrowUpRight,
  IconBrain,
  IconMessageSquare,
  IconRocket,
  IconSparkles,
  IconTimer,
  IconWand,
  IconWaves,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, listItem } from "@/lib/motion-presets";
import { cn, formatDate } from "@/lib/utils";
import { motion } from "motion/react";
import { HOME_OVERVIEW } from "./mock-data";

type Metric = {
  label: string;
  value: string;
  hint: string;
  icon: typeof IconMessageSquare;
  tone: string;
  bg: string;
};

export function WelcomeBanner() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 5
      ? "凌晨好"
      : hour < 12
        ? "早上好"
        : hour < 14
          ? "中午好"
          : hour < 18
            ? "下午好"
            : "晚上好";

  const today = formatDate(now, "yyyy-MM-dd EEE");

  const metrics: Metric[] = [
    {
      label: "今日对话",
      value: String(HOME_OVERVIEW.todayConversations),
      hint: "较昨日 +12%",
      icon: IconMessageSquare,
      tone: "text-brand-600",
      bg: "bg-brand-500/10",
    },
    {
      label: "总会话",
      value: HOME_OVERVIEW.totalConversations.toLocaleString(),
      hint: "累计 1248 条",
      icon: IconBrain,
      tone: "text-sky-600",
      bg: "bg-sky-500/10",
    },
    {
      label: "平均响应",
      value: `${HOME_OVERVIEW.avgResponseMs}ms`,
      hint: "P50 延迟",
      icon: IconTimer,
      tone: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "飞轮健康度",
      value: `${HOME_OVERVIEW.flywheelHealth}%`,
      hint: "良好",
      icon: IconWaves,
      tone: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
    >
      <Card className="relative overflow-hidden border-border shadow-vercel">
        {/* 顶部 hero 区域 · Vercel 招牌黑底渐变 */}
        <div
          className="relative flex flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between"
          style={{
            background: "linear-gradient(135deg, #09090B 0%, #18181B 60%, #1F1F23 100%)",
          }}
        >
          {/* 装饰背景光斑 */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(94, 106, 210, 0.5) 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(132, 99, 255, 0.5) 0%, transparent 70%)",
            }}
          />

          {/* 左：标题区 */}
          <div className="relative space-y-2.5">
            <div className="flex items-center gap-2">
              <span
                className="flex h-5 items-center gap-1 rounded-full bg-white/10 px-2 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur"
                aria-hidden
              >
                <IconSparkles className="h-2.5 w-2.5" weight="fill" />
                AI Workspace
              </span>
              <span className="font-mono text-[10px] text-white/40">{today}</span>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
              {greeting}，许泉兴
              <span className="ml-2 text-white/60">👋</span>
            </h1>
            <p className="text-sm text-white/70">
              欢迎回到 AI 协作工作台 · 一站式对话 · 记忆 · 工单 · 监控
            </p>
          </div>

          {/* 右：CTA 按钮组（Vercel 招牌） */}
          <div className="relative flex shrink-0 items-center gap-2">
            <Button size="sm" className="h-8 gap-1.5 bg-white text-black hover:bg-white/90">
              <IconRocket className="h-3.5 w-3.5" weight="fill" />
              开始新对话
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10"
            >
              <IconWand className="h-3.5 w-3.5" />
              <span>AI 整理</span>
              <kbd className="ml-0.5 rounded border border-white/20 bg-white/10 px-1 font-mono text-[9px]">
                ⌘K
              </kbd>
            </Button>
            <a
              href="https://github.com/haihaihaihai-1/ai-workbench"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-8 items-center gap-1 rounded-md border border-white/20 bg-white/5 px-3 text-xs text-white/80 backdrop-blur transition-colors hover:bg-white/10 md:inline-flex"
            >
              GitHub
              <IconArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 底部指标行 · Linear 紧凑 4 列 */}
        <CardContent className="bg-card/40 p-4 backdrop-blur">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              const item = listItem(0.05 + i * 0.05);
              return (
                <motion.div
                  key={m.label}
                  initial={item.initial}
                  animate={item.animate}
                  transition={item.transition}
                  className="group flex items-center gap-2.5 rounded-md border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-foreground/30"
                >
                  <div className={cn("rounded-md p-1.5", m.bg, m.tone)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-base font-semibold tabular-nums text-foreground">
                        {m.value}
                      </span>
                    </div>
                    <div className="text-[9px] text-muted-foreground">{m.hint}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
