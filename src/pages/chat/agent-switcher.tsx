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
import { IconSparkles } from "@/components/icons"
import { IconCheck, IconChevronDown, IconCpu } from "@/components/icons"
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
      {/* Agent 路由切换 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={streaming}
            className="h-8 gap-2 border-border bg-card/50"
          >
            <span className="text-base">{agent.emoji}</span>
            <span className="font-medium">{agent.name}</span>
            <IconChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>领域助手</DropdownMenuLabel>
          {(Object.keys(AGENTS) as AgentDomain[]).map((d) => {
            const a = AGENTS[d];
            return (
              <DropdownMenuItem
                key={d}
                onClick={() => onChange(d)}
                className="flex items-start gap-2.5 py-2"
              >
                <span className="text-lg">{a.emoji}</span>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.name}</span>
                    {d === current && <IconCheck className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden h-5 w-px bg-border md:block" />

      {/* 模型切换 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={streaming}
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <IconCpu className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">{modelInfo.name}</span>
            <IconChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>切换模型</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MODELS.map((m) => (
            <DropdownMenuItem key={m.id} onClick={() => onModelChange(m.id)}>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.provider}</div>
                </div>
                {m.id === model && <IconCheck className="h-3.5 w-3.5 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-2 hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
        <IconSparkles className="h-3 w-3" />
        <span>由 {modelInfo.name} 驱动</span>
      </div>
    </div>
  );
}
