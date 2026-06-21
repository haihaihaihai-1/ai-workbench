/**
 * SkillTable · 借皮 Linear 风格紧凑表格
 *
 * 列：技能 / 分类 / 执行模式 / 状态（开关+徽章）/ 调用 / 错误率 / 权限 / 操作
 *
 * 视觉：
 * - 技能图标：分类背景色块 + 大 emoji
 * - 分类徽章：背景 10% 透明 + 文字主色
 * - 错误率：>5 红 / >2 琥珀 / 否则灰
 *
 * 交互：
 * - 行 click → onOpen(skill)
 * - Switch/Dropdown 独立 click（stopPropagation）
 */

import {
  IconCopy,
  IconHistory,
  IconKeyRound,
  IconMoreHorizontal,
  IconPencil,
  IconShieldCheck,
  IconTrash2,
} from "@/components/icons";
import { LinearTable, type LinearTableColumn } from "@/components/ui/linear-table";
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
import { cn, shortNumber } from "@/lib/utils";
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
  const columns: LinearTableColumn<AdminSkill>[] = [
    {
      key: "name",
      label: "技能",
      width: "minmax(0,2.2fr)",
      render: (s) => {
        const cat = CATEGORY_INFO[s.category];
        return (
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
        );
      },
    },
    {
      key: "category",
      label: "分类",
      width: "120px",
      render: (s) => {
        const cat = CATEGORY_INFO[s.category];
        return (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              cat.bg,
              cat.color,
            )}
          >
            {cat.emoji} {cat.name}
          </span>
        );
      },
    },
    {
      key: "mode",
      label: "执行模式",
      width: "120px",
      render: (s) => {
        const mode = EXECUTION_MODE_INFO[s.executionMode];
        return (
          <Badge variant={mode.tone} className="text-[10px]">
            {mode.name}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: "状态",
      width: "180px",
      render: (s) => {
        const status = STATUS_INFO[s.status];
        return (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={s.status === "enabled"}
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
        );
      },
    },
    {
      key: "calls",
      label: "调用",
      width: "100px",
      align: "right",
      render: (s) => (
        <div>
          <div className="text-xs font-mono tabular-nums">{shortNumber(s.calls)}</div>
          <div className="text-[10px] text-muted-foreground">{s.p50LatencyMs}ms</div>
        </div>
      ),
    },
    {
      key: "errorRate",
      label: "错误率",
      width: "80px",
      align: "right",
      render: (s) => (
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
      ),
    },
    {
      key: "permission",
      label: "权限",
      width: "120px",
      render: (s) => {
        const perm = PERMISSION_LEVEL_INFO[s.permissionLevel];
        return (
          <Badge variant={perm.tone} className="text-[10px]">
            <IconShieldCheck className="mr-0.5 h-2.5 w-2.5" />
            {perm.name}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "操作",
      width: "60px",
      align: "right",
      render: (s) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="更多操作">
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
      ),
    },
  ];

  return (
    <LinearTable<AdminSkill>
      columns={columns}
      rows={skills}
      rowKey="id"
      onRowClick={onOpen}
      emptyText="暂无符合条件的技能"
    />
  );
}
