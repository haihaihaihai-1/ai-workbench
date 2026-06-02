import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exportToJSON } from "@/lib/export";
import { Brain, Sparkles } from "lucide-react";
import { MEMORY_TYPE_INFO } from "./mock-data";

// 静态画像数据 - 导出用
const PROFILE = {
  name: "许泉兴",
  department: "CS",
  grade: "大三",
  gpa: 3.7,
  interests: ["AI/ML", "Python", "PyTorch", "算法", "升学", "结构化笔记", "夜猫子"],
  summary:
    "计算机科学专业大三学生，对 AI/ML 方向感兴趣。偏好结构化笔记和 Python。近期面临升学决策，承受一定压力。晚上活跃度高。",
  memoryDistribution: { fact: 42, preference: 31, event: 28, skill: 23 },
};

export function ProfilePanel() {
  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          用户画像
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground text-sm">
              许
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">许泉兴</div>
            <div className="text-xs text-muted-foreground">CS · 大三 · GPA 3.7</div>
            <div className="text-[10px] text-muted-foreground">最近活跃 2 小时前</div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">画像摘要</div>
          <p className="rounded-md border border-border bg-muted/30 p-2.5 text-xs leading-relaxed">
            计算机科学专业大三学生，对 AI/ML 方向感兴趣。偏好结构化笔记和 Python。
            近期面临升学决策，承受一定压力。晚上活跃度高。
          </p>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">兴趣标签</div>
          <div className="flex flex-wrap gap-1">
            {["AI/ML", "Python", "PyTorch", "算法", "升学", "结构化笔记", "夜猫子"].map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">记忆分布</div>
          <div className="space-y-2">
            {(Object.keys(MEMORY_TYPE_INFO) as (keyof typeof MEMORY_TYPE_INFO)[]).map((k) => {
              const t = MEMORY_TYPE_INFO[k];
              const count = { fact: 42, preference: 31, event: 28, skill: 23 }[k];
              return (
                <div key={k} className="flex items-center gap-2 text-xs">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${t.bgColor} ${t.color}`}
                  >
                    {t.emoji} {t.name}
                  </span>
                  <Progress value={(count / 124) * 100} className="h-1 flex-1" />
                  <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={() =>
            exportToJSON(
              [{ ...PROFILE, exportedAt: new Date().toISOString() }],
              "user-profile.json",
            )
          }
        >
          <Brain className="h-3.5 w-3.5" />
          导出画像（JSON）
        </Button>
      </CardContent>
    </Card>
  );
}
