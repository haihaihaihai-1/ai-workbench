import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ticket, TicketStatus } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { LayoutGrid, List, Plus, RefreshCw, Ticket as TicketIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  MOCK_TICKETS,
  TICKET_PRIORITY_INFO,
  TICKET_STATS,
  TICKET_STATUS_INFO,
  TICKET_TYPE_INFO,
} from "./mock-data";
import { SlaIndicator } from "./sla-indicator";
import { TicketBoard } from "./ticket-board";
import { TicketDetail } from "./ticket-detail";
import { type FilterState, TicketFilters } from "./ticket-filters";
import { TicketStats } from "./ticket-stats";

export default function TicketsPage() {
  const [view, setView] = useState<"list" | "board">("list");
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    status: "all",
    priority: "all",
    type: "all",
  });
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = useMemo(() => {
    return MOCK_TICKETS.filter((t) => {
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
  }, [filters]);

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
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="list" className="h-7 gap-1 text-xs">
                <List className="h-3.5 w-3.5" />
                列表
              </TabsTrigger>
              <TabsTrigger value="board" className="h-7 gap-1 text-xs">
                <LayoutGrid className="h-3.5 w-3.5" />
                看板
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-7 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          <Button size="sm" className="h-7 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            新建工单
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <TicketStats stats={TICKET_STATS} />

      {/* 筛选 */}
      <Card>
        <CardContent className="p-3">
          <TicketFilters
            value={filters}
            onChange={setFilters}
            total={MOCK_TICKETS.length}
            filtered={filtered.length}
          />
        </CardContent>
      </Card>

      {/* 内容 */}
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          {view === "list" ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px]">工单</TableHead>
                    <TableHead className="text-[10px]">类型</TableHead>
                    <TableHead className="text-[10px]">优先级</TableHead>
                    <TableHead className="text-[10px]">状态</TableHead>
                    <TableHead className="text-[10px]">受理人</TableHead>
                    <TableHead className="text-[10px]">SLA</TableHead>
                    <TableHead className="text-[10px]">更新</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => {
                    const tp = TICKET_TYPE_INFO[t.type];
                    const pr = TICKET_PRIORITY_INFO[t.priority];
                    const st = TICKET_STATUS_INFO[t.status];
                    return (
                      <TableRow
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="cursor-pointer"
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <span>{tp.icon}</span>
                            <div>
                              <div className="text-sm font-medium">{t.title}</div>
                              <div className="font-mono text-[10px] text-muted-foreground">
                                {t.code}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{tp.name}</TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant={
                              t.priority === "urgent"
                                ? "destructive"
                                : t.priority === "high"
                                  ? "warning"
                                  : t.priority === "medium"
                                    ? "info"
                                    : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {pr.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{st.name}</TableCell>
                        <TableCell className="py-2 text-xs">{t.assignee ?? "—"}</TableCell>
                        <TableCell className="py-2">
                          <SlaIndicator dueAt={t.slaDueAt} compact />
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground">
                          {relativeTime(t.updatedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        暂无符合条件的工单
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <TicketBoard grouped={grouped} onSelect={setSelected} />
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
    </div>
  );
}
