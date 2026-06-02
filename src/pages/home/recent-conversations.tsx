import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { relativeTime } from "@/lib/utils";
import { ArrowRight, MessageSquare, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AGENT_VISUAL, RECENT_CONVERSATIONS } from "./mock-data";

export function RecentConversations() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <MessageSquare className="h-4 w-4 text-primary" />
          最近对话
        </CardTitle>
        <button
          type="button"
          onClick={() => {
            navigate("/chat");
            toast.info("已跳转到对话工作台");
          }}
          className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
        >
          查看全部 →
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[280px] pr-2">
          <div className="space-y-1.5">
            {RECENT_CONVERSATIONS.map((c) => {
              const v = AGENT_VISUAL[c.domain];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    navigate("/chat");
                    toast.success(`打开对话：${c.title}`);
                  }}
                  className="group flex w-full items-start gap-3 rounded-md border border-transparent p-2 text-left transition-all hover:border-border hover:bg-muted/40"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-base"
                    style={{ backgroundColor: `${v.color}1A`, color: v.color }}
                  >
                    {v.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {c.pinned && <Pin className="h-3 w-3 fill-warning text-warning" />}
                      <span className="truncate text-sm font-medium">{c.title}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                      {c.preview}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Badge variant="outline" className="h-4 px-1.5 py-0 text-[9px]">
                        {v.name}
                      </Badge>
                      <span>{c.messageCount} 条消息</span>
                      <span>·</span>
                      <span>{relativeTime(c.updatedAt)}</span>
                    </div>
                  </div>
                  <ArrowRight className="mt-2 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
