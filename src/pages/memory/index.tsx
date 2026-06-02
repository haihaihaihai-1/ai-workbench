import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Memory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Brain, Plus, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MemoryCard } from "./memory-card";
import { type MemoryFilterState, MemoryFilters } from "./memory-filters";
import { MemoryCharts, MemoryStats } from "./memory-stats";
import { MOCK_MEMORIES } from "./mock-data";
import { ProfilePanel } from "./profile-panel";

export default function MemoryPage() {
  const [filters, setFilters] = useState<MemoryFilterState>({
    q: "",
    type: "all",
    tag: null,
    sort: "newest",
  });
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);

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

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Brain className="h-6 w-6 text-primary" />
            记忆中心
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            长期记忆 · 用户画像 · 知识管理 · 跨会话召回
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Wand2 className="h-3.5 w-3.5" />
            合并相似记忆
          </Button>
          <Button size="sm" className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            手动添加
          </Button>
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

        <div className="hidden lg:block">
          <ProfilePanel />
        </div>
      </div>
    </div>
  );
}
