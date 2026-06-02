import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { useState } from "react";
import { USER_SEGMENTS, type UserSegment } from "./mock-data";

export function UserSegments() {
  const [tab, setTab] = useState<UserSegment>("high");
  const current = USER_SEGMENTS[tab];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" />
            用户分群
          </CardTitle>
          <Tabs value={tab} onValueChange={(v) => setTab(v as UserSegment)}>
            <TabsList>
              {(Object.entries(USER_SEGMENTS) as [UserSegment, typeof current][]).map(
                ([k, info]) => (
                  <TabsTrigger key={k} value={k} className="h-7 gap-1 text-xs">
                    <span className={cn("h-2 w-2 rounded-full", info.bg)} />
                    {info.name}
                    <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">
                      {info.samples.length}
                    </Badge>
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-xs text-muted-foreground">{current.description}</p>
        <Tabs value={tab}>
          {(Object.keys(USER_SEGMENTS) as UserSegment[]).map((k) => {
            const data = USER_SEGMENTS[k];
            return (
              <TabsContent key={k} value={k} className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">用户</TableHead>
                      <TableHead className="text-[10px]">最近活跃</TableHead>
                      <TableHead className="text-right text-[10px]">会话数</TableHead>
                      <TableHead className="text-right text-[10px]">提问总数</TableHead>
                      <TableHead className="text-right text-[10px]">满意度</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.samples.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
                                data.bg,
                                data.color,
                              )}
                            >
                              {u.username.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <div className="text-xs font-medium">{u.username}</div>
                              <div className="font-mono text-[10px] text-muted-foreground">
                                {u.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground">
                          {u.lastActive}
                        </TableCell>
                        <TableCell className="py-2 text-right font-mono text-xs tabular-nums">
                          {u.sessions}
                        </TableCell>
                        <TableCell className="py-2 text-right font-mono text-xs tabular-nums">
                          {u.totalQuestions}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          {u.satisfaction > 0 ? (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                                u.satisfaction >= 85
                                  ? "bg-success/15 text-success"
                                  : u.satisfaction >= 70
                                    ? "bg-info/15 text-info"
                                    : "bg-warning/15 text-warning",
                              )}
                            >
                              {u.satisfaction}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
