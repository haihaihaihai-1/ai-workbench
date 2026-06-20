import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV } from "@/lib/export";
import { cn, formatDate, relativeTime } from "@/lib/utils";
import {
  IconCheck,
  IconCheckCircle2,
  IconClock,
  IconDownload,
  IconFileText,
  IconStar,
  IconThumbsUp,
} from "@/components/icons";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { FEEDBACKS, FEEDBACK_STATS, type Feedback } from "./feedback/mock-data";
import { AGENT_VISUAL } from "./home/mock-data";

const STAR_COLORS = ["#EF4444", "#F59E0B", "#F59E0B", "#3B82F6", "#10B981"];

export default function FeedbackPage() {
  const [q, setQ] = useState("");
  const [rating, setRating] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "pending" | "processed">("all");
  const [selected, setSelected] = useState<Feedback | null>(null);

  const filtered = useMemo(() => {
    return FEEDBACKS.filter((f) => {
      if (q) {
        const lq = q.toLowerCase();
        if (!f.comment.toLowerCase().includes(lq) && !f.user.toLowerCase().includes(lq))
          return false;
      }
      if (rating !== "all" && String(f.rating) !== rating) return false;
      if (status !== "all" && f.status !== status) return false;
      return true;
    });
  }, [q, rating, status]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <IconFileText className="h-6 w-6 text-primary" />
            反馈管理
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            收集和处理用户对 AI 回复的反馈 · 评分分布 · 趋势分析
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() =>
              exportToCSV(FEEDBACKS, "feedbacks.csv", [
                { key: "id", label: "ID" },
                { key: "user", label: "用户" },
                { key: "domain", label: "领域" },
                { key: "rating", label: "评分" },
                { key: "tags", label: "标签" },
                { key: "comment", label: "评论" },
                { key: "status", label: "状态" },
                { key: "createdAt", label: "时间" },
              ])
            }
          >
            <IconDownload className="h-3.5 w-3.5" />
            导出 CSV
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="总反馈" value={FEEDBACK_STATS.total} icon={IconFileText} tone="text-primary" />
        <StatCard
          label="平均评分"
          value={FEEDBACK_STATS.avgRating}
          unit="/ 5"
          icon={IconStar}
          tone="text-warning"
        />
        <StatCard
          label="好评率"
          value={`${FEEDBACK_STATS.positiveRate}%`}
          icon={IconThumbsUp}
          tone="text-success"
        />
        <StatCard
          label="待处理"
          value={FEEDBACK_STATS.pending}
          icon={IconClock}
          tone="text-destructive"
        />
      </div>

      {/* 图表 */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">评分分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={FEEDBACK_STATS.distribution}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="star"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {FEEDBACK_STATS.distribution.map((_, i) => (
                    <Cell key={i} fill={STAR_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">正/负反馈趋势（14 天）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={FEEDBACK_STATS.trend}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="好评"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name="差评"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 筛选 */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索评论、用户..."
            className="h-8 max-w-sm text-xs"
          />
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="评分" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部评分</SelectItem>
              <SelectItem value="5">5 星</SelectItem>
              <SelectItem value="4">4 星</SelectItem>
              <SelectItem value="3">3 星</SelectItem>
              <SelectItem value="2">2 星</SelectItem>
              <SelectItem value="1">1 星</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <TabsList>
              <TabsTrigger value="all" className="h-7 text-xs">
                全部
              </TabsTrigger>
              <TabsTrigger value="pending" className="h-7 text-xs">
                待处理
              </TabsTrigger>
              <TabsTrigger value="processed" className="h-7 text-xs">
                已处理
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="ml-auto text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{filtered.length}</span> /{" "}
            {FEEDBACKS.length} 条
          </span>
        </CardContent>
      </Card>

      {/* 列表 · Linear 风格紧凑行 */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/30">
        <div className="sticky top-0 z-10 grid grid-cols-[80px_120px_100px_80px_60px_minmax(0,1fr)_80px_80px] items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>ID</span>
          <span>用户</span>
          <span>领域</span>
          <span>评分</span>
          <span>状态</span>
          <span>评论</span>
          <span className="text-right">时间</span>
          <span className="text-right">操作</span>
        </div>

        <ScrollArea className="max-h-[calc(100vh-30rem)]">
          <div className="divide-y divide-border/40">
            {filtered.map((f) => {
              const v = AGENT_VISUAL[f.domain];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelected(f)}
                  className={cn(
                    "grid w-full grid-cols-[80px_120px_100px_80px_60px_minmax(0,1fr)_80px_80px] items-center gap-3 px-4 py-2 text-left",
                    "transition-colors hover:bg-accent/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-inset",
                  )}
                >
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {f.id}
                  </span>
                  <span className="truncate font-mono text-[10px]">{f.user}</span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {v.emoji} {v.name}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <IconStar
                        key={i}
                        className={cn(
                          "h-2.5 w-2.5",
                          i < f.rating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/30",
                        )}
                      />
                    ))}
                  </div>
                  {f.status === "pending" ? (
                    <span
                      className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500" />
                      待处理
                    </span>
                  ) : (
                    <span
                      className="inline-flex w-fit items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
                    >
                      <IconCheck className="h-2.5 w-2.5" />
                      已处理
                    </span>
                  )}
                  <span className="line-clamp-1 text-xs text-foreground/80">{f.comment}</span>
                  <span className="text-right text-[10px] text-muted-foreground">
                    {relativeTime(f.createdAt)}
                  </span>
                  <span className="text-right text-[10px] font-medium text-brand-500">
                    查看 →
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                暂无符合的反馈
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconFileText className="h-4 w-4" />
                  反馈详情 · <span className="font-mono">{selected.id}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Info label="用户" value={selected.user} />
                  <Info
                    label="领域"
                    value={`${AGENT_VISUAL[selected.domain].emoji} ${AGENT_VISUAL[selected.domain].name}`}
                  />
                  <Info label="时间" value={formatDate(selected.createdAt, "MM-dd HH:mm")} />
                  <Info
                    label="评分"
                    value={`${"★".repeat(selected.rating)}${"☆".repeat(5 - selected.rating)}`}
                  />
                  <Info label="标签" value={selected.tags.join(", ")} />
                  <Info label="状态" value={selected.status === "pending" ? "待处理" : "已处理"} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">用户问题：</div>
                  <div className="mt-1 rounded-md border border-border bg-muted/30 p-2.5 text-sm">
                    {selected.userMessage}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">AI 回复：</div>
                  <div className="mt-1 rounded-md border border-border bg-muted/30 p-2.5 text-sm">
                    {selected.aiReply}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">用户评论：</div>
                  <div className="mt-1 rounded-md border border-primary/30 bg-primary/5 p-2.5 text-sm">
                    {selected.comment}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  {selected.status === "pending" ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelected(null);
                        toast.success("已标记为已处理");
                      }}
                    >
                      <IconCheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      标记已处理
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
                    关闭
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
}: { label: string; value: string | number; unit?: string; icon: typeof IconStar; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("rounded-md bg-muted p-2", tone)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold tabular-nums">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-2.5 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
