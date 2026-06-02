import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  type ServiceCategory,
  type ServiceItem,
} from "./services/mock-data";

const STATUS_BADGE = {
  available: { label: "可用", variant: "success" as const },
  beta: { label: "Beta", variant: "warning" as const },
  coming_soon: { label: "敬请期待", variant: "secondary" as const },
};

export default function ServicesPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("academic");

  const filterItems = (items: ServiceItem[]) =>
    items.filter(
      (i) =>
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.description.toLowerCase().includes(q.toLowerCase()),
    );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <span className="text-2xl">🛠</span>
            服务大厅
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            学业 · 心理 · 教务 · 生活 · 一站式服务导航
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索服务..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </header>

      <Tabs value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
        <TabsList>
          {SERVICE_CATEGORIES.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="gap-1.5">
              <span>{c.emoji}</span>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {SERVICE_CATEGORIES.map((cat) => {
          const items = filterItems(SERVICES[cat.id]);
          return (
            <TabsContent key={cat.id} value={cat.id} className="mt-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <span className={cn("rounded-md p-1.5", cat.bg, cat.color)}>{cat.emoji}</span>
                    {cat.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      · {cat.description}
                    </span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {items.length} 个服务
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const st = STATUS_BADGE[item.status];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            toast.info(`进入「${item.name}」服务`, {
                              description: item.description,
                            })
                          }
                          className="group flex flex-col items-start gap-2 rounded-lg border border-border bg-card/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                        >
                          <div className="flex w-full items-start justify-between">
                            <span className="text-3xl">{item.icon}</span>
                            <Badge variant={st.variant} className="text-[10px]">
                              {st.label}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">{item.name}</h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          {item.status !== "coming_soon" && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                              <span>使用 {item.usage.toLocaleString()} 次</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {items.length === 0 && (
                      <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                        暂无匹配的服务
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
