import { FileText } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function FeedbackPage() {
  return (
    <PlaceholderPage
      title="反馈管理"
      description="收集和管理用户对 AI 回复的反馈"
      icon={FileText}
      features={[
        "反馈列表 + 筛选",
        "评分分布 + 趋势",
        "反馈详情",
        "标记已处理",
        "关联会话 / Trace",
      ]}
      related={[
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "🎫 工单中心", url: "/tickets" },
      ]}
    />
  );
}
