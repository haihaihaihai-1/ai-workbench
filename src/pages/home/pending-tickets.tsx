import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, relativeTime } from "@/lib/utils";
import { IconArrowRight, IconTicket as TicketIcon } from "@/components/icons"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PENDING_TICKETS, PRIORITY_NAME, PRIORITY_VARIANT, TICKET_TYPE_META } from "./mock-data";

export function PendingTickets() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <TicketIcon className="h-4 w-4 text-warning" />
          待办工单
        </CardTitle>
        <button
          type="button"
          onClick={() => {
            navigate("/tickets");
            toast.info("已跳转到工单中心");
          }}
          className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
        >
          查看全部 →
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[280px] pr-2">
          <div className="space-y-1.5">
            {PENDING_TICKETS.map((t) => {
              const meta = TICKET_TYPE_META[t.type] ?? { icon: "📌", name: t.type };
              const urgent = t.priority === "urgent" || t.priority === "high";
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    navigate("/tickets");
                    toast.success(`打开工单 ${t.code}`);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-md border border-transparent p-2 text-left transition-all hover:border-border hover:bg-muted/40",
                    urgent && "bg-destructive/5 hover:bg-destructive/10",
                  )}
                >
                  <span className="text-base">{meta.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">{t.code}</span>
                      <span className="truncate text-sm font-medium">{t.title}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Badge
                        variant={PRIORITY_VARIANT[t.priority]}
                        className="h-4 px-1.5 text-[9px]"
                      >
                        {PRIORITY_NAME[t.priority]}
                      </Badge>
                      <span>{t.assignee ?? "未分配"}</span>
                      <span>·</span>
                      <span>{relativeTime(t.updatedAt)}</span>
                    </div>
                  </div>
                  <IconArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
