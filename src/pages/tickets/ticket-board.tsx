import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Ticket, TicketStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { TicketCard } from "./ticket-card";

type Props = {
  grouped: Record<TicketStatus, Ticket[]>;
  onSelect: (t: Ticket) => void;
};

const COLUMNS: { key: TicketStatus; title: string; color: string; description: string }[] = [
  { key: "open", title: "待处理", color: "#3B82F6", description: "新工单待分配" },
  { key: "in_progress", title: "处理中", color: "#F59E0B", description: "正在跟进" },
  { key: "resolved", title: "已完成", color: "#10B981", description: "等待用户确认" },
  { key: "closed", title: "已取消", color: "#6B7280", description: "归档" },
];

export function TicketBoard({ grouped, onSelect }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const list = grouped[col.key] ?? [];
        return (
          <div key={col.key} className="flex flex-col rounded-lg border border-border bg-card/30">
            <div className="flex items-center justify-between border-b border-border p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {list.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="新建工单">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="px-3 pt-2 text-[10px] text-muted-foreground">{col.description}</p>
            <ScrollArea className="h-[calc(100vh-26rem)]">
              <div className="flex flex-col gap-2 p-2">
                {list.map((t) => (
                  <TicketCard key={t.id} ticket={t} onClick={() => onSelect(t)} />
                ))}
                {list.length === 0 && (
                  <div className={cn("py-8 text-center text-xs text-muted-foreground")}>
                    暂无工单
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
