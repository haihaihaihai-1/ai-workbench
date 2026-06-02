import { Home } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function HomePage() {
  return (
    <PlaceholderPage
      title="首页"
      description="工作台仪表盘（v1 占位）"
      icon={Home}
      features={[
        "今日活跃 / 总会话 / 平均响应",
        "实时事件流",
        "工作区快捷入口",
        "最近对话",
        "待办工单",
        "飞轮健康度",
      ]}
      v2ETA="v7.2"
      related={[
        { title: "💬 对话工作台", url: "/chat" },
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "🎫 工单中心", url: "/tickets" },
        { title: "🧠 记忆中心", url: "/memory" },
      ]}
    />
  );
}
