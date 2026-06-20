import { IconDownload, IconUserPlus, IconUsers } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exportToCSV } from "@/lib/export";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MOCK_USERS, USER_STATS, type User } from "./users/mock-data";
import { NewUserDialog } from "./users/new-user-dialog";
import { StatsOverview } from "./users/stats-overview";
import { UserDetailDialog } from "./users/user-detail-dialog";
import { type UserFilterState, UserFilters } from "./users/user-filters";
import { UserTable } from "./users/user-table";

const DAY = 24 * 60 * 60 * 1000;

function matchRegistered(registeredAt: number, range: UserFilterState["registered"]): boolean {
  const now = Date.now();
  if (range === "all") return true;
  if (range === "today") return registeredAt > now - DAY;
  if (range === "week") return registeredAt > now - 7 * DAY;
  if (range === "month") return registeredAt > now - 30 * DAY;
  if (range === "year") return registeredAt > now - 365 * DAY;
  if (range === "older") return registeredAt <= now - 365 * DAY;
  return true;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filters, setFilters] = useState<UserFilterState>({
    q: "",
    role: "all",
    status: "all",
    registered: "all",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState<User | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q) &&
          !u.username.toLowerCase().includes(q) &&
          !(u.studentId?.toLowerCase().includes(q) ?? false) &&
          !(u.staffId?.toLowerCase().includes(q) ?? false)
        ) {
          return false;
        }
      }
      if (filters.role !== "all" && u.role !== filters.role) return false;
      if (filters.status !== "all" && u.status !== filters.status) return false;
      if (!matchRegistered(u.registeredAt, filters.registered)) return false;
      return true;
    });
  }, [users, filters]);

  const handleSave = (u: User) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
    toast.success(`用户 ${u.name} 已更新`);
    setOpen(null);
  };

  const handleToggle = (u: User, enabled: boolean) => {
    const next: User["status"] = enabled ? "active" : "disabled";
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    toast.success(`${u.name} 已${enabled ? "启用" : "禁用"}`);
  };

  const handleResetPwd = (u: User) => {
    toast.success(`已重置 ${u.name} 的密码`, { description: "新密码已发送至邮箱" });
  };

  const handleDelete = (u: User) => {
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    setSelectedIds((prev) => prev.filter((id) => id !== u.id));
    toast.success(`用户 ${u.name} 已删除`);
  };

  const handleCreate = (u: User) => {
    setUsers((prev) => [u, ...prev]);
    setNewOpen(false);
    toast.success(`用户 ${u.name} 创建成功`, { description: "初始密码已发送至邮箱" });
  };

  const handleBatch = (action: "enable" | "disable" | "delete") => {
    if (selectedIds.length === 0) return;
    if (action === "delete") {
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      toast.success(`已删除 ${selectedIds.length} 个用户`);
    } else {
      const next: User["status"] = action === "enable" ? "active" : "disabled";
      setUsers((prev) =>
        prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: next } : u)),
      );
      toast.success(
        action === "enable"
          ? `已启用 ${selectedIds.length} 个用户`
          : `已禁用 ${selectedIds.length} 个用户`,
      );
    }
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      {/* 顶部 · Linear Members 招牌：紫色 logo + 紧凑 metadata */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500 text-white shadow-vercel">
            <IconUsers className="h-4 w-4" weight="bold" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">Members</h1>
            <p className="text-[11px] text-muted-foreground">
              用户列表 · 角色 · 状态 · 批量操作 · 审计 ·{" "}
              <span className="font-mono">{filtered.length}</span> 人
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() =>
              exportToCSV(filtered, "users.csv", [
                { key: "id", label: "ID" },
                { key: "username", label: "账号" },
                { key: "name", label: "姓名" },
                { key: "email", label: "邮箱" },
                { key: "role", label: "角色" },
                { key: "status", label: "状态" },
                { key: "department", label: "部门" },
                { key: "registeredAt", label: "注册时间" },
              ])
            }
          >
            <IconDownload className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setNewOpen(true)}>
            <IconUserPlus className="h-3.5 w-3.5" weight="bold" />
            Add member
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <StatsOverview stats={USER_STATS} />

      {/* 筛选 + 批量操作 */}
      <Card>
        <CardContent className="space-y-2 p-3">
          <UserFilters
            value={filters}
            onChange={setFilters}
            total={users.length}
            filtered={filtered.length}
            selected={selectedIds.length}
          />
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 border-t border-border pt-2 text-xs">
              <span className="text-muted-foreground">批量操作：</span>
              <Button
                variant="outline"
                size="xs"
                className="h-6 text-[10px]"
                onClick={() => handleBatch("enable")}
              >
                批量启用
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="h-6 text-[10px]"
                onClick={() => handleBatch("disable")}
              >
                批量禁用
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 text-[10px] text-destructive"
                onClick={() => handleBatch("delete")}
              >
                批量删除
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 text-[10px]"
                onClick={() => setSelectedIds([])}
              >
                取消选择
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 表格 */}
      <UserTable
        users={filtered}
        selected={selectedIds}
        onSelectChange={setSelectedIds}
        onOpen={setOpen}
        onToggle={handleToggle}
        onResetPwd={handleResetPwd}
        onDelete={handleDelete}
      />

      {/* 详情 */}
      <UserDetailDialog
        user={open}
        onOpenChange={(o) => !o && setOpen(null)}
        onSave={handleSave}
        onToggle={handleToggle}
        onResetPwd={handleResetPwd}
      />

      {/* 新增 */}
      <NewUserDialog open={newOpen} onOpenChange={setNewOpen} onCreate={handleCreate} />
    </div>
  );
}
