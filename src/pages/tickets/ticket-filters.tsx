import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/types";
import { Search, X } from "lucide-react";

export type FilterState = {
  q: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  type: TicketType | "all";
};

type Props = {
  value: FilterState;
  onChange: (v: FilterState) => void;
  total: number;
  filtered: number;
};

export function TicketFilters({ value, onChange, total, filtered }: Props) {
  const active =
    value.q || value.status !== "all" || value.priority !== "all" || value.type !== "all";
  const clear = () => onChange({ q: "", status: "all", priority: "all", type: "all" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="搜索工单标题、编号、标签..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Select
        value={value.status}
        onValueChange={(v) => onChange({ ...value, status: v as FilterState["status"] })}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue placeholder="状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="open">待处理</SelectItem>
          <SelectItem value="in_progress">处理中</SelectItem>
          <SelectItem value="resolved">已完成</SelectItem>
          <SelectItem value="closed">已取消</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.priority}
        onValueChange={(v) => onChange({ ...value, priority: v as FilterState["priority"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="优先级" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部优先级</SelectItem>
          <SelectItem value="urgent">紧急</SelectItem>
          <SelectItem value="high">高</SelectItem>
          <SelectItem value="medium">中</SelectItem>
          <SelectItem value="low">低</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.type}
        onValueChange={(v) => onChange({ ...value, type: v as FilterState["type"] })}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue placeholder="类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          <SelectItem value="hitl">HITL 升级</SelectItem>
          <SelectItem value="crisis">危机干预</SelectItem>
          <SelectItem value="complaint">投诉反馈</SelectItem>
          <SelectItem value="feedback">用户反馈</SelectItem>
        </SelectContent>
      </Select>

      {active && (
        <Button variant="ghost" size="sm" onClick={clear} className="h-8 gap-1 text-xs">
          <X className="h-3 w-3" />
          清除
        </Button>
      )}

      <div className="ml-auto text-xs text-muted-foreground">
        <span className="font-mono text-foreground">{filtered}</span> / {total} 条
      </div>
    </div>
  );
}
