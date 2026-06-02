import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Toast (Sonner) 展示
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SectionFrame } from "./section-frame";

export function SectionFeedback() {
  return (
    <SectionFrame
      id="feedback"
      title="Feedback / Toast"
      description="即时反馈 - Sonner Toast 4 种类型 + 动作 + 描述"
    >
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="text-sm font-medium">Toast (Sonner)</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={() => toast.success("保存成功", { description: "设置已应用到所有页面" })}
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("提示信息", { description: "新版本已发布，刷新查看" })}
            >
              <Info className="mr-1 h-3.5 w-3.5" />
              Info
            </Button>
            <Button
              variant="outline"
              className="text-warning"
              onClick={() => toast.warning("警告", { description: "API Key 即将过期" })}
            >
              <AlertTriangle className="mr-1 h-3.5 w-3.5" />
              Warning
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast.error("出错了", { description: "请稍后重试或联系管理员" })}
            >
              <XCircle className="mr-1 h-3.5 w-3.5" />
              Error
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast("发现新版本", {
                  description: "点击刷新以应用更新",
                  action: {
                    label: "刷新",
                    onClick: () => toast.success("已刷新"),
                  },
                })
              }
            >
              带动作的 Toast
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.promise(new Promise((r) => setTimeout(r, 2000)), {
                  loading: "加载中...",
                  success: "完成",
                  error: "失败",
                });
              }}
            >
              Promise Toast
            </Button>
          </div>
        </CardContent>
      </Card>
    </SectionFrame>
  );
}
