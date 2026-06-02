import { PlaceholderPage } from "@/pages/_placeholder";
import { Wrench } from "lucide-react";

export default function SkillsAdminPage() {
  return (
    <PlaceholderPage
      title="技能管理"
      description="管理员配置 AI 技能"
      icon={Wrench}
      features={[
        "技能列表 + 编辑",
        "执行模式（AUTO / ASK_CONFIRM / INTERACTIVE）",
        "启用/禁用",
        "调用权限",
        "审计日志",
      ]}
      related={[
        { title: "🛠 技能市场", url: "/skills" },
        { title: "⚙️ 系统设置", url: "/admin/settings" },
      ]}
    />
  );
}
