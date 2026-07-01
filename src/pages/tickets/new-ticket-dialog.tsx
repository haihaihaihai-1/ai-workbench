import {
  IconAlertCircle,
  IconPlus,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket, TicketPriority, TicketType } from "@/lib/types";
import { randomId } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const TYPE_OPTIONS: { value: TicketType; label: string; icon: string }[] = [
  { value: "hitl", label: "HITL 升级", icon: "🤝" },
  { value: "crisis", label: "危机干预", icon: "🚨" },
  { value: "complaint", label: "投诉反馈", icon: "😤" },
  { value: "feedback", label: "用户反馈", icon: "💬" },
];

const PRIORITY_OPTIONS: { value: TicketPriority; label: string; color: string }[] = [
  { value: "low", label: "低", color: "#7A7A7A" },
  { value: "medium", label: "中", color: "#F2C94C" },
  { value: "high", label: "高", color: "#F2994A" },
  { value: "urgent", label: "紧急", color: "#EF4444" },
];

const LEVEL_OPTIONS = ["L1", "L2", "L3"] as const;

export function NewTicketDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (ticket: Ticket) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TicketType>("hitl");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [level, setLevel] = useState<(typeof LEVEL_OPTIONS)[number]>("L1");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
    setType("hitl");
    setPriority("medium");
    setLevel("L1");
    setAssignee("");
    setTags("");
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("请输入工单标题");
      return;
    }
    if (!description.trim()) {
      toast.error("请输入工单描述");
      return;
    }

    const now = Date.now();
    const slaMap: Record<TicketPriority, number> = {
      urgent: 30 * 60_000,
      high: 4 * 3600_000,
      medium: 24 * 3600_000,
      low: 72 * 3600_000,
    };

    const ticket: Ticket = {
      id: randomId(),
      code: `CW-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      type,
      status: "open",
      priority,
      level,
      assignee: assignee.trim() || undefined,
      reporter: "current_user",
      createdAt: now,
      updatedAt: now,
      slaDueAt: now + slaMap[priority],
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onCreate(ticket);
    toast.success(`工单 ${ticket.code} 已创建`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            新建工单
          </DialogTitle>
          <DialogDescription>
            创建新的工单，系统将根据优先级自动设置 SLA 时限。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-title">标题 *</Label>
            <Input
              id="ticket-title"
              placeholder="简要描述问题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-desc">描述 *</Label>
            <Textarea
              id="ticket-desc"
              placeholder="详细描述问题背景、影响范围、复现步骤等..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>类型</Label>
              <Select value={type} onValueChange={(v) => setType(v as TicketType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="mr-1.5">{opt.icon}</span>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>优先级</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span
                        className="mr-1.5 inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      />
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>处理级别</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-assignee">指派给（可选）</Label>
              <Input
                id="ticket-assignee"
                placeholder="输入处理人姓名..."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-tags">标签（逗号分隔）</Label>
            <Input
              id="ticket-tags"
              placeholder="如: 缓考, 操作系统"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {priority === "urgent" && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <IconAlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                紧急工单 SLA 为 30 分钟，将触发即时通知给相关负责人。
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>创建工单</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
