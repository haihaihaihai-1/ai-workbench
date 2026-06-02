import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  BookMarked,
  Edit3,
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AGENT_VISUAL } from "./home/mock-data";
import { recentConversations } from "./profile/mock-data";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader />
      <StatsRow />

      <Tabs defaultValue="conversations">
        <TabsList>
          <TabsTrigger value="conversations" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            我的对话
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="gap-1.5">
            <Star className="h-3.5 w-3.5" />
            我的反馈
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5">
            <BookMarked className="h-3.5 w-3.5" />
            收藏
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            使用统计
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <SettingsIcon className="h-3.5 w-3.5" />
            设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <Card>
            <CardContent className="p-3">
              <div className="space-y-1.5">
                {recentConversations.map((c) => {
                  const v = AGENT_VISUAL[c.domain];
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-card/40 p-2.5"
                    >
                      <span className="text-lg">{v.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{c.title}</span>
                          <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                            {v.name}
                          </Badge>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                          {c.preview}
                        </p>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{c.messageCount} 条</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedbacks">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              <Star className="mx-auto mb-2 h-8 w-8 opacity-30" />
              我的反馈记录
              <p className="mt-2 text-xs">这里将显示你对 AI 回复的所有评分与评论</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              <BookMarked className="mx-auto mb-2 h-8 w-8 opacity-30" />
              收藏的回复
              <p className="mt-2 text-xs">点击 AI 回复右上角的星标即可收藏</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <div className="grid gap-3 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">每日对话（最近 14 天）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="pdu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5E6AD2" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#5E6AD2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeDasharray="2 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="d"
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#5E6AD2"
                      strokeWidth={2}
                      fill="url(#pdu)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Agent 使用分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={agentUsage} layout="vertical">
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeDasharray="2 4"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" fill="#5E6AD2" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-3 lg:grid-cols-2">
            <SettingsCard title="通知偏好" icon={Bell}>
              <SettingRow label="新消息通知" defaultChecked />
              <SettingRow label="每日使用报告" defaultChecked />
              <SettingRow label="工单状态变更" />
              <SettingRow label="系统升级公告" defaultChecked />
            </SettingsCard>
            <SettingsCard title="外观" icon={SettingsIcon}>
              <SettingRow label="深色模式" defaultChecked />
              <SettingRow label="紧凑布局" />
              <SettingRow label="动画效果" defaultChecked />
            </SettingsCard>
            <SettingsCard title="账户与安全" icon={Shield}>
              <SettingRow label="两步验证" />
              <SettingRow label="会话超时自动登出" defaultChecked />
              <SettingRow label="记住登录状态" defaultChecked />
            </SettingsCard>
            <SettingsCard title="数据与隐私" icon={FileText}>
              <SettingRow label="允许数据用于模型训练" />
              <SettingRow label="允许匿名使用统计" defaultChecked />
              <Button variant="outline" size="sm" className="mt-3 text-xs">
                导出我的全部数据
              </Button>
            </SettingsCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileHeader() {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-lg text-primary-foreground">
              许
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">许泉兴</h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="default">学生</Badge>
              <span>·</span>
              <span>计算机科学 · 大三</span>
              <span>·</span>
              <span>学号 2022****1234</span>
            </div>
            <div className="mt-1.5 text-[10px] text-muted-foreground">
              加入于 2024-09-01 · 已使用 92 天
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Edit3 className="h-3.5 w-3.5" />
          编辑资料
        </Button>
      </CardContent>
    </Card>
  );
}

function StatsRow() {
  const items = [
    { label: "总会话", value: 248, icon: MessageSquare, tone: "text-primary" },
    { label: "总反馈", value: 86, icon: Star, tone: "text-warning" },
    { label: "收藏数", value: 32, icon: BookMarked, tone: "text-success" },
    { label: "使用天数", value: 92, icon: TrendingUp, tone: "text-info" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className={cn("rounded-md bg-muted p-2", it.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{it.label}</div>
                <div className="text-lg font-semibold tabular-nums">{it.value}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SettingsCard({
  title,
  icon: Icon,
  children,
}: { title: string; icon: typeof Bell; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        <Separator />
      </CardContent>
    </Card>
  );
}

function SettingRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

const dailyData = [
  { d: "5/19", v: 12 },
  { d: "5/20", v: 18 },
  { d: "5/21", v: 9 },
  { d: "5/22", v: 22 },
  { d: "5/23", v: 28 },
  { d: "5/24", v: 16 },
  { d: "5/25", v: 11 },
  { d: "5/26", v: 24 },
  { d: "5/27", v: 32 },
  { d: "5/28", v: 19 },
  { d: "5/29", v: 26 },
  { d: "5/30", v: 35 },
  { d: "5/31", v: 28 },
  { d: "6/1", v: 24 },
];

const agentUsage = [
  { name: "学业助手", value: 86 },
  { name: "心理助手", value: 42 },
  { name: "教务助手", value: 58 },
  { name: "通用助手", value: 62 },
];
