import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconBarChart3, IconBrain, IconFileText, IconGauge, IconMessageSquare, IconSparkles } from "@/components/icons"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Action = {
  id: string;
  label: string;
  emoji: string;
  icon: typeof IconMessageSquare;
  href: string;
  bg: string;
  tone: string;
  badge?: string;
};

const ACTIONS: Action[] = [
  {
    id: "chat",
    label: "对话",
    emoji: "💬",
    icon: IconMessageSquare,
    href: "/chat",
    bg: "bg-primary/10",
    tone: "text-primary",
    badge: "新会话",
  },
  {
    id: "memory",
    label: "记忆",
    emoji: "🧠",
    icon: IconBrain,
    href: "/memory",
    bg: "bg-info/10",
    tone: "text-info",
  },
  {
    id: "tickets",
    label: "工单",
    emoji: "🎫",
    icon: IconFileText,
    href: "/tickets",
    bg: "bg-warning/10",
    tone: "text-warning",
    badge: "3 待办",
  },
  {
    id: "monitor",
    label: "监控",
    emoji: "📊",
    icon: IconGauge,
    href: "/monitor",
    bg: "bg-success/10",
    tone: "text-success",
  },
  {
    id: "flywheel",
    label: "飞轮",
    emoji: "🎯",
    icon: IconSparkles,
    href: "/flywheel",
    bg: "bg-violet-500/10",
    tone: "text-violet-400",
  },
  {
    id: "evaluation",
    label: "评估",
    emoji: "🧪",
    icon: IconBarChart3,
    href: "/evaluation",
    bg: "bg-rose-500/10",
    tone: "text-rose-400",
  },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">快捷入口</h2>
          <span className="text-[10px] text-muted-foreground">点击直达工作区</span>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  navigate(a.href);
                  toast.success(`进入「${a.label}」工作区`);
                }}
                className="group relative flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full text-lg transition-all group-hover:scale-110",
                    a.bg,
                    a.tone,
                  )}
                >
                  {a.emoji}
                </div>
                <div className="text-xs font-medium">{a.label}</div>
                {a.badge && (
                  <span className="absolute right-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                    {a.badge}
                  </span>
                )}
                <Icon className="sr-only h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
