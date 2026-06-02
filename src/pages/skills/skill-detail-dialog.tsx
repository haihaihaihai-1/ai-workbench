import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, relativeTime, shortNumber } from "@/lib/utils";
import { Activity, Code2, Download, History, ShieldCheck, Star, Trash2 } from "lucide-react";
import { CATEGORY_INFO, EXECUTION_MODE_INFO, type Skill } from "./mock-data";

type Props = {
  skill: Skill | null;
  onOpenChange: (open: boolean) => void;
  onToggle: (s: Skill, enabled: boolean) => void;
  onInstall: (s: Skill) => void;
  onUninstall: (s: Skill) => void;
};

export function SkillDetailDialog({
  skill,
  onOpenChange,
  onToggle,
  onInstall,
  onUninstall,
}: Props) {
  if (!skill) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }
  const cat = CATEGORY_INFO[skill.category];
  const mode = EXECUTION_MODE_INFO[skill.executionMode];

  return (
    <Dialog open={!!skill} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-md text-2xl",
                cat.bg,
              )}
            >
              {skill.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg">{skill.name}</DialogTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  v{skill.version}
                </Badge>
              </div>
              <DialogDescription className="mt-1 text-sm">{skill.description}</DialogDescription>
              <div className="mt-2 flex flex-wrap gap-1">
                <span
                  className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", cat.bg, cat.color)}
                >
                  {cat.emoji} {cat.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {mode.name}
                </Badge>
                {skill.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="mr-1 h-3.5 w-3.5" />
              概览
            </TabsTrigger>
            <TabsTrigger value="example">
              <Code2 className="mr-1 h-3.5 w-3.5" />
              使用示例
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-1 h-3.5 w-3.5" />
              调用历史 ({skill.history.length})
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              权限
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="总调用" value={shortNumber(skill.calls)} />
              <Stat
                label="评分"
                value={
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {skill.rating.toFixed(1)}
                  </span>
                }
              />
              <Stat label="成功率" value={`${skill.successRate.toFixed(1)}%`} tone="text-success" />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">作者</div>
                <div className="font-medium">{skill.author}</div>
              </div>
              <div>
                <div className="text-muted-foreground">版本</div>
                <div className="font-mono">{skill.version}</div>
              </div>
              <div>
                <div className="text-muted-foreground">执行模式</div>
                <div>{mode.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">创建时间</div>
                <div className="font-mono">{relativeTime(skill.createdAt)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="example">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                调用语法
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed">
                <code>{skill.example}</code>
              </pre>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode.description}。技能由 LLM 在合适的场景自动调用，亦可在对话中显式请求。
            </p>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[220px] pr-2">
              {skill.history.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">暂无调用记录</div>
              ) : (
                <div className="space-y-1.5">
                  {skill.history.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            h.success ? "bg-success" : "bg-destructive",
                          )}
                        />
                        <span className="font-mono">{h.user}</span>
                        <span className="text-muted-foreground">{h.success ? "成功" : "失败"}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                        <span>{h.durationMs}ms</span>
                        <span>{relativeTime(h.ts)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="permissions">
            {skill.permissions.length === 0 ? (
              <div className="rounded-md border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                <ShieldCheck className="mx-auto mb-1.5 h-5 w-5 text-success" />
                此技能无需特殊权限
              </div>
            ) : (
              <div className="space-y-1.5">
                {skill.permissions.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-warning" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <div className="flex items-center gap-2">
            {skill.installed && (
              <>
                <span className="text-xs text-muted-foreground">已启用</span>
                <Switch
                  checked={skill.enabled}
                  onCheckedChange={(v) => onToggle(skill, v)}
                  aria-label="启用技能"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {skill.installed ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-destructive"
                onClick={() => onUninstall(skill)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                卸载
              </Button>
            ) : (
              <Button size="sm" className="h-8 gap-1.5" onClick={() => onInstall(skill)}>
                <Download className="h-3.5 w-3.5" />
                安装技能
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-lg font-semibold tabular-nums", tone)}>{value}</div>
    </div>
  );
}
