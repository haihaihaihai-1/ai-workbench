import { Activity } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function DataAnalysisPage() {
  return (
    <PlaceholderPage
      title="数据分析"
      description="系统运行数据 + 健康度"
      icon={Activity}
      features={["用户活跃度", "Agent 路由分布", "反馈分析", "意图分布", "数据导出"]}
      related={[
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "🔬 数据飞轮", url: "/flywheel" },
      ]}
    />
  );
}
