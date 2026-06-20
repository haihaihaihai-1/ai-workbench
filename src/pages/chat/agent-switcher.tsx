/**
 * AgentSwitcher · ChatGPT 风格顶部选择器
 *
 * ChatGPT 借皮要点：
 * - 极简：单行 · 圆形头像 + 名字 + 简短说明
 * - 模型选择：下拉，无背景按钮（hover 显）
 * - 当前模型用 Chip 显示在右侧
 * - 不显示「由 XX 驱动」这种冗余字
 */

import { IconCheck, IconChevronDown, IconCpu, IconSparkles } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AgentDomain } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AGENTS, MODELS, type ModelId } from "./mock-data";

type Props = {
  current: AgentDomain;
  onChange: (a: AgentDomain) => void;
  model: ModelId;
  onModelChange: (m: ModelId) => void;
  streaming: boolean;
};

export function AgentSwitcher({ current, onChange, model, onModelChange, streaming }: Props) {
  const agent = AGENTS[current];
  const modelInfo = MODELS.find((m) => m.id === model) ?? MODELS[0];

  return (
    <div className="flex items-center gap-2">
      {/* Agent 切换（ChatGPT 风格：圆形头像 + 名字 + 简短说明） */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={streaming}
            className="h-8 gap-1.5 rounded-full px-2 text-foreground hover:bg-muted"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-[#8B5CF6] text-xs"
              aria-hidden
            >
              {agent.emoji}
            </span>
            <span className="text-sm font-medium">{agent.name}</span>
            <IconChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel className="text-xs text-muted-foreground">领域助手</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.keys(AGENTS) as AgentDomain[]).map((d) => {
            const a = AGENTS[d];
            return (
              <DropdownMenuItem
                key={d}
                onClick={() => onChange(d)}
                className="flex items-start gap-3 py-2.5"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/20 to-[#8B5CF6]/20 text-base"
                  aria-hidden
                >
                  {a.emoji}
                </span>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{a.name}</span>
                    {d === current ? <IconCheck className="h-3.5 w-3.5 text-brand-500" /> : null}
                  </div>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 模型切换 · ChatGPT 风格：纯文字按钮 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={streaming}
            className="h-8 gap-1.5 px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconCpu className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">{modelInfo.name}</span>
            <IconChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="text-xs text-muted-foreground">选择模型</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MODELS.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => onModelChange(m.id)}
              className="flex items-start gap-3 py-2.5"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  m.id === model
                    ? "bg-brand-500/15 text-brand-600"
                    : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                <IconSparkles className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.name}</span>
                  {m.id === model ? <IconCheck className="h-3.5 w-3.5 text-brand-500" /> : null}
                </div>
                <span className="text-xs text-muted-foreground">
                  {m.provider} · {m.context}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
