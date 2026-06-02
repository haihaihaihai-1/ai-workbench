import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cardHover, listItem } from "@/lib/motion-presets";
import type { Memory } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { BarChart3, Brain, Calendar, Pin, Tag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { MEMORY_TYPE_INFO } from "./mock-data";

type Props = {
  memory: Memory;
  index?: number;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
};

export function MemoryCard({ memory, index = 0, onDelete, onTogglePin }: Props) {
  const t = MEMORY_TYPE_INFO[memory.type];
  const conf = Math.round(memory.confidence * 100);
  const enter = listItem(Math.min(index, 12) * 0.02);
  return (
    <motion.div
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
      whileHover={cardHover.whileHover}
      className="will-change-transform"
    >
      <Card className="group transition-all hover:border-primary/40 hover:shadow-md">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", t.bgColor, t.color)}
              >
                {t.emoji} {t.name}
              </span>
              {memory.pinned && <Pin className="h-3 w-3 fill-warning text-warning" />}
            </div>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onTogglePin?.(memory.id)}
                aria-label="置顶"
              >
                <Pin className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={() => onDelete?.(memory.id)}
                aria-label="删除"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{memory.content}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            {memory.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                <Tag className="mr-0.5 h-2.5 w-2.5" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <Brain className="h-3 w-3" />
                {memory.source}
              </span>
              <span className="flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {relativeTime(memory.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span
                className={cn(
                  "font-mono",
                  conf >= 90 ? "text-success" : conf >= 75 ? "text-info" : "text-warning",
                )}
              >
                置信度 {conf}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
