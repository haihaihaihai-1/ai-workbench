import {
  IconArrowRight,
  IconDownload,
  IconHistory,
  IconMessageCirclePlus,
  IconRotateCcw,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportToJSON } from "@/lib/export";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MOCK_USER, QUICK_ACTIONS } from "./mock-data";

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
  const [confirmReset, setConfirmReset] = useState(false);

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
    if (a.key === "exportProfile") {
      exportToJSON([MOCK_USER], `user-profile-${MOCK_USER.id}.json`);
      toast.success("画像已导出为 JSON 文件");
      return;
    }
    if (a.key === "resetMemory") {
      setConfirmReset(true);
      return;
    }
  };

  const handleConfirmReset = () => {
    setConfirmReset(false);
    toast.success("已清空该用户的全部记忆数据");
  };

  return (
    <>
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

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认重置记忆</DialogTitle>
            <DialogDescription>
              此操作将清空用户 {MOCK_USER.name}（{MOCK_USER.id}）的全部记忆数据，包括事实、偏好、事件和技能记录。此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmReset}>
              <IconArrowRight className="mr-1 h-3.5 w-3.5" />
              确认重置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
