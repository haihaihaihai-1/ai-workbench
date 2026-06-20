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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
                aria-label="全选"
              />
            </TableHead>
            <TableHead className="text-[10px]">用户</TableHead>
            <TableHead className="text-[10px]">角色</TableHead>
            <TableHead className="text-[10px]">状态</TableHead>
            <TableHead className="text-[10px]">会话数</TableHead>
            <TableHead className="text-[10px]">注册时间</TableHead>
            <TableHead className="text-[10px]">最后活跃</TableHead>
            <TableHead className="w-10 text-right text-[10px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const r = ROLE_INFO[u.role];
            const s = STATUS_INFO[u.status];
            const checked = selected.includes(u.id);
            return (
              <TableRow
                key={u.id}
                onClick={() => onOpen(u)}
                className={cn("cursor-pointer", checked && "bg-muted/30")}
                data-state={checked ? "selected" : undefined}
              >
                <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleOne(u.id)}
                    aria-label={`选择 ${u.name}`}
                  />
                </TableCell>
                <TableCell className="py-2">
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
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant={r.tone} className="text-[10px]">
                    {r.name}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
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
                </TableCell>
                <TableCell className="py-2">
                  <div className="text-xs">
                    <div className="font-mono tabular-nums">{u.sessions}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {shortNumber(u.messages)} 条消息
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-[11px] text-muted-foreground">
                  {relativeTime(u.registeredAt)}
                </TableCell>
                <TableCell className="py-2 text-[11px] text-muted-foreground">
                  {u.lastActiveAt > now1day() ? relativeTime(u.lastActiveAt) : "长期未活跃"}
                </TableCell>
                <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <Switch
                      checked={u.status === "active"}
                      onCheckedChange={(v) => onToggle(u, v)}
                      aria-label="启用用户"
                      className="scale-90"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="更多操作"
                        >
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
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                暂无符合条件的用户
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function now1day() {
  return Date.now() - 24 * 60 * 60 * 1000;
}
