import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV } from "@/lib/export";
import { cn, formatDate, relativeTime } from "@/lib/utils";
import { IconCheckCircle2, IconClock, IconDownload, IconFileText, IconStar, IconThumbsUp } from "@/components/icons"
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

      {/* 表格 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">ID</TableHead>
              <TableHead className="text-[10px]">用户</TableHead>
              <TableHead className="text-[10px]">领域</TableHead>
              <TableHead className="text-[10px]">评分</TableHead>
              <TableHead className="text-[10px]">标签</TableHead>
              <TableHead className="text-[10px] max-w-md">评论</TableHead>
              <TableHead className="text-[10px]">时间</TableHead>
              <TableHead className="text-[10px]">状态</TableHead>
              <TableHead className="text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => {
              const v = AGENT_VISUAL[f.domain];
              return (
                <TableRow key={f.id}>
                  <TableCell className="py-2 font-mono text-[11px] text-muted-foreground">
                    {f.id}
                  </TableCell>
                  <TableCell className="py-2 font-mono text-[11px]">{f.user}</TableCell>
                  <TableCell className="py-2 text-xs">
                    <Badge variant="outline" className="text-[10px]">
                      {v.emoji} {v.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <IconStar
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < f.rating ? "fill-warning text-warning" : "text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-wrap gap-0.5">
                      {f.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[9px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 max-w-md truncate text-xs text-muted-foreground">
                    {f.comment}
                  </TableCell>
                  <TableCell className="py-2 text-[11px] text-muted-foreground">
                    {relativeTime(f.createdAt)}
                  </TableCell>
                  <TableCell className="py-2">
                    {f.status === "pending" ? (
                      <Badge variant="warning" className="text-[10px]">
                        待处理
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">
                        已处理
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => setSelected(f)}
                    >
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

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
