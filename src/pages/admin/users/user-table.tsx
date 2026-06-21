/**
 * UserTable · 借皮 Linear 风格紧凑表格
 *
 * 列：复选框 / 用户 / 角色 / 状态 / 会话 / 注册 / 最后活跃 / 操作
 *
 * 视觉：
 * - 角色徽章：背景 20% 透明 + 文字 100% 饱和
 * - 状态圆点：active=绿, suspended=红, inactive=琥珀
 * - 表格行：grid 紧凑 + hover 显背景 + 选中态品牌色
 *
 * 交互：
 * - 行 click → onOpen(user)
 * - 复选框独立 click（stopPropagation）
 * - Switch/Dropdown 独立 click（stopPropagation）
 */

import {
  IconCheck,
  IconKeyRound,
  IconMinus,
  IconMoreHorizontal,
  IconPower,
  IconShieldCheck,
  IconTrash2,
  IconUserCog,
} from "@/components/icons";
import { LinearTable, type LinearTableColumn } from "@/components/ui/linear-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn, relativeTime, shortNumber } from "@/lib/utils";
import type { User } from "./mock-data";
import { ROLE_INFO, STATUS_INFO } from "./mock-data";

type Props = {
  users: User[];
  selected: string[];
  onSelectChange: (ids: string[]) => void;
  onOpen: (u: User) => void;
  onToggle: (u: User, enabled: boolean) => void;
  onResetPwd: (u: User) => void;
  onDelete: (u: User) => void;
};

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: () => void;
  "aria-label"?: string;
};

function Checkbox({ checked, indeterminate, onCheckedChange, ...rest }: CheckboxProps) {
  return (
    <span
      className={cn(
        "relative flex h-4 w-4 items-center justify-center rounded border transition-colors",
        checked || indeterminate
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background hover:border-primary/60",
      )}
    >
      <input
        type="checkbox"
        checked={indeterminate ? false : checked}
        ref={(el) => {
          if (el) el.indeterminate = Boolean(indeterminate);
        }}
        onChange={() => onCheckedChange()}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 cursor-pointer opacity-0"
        {...rest}
      />
      {indeterminate ? (
        <IconMinus className="pointer-events-none h-3 w-3" />
      ) : checked ? (
        <IconCheck className="pointer-events-none h-3 w-3" />
      ) : null}
    </span>
  );
}

export function UserTable({
  users,
  selected,
  onSelectChange,
  onOpen,
  onToggle,
  onResetPwd,
  onDelete,
}: Props) {
  const allSelected = users.length > 0 && users.every((u) => selected.includes(u.id));
  const someSelected = users.some((u) => selected.includes(u.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onSelectChange(selected.filter((id) => !users.some((u) => u.id === id)));
    } else {
      onSelectChange([...new Set([...selected, ...users.map((u) => u.id)])]);
    }
  };

  const toggleOne = (id: string) => {
    onSelectChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const columns: LinearTableColumn<User>[] = [
    {
      key: "select",
      label: "",
      width: "40px",
      render: (u) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected.includes(u.id)}
            onCheckedChange={() => toggleOne(u.id)}
            aria-label={`选择 ${u.name}`}
          />
        </div>
      ),
    },
    {
      key: "user",
      label: "用户",
      width: "minmax(0,2fr)",
      render: (u) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className={cn("text-[10px]", u.avatarColor)}>
              {u.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{u.name}</div>
            <div className="truncate font-mono text-[10px] text-muted-foreground">
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "角色",
      width: "120px",
      render: (u) => {
        const r = ROLE_INFO[u.role];
        return (
          <Badge variant={r.tone} className="text-[10px]">
            {r.name}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: "状态",
      width: "120px",
      render: (u) => {
        const s = STATUS_INFO[u.status];
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                u.status === "active"
                  ? "bg-success"
                  : u.status === "disabled"
                    ? "bg-destructive"
                    : "bg-warning",
              )}
            />
            <span className="text-xs">{s.name}</span>
          </div>
        );
      },
    },
    {
      key: "sessions",
      label: "会话数",
      width: "120px",
      render: (u) => (
        <div className="text-xs">
          <div className="font-mono tabular-nums">{u.sessions}</div>
          <div className="text-[10px] text-muted-foreground">
            {shortNumber(u.messages)} 条消息
          </div>
        </div>
      ),
    },
    {
      key: "registered",
      label: "注册时间",
      width: "120px",
      render: (u) => (
        <span className="text-[11px] text-muted-foreground">{relativeTime(u.registeredAt)}</span>
      ),
    },
    {
      key: "active",
      label: "最后活跃",
      width: "120px",
      render: (u) => (
        <span className="text-[11px] text-muted-foreground">
          {u.lastActiveAt > now1day() ? relativeTime(u.lastActiveAt) : "长期未活跃"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "操作",
      width: "120px",
      align: "right",
      render: (u) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={u.status === "active"}
            onCheckedChange={(v) => onToggle(u, v)}
            aria-label="启用用户"
            className="scale-90"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="更多操作">
                <IconMoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>用户操作</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onOpen(u)}>
                <IconUserCog className="h-3.5 w-3.5" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResetPwd(u)}>
                <IconKeyRound className="h-3.5 w-3.5" />
                重置密码
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggle(u, u.status !== "active")}>
                <IconPower className="h-3.5 w-3.5" />
                {u.status === "active" ? "禁用" : "启用"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpen(u)}>
                <IconShieldCheck className="h-3.5 w-3.5" />
                权限设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(u)}>
                <IconTrash2 className="h-3.5 w-3.5" />
                删除用户
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* 顶部批量操作栏 · 选中后浮现 */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-brand-500/30 bg-brand-500/5 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onCheckedChange={toggleAll}
              aria-label="全选"
            />
            <span className="font-medium">已选 {selected.length} 项</span>
            <span className="text-muted-foreground">/ 共 {users.length} 个用户</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px]">
              批量启用
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]">
              批量重置密码
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] text-destructive"
              onClick={() => selected.forEach((id) => {
                const u = users.find((x) => x.id === id);
                if (u) onDelete(u);
              })}
            >
              批量删除
            </Button>
          </div>
        </div>
      )}

      <LinearTable<User>
        columns={columns}
        rows={users}
        rowKey="id"
        onRowClick={onOpen}
        selectedKeys={selected}
        emptyText="暂无符合条件的用户"
      />
    </div>
  );
}

function now1day() {
  return Date.now() - 24 * 60 * 60 * 1000;
}
