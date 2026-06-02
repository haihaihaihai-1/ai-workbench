import type { ReactNode } from "react";
import DataAnalysisPage from "./pages/DataAnalysisPage";
import EvaluationPage from "./pages/EvaluationPage";
import FeedbackPage from "./pages/FeedbackPage";
import FlywheelPage from "./pages/FlywheelPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import ServicesPage from "./pages/ServicesPage";
import SkillsPage from "./pages/SkillsPage";
import UserProfilePage from "./pages/UserProfilePage";
import SafetyPage from "./pages/admin/SafetyPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminSkillsPage from "./pages/admin/SkillsPage";
import UsersPage from "./pages/admin/UsersPage";
import ChatPage from "./pages/chat";
import MemoryPage from "./pages/memory";
import MonitorPage from "./pages/monitor";
import TicketsPage from "./pages/tickets";

export type RouteConfig = {
  name: string;
  path: string;
  element: ReactNode;
};

export const routes: RouteConfig[] = [
  { name: "首页", path: "/", element: <HomePage /> },
  { name: "对话工作台", path: "/chat", element: <ChatPage /> },
  { name: "记忆中心", path: "/memory", element: <MemoryPage /> },
  { name: "实时监控", path: "/monitor", element: <MonitorPage /> },
  { name: "工单中心", path: "/tickets", element: <TicketsPage /> },
  { name: "服务大厅", path: "/services", element: <ServicesPage /> },
  { name: "个人中心", path: "/profile", element: <ProfilePage /> },
  { name: "反馈管理", path: "/feedback", element: <FeedbackPage /> },
  { name: "数据飞轮", path: "/flywheel", element: <FlywheelPage /> },
  { name: "系统评估", path: "/evaluation", element: <EvaluationPage /> },
  { name: "数据分析", path: "/analysis", element: <DataAnalysisPage /> },
  { name: "技能市场", path: "/skills", element: <SkillsPage /> },
  { name: "用户管理", path: "/admin/users", element: <UsersPage /> },
  { name: "技能管理", path: "/admin/skills", element: <AdminSkillsPage /> },
  { name: "安全监控", path: "/admin/safety", element: <SafetyPage /> },
  { name: "系统设置", path: "/admin/settings", element: <SettingsPage /> },
  { name: "用户画像", path: "/memory/profile/:userId", element: <UserProfilePage /> },
  { name: "404", path: "*", element: <NotFound /> },
];
