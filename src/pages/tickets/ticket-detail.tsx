import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/lib/types";
import { formatDate, relativeTime } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { TICKET_PRIORITY_INFO, TICKET_STATUS_INFO, TICKET_TYPE_INFO } from "./mock-data";
import { SlaIndicator } from "./sla-indicator";

type Props = {
  ticket: Ticket;
  onClose: () => void;
};

const MOCK_COMMENTS = [
  {
    id: "c1",
    author: "王老师",
    role: "assignee",
    content: "已和学生电话沟通，确认情况属实，正在审批中。",
    createdAt: Date.now() - 12 * 60_000,
  },
  {
    id: "c2",
    author: "系统",
    role: "system",
    content: "工单状态从「待处理」变更为「处理中」",
    createdAt: Date.now() - 14 * 60_000,
  },
];

const MOCK_RELATED = [
  { kind: "conversation", title: "缓考申请 - 操作系统课程", url: "/chat" },
  { kind: "feedback", title: "用户对回答质量不满（3星）", url: "/feedback" },
  { kind: "trace", title: "Trace #tr_8234", url: "/monitor" },
];

export function TicketDetail({ ticket, onClose }: Props) {
  const t = TICKET_TYPE_INFO[ticket.type];
  const p = TICKET_PRIORITY_INFO[ticket.priority];
  const s = TICKET_STATUS_INFO[ticket.status];
  const [reply, setReply] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base">{t.icon}</span>
            <span className="font-mono">{ticket.code}</span>
            <span>·</span>
            <span>{t.name}</span>
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
              {p.name}优先级
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {s.name}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px]">
              {ticket.level}
            </Badge>
          </div>
          <h2 className="mt-1.5 text-lg font-semibold leading-tight">{ticket.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{ticket.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="关闭详情">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">报告人：</span>
            <span className="font-mono">{ticket.reporter}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">受理人：</span>
            <span>{ticket.assignee ?? "未分配"}</span>
          </div>
        </div>
        <SlaIndicator dueAt={ticket.slaDueAt} />
      </div>

      <Tabs defaultValue="discussion" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-2 self-start">
          <TabsTrigger value="discussion">
            <MessageSquare className="mr-1 h-3.5 w-3.5" />
            讨论 ({MOCK_COMMENTS.length})
          </TabsTrigger>
          <TabsTrigger value="related">
            <GitBranch className="mr-1 h-3.5 w-3.5" />
            关联 ({MOCK_RELATED.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            历史
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussion" className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col gap-3 py-2">
            {MOCK_COMMENTS.map((c) => (
              <div
                key={c.id}
                className={
                  c.role === "system"
                    ? "rounded-md border border-dashed border-border bg-muted/30 px-3 py-1.5 text-center text-[11px] text-muted-foreground"
                    : "rounded-md border border-border bg-card p-3"
                }
              >
                {c.role !== "system" && (
                  <div className="flex items-center gap-2 text-xs">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {c.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{c.author}</span>
                    <span className="text-muted-foreground">· {relativeTime(c.createdAt)}</span>
                  </div>
                )}
                <p className={`text-sm ${c.role !== "system" ? "mt-1.5" : ""}`}>{c.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="related" className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col gap-2 py-2">
            {MOCK_RELATED.map((r) => (
              <a
                key={r.title}
                href={r.url}
                className="group flex items-center gap-2 rounded-md border border-border bg-card p-2.5 hover:border-primary/50"
              >
                <div className="rounded bg-primary/10 p-1.5 text-primary">
                  {r.kind === "conversation" && <MessageSquare className="h-3.5 w-3.5" />}
                  {r.kind === "feedback" && <Sparkles className="h-3.5 w-3.5" />}
                  {r.kind === "trace" && <GitBranch className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-[10px] text-muted-foreground">{r.kind}</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col gap-1.5 py-2 text-xs">
            <HistoryItem
              label="工单创建"
              detail={`by ${ticket.reporter}`}
              time={ticket.createdAt}
            />
            <HistoryItem
              label="分配给"
              detail={ticket.assignee ?? "未分配"}
              time={ticket.createdAt + 60_000}
            />
            <HistoryItem label="状态变更为" detail="处理中" time={ticket.createdAt + 14 * 60_000} />
            <HistoryItem label="添加评论" detail="王老师" time={ticket.createdAt + 12 * 60_000} />
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-md border border-input bg-card p-2">
          <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="附件">
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="回复工单... (Markdown 支持)"
            rows={2}
            className="scrollbar-none min-h-0 flex-1 resize-none border-0 p-1 text-sm shadow-none focus-visible:ring-0"
          />
          <Button size="sm" className="h-7 gap-1" disabled={!reply.trim()}>
            <Send className="h-3 w-3" />
            发送
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs">
            标记为已完成
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            改派
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
            升级到 L3
          </Button>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ label, detail, time }: { label: string; detail: string; time: number }) {
  return (
    <div className="flex items-center gap-2 rounded border border-dashed border-border bg-muted/20 px-2.5 py-1.5">
      <span className="text-muted-foreground">{label}：</span>
      <span className="font-medium">{detail}</span>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {formatDate(time, "MM-dd HH:mm")}
      </span>
    </div>
  );
}
