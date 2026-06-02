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
import type { SkillCategory } from "./mock-data";

export type SkillFilterState = {
  q: string;
  category: SkillCategory | "all";
  sort: "popular" | "rating" | "newest" | "name";
};

type Props = {
  value: SkillFilterState;
  onChange: (v: SkillFilterState) => void;
  total: number;
  filtered: number;
};

export function SkillFilters({ value, onChange, total, filtered }: Props) {
  const active = value.q || value.category !== "all" || value.sort !== "popular";
  const clear = () => onChange({ q: "", category: "all", sort: "popular" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="搜索技能名称、描述、标签..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Select
        value={value.category}
        onValueChange={(v) => onChange({ ...value, category: v as SkillFilterState["category"] })}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
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
        value={value.sort}
        onValueChange={(v) => onChange({ ...value, sort: v as SkillFilterState["sort"] })}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue placeholder="排序" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">最热门</SelectItem>
          <SelectItem value="rating">最高评分</SelectItem>
          <SelectItem value="newest">最新</SelectItem>
          <SelectItem value="name">按名称</SelectItem>
        </SelectContent>
      </Select>

      {active && (
        <Button variant="ghost" size="sm" onClick={clear} className="h-8 gap-1 text-xs">
          <X className="h-3 w-3" />
          清除
        </Button>
      )}

      <div className="ml-auto text-xs text-muted-foreground">
        <span className="font-mono text-foreground">{filtered}</span> / {total} 个
      </div>
    </div>
  );
}
