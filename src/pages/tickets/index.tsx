import {
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconRefreshCw,
  IconTicket as TicketIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-media-query";
import type { Ticket, TicketStatus } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MOCK_TICKETS, TICKET_STATS, TICKET_STATUS_INFO } from "./mock-data";
import { NewTicketDialog } from "./new-ticket-dialog";
import { TicketBoard } from "./ticket-board";
import { TicketDetail } from "./ticket-detail";
import { type FilterState, TicketFilters } from "./ticket-filters";
import { TicketList } from "./ticket-list";
import { TicketStats } from "./ticket-stats";

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["open", "resolved", "closed"],
  resolved: ["open", "closed"],
  closed: [],
};

function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export default function TicketsPage() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"list" | "board">("list");
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    status: "all",
    priority: "all",
    type: "all",
  });
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [showNewDialog, setShowNewDialog] = useState(false);

  /* Linear 招牌快捷键:
   * - C          新建工单
   * - /          聚焦搜索
   * - Esc        关闭详情
   */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // 忽略输入框内的按键
      if (target?.matches("input, textarea, [contenteditable]")) return;

      if (e.key === "c" || e.key === "C") {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        setShowNewDialog(true);
      } else if (e.key === "/") {
        e.preventDefault();
        const search = document.querySelector<HTMLInputElement>('input[type="search"]');
        search?.focus();
      } else if (e.key === "Escape" && selected) {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  const handleCreateTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.code.toLowerCase().includes(q) &&
          !t.tags.some((tag) => tag.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.type !== "all" && t.type !== filters.type) return false;
      return true;
    });
  }, [tickets, filters]);

  const grouped = useMemo(() => {
    const g: Record<TicketStatus, Ticket[]> = {
      open: [],
      in_progress: [],
      resolved: [],
      closed: [],
    };
    filtered.forEach((t) => g[t.status].push(t));
    return g;
  }, [filtered]);

  const liveStats = useMemo(() => {
    const now = Date.now();
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const closed = tickets.filter((t) => t.status === "closed").length;
    const breached = tickets.filter((t) => t.slaDueAt < now && t.status !== "closed").length;
    return { open, inProgress, resolved, closed, breached };
  }, [tickets]);

  const handleStatusChange = (id: string, newStatus: TicketStatus) => {
    const target = tickets.find((t) => t.id === id);
    if (!target) return;
    if (!canTransition(target.status, newStatus)) {
      toast.error(
        `无法将 ${target.code} 从「${TICKET_STATUS_INFO[target.status].name}」移到「${TICKET_STATUS_INFO[newStatus].name}」`,
      );
      return;
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: Date.now() } : t)),
    );
    toast.success(`已将 ${target.code} 移到「${TICKET_STATUS_INFO[newStatus].name}」`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <TicketIcon className="h-6 w-6 text-primary" />
            工单中心
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            HITL 升级 · 危机干预 · 投诉反馈 · 用户反馈 · SLA 管理
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList className="h-7">
              <TabsTrigger value="list" className="h-6 gap-1 px-2 text-xs">
                <IconList className="h-3 w-3" />
                列表
              </TabsTrigger>
              <TabsTrigger value="board" className="h-6 gap-1 px-2 text-xs">
                <IconLayoutGrid className="h-3 w-3" />
                看板
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Linear 风格快捷键提示 */}
          <div className="hidden items-center gap-1 text-[10px] text-muted-foreground lg:flex">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              C
            </kbd>
            <span>新建</span>
            <span className="mx-1 opacity-30">·</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              /
            </kbd>
            <span>搜索</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-7 w-7 sm:inline-flex"
            aria-label="刷新"
          >
            <IconRefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-7 gap-1.5" onClick={() => setShowNewDialog(true)}>
            <IconPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">新建工单</span>
            <span className="sm:hidden">新建</span>
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <TicketStats
        stats={{
          ...TICKET_STATS,
          open: liveStats.open,
          inProgress: liveStats.inProgress,
          resolved: liveStats.resolved,
          closed: liveStats.closed,
          breached: liveStats.breached,
        }}
      />

      {/* 筛选 */}
      <Card>
        <CardContent className="p-3">
          <TicketFilters
            value={filters}
            onChange={setFilters}
            total={tickets.length}
            filtered={filtered.length}
          />
        </CardContent>
      </Card>

      {/* 内容 */}
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          {view === "list" ? (
            <TicketList
              tickets={filtered}
              selectedId={selected?.id}
              onSelect={setSelected}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {isMobile && (
                <div className="flex items-center gap-2 rounded-md border border-info/20 bg-info/5 px-3 py-2 text-xs text-info">
                  <span className="shrink-0">💡</span>
                  <span>建议横屏查看完整看板，或左右滑动浏览各列。</span>
                </div>
              )}
              <TicketBoard
                grouped={grouped}
                onSelect={setSelected}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>

        {/* 详情抽屉 */}
        {selected && (
          <div className="hidden w-[420px] shrink-0 xl:block">
            <Card className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-hidden">
              <TicketDetail ticket={selected} onClose={() => setSelected(null)} />
            </Card>
          </div>
        )}
      </div>

      {/* 移动端详情（全屏） */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-background xl:hidden">
          <TicketDetail ticket={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* 新建工单弹窗 */}
      <NewTicketDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}
