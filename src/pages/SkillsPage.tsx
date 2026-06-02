import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CustomSkillCta } from "./skills/custom-skill-cta";
import { MOCK_SKILLS, SKILL_STATS, type Skill } from "./skills/mock-data";
import { SkillCard } from "./skills/skill-card";
import { SkillDetailDialog } from "./skills/skill-detail-dialog";
import { type SkillFilterState, SkillFilters } from "./skills/skill-filters";
import { StatsOverview } from "./skills/stats-overview";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [filters, setFilters] = useState<SkillFilterState>({
    q: "",
    category: "all",
    sort: "popular",
  });
  const [open, setOpen] = useState<Skill | null>(null);

  const filtered = useMemo(() => {
    let list = skills.filter((s) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !s.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.category !== "all" && s.category !== filters.category) return false;
      return true;
    });
    if (filters.sort === "popular") list = list.sort((a, b) => b.calls - a.calls);
    else if (filters.sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === "newest") list = list.sort((a, b) => b.createdAt - a.createdAt);
    else if (filters.sort === "name") list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [skills, filters]);

  const handleToggle = (s: Skill, enabled: boolean) => {
    setSkills((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled } : x)));
    toast.success(enabled ? `${s.name} 已启用` : `${s.name} 已停用`);
  };

  const handleInstall = (s: Skill) => {
    setSkills((prev) =>
      prev.map((x) => (x.id === s.id ? { ...x, installed: true, enabled: true } : x)),
    );
    toast.success(`${s.name} 安装成功`, { description: "已自动启用，可在对话中使用" });
    setOpen(null);
  };

  const handleUninstall = (s: Skill) => {
    setSkills((prev) =>
      prev.map((x) => (x.id === s.id ? { ...x, installed: false, enabled: false } : x)),
    );
    toast.success(`${s.name} 已卸载`);
    setOpen(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" />
            技能市场
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI 技能浏览 · 安装 · 自定义 · 调用统计
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
          <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.info("打开技能开发向导")}>
            <Sparkles className="h-3.5 w-3.5" />
            提交技能
          </Button>
        </div>
      </header>

      {/* 统计 */}
      <StatsOverview stats={SKILL_STATS} />

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

      {/* 技能网格 */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            暂无符合条件的技能
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <SkillCard
              key={s.id}
              skill={s}
              onOpen={setOpen}
              onToggle={handleToggle}
              onInstall={handleInstall}
            />
          ))}
        </div>
      )}

      {/* 自定义 CTA */}
      <CustomSkillCta />

      {/* 详情弹窗 */}
      <SkillDetailDialog
        skill={open}
        onOpenChange={(o) => !o && setOpen(null)}
        onToggle={handleToggle}
        onInstall={handleInstall}
        onUninstall={handleUninstall}
      />
    </div>
  );
}
