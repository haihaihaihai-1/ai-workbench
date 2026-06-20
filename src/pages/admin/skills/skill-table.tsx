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
import { cn, shortNumber } from "@/lib/utils";
import { IconCopy, IconHistory, IconKeyRound, IconMoreHorizontal, IconPencil, IconShieldCheck, IconTrash2 } from "@/components/icons"
import {
  type AdminSkill,
  CATEGORY_INFO,
  EXECUTION_MODE_INFO,
  PERMISSION_LEVEL_INFO,
  STATUS_INFO,
} from "./mock-data";

type Props = {
  skills: AdminSkill[];
  onOpen: (s: AdminSkill) => void;
  onToggle: (s: AdminSkill, enabled: boolean) => void;
  onEdit: (s: AdminSkill) => void;
  onDuplicate: (s: AdminSkill) => void;
  onDelete: (s: AdminSkill) => void;
  onPermission: (s: AdminSkill) => void;
  onAudit: (s: AdminSkill) => void;
};

export function SkillTable({
  skills,
  onOpen,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onPermission,
  onAudit,
}: Props) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px]">技能</TableHead>
            <TableHead className="text-[10px]">分类</TableHead>
            <TableHead className="text-[10px]">执行模式</TableHead>
            <TableHead className="text-[10px]">状态</TableHead>
            <TableHead className="text-right text-[10px]">调用</TableHead>
            <TableHead className="text-right text-[10px]">错误率</TableHead>
            <TableHead className="text-[10px]">权限</TableHead>
            <TableHead className="w-10 text-right text-[10px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((s) => {
            const cat = CATEGORY_INFO[s.category];
            const mode = EXECUTION_MODE_INFO[s.executionMode];
            const status = STATUS_INFO[s.status];
            const perm = PERMISSION_LEVEL_INFO[s.permissionLevel];
            return (
              <TableRow key={s.id} onClick={() => onOpen(s)} className="cursor-pointer">
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-lg",
                        cat.bg,
                      )}
                    >
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        v{s.version} · {s.author}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      cat.bg,
                      cat.color,
                    )}
                  >
                    {cat.emoji} {cat.name}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant={mode.tone} className="text-[10px]">
                    {mode.name}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={s.status === "enabled"}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(v) => onToggle(s, v)}
                      aria-label="启用技能"
                      className="scale-90"
                    />
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        s.status === "enabled"
                          ? "bg-success/15 text-success"
                          : s.status === "pending"
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/15 text-destructive",
                      )}
                    >
                      {status.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-right">
                  <div className="text-xs font-mono tabular-nums">{shortNumber(s.calls)}</div>
                  <div className="text-[10px] text-muted-foreground">{s.p50LatencyMs}ms</div>
                </TableCell>
                <TableCell className="py-2 text-right">
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      s.errorRate > 5
                        ? "text-destructive"
                        : s.errorRate > 2
                          ? "text-warning"
                          : "text-muted-foreground",
                    )}
                  >
                    {s.errorRate.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant={perm.tone} className="text-[10px]">
                    <IconShieldCheck className="mr-0.5 h-2.5 w-2.5" />
                    {perm.name}
                  </Badge>
                </TableCell>
                <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end">
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
                        <DropdownMenuLabel>技能操作</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(s)}>
                          <IconPencil className="h-3.5 w-3.5" />
                          编辑元数据
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(s)}>
                          <IconCopy className="h-3.5 w-3.5" />
                          复制技能
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPermission(s)}>
                          <IconKeyRound className="h-3.5 w-3.5" />
                          权限设置
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAudit(s)}>
                          <IconHistory className="h-3.5 w-3.5" />
                          调用日志
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(s)}>
                          <IconTrash2 className="h-3.5 w-3.5" />
                          删除技能
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {skills.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                暂无符合条件的技能
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
