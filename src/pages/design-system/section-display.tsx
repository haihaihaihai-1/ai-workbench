import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Badge / Card / Avatar / Tooltip / Progress / Separator 展示
import { Activity, Mail } from "lucide-react";
import { SectionFrame } from "./section-frame";

export function SectionDisplay() {
  return (
    <TooltipProvider delayDuration={150}>
      <SectionFrame
        id="display"
        title="Display"
        description="展示类组件 - 信息密度高，视觉层次清晰"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="text-sm font-medium">Badge (7 变体)</div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <Separator />
              <div className="text-sm font-medium">Avatar</div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    许
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground text-sm">
                    AI
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-muted text-2xl">👤</AvatarFallback>
                </Avatar>
              </div>
              <Separator />
              <div className="text-sm font-medium">Progress</div>
              <div className="space-y-2">
                <Progress value={33} />
                <Progress value={66} />
                <Progress value={92} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="text-sm font-medium">Card (5 变体)</div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">会话质量</CardTitle>
                  <CardDescription>近 7 天平均</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-semibold tabular-nums">4.6</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>
                </CardContent>
              </Card>
              <Separator />
              <div className="text-sm font-medium">Tooltip (hover 触发)</div>
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="info" className="cursor-help">
                      <Mail className="mr-1 h-3 w-3" />
                      hover 我
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>这是 Tooltip 的演示</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-sm text-primary hover:underline">
                      悬浮提示
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>支持 Radix Tooltip - 自动定位 / ARIA</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionFrame>
    </TooltipProvider>
  );
}
