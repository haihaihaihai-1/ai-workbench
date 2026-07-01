import {
  IconArrowUpRight,
  IconCheckCircle,
  IconClock,
  IconGitBranch,
  IconLightning,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ServiceItem } from "./mock-data";
import { toast } from "sonner";

const STATUS_LABEL = {
  available: "可用",
  beta: "Beta",
  coming_soon: "敬请期待",
} as const;

export function ServiceDetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: ServiceItem | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!item) return null;

  const isAvailable = item.status === "available";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xl">
              {item.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                {item.name}
                <Badge
                  variant={
                    item.status === "available"
                      ? "success"
                      : item.status === "beta"
                        ? "warning"
                        : "secondary"
                  }
                  className="text-[10px]"
                >
                  {STATUS_LABEL[item.status]}
                </Badge>
              </div>
              <DialogDescription className="mt-0.5">
                {item.description}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 服务信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                调用次数
              </div>
              <div className="mt-1 font-mono text-lg font-semibold">
                {item.usage.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">total calls</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                部署分支
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-semibold">
                <IconGitBranch className="h-3.5 w-3.5" />
                main
              </div>
              <div className="text-[10px] text-muted-foreground">auto-deploy enabled</div>
            </div>
          </div>

          {/* 域名 */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                访问域名
              </div>
              <div className="mt-1 flex items-center gap-1 font-mono text-sm">
                <span className="opacity-50">svc/{item.id}.vercel.app</span>
                <IconArrowUpRight className="h-3 w-3 opacity-50" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => {
                navigator.clipboard
                  ?.writeText(`https://svc/${item.id}.vercel.app`)
                  .then(() => toast.success("域名已复制"))
                  .catch(() => toast.error("复制失败"));
              }}
            >
              复制
            </Button>
          </div>

          <Separator />

          {/* 最近调用日志 */}
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              最近调用
            </div>
            <div className="space-y-1.5">
              {[
                { time: "2 分钟前", status: "success", latency: "120ms" },
                { time: "5 分钟前", status: "success", latency: "98ms" },
                { time: "12 分钟前", status: "success", latency: "156ms" },
                { time: "1 小时前", status: "success", latency: "210ms" },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 text-xs"
                >
                  <IconCheckCircle className="h-3.5 w-3.5 text-success" />
                  <span className="flex-1 text-muted-foreground">{log.time}</span>
                  <span className="font-mono text-muted-foreground">{log.latency}</span>
                  <IconClock className="h-3 w-3 text-muted-foreground/50" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button
            disabled={!isAvailable}
            onClick={() => {
              toast.success(`已进入「${item.name}」服务`);
              onOpenChange(false);
            }}
          >
            <IconLightning className="mr-1.5 h-3.5 w-3.5" weight="fill" />
            {isAvailable ? "进入服务" : "暂不可用"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
