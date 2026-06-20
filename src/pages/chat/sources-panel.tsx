import { Badge } from "@/components/ui/badge";
import type { SourceRef } from "@/lib/types";
import { IconCheck, IconExternalLink } from "@/components/icons"

type Props = { sources: SourceRef[] };

export function SourcesPanel({ sources }: Props) {
  if (sources.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
        <div className="text-3xl">📚</div>
        <p className="text-sm">本次回答未引用外部资料</p>
        <p className="text-xs">所有内容均来自模型自身知识</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">引用来源</h3>
        <Badge variant="secondary" className="text-[10px]">
          {sources.length} 条
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        {sources.map((s, i) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-1.5 rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                {i + 1}
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium group-hover:text-primary">
                    {s.title}
                  </span>
                  <IconExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-0.5 truncate text-[10px] font-mono text-muted-foreground">
                  {s.domain}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{s.snippet}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-success">
              <IconCheck className="h-3 w-3" />
              引用可信
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
