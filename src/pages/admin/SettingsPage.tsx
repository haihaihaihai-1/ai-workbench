import {
  IconBell,
  IconBot,
  IconCheckCircle2,
  IconEye,
  IconEyeOff,
  IconInfo,
  IconPalette,
  IconSave,
  IconServer,
  IconShield,
  IconSparkles,
  IconTestTube,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type Panel = "ai" | "notification" | "services" | "security" | "appearance" | "about";

const NAV: { id: Panel; name: string; icon: typeof IconBot; description: string }[] = [
  { id: "ai", name: "AI 模型", icon: IconBot, description: "默认模型 / 路由策略 / 参数" },
  { id: "notification", name: "通知配置", icon: IconBell, description: "企业微信 / 告警" },
  { id: "services", name: "服务状态", icon: IconServer, description: "Supabase / Redis / LLM" },
  { id: "security", name: "安全策略", icon: IconShield, description: "PII / 提示注入 / 内容审核" },
  { id: "appearance", name: "外观", icon: IconPalette, description: "主题 / 主色 / 紧凑模式" },
  { id: "about", name: "关于", icon: IconInfo, description: "版本 / 技术栈 / 更新日志" },
];

export default function SettingsPage() {
  const [panel, setPanel] = useState<Panel>("ai");
  const [dirty, setDirty] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部 · Vercel Settings 招牌：黑色高对比 logo */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background shadow-vercel">
            <IconSparkles className="h-4 w-4" weight="bold" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">Settings</h1>
            <p className="text-[11px] text-muted-foreground">
              AI 模型 · 通知 · 服务状态 · 安全策略 · 外观
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <Badge variant="warning" className="text-[10px]">
              有未保存的修改
            </Badge>
          )}
          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => {
              setDirty(false);
              toast.success("设置已保存");
            }}
          >
            <IconSave className="h-3.5 w-3.5" />
            保存
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* 左侧导航 */}
        <Card>
          <CardContent className="p-2">
            <nav className="flex flex-col gap-0.5">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = panel === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setPanel(n.id)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium">{n.name}</div>
                      <div className="text-[10px] text-muted-foreground">{n.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* 右侧面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{NAV.find((n) => n.id === panel)?.name}</CardTitle>
            <CardDescription>{NAV.find((n) => n.id === panel)?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-22rem)] pr-2">
              {panel === "ai" && <AiPanel onChange={() => setDirty(true)} />}
              {panel === "notification" && <NotificationPanel onChange={() => setDirty(true)} />}
              {panel === "services" && <ServicesPanel />}
              {panel === "security" && <SecurityPanel onChange={() => setDirty(true)} />}
              {panel === "appearance" && <AppearancePanel onChange={() => setDirty(true)} />}
              {panel === "about" && <AboutPanel />}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AiPanel({ onChange }: { onChange: () => void }) {
  const [showKey, setShowKey] = useState(false);
  const [temp, setTemp] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [freq, setFreq] = useState(0);
  return (
    <div className="space-y-6">
      <Section title="默认模型">
        <Row label="默认模型">
          <Select defaultValue="claude-sonnet-4.5" onValueChange={onChange}>
            <SelectTrigger className="h-9 w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-sonnet-4.5">Claude Sonnet 4.5（推荐）</SelectItem>
              <SelectItem value="gpt-5">GPT-5</SelectItem>
              <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
              <SelectItem value="minimax-m3">MiniMax M3</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label="路由策略">
          <Select defaultValue="quality" onValueChange={onChange}>
            <SelectTrigger className="h-9 w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">成本优先</SelectItem>
              <SelectItem value="quality">质量优先</SelectItem>
              <SelectItem value="performance">性能优先</SelectItem>
              <SelectItem value="balanced">均衡</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label="API Key">
          <div className="flex w-64 gap-1.5">
            <Input
              type={showKey ? "text" : "password"}
              defaultValue="sk-ant-••••••••••••••"
              className="h-9 font-mono text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <IconEyeOff className="h-3.5 w-3.5" />
              ) : (
                <IconEye className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </Row>
      </Section>

      <Separator />

      <Section title="生成参数">
        <SliderRow
          label="Temperature"
          value={temp}
          min={0}
          max={2}
          step={0.1}
          onChange={(v) => {
            setTemp(v);
            onChange();
          }}
          hint="越高越发散"
        />
        <SliderRow
          label="Top P"
          value={topP}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => {
            setTopP(v);
            onChange();
          }}
          hint="核采样"
        />
        <SliderRow
          label="Frequency Penalty"
          value={freq}
          min={-2}
          max={2}
          step={0.1}
          onChange={(v) => {
            setFreq(v);
            onChange();
          }}
          hint="减少重复"
        />
        <Row label="Max Tokens">
          <Input type="number" defaultValue={4096} className="h-9 w-32" onChange={onChange} />
        </Row>
      </Section>

      <Separator />

      <Section title="模型启用">
        {[
          { name: "Claude Sonnet 4.5", on: true, hint: "主力模型" },
          { name: "GPT-5", on: true, hint: "备选" },
          { name: "Gemini 2.5 Pro", on: false, hint: "测试中" },
          { name: "MiniMax M3", on: true, hint: "低成本" },
        ].map((m) => (
          <Row key={m.name} label={m.name} hint={m.hint}>
            <Switch defaultChecked={m.on} onCheckedChange={onChange} />
          </Row>
        ))}
      </Section>
    </div>
  );
}

function NotificationPanel({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <Section title="通知渠道">
        <Row label="企业微信 Webhook" hint="接收告警的群机器人">
          <div className="flex w-96 gap-1.5">
            <Input
              placeholder="https://qyapi.weixin.qq.com/..."
              className="h-9 font-mono text-xs"
              onChange={onChange}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => toast.success("测试消息已发送")}
            >
              <IconTestTube className="h-3.5 w-3.5" />
              测试
            </Button>
          </div>
        </Row>
      </Section>
      <Separator />
      <Section title="通知类型">
        {[
          { name: "安全告警", desc: "Critical / High 严重级别时立即推送", on: true },
          { name: "每日报告", desc: "每天早 9 点推送昨日汇总", on: true },
          { name: "异常告警", desc: "错误率 > 阈值时", on: true },
          { name: "工单升级", desc: "L2+ 工单分配时", on: false },
          { name: "危机干预", desc: "检测到危机关键词时", on: true },
          { name: "系统升级公告", desc: "新版本发布时", on: true },
        ].map((n) => (
          <Row key={n.name} label={n.name} hint={n.desc}>
            <Switch defaultChecked={n.on} onCheckedChange={onChange} />
          </Row>
        ))}
      </Section>
    </div>
  );
}

function ServicesPanel() {
  const services = [
    { name: "Supabase", status: "healthy", latency: 24, last: "刚刚" },
    { name: "Redis", status: "healthy", latency: 3, last: "刚刚" },
    { name: "Claude API", status: "healthy", latency: 480, last: "刚刚" },
    { name: "OpenAI API", status: "degraded", latency: 1240, last: "2 分钟前" },
    { name: "Langfuse", status: "healthy", latency: 156, last: "刚刚" },
    { name: "邮件服务", status: "down", latency: -1, last: "12 分钟前" },
  ];
  return (
    <div className="space-y-6">
      <Section title="健康度总览">
        <div className="flex items-center gap-3 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span>部分服务异常：邮件服务离线、OpenAI 响应慢</span>
        </div>
      </Section>
      <Separator />
      <Section title="服务列表">
        <div className="space-y-2">
          {services.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  s.status === "healthy" && "bg-success",
                  s.status === "degraded" && "bg-warning",
                  s.status === "down" && "bg-destructive",
                )}
              />
              <span className="w-32 text-sm font-medium">{s.name}</span>
              <Badge
                variant={
                  s.status === "healthy"
                    ? "success"
                    : s.status === "degraded"
                      ? "warning"
                      : "destructive"
                }
                className="text-[10px]"
              >
                {s.status === "healthy" ? "正常" : s.status === "degraded" ? "降级" : "离线"}
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                延迟 {s.latency > 0 ? `${s.latency}ms` : "—"} · {s.last}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => toast.info(`重试连接 ${s.name}`)}
              >
                重试
              </Button>
            </div>
          ))}
        </div>
      </Section>
      <Separator />
      <Section title="SLO 阈值">
        <SliderRow
          label="错误率阈值"
          value={1.0}
          min={0.1}
          max={5}
          step={0.1}
          onChange={() => {}}
          suffix="%"
          hint="超过触发告警"
        />
        <SliderRow
          label="P99 延迟阈值"
          value={2000}
          min={500}
          max={10000}
          step={100}
          onChange={() => {}}
          suffix="ms"
          hint="超过触发告警"
        />
        <SliderRow
          label="可用性阈值"
          value={99.5}
          min={95}
          max={99.99}
          step={0.1}
          onChange={() => {}}
          suffix="%"
          hint="月可用性"
        />
      </Section>
    </div>
  );
}

function SecurityPanel({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <Section title="PII 检测">
        <Row label="启用 PII 检测" hint="自动识别并脱敏个人信息">
          <Switch defaultChecked onCheckedChange={onChange} />
        </Row>
        <Row label="严格度">
          <Select defaultValue="standard" onValueChange={onChange}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loose">宽松</SelectItem>
              <SelectItem value="standard">标准</SelectItem>
              <SelectItem value="strict">严格</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>
      <Separator />
      <Section title="提示注入防护">
        <Row label="启用注入检测">
          <Switch defaultChecked onCheckedChange={onChange} />
        </Row>
        <Row label="检测模式">
          <Select defaultValue="hybrid" onValueChange={onChange}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rule">规则匹配</SelectItem>
              <SelectItem value="ml">ML 模型</SelectItem>
              <SelectItem value="hybrid">混合（推荐）</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>
      <Separator />
      <Section title="内容审核">
        <Row label="启用内容审核">
          <Switch defaultChecked onCheckedChange={onChange} />
        </Row>
        <Row label="数据保留天数">
          <Input type="number" defaultValue={90} className="h-9 w-32" onChange={onChange} />
        </Row>
      </Section>
    </div>
  );
}

function AppearancePanel({ onChange }: { onChange: () => void }) {
  const [theme, setTheme] = useState("dark");
  const colors = [
    { id: "purple", name: "线性紫", color: "#5E6AD2" },
    { id: "blue", name: "电光蓝", color: "#3B82F6" },
    { id: "green", name: "薄荷绿", color: "#10B981" },
    { id: "orange", name: "暖橙", color: "#F59E0B" },
  ];
  return (
    <div className="space-y-6">
      <Section title="主题">
        <Row label="主题模式">
          <div className="flex gap-1.5">
            {["dark", "light", "system"].map((t) => (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => {
                  setTheme(t);
                  onChange();
                }}
              >
                {t === "dark" ? "暗色" : t === "light" ? "亮色" : "跟随系统"}
              </Button>
            ))}
          </div>
        </Row>
        <Row label="主色" hint="重新加载后生效">
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={onChange}
                className="group flex items-center gap-1.5 rounded-md border border-border p-1.5 transition-colors hover:border-primary/50"
                title={c.name}
              >
                <span className="h-5 w-5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs">{c.name}</span>
              </button>
            ))}
          </div>
        </Row>
        <Row label="字体大小">
          <Select defaultValue="standard" onValueChange={onChange}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">小</SelectItem>
              <SelectItem value="standard">标准</SelectItem>
              <SelectItem value="large">大</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label="紧凑模式" hint="更高信息密度">
          <Switch onCheckedChange={onChange} />
        </Row>
        <Row label="动画效果">
          <Switch defaultChecked onCheckedChange={onChange} />
        </Row>
      </Section>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="space-y-6">
      <Section title="产品信息">
        <Info2 label="名称" value="AI Workbench" />
        <Info2 label="版本" value="v7.2.0" />
        <Info2 label="构建时间" value="2026-06-02" />
        <Info2
          label="技术栈"
          value="React 18 · TypeScript 5.9 · Vite 5 · Tailwind 3.4 · Supabase"
        />
      </Section>
      <Separator />
      <Section title="更新日志">
        <div className="space-y-3 text-sm">
          <UpdateItem
            version="v7.2"
            date="2026-06-02"
            features={[
              "13 个占位页面全部升级为完整实现",
              "完整数据分析 + 工单管理 + 设置中心",
              "新增 50+ 子组件 + 60+ mock 数据集",
            ]}
          />
          <UpdateItem
            version="v7.1"
            date="2026-06-02"
            features={[
              "4 个核心页面（对话/观测/工单/记忆）",
              "设计系统 + 全局布局 + 命令面板",
              "17 页面骨架",
            ]}
          />
          <UpdateItem version="v7.0" date="2026-06-01" features={["项目脚手架", "17 页面规划"]} />
        </div>
      </Section>
    </div>
  );
}

function UpdateItem({
  version,
  date,
  features,
}: { version: string; date: string; features: string[] }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <Badge variant="default" className="font-mono text-[10px]">
          {version}
        </Badge>
        <span className="text-[10px] text-muted-foreground">{date}</span>
      </div>
      <ul className="ml-2 space-y-0.5 text-xs">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-1.5">
            <IconCheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="font-mono text-sm tabular-nums">
          {value.toFixed(step < 1 ? 1 : 0)}
          {suffix}
        </span>
      </div>
      {hint && <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="mt-2 w-full accent-primary"
      />
    </div>
  );
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
