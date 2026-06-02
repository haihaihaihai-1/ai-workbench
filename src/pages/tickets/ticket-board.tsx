import type { Ticket, TicketStatus } from "@/lib/types";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DraggableTicketCard } from "./draggable-ticket-card";
import { DroppableColumn } from "./droppable-column";

type Props = {
  grouped: Record<TicketStatus, Ticket[]>;
  onSelect: (t: Ticket) => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
};

const COLUMNS: { key: TicketStatus; title: string; color: string; description: string }[] = [
  { key: "open", title: "待处理", color: "#3B82F6", description: "新工单待分配" },
  { key: "in_progress", title: "处理中", color: "#F59E0B", description: "正在跟进" },
  { key: "resolved", title: "已完成", color: "#10B981", description: "等待用户确认" },
  { key: "closed", title: "已取消", color: "#6B7280", description: "归档" },
];

const STATUS_SET = new Set<TicketStatus>(["open", "in_progress", "resolved", "closed"]);

export function isColumnStatus(id: string | number): id is TicketStatus {
  return typeof id === "string" && STATUS_SET.has(id as TicketStatus);
}

export function TicketBoard({ grouped, onSelect, onStatusChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const ticketIndex: Record<string, TicketStatus> = {};
  (Object.keys(grouped) as TicketStatus[]).forEach((s) => {
    grouped[s].forEach((t) => {
      ticketIndex[t.id] = s;
    });
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const ticketId = String(active.id);
    const overId = String(over.id);
    const currentStatus = ticketIndex[ticketId];
    if (!currentStatus) return;

    let targetStatus: TicketStatus | null = null;
    if (isColumnStatus(overId)) {
      targetStatus = overId;
    } else {
      const s = ticketIndex[overId];
      if (s) targetStatus = s;
    }
    if (!targetStatus || targetStatus === currentStatus) return;
    onStatusChange(ticketId, targetStatus);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      {/*
        移动端: flex 横滑, 每列 80vw (snappy scroll-snap)
        桌面端: 4 列 grid (md 断点 768)
       */}
      <div className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:w-auto md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const list = grouped[col.key] ?? [];
          return (
            <div
              key={col.key}
              className="w-[80vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
            >
              <DroppableColumn
                id={col.key}
                title={col.title}
                count={list.length}
                color={col.color}
                description={col.description}
                items={list.map((t) => t.id)}
              >
                {list.map((t) => (
                  <DraggableTicketCard key={t.id} ticket={t} onClick={() => onSelect(t)} />
                ))}
              </DroppableColumn>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
