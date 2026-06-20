import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, shortNumber } from "@/lib/utils";
import { IconWrench } from "@/components/icons"
import { TOOL_HEALTH_REPORT } from "./mock-data";

export function ToolHealthReport() {
  const sorted = [...TOOL_HEALTH_REPORT].sort((a, b) => b.errorRate - a.errorRate);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconWrench className="h-4 w-4 text-warning" />
          工具健康度报告
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px]">工具</TableHead>
              <TableHead className="text-right text-[10px]">调用</TableHead>
              <TableHead className="text-right text-[10px]">错误率</TableHead>
              <TableHead className="text-right text-[10px]">超时率</TableHead>
              <TableHead className="text-right text-[10px]">P99</TableHead>
              <TableHead className="text-right text-[10px]">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((tool) => {
              const healthy = tool.errorRate < 1 && tool.timeoutRate < 1.5;
              const warning = !healthy && tool.errorRate < 3;
              return (
                <TableRow key={tool.name}>
                  <TableCell className="py-2 font-mono text-xs">{tool.name}</TableCell>
                  <TableCell className="py-2 text-right text-xs tabular-nums">
                    {shortNumber(tool.calls)}
                  </TableCell>
                  <TableCell className="py-2 text-right text-xs tabular-nums">
                    <span
                      className={cn(
                        tool.errorRate >= 3
                          ? "text-destructive"
                          : tool.errorRate >= 1
                            ? "text-warning"
                            : "text-muted-foreground",
                      )}
                    >
                      {tool.errorRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-right text-xs tabular-nums">
                    <span
                      className={cn(
                        tool.timeoutRate >= 2
                          ? "text-destructive"
                          : tool.timeoutRate >= 1
                            ? "text-warning"
                            : "text-muted-foreground",
                      )}
                    >
                      {tool.timeoutRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-right font-mono text-xs tabular-nums">
                    {tool.p99}ms
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        healthy && "bg-success/15 text-success",
                        warning && "bg-warning/15 text-warning",
                        !healthy && !warning && "bg-destructive/15 text-destructive",
                      )}
                    >
                      {healthy ? "健康" : warning ? "关注" : "异常"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
