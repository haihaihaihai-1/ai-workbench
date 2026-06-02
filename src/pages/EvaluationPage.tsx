import { Target } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function EvaluationPage() {
  return (
    <PlaceholderPage
      title="系统评估"
      description="离线评估 + 测试集管理"
      icon={Target}
      features={[
        "运行离线评估",
        "测试集管理",
        "质量评分 / 路由准确率 / 危机识别召回率",
        "详细评估表格",
        "评估报告导出",
      ]}
      related={[
        { title: "🔬 数据飞轮", url: "/flywheel" },
        { title: "📊 可观测中心", url: "/monitor" },
      ]}
    />
  );
}
