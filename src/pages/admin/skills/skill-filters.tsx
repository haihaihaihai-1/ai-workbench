import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { ExecutionMode, SkillCategory, SkillStatus } from "./mock-data";

export type SkillFilterState = {
  q: string;
  category: SkillCategory | "all";
  status: SkillStatus | "all";
  mode: ExecutionMode | "all";
};

type Props = {
  value: SkillFilterState;
  onChange: (v: SkillFilterState) => void;
  total: number;
  filtered: number;
};

export function SkillFilters({ value, onChange, total, filtered }: Props) {
  const active =
    value.q || value.category !== "all" || value.status !== "all" || value.mode !== "all";
  const clear = () => onChange({ q: "", category: "all", status: "all", mode: "all" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="搜索技能名称、标签、作者..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Select
        value={value.category}
        onValueChange={(v) => onChange({ ...value, category: v as SkillFilterState["category"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部分类</SelectItem>
          <SelectItem value="tool">🔧 工具</SelectItem>
          <SelectItem value="data">📊 数据</SelectItem>
          <SelectItem value="cognitive">🧠 认知</SelectItem>
          <SelectItem value="creative">✨ 创作</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.status}
        onValueChange={(v) => onChange({ ...value, status: v as SkillFilterState["status"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="enabled">已启用</SelectItem>
          <SelectItem value="disabled">已禁用</SelectItem>
          <SelectItem value="pending">待审核</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.mode}
        onValueChange={(v) => onChange({ ...value, mode: v as SkillFilterState["mode"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="模式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部模式</SelectItem>
          <SelectItem value="AUTO">自动</SelectItem>
          <SelectItem value="ASK_CONFIRM">需确认</SelectItem>
          <SelectItem value="INTERACTIVE">交互式</SelectItem>
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
