import { ProtectedRoute } from "@/components/ProtectedRoute";
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
const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export type RouteConfig = {
  name: string;
  path: string;
  element: ReactNode;
  roles?: import("@/lib/types").UserRole[];
};

// 统一 Suspense 包装, 保证每个懒加载页面都有骨架屏占位
const withFallback = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

// 受保护路由包装
const guarded = (node: ReactNode, roles?: import("@/lib/types").UserRole[]) =>
  withFallback(<ProtectedRoute roles={roles}>{node}</ProtectedRoute>);

// 所有角色可访问
const ALL = undefined;
// 运营/管理角色
const STAFF: import("@/lib/types").UserRole[] = ["teacher", "counselor", "admin"];
// 仅管理员
const ADMIN: import("@/lib/types").UserRole[] = ["admin"];

export const routes: RouteConfig[] = [
  // 登录页（不需要认证）
  { name: "登录", path: "/login", element: withFallback(<LoginPage />) },
  // 通用页面
  { name: "首页", path: "/", element: guarded(<HomePage />, ALL) },
  { name: "对话工作台", path: "/chat", element: guarded(<ChatPage />, ALL) },
  { name: "对话演示", path: "/chat-demo", element: guarded(<ChatDemoPage />, ALL) },
  { name: "记忆中心", path: "/memory", element: guarded(<MemoryPage />, ALL) },
  { name: "服务大厅", path: "/services", element: guarded(<ServicesPage />, ALL) },
  { name: "个人中心", path: "/profile", element: guarded(<ProfilePage />, ALL) },
  { name: "技能市场", path: "/skills", element: guarded(<SkillsPage />, ALL) },
  // 运营页面（teacher/counselor/admin）
  { name: "实时监控", path: "/monitor", element: guarded(<MonitorPage />, STAFF) },
  { name: "工单中心", path: "/tickets", element: guarded(<TicketsPage />, STAFF) },
  { name: "反馈管理", path: "/feedback", element: guarded(<FeedbackPage />, STAFF) },
  { name: "数据飞轮", path: "/flywheel", element: guarded(<FlywheelPage />, STAFF) },
  { name: "系统评估", path: "/evaluation", element: guarded(<EvaluationPage />, STAFF) },
  { name: "数据分析", path: "/analysis", element: guarded(<DataAnalysisPage />, STAFF) },
  { name: "用户画像", path: "/memory/profile/:userId", element: guarded(<UserProfilePage />, STAFF) },
  // 管理页面（仅 admin）
  { name: "用户管理", path: "/admin/users", element: guarded(<UsersPage />, ADMIN) },
  { name: "技能管理", path: "/admin/skills", element: guarded(<AdminSkillsPage />, ADMIN) },
  { name: "安全监控", path: "/admin/safety", element: guarded(<SafetyPage />, ADMIN) },
  { name: "系统设置", path: "/admin/settings", element: guarded(<SettingsPage />, ADMIN) },
  // 开发/设计
  { name: "设计系统", path: "/design-system", element: guarded(<DesignSystemPage />, ALL) },
  // 404
  { name: "404", path: "*", element: withFallback(<NotFound />) },
];
