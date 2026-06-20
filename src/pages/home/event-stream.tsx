import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { slideInRight } from "@/lib/motion-presets";
import { cn, relativeTime } from "@/lib/utils";
import { IconActivity } from "@/components/icons"
import { motion } from "motion/react";
import { type HomeEvent, RECENT_EVENTS } from "./mock-data";

const TYPE_TONE: Record<HomeEvent["type"], { ring: string; text: string; bg: string }> = {
  info: { ring: "ring-info/30", text: "text-info", bg: "bg-info/10" },
  success: { ring: "ring-success/30", text: "text-success", bg: "bg-success/10" },
  warning: { ring: "ring-warning/30", text: "text-warning", bg: "bg-warning/10" },
  error: { ring: "ring-destructive/30", text: "text-destructive", bg: "bg-destructive/10" },
};

export function EventStream() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconActivity className="h-4 w-4 text-info" />
          实时事件流
        </CardTitle>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
          实时
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[280px] pr-2">
          <div className="space-y-1">
            {RECENT_EVENTS.map((e) => {
              const tone = TYPE_TONE[e.type];
              return (
                <motion.div
                  key={e.id}
                  initial={slideInRight.initial}
                  animate={slideInRight.animate}
                  transition={slideInRight.transition}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-md border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ring-1",
                      tone.bg,
                      tone.ring,
                    )}
                  >
                    {e.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium">{e.title}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {relativeTime(e.ts)}
                      </span>
                    </div>
                    {e.detail && (
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {e.detail}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
