import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSparkles } from "@/components/icons"
import { PROFILE_SUMMARY } from "./mock-data";

export function ProfileSummary() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <IconSparkles className="h-4 w-4 text-primary" />
            AI 画像摘要
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">
            基于 124 条记忆 · 187 次会话生成
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {PROFILE_SUMMARY.map((p, i) => (
          <div key={i} className="flex gap-3 rounded-md border border-border/50 bg-muted/20 p-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-[10px] font-semibold text-primary">
              {i + 1}
            </span>
            <p className="text-xs leading-relaxed text-foreground/90">{p}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
