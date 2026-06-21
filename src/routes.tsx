import { type ReactNode, Suspense, lazy } from "react";
import { PageFallback } from "./components/layouts/page-fallback";

// 路由级代码分割: 每个页面按需加载, 初始包体积最小化
const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/chat"));
const ChatDemoPage = lazy(() => import("./pages/ChatDemoPage"));
const MemoryPage = lazy(() => import("./pages/memory"));
const MonitorPage = lazy(() => import("./pages/monitor"));
const TicketsPage = lazy(() => import("./pages/tickets"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const FlywheelPage = lazy(() => import("./pages/FlywheelPage"));
const EvaluationPage = lazy(() => import("./pages/EvaluationPage"));
const DataAnalysisPage = lazy(() => import("./pages/DataAnalysisPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminSkillsPage = lazy(() => import("./pages/admin/SkillsPage"));
const SafetyPage = lazy(() => import("./pages/admin/SafetyPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export type RouteConfig = {
  name: string;
  path: string;
  element: ReactNode;
};

// 统一 Suspense 包装, 保证每个懒加载页面都有骨架屏占位
const withFallback = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

export const routes: RouteConfig[] = [
  { name: "首页", path: "/", element: withFallback(<HomePage />) },
  { name: "对话工作台", path: "/chat", element: withFallback(<ChatPage />) },
  { name: "对话演示", path: "/chat-demo", element: withFallback(<ChatDemoPage />) },
  { name: "记忆中心", path: "/memory", element: withFallback(<MemoryPage />) },
  { name: "实时监控", path: "/monitor", element: withFallback(<MonitorPage />) },
  { name: "工单中心", path: "/tickets", element: withFallback(<TicketsPage />) },
  { name: "服务大厅", path: "/services", element: withFallback(<ServicesPage />) },
  { name: "个人中心", path: "/profile", element: withFallback(<ProfilePage />) },
  { name: "反馈管理", path: "/feedback", element: withFallback(<FeedbackPage />) },
  { name: "数据飞轮", path: "/flywheel", element: withFallback(<FlywheelPage />) },
  { name: "系统评估", path: "/evaluation", element: withFallback(<EvaluationPage />) },
  { name: "数据分析", path: "/analysis", element: withFallback(<DataAnalysisPage />) },
  { name: "技能市场", path: "/skills", element: withFallback(<SkillsPage />) },
  { name: "用户管理", path: "/admin/users", element: withFallback(<UsersPage />) },
  { name: "技能管理", path: "/admin/skills", element: withFallback(<AdminSkillsPage />) },
  { name: "安全监控", path: "/admin/safety", element: withFallback(<SafetyPage />) },
  { name: "系统设置", path: "/admin/settings", element: withFallback(<SettingsPage />) },
  { name: "用户画像", path: "/memory/profile/:userId", element: withFallback(<UserProfilePage />) },
  { name: "404", path: "*", element: withFallback(<NotFound />) },
];
