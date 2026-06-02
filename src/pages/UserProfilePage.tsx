import { PlaceholderPage } from "@/pages/_placeholder";
import { Brain } from "lucide-react";
import { useParams } from "react-router-dom";

export default function UserProfilePage() {
  const { userId } = useParams();
  return (
    <PlaceholderPage
      title={`用户画像 · ${userId ?? "未知"}`}
      description="基于对话生成的画像"
      icon={Brain}
      features={["画像摘要", "兴趣标签", "学习风格 + 沟通偏好", "活跃时段统计", "30 天情绪趋势"]}
      related={[
        { title: "🧠 记忆中心", url: "/memory" },
        { title: "📊 可观测中心", url: "/monitor" },
      ]}
    />
  );
}
