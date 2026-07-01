import {
  IconDotsThree,
  IconPlus,
  IconShareNetwork,
  IconSparkle,
  IconStar,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Memory } from "@/lib/types";
import { formatDate, relativeTime } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MemoryCard } from "./memory-card";
import { type MemoryFilterState, MemoryFilters } from "./memory-filters";
import { MemoryCharts, MemoryStats } from "./memory-stats";
import { MOCK_MEMORIES } from "./mock-data";
import { NewMemoryDialog } from "./new-memory-dialog";
import { ProfilePanel } from "./profile-panel";

export default function MemoryPage() {
  const [filters, setFilters] = useState<MemoryFilterState>({
    q: "",
    type: "all",
    tag: null,
    sort: "newest",
  });
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [showNewDialog, setShowNewDialog] = useState(false);

  const filtered = useMemo(() => {
    let list = memories.filter((m) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !m.content.toLowerCase().includes(q) &&
          !m.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.type !== "all" && m.type !== filters.type) return false;
      if (filters.tag && !m.tags.includes(filters.tag)) return false;
      return true;
    });
    if (filters.sort === "newest") list = list.sort((a, b) => b.createdAt - a.createdAt);
    else if (filters.sort === "oldest") list = list.sort((a, b) => a.createdAt - b.createdAt);
    else if (filters.sort === "confidence") list = list.sort((a, b) => b.confidence - a.confidence);
    return list;
  }, [memories, filters]);

  // 按月分组
  const grouped = useMemo(() => {
    const g: Record<string, Memory[]> = {};
    for (const m of filtered) {
      const key = formatDate(m.createdAt, "yyyy-MM");
      g[key] = g[key] ?? [];
      g[key].push(m);
    }
    return g;
  }, [filtered]);

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    toast.success("记忆已删除");
  };

  const handleTogglePin = (id: string) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)));
  };

  const handleCreateMemory = (memory: Memory) => {
    setMemories((prev) => [memory, ...prev]);
  };

  const handleAIOrganize = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "AI 正在整理记忆...",
        success: () => {
          // 模拟: 按置信度排序并自动标签
          setMemories((prev) =>
            [...prev].sort((a, b) => b.confidence - a.confidence),
          );
          return "AI 整理完成！已按置信度重新排序";
        },
        error: "整理失败",
      },
    );
  };

  const handleShare = () => {
    const data = JSON.stringify(
      { memories: filtered, exportedAt: new Date().toISOString() },
      null,
      2,
    );
    navigator.clipboard.writeText(data).then(
      () => toast.success(`已复制 ${filtered.length} 条记忆到剪贴板`),
      () => toast.error("复制失败，请重试"),
    );
  };

  const relativeDate = (ts?: number) => (ts ? relativeTime(ts) : "—");

  return (
    <div className="flex flex-col gap-6">
      {/* 顶部 · Notion 招牌：巨大 emoji + 衬线标题 + 面包屑 */}
      <header className="space-y-3">
        <nav
          aria-label="面包屑"
          className="flex items-center gap-1 text-[11px] text-muted-foreground"
        >
          <a href="/" className="hover:text-foreground">
            工作台
          </a>
          <span className="opacity-50">/</span>
          <span className="text-foreground">记忆中心</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8463FF]/15 to-[#FF6B9D]/15 text-4xl"
              aria-hidden
            >
              🧠
            </span>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                记忆中心
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                长期记忆 · 用户画像 · 知识管理 · 跨会话召回
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IconStar className="h-3 w-3" />
                  {memories.filter((m) => m.pinned).length} 置顶
                </span>
                <span className="opacity-30">·</span>
                <span>{memories.length} 条记忆</span>
                <span className="opacity-30">·</span>
                <span>最近更新 {relativeDate(memories[0]?.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground"
              onClick={handleAIOrganize}
            >
              <IconSparkle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI 整理</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground"
              onClick={handleShare}
            >
              <IconShareNetwork className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">分享</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="更多">
              <IconDotsThree className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 shadow-notion"
              onClick={() => setShowNewDialog(true)}
            >
              <IconPlus className="h-3.5 w-3.5" />
              新建记忆
            </Button>
          </div>
        </div>
      </header>

      <MemoryStats />
      <MemoryCharts />

      {/* 筛选 */}
      <Card>
        <CardContent className="p-3">
          <MemoryFilters
            value={filters}
            onChange={setFilters}
            total={memories.length}
            filtered={filtered.length}
          />
        </CardContent>
      </Card>

      {/* 内容 + 画像 */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          {Object.keys(grouped).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                暂无符合条件的记忆
              </CardContent>
            </Card>
          ) : (
            Object.entries(grouped).map(([month, list]) => (
              <section key={month} className="flex flex-col gap-2">
                <h2 className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {month}
                  <span className="font-mono text-[10px]">({list.length})</span>
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((m, i) => (
                    <MemoryCard
                      key={m.id}
                      memory={m}
                      index={i}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* 桌面端: 右侧 sticky 画像; 移动端: 内容下方的折叠区 */}
        <div className="hidden lg:block">
          <ProfilePanel />
        </div>
      </div>

      {/* 移动端: 画像移到内容下方 */}
      <div className="lg:hidden">
        <ProfilePanel />
      </div>

      {/* 新建记忆弹窗 */}
      <NewMemoryDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onCreate={handleCreateMemory}
      />
    </div>
  );
}
