import { PlaceholderPage } from "@/pages/_placeholder";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="用户管理"
      description="用户列表 + 角色 + 状态"
      icon={Users}
      features={[
        "用户列表 + 筛选",
        "新增/编辑/禁用用户",
        "角色管理（学生/教师/管理员）",
        "用户活跃度",
        "关联会话",
      ]}
      related={[
        { title: "👤 个人中心", url: "/profile" },
        { title: "🔒 安全监控", url: "/admin/safety" },
      ]}
    />
  );
}
