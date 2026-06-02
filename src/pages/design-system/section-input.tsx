import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// Input / Textarea / Select / Switch / Checkbox 展示
import { useState } from "react";
import { SectionFrame } from "./section-frame";

export function SectionInput() {
  return (
    <SectionFrame
      id="input"
      title="Input / Form"
      description="表单输入类组件 - 支持 controlled / uncontrolled、暗色聚焦环、禁用态"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Input</div>
            <div className="space-y-3">
              <DemoInput placeholder="默认态" />
              <DemoInput placeholder="聚焦态（点击）" />
              <DemoInput placeholder="禁用态" disabled />
              <DemoInput defaultValue="带默认值" />
              <DemoInput type="password" defaultValue="password123" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Textarea</div>
            <Textarea placeholder="多行文本输入..." rows={3} />
            <Textarea
              placeholder="带默认值的多行文本"
              defaultValue="AI Workbench 是一个融合了 7 大参考站机制的一站式 AI 协作工作台。"
              rows={3}
            />
            <Textarea placeholder="禁用态" rows={2} disabled />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Select</div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择一个 Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">📚 学业助手</SelectItem>
                <SelectItem value="emotional">💚 心理助手</SelectItem>
                <SelectItem value="affairs">📋 教务助手</SelectItem>
                <SelectItem value="general">✨ 通用助手</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 小时</SelectItem>
                <SelectItem value="24h">24 小时</SelectItem>
                <SelectItem value="7d">7 天</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Switch / Label</div>
            <div className="space-y-3">
              <DemoSwitchRow label="启用暗色模式" defaultChecked />
              <DemoSwitchRow label="通知提醒" defaultChecked />
              <DemoSwitchRow label="声音提示" />
              <div className="flex items-center gap-2 pt-2">
                <Label>邮箱地址</Label>
                <Badge variant="outline">已验证</Badge>
              </div>
              <Input defaultValue="user@example.com" />
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionFrame>
  );
}

function DemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} />;
}

function DemoSwitchRow({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}
