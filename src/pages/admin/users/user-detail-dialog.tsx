import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDate, relativeTime, shortNumber } from "@/lib/utils";
import {
  Activity,
  Calendar,
  KeyRound,
  Mail,
  MessageSquare,
  Network,
  Power,
  Save,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { ROLE_INFO, STATUS_INFO, type User } from "./mock-data";

type Props = {
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onSave: (u: User) => void;
  onToggle: (u: User, enabled: boolean) => void;
  onResetPwd: (u: User) => void;
};

const MOCK_SESSIONS = [
  { id: "s1", title: "数据结构知识图谱", updatedAt: Date.now() - 30 * 60_000, messages: 24 },
  { id: "s2", title: "线性代数复习", updatedAt: Date.now() - 4 * 3600_000, messages: 18 },
  { id: "s3", title: "英语口语练习", updatedAt: Date.now() - 86_400_000, messages: 42 },
  { id: "s4", title: "操作系统缓考申请", updatedAt: Date.now() - 2 * 86_400_000, messages: 12 },
];

const MOCK_MEMORIES = [
  { id: "m1", content: "计算机科学专业，GPA 3.8", tags: ["专业", "学业"], conf: 0.95 },
  { id: "m2", content: "偏好简洁明了的回答风格", tags: ["偏好"], conf: 0.88 },
  { id: "m3", content: "本学期选课：操作系统、线性代数、英语口语", tags: ["课程"], conf: 0.92 },
];

const MOCK_AUDIT = [
  { ts: Date.now() - 12 * 60_000, action: "登录", detail: "Web · 10.0.1.42" },
  { ts: Date.now() - 4 * 3600_000, action: "修改资料", detail: "更新电话" },
  { ts: Date.now() - 86_400_000, action: "权限变更", detail: "授予「学业 Agent」使用" },
];

export function UserDetailDialog({ user, onOpenChange, onSave, onToggle, onResetPwd }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<User | null>(null);

  if (!user) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const r = ROLE_INFO[user.role];
  const s = STATUS_INFO[user.status];
  const current = editing && draft ? draft : user;

  const handleStartEdit = () => {
    setDraft({ ...user });
    setEditing(true);
  };

  const handleSave = () => {
    if (draft) onSave(draft);
    setEditing(false);
    setDraft(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft(null);
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className={cn("text-lg", user.avatarColor)}>
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <DialogTitle className="flex items-center gap-2">
                {editing ? (
                  <input
                    type="text"
                    value={current.name}
                    onChange={(e) => setDraft(draft ? { ...draft, name: e.target.value } : null)}
                    className="rounded border border-input bg-background px-2 py-1 text-lg font-semibold"
                  />
                ) : (
                  user.name
                )}
                <Badge variant={r.tone} className="text-[10px]">
                  {r.name}
                </Badge>
                <Badge variant={s.tone} className="text-[10px]">
                  {s.name}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  {user.username}
                </span>
                {user.studentId && <span className="font-mono">学号 {user.studentId}</span>}
                {user.staffId && <span className="font-mono">工号 {user.staffId}</span>}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">
              <UserIcon className="mr-1 h-3.5 w-3.5" />
              基本信息
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="mr-1 h-3.5 w-3.5" />
              活动统计
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              会话
            </TabsTrigger>
            <TabsTrigger value="memory">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              记忆
            </TabsTrigger>
            <TabsTrigger value="audit">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              审计
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="部门" value={user.department} editing={editing} />
              <Field label="专业 / 方向" value={user.major ?? "—"} editing={editing} />
              <Field label="电话" value={user.phone ?? "—"} editing={editing} />
              <Field label="最后登录 IP" value={user.lastLoginIp} editing={false} />
              <Field label="注册时间" value={formatDate(user.registeredAt)} editing={false} />
              <Field label="最后活跃" value={relativeTime(user.lastActiveAt)} editing={false} />
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="总会话" value={user.sessions} />
              <Stat label="总消息" value={shortNumber(user.messages)} />
              <Stat label="记忆条数" value={user.memoryCount} />
            </div>
            <Separator />
            <div>
              <div className="mb-2 text-xs text-muted-foreground">最近 7 天活动</div>
              <div className="flex h-16 items-end gap-1">
                {[35, 52, 28, 64, 41, 78, 92].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/60"
                    style={{ height: `${h}%` }}
                    title={`Day ${i + 1}: ${h}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <ScrollArea className="h-[220px] pr-2">
              <div className="space-y-1.5">
                {MOCK_SESSIONS.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-info" />
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {s.messages} 条消息 · {relativeTime(s.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="memory">
            <ScrollArea className="h-[220px] pr-2">
              <div className="space-y-1.5">
                {MOCK_MEMORIES.map((m) => (
                  <Card key={m.id}>
                    <CardContent className="p-2.5 text-xs">
                      <p className="text-sm leading-relaxed">{m.content}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex gap-1">
                          {m.tags.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          置信度 {Math.round(m.conf * 100)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-1.5">
              {MOCK_AUDIT.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-dashed border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Network className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{a.action}</span>
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
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-mono">UID: {user.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCancel}>
                  取消
                </Button>
                <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSave}>
                  <Save className="h-3.5 w-3.5" />
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => onResetPwd(user)}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  重置密码
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => onToggle(user, user.status !== "active")}
                >
                  <Power className="h-3.5 w-3.5" />
                  {user.status === "active" ? "禁用" : "启用"}
                </Button>
                <Button size="sm" className="h-8 text-xs" onClick={handleStartEdit}>
                  编辑资料
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string; editing: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-xs font-medium">{value}</div>
    </div>
  );
}
