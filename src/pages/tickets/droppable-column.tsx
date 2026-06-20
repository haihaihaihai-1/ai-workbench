import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IconPlus } from "@/components/icons"
import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  count: number;
  color: string;
  description: string;
  items: string[];
  children: ReactNode;
};

export function DroppableColumn({ id, title, count, color, description, items, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
  });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${title} 工单列,共 ${count} 张`}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card/30 transition-colors",
        isOver && "border-primary bg-primary/5 shadow-md",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-border p-3",
          isOver && "border-primary/30",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold">{title}</h3>
          <span
            className={cn(
              "rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
              isOver && "bg-primary/15 text-primary",
            )}
          >
            {count}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="新建工单">
          <IconPlus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="px-3 pt-2 text-[10px] text-muted-foreground">{description}</p>
      <ScrollArea className="h-[calc(100vh-26rem)]">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 p-2">
            {children}
            {items.length === 0 && (
              <div
                className={cn(
                  "rounded-md border border-dashed border-border/60 py-8 text-center text-xs text-muted-foreground",
                  isOver && "border-primary/60 text-primary",
                )}
              >
                {isOver ? "松开放入" : "暂无工单"}
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </section>
  );
}
