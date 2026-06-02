import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, Lightbulb, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NEW_INTENTS } from "./mock-data";

const categoryInfo = {
  academic: { name: "学业", color: "text-info", bg: "bg-info/15" },
  emotional: { name: "情感", color: "text-success", bg: "bg-success/15" },
  affairs: { name: "教务", color: "text-warning", bg: "bg-warning/15" },
  general: { name: "通用", color: "text-primary", bg: "bg-primary/15" },
};

export function NewIntents() {
  const items = NEW_INTENTS;
  const [decisions, setDecisions] = useState<Record<string, "accept" | "ignore">>({});

  const handleAccept = (id: string) => {
    setDecisions((prev) => ({ ...prev, [id]: "accept" }));
    const target = items.find((i) => i.id === id);
    toast.success(`已采纳意图：${target?.name ?? id}`, {
      description: "将在下次模型微调中加入训练集。",
    });
  };

  const handleIgnore = (id: string) => {
    setDecisions((prev) => ({ ...prev, [id]: "ignore" }));
    toast.info("已忽略");
  };

  const remaining = items.filter((i) => !decisions[i.id]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-warning" />
            新意图发现
          </CardTitle>
          <Badge variant="warning" className="text-[10px]">
            {remaining.length} / {items.length} 待审
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px] pr-2">
          <div className="flex flex-col gap-2">
            {items.map((intent) => {
              const decision = decisions[intent.id];
              const cat = categoryInfo[intent.category];
              return (
                <div
                  key={intent.id}
                  className={cn(
                    "rounded-lg border border-border p-3 transition-all",
                    decision === "accept" && "border-success/30 bg-success/5",
                    decision === "ignore" && "opacity-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-sm font-medium">{intent.name}</span>
                        <span
                          className={cn("rounded px-1.5 py-0.5 text-[10px]", cat.bg, cat.color)}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span>
                          出现 <span className="font-mono text-foreground">{intent.count}</span> 次
                        </span>
                        <span>
                          置信度{" "}
                          <span
                            className={cn(
                              "font-mono",
                              intent.confidence >= 0.8 ? "text-success" : "text-warning",
                            )}
                          >
                            {intent.confidence.toFixed(2)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {intent.examples.map((ex) => (
                          <span
                            key={ex}
                            className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            "{ex}"
                          </span>
                        ))}
                      </div>
                    </div>
                    {!decision && (
                      <div className="flex shrink-0 flex-col gap-1">
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-7 gap-1 text-success"
                          onClick={() => handleAccept(intent.id)}
                        >
                          <Check className="h-3 w-3" />
                          采纳
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 gap-1 text-muted-foreground"
                          onClick={() => handleIgnore(intent.id)}
                        >
                          <X className="h-3 w-3" />
                          忽略
                        </Button>
                      </div>
                    )}
                    {decision === "accept" && (
                      <Badge variant="success" className="shrink-0 text-[10px]">
                        <Check className="h-3 w-3" />
                        已采纳
                      </Badge>
                    )}
                    {decision === "ignore" && (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        已忽略
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
