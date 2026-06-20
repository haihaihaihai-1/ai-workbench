import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { IconMessageSquare, IconPlus, IconSearch } from "@/components/icons"
import { useState } from "react";
import { AGENTS } from "./mock-data";

type Props = {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  collapsed: boolean;
};

export function ConversationList({
  conversations,
  currentId,
  onSelect,
  onCreate,
  collapsed,
}: Props) {
  const [q, setQ] = useState("");
  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
  const grouped = {
    pinned: filtered.filter((c) => c.pinned),
    today: filtered.filter((c) => !c.pinned && Date.now() - c.updatedAt < 86_400_000),
    earlier: filtered.filter((c) => !c.pinned && Date.now() - c.updatedAt >= 86_400_000),
  };

  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center gap-2 border-r border-border py-3">
        <Button
          size="icon"
          variant="outline"
          className="h-9 w-9"
          onClick={onCreate}
          aria-label="新建对话"
        >
          <IconPlus className="h-4 w-4" />
        </Button>
        {conversations.slice(0, 8).map((c) => {
          const a = AGENTS[c.domain];
          const active = c.id === currentId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md text-base transition-colors",
                active ? "bg-primary/15" : "hover:bg-accent",
              )}
              title={c.title}
            >
              {a.emoji}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-border">
      <div className="flex items-center gap-2 p-3">
        <Button
          className="flex-1 justify-start gap-2"
          variant="default"
          size="sm"
          onClick={onCreate}
        >
          <IconPlus className="h-4 w-4" />
          新建对话
        </Button>
      </div>
      <div className="px-3 pb-2">
        <div className="relative">
          <IconSearch className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索对话..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-2">
          {grouped.pinned.length > 0 && (
            <Group title="置顶" items={grouped.pinned} currentId={currentId} onSelect={onSelect} />
          )}
          <Group title="今天" items={grouped.today} currentId={currentId} onSelect={onSelect} />
          {grouped.earlier.length > 0 && (
            <Group title="更早" items={grouped.earlier} currentId={currentId} onSelect={onSelect} />
          )}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-1 py-8 text-center text-xs text-muted-foreground">
              <IconMessageSquare className="h-6 w-6 opacity-50" />
              <span>暂无对话</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function Group({
  title,
  items,
  currentId,
  onSelect,
}: {
  title: string;
  items: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {items.map((c) => {
        const a = AGENTS[c.domain];
        const active = c.id === currentId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={cn(
              "group flex flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors",
              active ? "bg-primary/10" : "hover:bg-accent",
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{a.emoji}</span>
              <span className="flex-1 truncate text-xs font-medium">{c.title}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{relativeTime(c.updatedAt)}</span>
          </button>
        );
      })}
    </div>
  );
}
