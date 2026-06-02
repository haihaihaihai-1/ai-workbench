import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ADMIN_SKILL_STATS, type AdminSkill, MOCK_ADMIN_SKILLS } from "./skills/mock-data";
import { SkillEditDialog } from "./skills/skill-edit-dialog";
import { type SkillFilterState, SkillFilters } from "./skills/skill-filters";
import { SkillPermissionDialog } from "./skills/skill-permission-dialog";
import { SkillTable } from "./skills/skill-table";
import { StatsOverview } from "./skills/stats-overview";

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<AdminSkill[]>(MOCK_ADMIN_SKILLS);
  const [filters, setFilters] = useState<SkillFilterState>({
    q: "",
    category: "all",
    status: "all",
    mode: "all",
  });
  const [edit, setEdit] = useState<AdminSkill | null>(null);
  const [perm, setPerm] = useState<AdminSkill | null>(null);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.author.toLowerCase().includes(q) &&
          !s.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.category !== "all" && s.category !== filters.category) return false;
      if (filters.status !== "all" && s.status !== filters.status) return false;
      if (filters.mode !== "all" && s.executionMode !== filters.mode) return false;
      return true;
    });
  }, [skills, filters]);

  const handleToggle = (s: AdminSkill, enabled: boolean) => {
    setSkills((prev) =>
      prev.map((x) =>
        x.id === s.id
          ? { ...x, status: enabled ? "enabled" : "disabled", updatedAt: Date.now() }
          : x,
      ),
    );
    toast.success(enabled ? `${s.name} 已启用` : `${s.name} 已禁用`);
  };

  const handleSave = (s: AdminSkill) => {
    setSkills((prev) => prev.map((x) => (x.id === s.id ? s : x)));
    toast.success(`已保存 ${s.name} 的修改`);
  };

  const handleDuplicate = (s: AdminSkill) => {
    const clone: AdminSkill = {
      ...s,
      id: `sk_${Math.random().toString(36).slice(2, 8)}`,
      name: `${s.name} (副本)`,
      status: "pending",
      calls: 0,
      errorRate: 0,
      p50LatencyMs: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSkills((prev) => [clone, ...prev]);
    toast.success(`已复制为「${clone.name}」，进入待审核状态`);
  };

  const handleDelete = (s: AdminSkill) => {
    setSkills((prev) => prev.filter((x) => x.id !== s.id));
    toast.success(`已删除技能 ${s.name}`);
  };

  const handleAudit = (s: AdminSkill) => {
    setEdit(s);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Wrench className="h-6 w-6 text-primary" />
            技能管理
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            技能 CRUD · 执行模式 · 权限分配 · 审计日志
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => toast.info("已请求刷新技能列表")}
          >
            刷新
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.info("打开技能创建向导")}>
            <Wrench className="h-3.5 w-3.5" />
            新建技能
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <StatsOverview stats={ADMIN_SKILL_STATS} />

      {/* 筛选 */}
      <Card>
        <CardContent className="p-3">
          <SkillFilters
            value={filters}
            onChange={setFilters}
            total={skills.length}
            filtered={filtered.length}
          />
        </CardContent>
      </Card>

      {/* 表格 */}
      <SkillTable
        skills={filtered}
        onOpen={setEdit}
        onToggle={handleToggle}
        onEdit={setEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onPermission={setPerm}
        onAudit={handleAudit}
      />

      {/* 编辑 / 详情 */}
      <SkillEditDialog skill={edit} onOpenChange={(o) => !o && setEdit(null)} onSave={handleSave} />

      {/* 权限 */}
      <SkillPermissionDialog
        skill={perm}
        onOpenChange={(o) => !o && setPerm(null)}
        onSave={handleSave}
      />
    </div>
  );
}
