import { Badge } from "@/components/ui/badge";
// Table / ScrollArea 展示
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionFrame } from "./section-frame";

const SAMPLE = [
  { id: "1", name: "学业助手", domain: "academic", status: "active", usage: 4280 },
  { id: "2", name: "心理助手", domain: "emotional", status: "active", usage: 1840 },
  { id: "3", name: "教务助手", domain: "affairs", status: "active", usage: 2100 },
  { id: "4", name: "通用助手", domain: "general", status: "active", usage: 3560 },
];

export function SectionData() {
  return (
    <SectionFrame id="data" title="Data" description="数据展示类组件 - 表格、滚动区域">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">名称</TableHead>
                  <TableHead className="text-[10px]">领域</TableHead>
                  <TableHead className="text-[10px]">状态</TableHead>
                  <TableHead className="text-right text-[10px]">调用次数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SAMPLE.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="py-2 text-sm font-medium">{s.name}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <Badge variant="outline">{s.domain}</Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="success" className="text-[10px]">
                        active
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right font-mono text-xs tabular-nums">
                      {s.usage.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="mb-2 text-sm font-medium">ScrollArea</div>
            <ScrollArea className="h-40 rounded-md border p-2">
              <div className="space-y-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="rounded p-1.5 text-xs hover:bg-muted/40">
                    项目 {i + 1} - 滚动测试条目
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SectionFrame>
  );
}
