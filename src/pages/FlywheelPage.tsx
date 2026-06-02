import { ChartLine } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function FlywheelPage() {
  return (
    <PlaceholderPage
      title="数据飞轮"
      description="意图进化 + 反馈分析 + 优化建议"
      icon={ChartLine}
      features={[
        "飞轮健康度评分",
        "意图覆盖分析",
        "新意图发现 + 采纳",
        "低置信度根因分析",
        "工具健康度报告",
        "优化建议生成器 + 导出",
      ]}
      related={[
        { title: "📊 可观测中心", url: "/monitor" },
        { title: "🧪 系统评估", url: "/evaluation" },
      ]}
    />
  );
}
