import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MemoryType } from "@/lib/types";
import { Search, Tag, X } from "lucide-react";

export type MemoryFilterState = {
  q: string;
  type: MemoryType | "all";
  tag: string | null;
  sort: "newest" | "oldest" | "confidence";
};

type Props = {
  value: MemoryFilterState;
  onChange: (v: MemoryFilterState) => void;
  total: number;
  filtered: number;
};

export function MemoryFilters({ value, onChange, total, filtered }: Props) {
  const active = value.q || value.type !== "all" || value.tag !== null || value.sort !== "newest";
  const clear = () => onChange({ q: "", type: "all", tag: null, sort: "newest" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="搜索记忆内容、标签..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Select
        value={value.type}
        onValueChange={(v) => onChange({ ...value, type: v as MemoryFilterState["type"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="fact">📌 事实</SelectItem>
          <SelectItem value="preference">💜 偏好</SelectItem>
          <SelectItem value="event">🕐 事件</SelectItem>
          <SelectItem value="skill">🎯 技能</SelectItem>
        </SelectContent>
      </Select>

      {value.tag && (
        <Badge variant="secondary" className="h-8 gap-1 px-2 text-xs">
          <Tag className="h-3 w-3" />
          {value.tag}
          <button type="button" onClick={() => onChange({ ...value, tag: null })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Select
        value={value.sort}
        onValueChange={(v) => onChange({ ...value, sort: v as MemoryFilterState["sort"] })}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">最新优先</SelectItem>
          <SelectItem value="oldest">最早优先</SelectItem>
          <SelectItem value="confidence">置信度</SelectItem>
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

import { Badge } from "@/components/ui/badge";
