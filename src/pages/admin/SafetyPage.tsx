import { PlaceholderPage } from "@/pages/_placeholder";
import { ShieldCheck } from "lucide-react";

export default function SafetyPage() {
  return (
    <PlaceholderPage
      title="安全监控"
      description="PII / 提示注入 / 内容违规"
      icon={ShieldCheck}
      features={[
        "拦截事件表格",
        "PII 检测统计",
        "内容违规分布",
        "提示注入事件",
        "严重级别筛选",
        "告警通知",
      ]}
      related={[
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "⚙️ 系统设置", url: "/admin/settings" },
      ]}
    />
  );
}
