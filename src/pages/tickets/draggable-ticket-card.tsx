import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TICKET_PRIORITY_INFO, TICKET_TYPE_INFO } from "./mock-data";
import { SlaIndicator } from "./sla-indicator";

type Props = { ticket: Ticket; onClick?: () => void };

export function DraggableTicketCard({ ticket, onClick }: Props) {
  const t = TICKET_TYPE_INFO[ticket.type];
  const p = TICKET_PRIORITY_INFO[ticket.priority];
  const isLocked = ticket.status === "closed";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { type: "ticket", status: ticket.status },
    disabled: isLocked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={isDragging ? undefined : onClick}
      aria-label={`工单 ${ticket.code} ${ticket.title}`}
      className={cn(
        "group relative flex w-full flex-col gap-2 rounded-md border border-border bg-card p-3 text-left",
        "transition-all hover:border-primary/50 hover:shadow-sm",
        isDragging && "z-50 cursor-grabbing border-primary opacity-50 shadow-lg",
        isDragging && "rotate-2 scale-105",
        isLocked && "cursor-not-allowed opacity-70",
        !isDragging && !isLocked && "cursor-grab",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GripVertical
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/40 transition-colors",
              "group-hover:text-muted-foreground",
              isLocked && "hidden",
            )}
            aria-hidden
          />
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
