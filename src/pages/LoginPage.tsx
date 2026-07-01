import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LOGIN_ACCOUNTS, useAuthStore } from "@/stores/auth-store";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ROLE_LABEL: Record<string, string> = {
  student: "学生",
  teacher: "教师",
  admin: "管理员",
  counselor: "咨询师",
};

const ROLE_COLORS: Record<string, string> = {
  student: "bg-info/15 text-info",
  teacher: "bg-success/15 text-success",
  admin: "bg-warning/15 text-warning",
  counselor: "bg-primary/15 text-primary",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async (accountUsername: string) => {
    setLoading(true);
    const result = await login(accountUsername, "123456");
    if (result.success) {
      const account = LOGIN_ACCOUNTS.find((a) => a.username === accountUsername);
      toast.success(`欢迎回来，${account?.user.name ?? ""}`, {
        description: `身份：${ROLE_LABEL[account?.user.role ?? "student"]}`,
      });
      navigate("/");
    } else {
      toast.error(result.error ?? "登录失败");
      setLoading(false);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("请输入用户名");
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password || "123456");
    if (result.success) {
      const account = LOGIN_ACCOUNTS.find((a) => a.username === username.trim());
      toast.success(`欢迎回来，${account?.user.name ?? ""}`);
      navigate("/");
    } else {
      toast.error(result.error ?? "登录失败");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-2xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground shadow-lg">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Workbench</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI 协作工作台 · 请选择身份登录
                </p>
              </div>
            </div>

            {/* 快速登录 - 角色卡片 */}
            <div className="mb-6">
              <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                快速登录（演示模式）
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {LOGIN_ACCOUNTS.map((account) => {
                  const u = account.user;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(account.username)}
                      disabled={loading}
                      className={cn(
                        "group flex flex-col items-start gap-1.5 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50",
                      )}
                    >
                      <div className="flex w-full items-center gap-2">
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                          ROLE_COLORS[u.role],
                        )}>
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{u.name}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{account.username}</div>
                        </div>
                      </div>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        ROLE_COLORS[u.role],
                      )}>
                        {ROLE_LABEL[u.role]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">或输入用户名</span>
              <Separator className="flex-1" />
            </div>

            {/* 表单 */}
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="输入用户名（如 liming）"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="任意密码（演示模式）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button type="submit" className="h-10 w-full" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>

            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              演示模式 · 选择角色卡片即可快速体验不同权限
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
