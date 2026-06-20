import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, listItem } from "@/lib/motion-presets";
import { cn, formatDate } from "@/lib/utils";
import { IconBrain, IconMessageSquare, IconSparkles, IconTimer, IconWaves } from "@/components/icons"
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

  const today = formatDate(now, "yyyy年MM月dd日 EEE");

  const metrics: Metric[] = [
    {
      label: "今日对话",
      value: String(HOME_OVERVIEW.todayConversations),
      hint: "较昨日 +12%",
      icon: IconMessageSquare,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "总会话",
      value: HOME_OVERVIEW.totalConversations.toLocaleString(),
      hint: "累计 1248 条",
      icon: IconBrain,
      tone: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "平均响应",
      value: `${HOME_OVERVIEW.avgResponseMs}ms`,
      hint: "P50 延迟",
      icon: IconTimer,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "飞轮健康度",
      value: `${HOME_OVERVIEW.flywheelHealth}%`,
      hint: "良好",
      icon: IconWaves,
      tone: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
    >
      <Card className="relative overflow-hidden border-primary/20">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(800px circle at 100% 0%, hsl(var(--primary) / 0.18), transparent 50%)",
          }}
        />
        <CardContent className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {greeting}，许泉兴 <span className="text-primary">👋</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              <IconSparkles className="mr-1 inline h-3.5 w-3.5 text-primary" />
              欢迎回到 AI 协作工作台 · {today}
            </p>
          </div>
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
                  className="flex items-center gap-2.5 rounded-md border border-border bg-card/60 px-3 py-2"
                >
                  <div className={cn("rounded-md p-1.5", m.bg, m.tone)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">{m.label}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold tabular-nums">{m.value}</span>
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
