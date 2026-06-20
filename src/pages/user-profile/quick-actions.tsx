import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDownload, IconHistory, IconMessageCirclePlus, IconRotateCcw } from "@/components/icons"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QUICK_ACTIONS } from "./mock-data";

type Action = {
  key: keyof typeof QUICK_ACTIONS;
  label: string;
  icon: typeof IconMessageCirclePlus;
  variant: "default" | "outline" | "ghost" | "destructive";
  description: string;
};

const ACTIONS: Action[] = [
  {
    key: "sendMessage",
    label: "发送消息",
    icon: IconMessageCirclePlus,
    variant: "default",
    description: "开启与该用户的新会话",
  },
  {
    key: "viewConversations",
    label: "查看对话",
    icon: IconHistory,
    variant: "outline",
    description: "查看历史对话与消息",
  },
  {
    key: "exportProfile",
    label: "导出画像",
    icon: IconDownload,
    variant: "outline",
    description: "导出为 JSON 文件",
  },
  {
    key: "resetMemory",
    label: "重置记忆",
    icon: IconRotateCcw,
    variant: "ghost",
    description: "清空该用户全部记忆",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  const handle = (a: Action) => {
    if (a.key === "sendMessage") {
      toast.success(QUICK_ACTIONS.sendMessage);
      setTimeout(() => navigate("/chat"), 400);
      return;
    }
    if (a.key === "viewConversations") {
      toast.info(QUICK_ACTIONS.viewConversations);
      setTimeout(() => navigate("/chat"), 400);
      return;
    }
    if (a.key === "resetMemory") {
      toast.warning(QUICK_ACTIONS.resetMemory);
      return;
    }
    toast.success(QUICK_ACTIONS[a.key]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconRotateCcw className="h-4 w-4 text-primary" />
          快速操作
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {ACTIONS.map((a) => (
          <Button
            key={a.key}
            variant={a.variant}
            size="sm"
            className="h-9 w-full justify-between"
            onClick={() => handle(a)}
          >
            <span className="flex items-center gap-1.5">
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </span>
            <span className="text-[10px] font-normal text-muted-foreground">{a.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
