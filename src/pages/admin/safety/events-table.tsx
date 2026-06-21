/**
 * EventsTable · 借皮 Linear 风格紧凑表格
 *
 * 列：时间 / 类型 / 严重级别 / 匹配内容 / 用户 / 上下文 / 处置
 *
 * 视觉：
 * - 严重级别色块：critical 红 / high 琥珀 / medium 蓝 / low 绿
 * - 处置文字着色：warn=琥珀 / block=红 / redact=蓝
 *
 * 借皮要点：
 * - grid 紧凑行（替代 shadcn Table）
 * - 极小字号 header
 * - 表格行可点击（如有 onOpen 回调）
 */

import { LinearTable, type LinearTableColumn } from "@/components/ui/linear-table";
import { cn, relativeTime } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low";
type EventType = "pii" | "injection" | "violation";
type Action = "warn" | "block" | "redact";

export type SafetyEvent = {
  id: string;
  type: EventType;
  severity: Severity;
  content: string;
  user: string;
  action: Action;
  createdAt: number;
  context: string;
};

const SEVERITY_INFO: Record<Severity, { name: string; cls: string }> = {
  critical: { name: "严重", cls: "bg-destructive/15 text-destructive" },
  high: { name: "高", cls: "bg-warning/15 text-warning" },
  medium: { name: "中", cls: "bg-info/15 text-info" },
  low: { name: "低", cls: "bg-success/15 text-success" },
};

const TYPE_INFO: Record<EventType, { name: string; color: string; bg: string }> = {
  pii: { name: "PII", color: "#3B82F6", bg: "bg-info/10" },
  injection: { name: "提示注入", color: "#EF4444", bg: "bg-destructive/10" },
  violation: { name: "内容违规", color: "#F59E0B", bg: "bg-warning/10" },
};

const ACTION_INFO: Record<Action, { name: string; tone: string }> = {
  warn: { name: "警告", tone: "text-warning" },
  block: { name: "阻断", tone: "text-destructive" },
  redact: { name: "脱敏", tone: "text-info" },
};

type Props = {
  events: SafetyEvent[];
  onRowClick?: (e: SafetyEvent) => void;
};

export function EventsTable({ events, onRowClick }: Props) {
  const columns: LinearTableColumn<SafetyEvent>[] = [
    {
      key: "time",
      label: "时间",
      width: "120px",
      render: (e) => (
        <span className="text-[11px] text-muted-foreground">{relativeTime(e.createdAt)}</span>
      ),
    },
    {
      key: "type",
      label: "类型",
      width: "100px",
      render: (e) => {
        const ti = TYPE_INFO[e.type];
        return (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              ti.bg,
              "text-foreground",
            )}
          >
            <span
              className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle"
              style={{ backgroundColor: ti.color }}
            />
            {ti.name}
          </span>
        );
      },
    },
    {
      key: "severity",
      label: "严重级别",
      width: "100px",
      render: (e) => {
        const si = SEVERITY_INFO[e.severity];
        return (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              si.cls,
            )}
          >
            {si.name}
          </span>
        );
      },
    },
    {
      key: "content",
      label: "匹配内容",
      width: "minmax(0,2fr)",
      render: (e) => (
        <span className="truncate font-mono text-[11px]">{e.content}</span>
      ),
    },
    {
      key: "user",
      label: "用户",
      width: "120px",
      render: (e) => (
        <span className="font-mono text-[11px] text-muted-foreground">{e.user}</span>
      ),
    },
    {
      key: "context",
      label: "上下文",
      width: "minmax(0,1.2fr)",
      render: (e) => <span className="text-[11px] text-muted-foreground">{e.context}</span>,
    },
    {
      key: "action",
      label: "处置",
      width: "80px",
      render: (e) => {
        const ai = ACTION_INFO[e.action];
        return <span className={cn("text-xs font-medium", ai.tone)}>{ai.name}</span>;
      },
    },
  ];

  return (
    <LinearTable<SafetyEvent>
      columns={columns}
      rows={events}
      rowKey="id"
      onRowClick={onRowClick}
      emptyText="暂无匹配的安全事件"
    />
  );
}
