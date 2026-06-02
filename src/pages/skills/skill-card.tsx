import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn, shortNumber } from "@/lib/utils";
import { Download, Star } from "lucide-react";
import { CATEGORY_INFO, EXECUTION_MODE_INFO, type Skill } from "./mock-data";

type Props = {
  skill: Skill;
  onOpen: (s: Skill) => void;
  onToggle: (s: Skill, enabled: boolean) => void;
  onInstall: (s: Skill) => void;
};

export function SkillCard({ skill, onOpen, onToggle, onInstall }: Props) {
  const cat = CATEGORY_INFO[skill.category];
  const mode = EXECUTION_MODE_INFO[skill.executionMode];
  return (
    <Card
      className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-md"
      onClick={() => onOpen(skill)}
    >
      <CardContent className="flex flex-col gap-2.5 p-3.5">
        {/* 顶部：图标 + 名称 + 状态 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn("flex h-9 w-9 items-center justify-center rounded-md text-xl", cat.bg)}
            >
              {skill.icon}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold leading-tight">{skill.name}</div>
              <div className="text-[10px] text-muted-foreground">
                v{skill.version} · {skill.author}
              </div>
            </div>
          </div>
          <Switch
            checked={skill.enabled}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onCheckedChange={() => onToggle(skill, !skill.enabled)}
            aria-label="启用技能"
          />
        </div>

        {/* 描述 */}
        <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground">
          {skill.description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1">
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", cat.bg, cat.color)}>
            {cat.emoji} {cat.name}
          </span>
          <Badge variant="outline" className="text-[10px]">
            {mode.name}
          </Badge>
          {skill.tags.slice(0, 2).map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">
              {t}
            </Badge>
          ))}
        </div>

        {/* 底部：调用次数 + 评分 + 操作 */}
        <div className="flex items-center justify-between border-t border-border pt-2 text-[10px]">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <span className="font-mono tabular-nums">{shortNumber(skill.calls)} 次调用</span>
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="font-mono">{skill.rating.toFixed(1)}</span>
            </span>
            <span className="font-mono text-success">{skill.successRate.toFixed(1)}%</span>
          </div>
          {skill.installed ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(skill, !skill.enabled);
              }}
              className={cn(
                "h-6 px-2 text-[10px]",
                skill.enabled ? "text-success" : "text-muted-foreground",
              )}
            >
              {skill.enabled ? "已启用" : "已停用"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onInstall(skill);
              }}
              className="h-6 gap-1 px-2 text-[10px]"
            >
              <Download className="h-3 w-3" />
              安装
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
