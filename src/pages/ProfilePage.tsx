import {
  IconActivity,
  IconBell,
  IconBookMarked,
  IconBriefcase,
  IconCalendar,
  IconFileText,
  IconLink,
  IconMapPin,
  IconMessageSquare,
  IconPencil,
  IconShield,
  IconStar,
  IconUsers,
  IconX,
  IconSettings as SettingsIcon,
} from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, relativeTime } from "@/lib/utils";
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
import { toast } from "sonner";
import { AGENT_VISUAL } from "./home/mock-data";
import { ContributionGraph } from "./profile/contribution-graph";
import { type ProfileData, EditProfileDialog } from "./profile/edit-profile-dialog";
import { myFavorites, myFeedbacks, recentConversations } from "./profile/mock-data";

const DEFAULT_PROFILE: ProfileData = {
  name: "许泉兴",
  handle: "xuquanxing",
  bio: "计算机科学 · 大三 · 在用 AI 重塑学习与生活",
  org: "AI Workbench",
  location: "Shanghai, China",
  website: "xuquanxing.dev",
};

export default function ProfilePage() {
  const [feedbacks] = useState(myFeedbacks);
  const [favorites, setFavorites] = useState(myFavorites);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [following, setFollowing] = useState(false);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.success("已取消收藏");
  };

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        profile={profile}
        onEdit={() => setEditing(true)}
        following={following}
        onFollow={() => {
          setFollowing(!following);
          toast.success(following ? "已取消关注" : "已关注");
        }}
      />
      <StatsRow />

      {/* 贡献热力图 · GitHub 招牌 */}
      <Card>
        <CardContent className="p-4">
          <ContributionGraph />
        </CardContent>
      </Card>

      <Tabs defaultValue="conversations">
        <TabsList className="h-9 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="conversations"
            className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
          >
            <IconMessageSquare className="mr-1.5 h-3.5 w-3.5" />
            对话
          </TabsTrigger>
          <TabsTrigger
            value="feedbacks"
            className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
          >
            <IconStar className="mr-1.5 h-3.5 w-3.5" />
            反馈
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
          >
            <IconBookMarked className="mr-1.5 h-3.5 w-3.5" />
            收藏
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
          >
            <IconActivity className="mr-1.5 h-3.5 w-3.5" />
            统计
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground"
          >
            <SettingsIcon className="mr-1.5 h-3.5 w-3.5" />
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
            <CardContent className="p-3">
              {feedbacks.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <IconStar className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  暂无反馈记录
                  <p className="mt-1 text-xs">对话结束后即可对 AI 回复评分</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {feedbacks.map((fb) => {
                    const v = AGENT_VISUAL[fb.domain];
                    return (
                      <div
                        key={fb.id}
                        className="flex items-start gap-3 rounded-md border border-border bg-card/40 p-2.5"
                      >
                        <span className="mt-0.5 text-lg">{v.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{fb.conversationTitle}</span>
                            <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                              {v.name}
                            </Badge>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < fb.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                            {fb.comment}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {fb.tags.map((t) => (
                              <Badge key={t} variant="secondary" className="h-4 px-1.5 text-[9px]">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={fb.status === "processed" ? "success" : "warning"}
                            className="text-[9px]"
                          >
                            {fb.status === "processed" ? "已处理" : "待处理"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {relativeTime(fb.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-3">
              {favorites.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <IconBookMarked className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  暂无收藏内容
                  <p className="mt-1 text-xs">点击 AI 回复右上角的星标即可收藏</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {favorites.map((fav) => {
                    const v = AGENT_VISUAL[fav.domain];
                    return (
                      <div
                        key={fav.id}
                        className="flex items-start gap-3 rounded-md border border-border bg-card/40 p-2.5"
                      >
                        <span className="mt-0.5 text-lg">{v.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{fav.title}</span>
                            <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                              {v.name}
                            </Badge>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                            {fav.excerpt}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFavorite(fav.id)}
                          >
                            <IconX className="h-3 w-3" />
                          </Button>
                          <span className="text-[10px] text-muted-foreground">
                            {relativeTime(fav.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
            <SettingsCard title="通知偏好" icon={IconBell}>
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
            <SettingsCard title="账户与安全" icon={IconShield}>
              <SettingRow label="两步验证" />
              <SettingRow label="会话超时自动登出" defaultChecked />
              <SettingRow label="记住登录状态" defaultChecked />
            </SettingsCard>
            <SettingsCard title="数据与隐私" icon={IconFileText}>
              <SettingRow label="允许数据用于模型训练" />
              <SettingRow label="允许匿名使用统计" defaultChecked />
              <Button variant="outline" size="sm" className="mt-3 text-xs">
                导出我的全部数据
              </Button>
            </SettingsCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* 编辑资料弹窗 */}
      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        data={profile}
        onSave={setProfile}
      />
    </div>
  );
}

/**
 * ProfileHeader · GitHub 风格个人头部
 *
 * 招牌布局：
 * - 左侧：大圆形头像 + 名字（粗）+ handle（灰） + bio
 * - 中间：Follow/Edit 按钮
 * - meta 行：组织、位置、URL、加入时间
 * - 右侧：3-4 个紧凑统计（repos/stars/followers/following）
 */
function ProfileHeader({
  profile,
  onEdit,
  following,
  onFollow,
}: {
  profile: ProfileData;
  onEdit: () => void;
  following: boolean;
  onFollow: () => void;
}) {
  return (
    <Card className="overflow-hidden border-border">
      {/* 顶部 banner · GitHub 招牌：极简色块 */}
      <div className="h-24 bg-gradient-to-br from-[#5E6AD2] via-[#8463FF] to-[#FF6B9D]" />
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* 头像 + 名字区 */}
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-end">
            <Avatar className="h-24 w-24 shrink-0 ring-4 ring-card -mt-12">
              <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-3xl text-primary-foreground">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {profile.name}
                </h2>
                <span className="text-sm font-light text-muted-foreground">
                  {profile.handle}
                </span>
                <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                  PRO
                </Badge>
              </div>
              <p className="max-w-xl text-sm text-foreground/80">{profile.bio}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IconBriefcase className="h-3.5 w-3.5" />
                  {profile.org}
                </span>
                <span className="flex items-center gap-1">
                  <IconMapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
                <a href="#" className="flex items-center gap-1 hover:text-brand-500">
                  <IconLink className="h-3.5 w-3.5" />
                  {profile.website}
                </a>
                <span className="flex items-center gap-1">
                  <IconCalendar className="h-3.5 w-3.5" />
                  Joined Sep 2024
                </span>
              </div>
            </div>
          </div>

          {/* 按钮 + 统计 */}
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onEdit}>
                <IconPencil className="h-3.5 w-3.5" />
                Edit profile
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5"
                variant={following ? "secondary" : "default"}
                onClick={onFollow}
              >
                <IconUsers className="h-3.5 w-3.5" />
                {following ? "Following" : "Follow"}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <StatPill label="followers" value="128" />
              <span className="text-muted-foreground/30">·</span>
              <StatPill label="following" value="42" />
              <span className="text-muted-foreground/30">·</span>
              <StatPill label="stars" value="86" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <a href="#" className="flex items-center gap-1 hover:text-brand-500">
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </a>
  );
}

/**
 * StatsRow · GitHub 风格数据概览
 *
 * 紧凑 4 列 · 大数字 + 小标签 + 趋势指示
 */
function StatsRow() {
  const items = [
    { label: "总会话", value: "248", change: "+12 本周", tone: "text-foreground" },
    { label: "反馈评分", value: "86", change: "4.6 平均", tone: "text-foreground" },
    { label: "收藏", value: "32", change: "+3 本月", tone: "text-foreground" },
    { label: "使用天数", value: "92", change: "92 连续", tone: "text-foreground" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label} className="hover:border-foreground/20 transition-colors">
          <CardContent className="p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {it.label}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={cn("font-display text-2xl font-semibold tabular-nums", it.tone)}>
                {it.value}
              </span>
              <span className="text-[10px] text-muted-foreground">{it.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettingsCard({
  title,
  icon: Icon,
  children,
}: { title: string; icon: typeof IconBell; children: React.ReactNode }) {
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
