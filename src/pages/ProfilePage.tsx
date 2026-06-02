import { UserCog } from "lucide-react";
import { PlaceholderPage } from "./_placeholder";

export default function ProfilePage() {
  return (
    <PlaceholderPage
      title="个人中心"
      description="我的对话 / 反馈 / 收藏 / 设置"
      icon={UserCog}
      features={[
        "我的对话历史",
        "我的反馈记录",
        "收藏的回复",
        "使用统计",
        "通知偏好",
        "账户与安全",
      ]}
      related={[
        { title: "💬 对话工作台", url: "/chat" },
        { title: "🧠 记忆中心", url: "/memory" },
      ]}
    />
  );
}
