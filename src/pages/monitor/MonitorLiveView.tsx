/**
 * MonitorLiveView · /monitor 下的 "Grafana Live" 视图（L1 真 iframe 拼图）
 *
 * 借用 Grafana Cloud 公开 status / Play dashboard 验证 iframe 嵌入策略。
 * 真正的生产监控面会换成自部署的 Grafana 子域。
 */

import { SafeEmbed } from "@/components/common/SafeEmbed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type EmbedEntry, findEmbed } from "@/data/embeds";
import { Activity, Info, Rss } from "lucide-react";
import { useState } from "react";

const grafanaEmbeds = ["grafana-status", "grafana-demo", "github-status"] as const;

export function MonitorLiveView() {
  const [activeId, setActiveId] = useState<(typeof grafanaEmbeds)[number]>("grafana-status");
  const entry: EmbedEntry | undefined = findEmbed(activeId);

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[600px] flex-col gap-3">
      {/* 顶部说明 + 子切换 */}
      <Card className="border-border bg-card shadow-grafana">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-brand-500/10 p-2 text-brand-500">
              <Rss className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Grafana Live · L1 真 iframe 拼图</CardTitle>
              <CardDescription className="mt-1 text-xs">
                直接嵌入主流产品的公共 status / dashboard，验证 iframe 嵌入策略。
                生产环境会替换为自部署的 Grafana 子域（无 X-Frame-Options 限制）。
              </CardDescription>
            </div>
          </div>
          <Tabs value={activeId} onValueChange={(v) => setActiveId(v as typeof activeId)}>
            <TabsList className="h-8">
              {grafanaEmbeds.map((id) => {
                const e = findEmbed(id);
                if (!e) return null;
                return (
                  <TabsTrigger key={id} value={id} className="h-7 px-2.5 text-xs">
                    {e.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Activity className="h-3 w-3" />
              来源: <span className="font-mono text-foreground">{entry?.source}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Info className="h-3 w-3" />
              {entry?.note}
            </span>
            {entry?.refreshIntervalSec ? (
              <span className="inline-flex items-center gap-1 font-mono-tabular">
                ⟳ {entry.refreshIntervalSec}s 自动刷新
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* 嵌入区 */}
      <div className="flex-1">
        {entry ? (
          <SafeEmbed
            src={entry.src}
            title={entry.title}
            allowScripts={entry.allowScripts}
            allowSameOrigin={entry.allowSameOrigin}
            allowPopups={entry.allowPopups}
            refreshIntervalSec={entry.refreshIntervalSec}
            embedTheme={entry.embedTheme}
            className="h-full"
          />
        ) : null}
      </div>
    </div>
  );
}
