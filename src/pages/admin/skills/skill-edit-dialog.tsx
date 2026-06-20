import {
  IconHistory as HistoryIcon,
  IconActivity,
  IconCode2,
  IconSave,
  IconShieldCheck,
} from "@/components/icons";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate, relativeTime, shortNumber } from "@/lib/utils";
import { useState } from "react";
import {
  type AdminSkill,
  CATEGORY_INFO,
  EXECUTION_MODE_INFO,
  type ExecutionMode,
  MOCK_AUDIT_LOG,
  MOCK_CALL_LOG,
  STATUS_INFO,
  type SkillCategory,
} from "./mock-data";

type Props = {
  skill: AdminSkill | null;
  onOpenChange: (open: boolean) => void;
  onSave: (s: AdminSkill) => void;
};

export function SkillEditDialog({ skill, onOpenChange, onSave }: Props) {
  const [draft, setDraft] = useState<AdminSkill | null>(null);

  // 打开时初始化草稿
  if (skill && (!draft || draft.id !== skill.id)) {
    setDraft({ ...skill });
  }

  if (!skill || !draft) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const cat = CATEGORY_INFO[draft.category];
  const mode = EXECUTION_MODE_INFO[draft.executionMode];
  const status = STATUS_INFO[draft.status];

  const handleSave = () => {
    onSave({ ...draft, updatedAt: Date.now() });
    setDraft(null);
    onOpenChange(false);
  };

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
              {draft.icon}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="rounded border border-input bg-background px-2 py-1 text-lg font-semibold"
                />
                <Badge variant={mode.tone} className="text-[10px]">
                  {mode.name}
                </Badge>
                <Badge variant={status.tone} className="text-[10px]">
                  {status.name}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                完整元数据 · 调用统计 · 权限配置 · 审计日志
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList>
            <TabsTrigger value="meta">
              <IconCode2 className="mr-1 h-3.5 w-3.5" />
              元数据
            </TabsTrigger>
            <TabsTrigger value="stats">
              <IconActivity className="mr-1 h-3.5 w-3.5" />
              调用统计
            </TabsTrigger>
            <TabsTrigger value="perm">
              <IconShieldCheck className="mr-1 h-3.5 w-3.5" />
              权限
            </TabsTrigger>
            <TabsTrigger value="audit">
              <HistoryIcon className="mr-1 h-3.5 w-3.5" />
              审计日志
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">名称</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">版本</Label>
                <Input
                  value={draft.version}
                  onChange={(e) => setDraft({ ...draft, version: e.target.value })}
                  className="h-8 font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">作者</Label>
                <Input
                  value={draft.author}
                  onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">分类</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v as SkillCategory })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tool">🔧 工具</SelectItem>
                    <SelectItem value="data">📊 数据</SelectItem>
                    <SelectItem value="cognitive">🧠 认知</SelectItem>
                    <SelectItem value="creative">✨ 创作</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">执行模式</Label>
                <Select
                  value={draft.executionMode}
                  onValueChange={(v) => setDraft({ ...draft, executionMode: v as ExecutionMode })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTO">AUTO - 自动执行</SelectItem>
                    <SelectItem value="ASK_CONFIRM">ASK_CONFIRM - 需确认</SelectItem>
                    <SelectItem value="INTERACTIVE">INTERACTIVE - 交互式</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">图标 (emoji)</Label>
                <Input
                  value={draft.icon}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                  className="h-8 text-xs"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">描述</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="text-xs"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">标签 (逗号分隔)</Label>
              <Input
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                className="h-8 text-xs"
                placeholder="搜索, 实时, 学术"
              />
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="总调用" value={shortNumber(draft.calls)} />
              <Stat
                label="错误率"
                value={`${draft.errorRate.toFixed(1)}%`}
                tone={draft.errorRate > 5 ? "text-destructive" : "text-foreground"}
              />
              <Stat label="P50 延迟" value={`${draft.p50LatencyMs}ms`} />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-card p-3 text-xs">
              <Row label="创建时间" value={formatDate(draft.createdAt)} />
              <Row label="更新时间" value={formatDate(draft.updatedAt)} />
              <Row label="最近审计" value={relativeTime(draft.lastAudit)} />
              <Row label="Skill ID" value={draft.id} mono />
            </div>
            <div>
              <div className="mb-2 text-xs text-muted-foreground">最近调用</div>
              <div className="space-y-1.5">
                {MOCK_CALL_LOG(draft.id).map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          c.success ? "bg-success" : "bg-destructive",
                        )}
                      />
                      <span className="font-mono text-[10px]">{c.user}</span>
                      <span className="font-mono text-muted-foreground">{c.input}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <span>{c.durationMs}ms</span>
                      <span>{relativeTime(c.ts)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="perm" className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">权限级别</Label>
              <Select
                value={draft.permissionLevel}
                onValueChange={(v) =>
                  setDraft({ ...draft, permissionLevel: v as AdminSkill["permissionLevel"] })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全员</SelectItem>
                  <SelectItem value="role">按角色</SelectItem>
                  <SelectItem value="user">按用户</SelectItem>
                  <SelectItem value="admin_only">仅管理员</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {PERMISSION_LEVEL_INFO_HELPER(draft.permissionLevel)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">所需系统权限</Label>
              {draft.permissions.length === 0 ? (
                <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-center text-xs text-muted-foreground">
                  无需特殊权限
                </div>
              ) : (
                <div className="space-y-1">
                  {draft.permissions.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
                    >
                      <IconShieldCheck className="h-3.5 w-3.5 text-warning" />
                      <span className="font-mono">{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {draft.permissionLevel === "role" && (
              <div className="space-y-1.5">
                <Label className="text-xs">允许角色</Label>
                <div className="flex flex-wrap gap-1">
                  {draft.allowedRoles.map((r) => (
                    <Badge key={r} variant="secondary" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {draft.permissionLevel === "user" && (
              <div className="space-y-1.5">
                <Label className="text-xs">允许用户</Label>
                <div className="flex flex-wrap gap-1">
                  {draft.allowedUsers.map((u) => (
                    <Badge key={u} variant="secondary" className="font-mono text-[10px]">
                      {u}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-1.5">
              {MOCK_AUDIT_LOG.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-dashed border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      {a.action}
                    </span>
                    <span className="font-medium">{a.user}</span>
                    <span className="text-muted-foreground">· {a.detail}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {relativeTime(a.ts)}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">v{draft.version}</span> · 更新于{" "}
            {relativeTime(draft.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setDraft(null);
                onOpenChange(false);
              }}
            >
              取消
            </Button>
            <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSave}>
              <IconSave className="h-3.5 w-3.5" />
              保存修改
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-lg font-semibold tabular-nums", tone)}>{value}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function PERMISSION_LEVEL_INFO_HELPER(level: AdminSkill["permissionLevel"]) {
  switch (level) {
    case "all":
      return "所有登录用户都可调用此技能";
    case "role":
      return "仅指定角色的用户可调用";
    case "user":
      return "仅指定用户可调用";
    case "admin_only":
      return "仅管理员账户可调用";
    default:
      return "";
  }
}
