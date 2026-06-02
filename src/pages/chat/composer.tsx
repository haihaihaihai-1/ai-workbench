import { Button } from "@/components/ui/button";
import type { AgentDomain } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { useState } from "react";
import { AGENTS, SUGGESTED_PROMPTS } from "./mock-data";

type Props = {
  onSend: (text: string) => void;
  streaming: boolean;
  onStop: () => void;
  agent: AgentDomain;
};

export function Composer({ onSend, streaming, onStop, agent }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const v = text.trim();
    if (!v || streaming) return;
    onSend(v);
    setText("");
  };

  return (
    <div className="border-t border-border bg-background/60 p-3 backdrop-blur">
      {/* 推荐问题（仅在空状态显示） */}
      {text.length === 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSend(p.text)}
              disabled={streaming}
              className={cn(
                "group flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:bg-accent",
                streaming && "pointer-events-none opacity-50",
              )}
            >
              <span>{p.icon}</span>
              <span className="text-muted-foreground group-hover:text-foreground">{p.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* 输入区 */}
      <div className="flex items-end gap-2 rounded-xl border border-input bg-card p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" aria-label="附件">
          <Paperclip className="h-4 w-4" />
        </Button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={`问 ${AGENTS[agent].name} 任何问题...  (Shift+Enter 换行)`}
          className="scrollbar-none max-h-32 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        {streaming ? (
          <Button size="icon" variant="destructive" className="h-8 w-8 shrink-0" onClick={onStop}>
            <Square className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            size="icon"
            disabled={!text.trim()}
            onClick={submit}
            className="h-8 w-8 shrink-0"
            aria-label="发送"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
        AI 生成内容仅供参考 · 涉及个人决策请核实 · 按 ⌘K 唤起命令面板
      </p>
    </div>
  );
}
