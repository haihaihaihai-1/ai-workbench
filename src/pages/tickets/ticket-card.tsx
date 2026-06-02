import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "@/lib/types";
import { TICKET_PRIORITY_INFO, TICKET_TYPE_INFO } from "./mock-data";
import { SlaIndicator } from "./sla-indicator";

type Props = { ticket: Ticket; onClick?: () => void };

export function TicketCard({ ticket, onClick }: Props) {
  const t = TICKET_TYPE_INFO[ticket.type];
  const p = TICKET_PRIORITY_INFO[ticket.priority];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col gap-2 rounded-md border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{t.icon}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{ticket.code}</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            variant={
              ticket.priority === "urgent"
                ? "destructive"
                : ticket.priority === "high"
                  ? "warning"
                  : ticket.priority === "medium"
                    ? "info"
                    : "secondary"
            }
            className="text-[10px]"
          >
            {p.name}
          </Badge>
        </div>
      </div>

      <h3 className="line-clamp-2 text-sm font-medium leading-tight">{ticket.title}</h3>

      <div className="flex flex-wrap gap-1">
        {ticket.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          {ticket.assignee ? (
            <>
              <Avatar className="h-4 w-4">
                <AvatarFallback className="bg-primary/15 text-[8px] text-primary">
                  {ticket.assignee[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{ticket.assignee}</span>
            </>
          ) : (
            <span className="text-muted-foreground">未分配</span>
          )}
        </div>
        <SlaIndicator dueAt={ticket.slaDueAt} compact />
      </div>
    </button>
  );
}
