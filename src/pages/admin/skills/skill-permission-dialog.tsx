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
import { IconPlus, IconShieldCheck, IconTrash2, IconUserPlus } from "@/components/icons"
import { useState } from "react";
import { type AdminSkill, PERMISSION_LEVEL_INFO, type PermissionLevel } from "./mock-data";

type Props = {
  skill: AdminSkill | null;
  onOpenChange: (open: boolean) => void;
  onSave: (s: AdminSkill) => void;
};

const ROLES = ["student", "teacher", "admin", "counselor"];
const ROLE_LABEL: Record<string, string> = {
  student: "学生",
  teacher: "教师",
  admin: "管理员",
  counselor: "咨询师",
};

export function SkillPermissionDialog({ skill, onOpenChange, onSave }: Props) {
  const [draft, setDraft] = useState<AdminSkill | null>(null);
  const [newRole, setNewRole] = useState<string>("student");
  const [newUserId, setNewUserId] = useState("");

  // 打开时初始化草稿
  if (skill && (!draft || draft.id !== skill.id)) {
    setDraft({
      ...skill,
      allowedRoles: [...skill.allowedRoles],
      allowedUsers: [...skill.allowedUsers],
    });
  }

  if (!skill || !draft) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const handleSave = () => {
    onSave({ ...draft, lastAudit: Date.now() });
    setDraft(null);
    onOpenChange(false);
  };

  const addRole = () => {
    if (newRole && !draft.allowedRoles.includes(newRole)) {
      setDraft({ ...draft, allowedRoles: [...draft.allowedRoles, newRole] });
    }
  };

  const removeRole = (r: string) => {
    setDraft({ ...draft, allowedRoles: draft.allowedRoles.filter((x) => x !== r) });
  };

  const addUser = () => {
    const v = newUserId.trim();
    if (v && !draft.allowedUsers.includes(v)) {
      setDraft({ ...draft, allowedUsers: [...draft.allowedUsers, v] });
      setNewUserId("");
    }
  };

  const removeUser = (u: string) => {
    setDraft({ ...draft, allowedUsers: draft.allowedUsers.filter((x) => x !== u) });
  };

  return (
    <Dialog open={!!skill} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShieldCheck className="h-5 w-5 text-warning" />
            权限设置 - {draft.name}
          </DialogTitle>
          <DialogDescription>配置谁可以调用此技能，按角色或按用户精确控制</DialogDescription>
        </DialogHeader>

        <Tabs
          value={draft.permissionLevel}
          onValueChange={(v) => setDraft({ ...draft, permissionLevel: v as PermissionLevel })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              {PERMISSION_LEVEL_INFO.all.name}
            </TabsTrigger>
            <TabsTrigger value="role" className="text-xs">
              {PERMISSION_LEVEL_INFO.role.name}
            </TabsTrigger>
            <TabsTrigger value="user" className="text-xs">
              {PERMISSION_LEVEL_INFO.user.name}
            </TabsTrigger>
            <TabsTrigger value="admin_only" className="text-xs">
              {PERMISSION_LEVEL_INFO.admin_only.name}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="rounded-md border border-info/30 bg-info/5 p-4 text-center text-xs text-muted-foreground"
          >
            所有登录用户都可以调用此技能
          </TabsContent>

          <TabsContent
            value="admin_only"
            className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-center text-xs text-muted-foreground"
          >
            只有管理员账户可调用此技能
          </TabsContent>

          <TabsContent value="role" className="space-y-3">
            <Card>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">添加角色</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="h-8 gap-1.5" onClick={addRole}>
                    <IconPlus className="h-3.5 w-3.5" />
                    添加
                  </Button>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="mb-2 text-xs text-muted-foreground">
                    已分配角色 ({draft.allowedRoles.length})
                  </div>
                  {draft.allowedRoles.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-center text-xs text-muted-foreground">
                      尚未分配任何角色
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {draft.allowedRoles.map((r) => (
                        <div
                          key={r}
                          className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <IconShieldCheck className="h-3.5 w-3.5 text-warning" />
                            <span className="font-medium">{ROLE_LABEL[r] ?? r}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{r}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeRole(r)}
                            aria-label={`移除 ${r}`}
                          >
                            <IconTrash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user" className="space-y-3">
            <Card>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">添加用户 ID</Label>
                    <Input
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder="如 u_8234"
                      className="h-8 font-mono text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addUser();
                        }
                      }}
                    />
                  </div>
                  <Button size="sm" className="h-8 gap-1.5" onClick={addUser}>
                    <IconUserPlus className="h-3.5 w-3.5" />
                    添加
                  </Button>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="mb-2 text-xs text-muted-foreground">
                    已分配用户 ({draft.allowedUsers.length})
                  </div>
                  {draft.allowedUsers.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-center text-xs text-muted-foreground">
                      尚未分配任何用户
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {draft.allowedUsers.map((u) => (
                        <Badge
                          key={u}
                          variant="secondary"
                          className="gap-1.5 px-2 py-1 font-mono text-[10px]"
                        >
                          {u}
                          <button
                            type="button"
                            onClick={() => removeUser(u)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`移除 ${u}`}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <div className="text-xs text-muted-foreground">
            当前：
            <Badge
              variant={PERMISSION_LEVEL_INFO[draft.permissionLevel].tone}
              className="text-[10px]"
            >
              {PERMISSION_LEVEL_INFO[draft.permissionLevel].name}
            </Badge>
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
            <Button size="sm" className="h-8 text-xs" onClick={handleSave}>
              保存权限
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
