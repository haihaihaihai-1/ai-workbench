import { ListChecks } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function ServicesPage() {
  return (
    <PlaceholderPage
      title="服务大厅"
      description="一站式服务导航"
      icon={ListChecks}
      features={[
        "学业服务（课程/成绩/作业/考试）",
        "心理服务（测评/咨询/音乐）",
        "教务服务（请假/选课/学籍）",
        "生活服务（地图/失物/活动）",
      ]}
      related={[
        { title: "💬 对话工作台", url: "/chat" },
        { title: "🛠 技能市场", url: "/skills" },
      ]}
    />
  );
}
