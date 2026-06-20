import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowRight, IconCode2, IconSparkles, IconZap } from "@/components/icons"
import { toast } from "sonner";

export function CustomSkillCta() {
  return (
    <Card className="border-dashed bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2.5 text-primary">
            <IconSparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              自定义 AI 技能
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Beta
              </span>
            </h3>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
              使用 JavaScript / Python 编写你自己的技能，处理内部数据、调用第三方
              API、自动化任何流程。
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconCode2 className="h-3 w-3" /> 沙箱执行
              </span>
              <span className="flex items-center gap-1">
                <IconZap className="h-3 w-3" /> 热加载
              </span>
              <span>·</span>
              <span>支持 OPENAPI / MCP 协议接入</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => toast.info("查看技能开发文档")}
          >
            查看文档
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => toast.info("打开技能开发向导")}
          >
            立即创建
            <IconArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
