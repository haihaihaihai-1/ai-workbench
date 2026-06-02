import { PlaceholderPage } from "@/pages/_placeholder";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="系统设置"
      description="AI 模型 / 通知 / 服务状态"
      icon={Settings}
      features={[
        "AI 模型配置（API Key / 模型 / Temperature）",
        "通知配置（企业微信 Webhook）",
        "服务状态监控（Redis / DB / LLM）",
        "SLO 阈值",
        "主题与外观",
      ]}
      related={[
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "🔒 安全监控", url: "/admin/safety" },
      ]}
    />
  );
}
