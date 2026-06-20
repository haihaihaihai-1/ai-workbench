import {
  IconCheckCircle2,
  IconCircleAlert,
  IconLoader2,
  IconWrench,
  IconXCircle,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { ToolCall } from "@/lib/types";

type Props = { tools: ToolCall[] };

export function TracePanel({ tools }: Props) {
  const total = tools.length;
  const success = tools.filter((t) => t.status === "success").length;
  const error = tools.filter((t) => t.status === "error").length;
  const running = tools.filter((t) => t.status === "running").length;
  const totalMs = tools.reduce((sum, t) => sum + (t.durationMs ?? 0), 0);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center gap-2">
          <IconWrench className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">工具调用</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="总调用" value={total} />
          <Stat label="成功" value={success} tone="success" />
          <Stat label="失败" value={error} tone="destructive" />
          <Stat label="进行中" value={running} tone="info" />
        </div>
        <div className="mt-3 text-center text-[10px] text-muted-foreground">
          总耗时 <span className="font-mono font-medium text-foreground">{totalMs}ms</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {tools.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="text-3xl">🛠</div>
            <p className="text-sm">暂无工具调用</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {tools.map((tool) => (
            <div key={tool.id} className="rounded-md border border-border bg-card p-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {tool.status === "running" && (
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin text-info" />
                  )}
                  {tool.status === "success" && (
                    <IconCheckCircle2 className="h-3.5 w-3.5 text-success" />
                  )}
                  {tool.status === "error" && (
                    <IconXCircle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className="font-mono text-xs font-medium">{tool.name}</span>
                </div>
                {tool.durationMs != null && (
                  <Badge variant="secondary" className="text-[10px]">
                    {tool.durationMs}ms
                  </Badge>
                )}
              </div>
              {tool.input && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-[10px] text-muted-foreground hover:text-foreground">
                    输入参数
                  </summary>
                  <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-1.5 text-[10px] font-mono text-muted-foreground">
                    {tool.input}
                  </pre>
                </details>
              )}
              {tool.output && (
                <div className="mt-1.5 line-clamp-2 text-[10px] text-muted-foreground">
                  → {tool.output}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "destructive" | "info";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : tone === "info"
          ? "text-info"
          : "text-foreground";
  return (
    <div className="flex flex-col items-center">
      <span className={`text-base font-semibold tabular-nums ${color}`}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

// 危机干预横幅
export function CrisisBanner() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs">
      <IconCircleAlert className="h-4 w-4 text-destructive" />
      <span className="text-destructive">
        <strong>危机干预已激活</strong> · 检测到敏感关键词，已切换至心理助手并提供援助热线
      </span>
    </div>
  );
}
