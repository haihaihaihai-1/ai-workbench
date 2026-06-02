import { Sparkles } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function SkillsPage() {
  return (
    <PlaceholderPage
      title="技能市场"
      description="AI 技能浏览 / 安装 / 自定义"
      icon={Sparkles}
      features={[
        "技能列表 + 详情",
        "执行模式（AUTO/ASK/INTERACTIVE）",
        "启用/禁用",
        "自定义技能",
        "调用统计",
      ]}
      related={[
        { title: "🤖 技能管理", url: "/admin/skills" },
        { title: "💬 对话工作台", url: "/chat" },
      ]}
    />
  );
}
