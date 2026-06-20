import { IconSearch, IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRegisteredAt, UserRole, UserStatus } from "./mock-data";

export type UserFilterState = {
  q: string;
  role: UserRole | "all";
  status: UserStatus | "all";
  registered: UserRegisteredAt | "all";
};

type Props = {
  value: UserFilterState;
  onChange: (v: UserFilterState) => void;
  total: number;
  filtered: number;
  selected: number;
};

export function UserFilters({ value, onChange, total, filtered, selected }: Props) {
  const active =
    value.q || value.role !== "all" || value.status !== "all" || value.registered !== "all";
  const clear = () => onChange({ q: "", role: "all", status: "all", registered: "all" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <IconSearch className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="搜索姓名、邮箱、用户名、学号..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <Select
        value={value.role}
        onValueChange={(v) => onChange({ ...value, role: v as UserFilterState["role"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部角色</SelectItem>
          <SelectItem value="student">学生</SelectItem>
          <SelectItem value="teacher">教师</SelectItem>
          <SelectItem value="admin">管理员</SelectItem>
          <SelectItem value="counselor">咨询师</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.status}
        onValueChange={(v) => onChange({ ...value, status: v as UserFilterState["status"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="active">活跃</SelectItem>
          <SelectItem value="disabled">禁用</SelectItem>
          <SelectItem value="pending">待激活</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.registered}
        onValueChange={(v) =>
          onChange({ ...value, registered: v as UserFilterState["registered"] })
        }
      >
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="注册" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部时间</SelectItem>
          <SelectItem value="today">今日</SelectItem>
          <SelectItem value="week">本周</SelectItem>
          <SelectItem value="month">本月</SelectItem>
          <SelectItem value="year">今年</SelectItem>
          <SelectItem value="older">更早</SelectItem>
        </SelectContent>
      </Select>

      {active && (
        <Button variant="ghost" size="sm" onClick={clear} className="h-8 gap-1 text-xs">
          <IconX className="h-3 w-3" />
          清除
        </Button>
      )}

      <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
        {selected > 0 && <span className="font-mono text-primary">已选 {selected} 项</span>}
        <span>
          <span className="font-mono text-foreground">{filtered}</span> / {total} 用户
        </span>
      </div>
    </div>
  );
}
