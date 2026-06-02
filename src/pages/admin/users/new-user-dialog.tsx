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
import { useState } from "react";
import { type User, type UserRole, departmentsList } from "./mock-data";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (u: User) => void;
};

export function NewUserDialog({ open, onOpenChange, onCreate }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    role: "student" as UserRole,
    department: departmentsList[0],
    major: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const u: User = {
      id: `u_${Math.random().toString(36).slice(2, 8)}`,
      username: form.username || form.email.split("@")[0],
      email: form.email,
      name: form.name,
      role: form.role,
      status: "active",
      avatarColor: "bg-info/15 text-info",
      sessions: 0,
      messages: 0,
      registeredAt: Date.now(),
      lastActiveAt: Date.now(),
      department: form.department,
      major: form.major || undefined,
      lastLoginIp: "—",
      memoryCount: 0,
    };
    onCreate(u);
    setForm({
      name: "",
      email: "",
      username: "",
      role: "student",
      department: departmentsList[0],
      major: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
          <DialogDescription>创建新用户账号，初始密码将通过邮件发送</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                姓名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：李明"
                className="h-8 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                用户名
              </Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="留空将自动生成"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              邮箱 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@school.edu"
              className="h-8 text-xs"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">角色</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as UserRole })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">学生</SelectItem>
                  <SelectItem value="teacher">教师</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="counselor">咨询师</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">部门 / 学院</Label>
              <Select
                value={form.department}
                onValueChange={(v) => setForm({ ...form, department: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departmentsList.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.role === "student" && (
            <div className="space-y-1.5">
              <Label htmlFor="major" className="text-xs">
                专业
              </Label>
              <Input
                id="major"
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                placeholder="如：软件工程"
                className="h-8 text-xs"
              />
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs"
              disabled={!form.name || !form.email}
            >
              创建用户
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
