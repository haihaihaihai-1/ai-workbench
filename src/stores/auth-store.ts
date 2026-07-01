// 认证 Store - 管理当前登录用户、角色、登录/登出
// 当前为 mock 模式：模拟登录验证，后续可无缝切换到 Supabase Auth

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/types";

export type CurrentUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  major?: string;
  studentId?: string;
  staffId?: string;
  sessions?: number;
};

// 预置可登录账号（从 admin/users mock-data 中精选 4 个角色各 1 个）
export const LOGIN_ACCOUNTS: Array<{
  username: string;
  password: string;
  user: CurrentUser;
}> = [
  {
    username: "liming",
    password: "123456",
    user: {
      id: "u_8234",
      username: "liming",
      name: "李明",
      email: "liming@school.edu",
      role: "student",
      avatar: "李",
      department: "计算机学院",
      major: "软件工程",
      studentId: "2021034",
    },
  },
  {
    username: "wang_teacher",
    password: "123456",
    user: {
      id: "u_1234",
      username: "wang_teacher",
      name: "王老师",
      email: "wang@school.edu",
      role: "teacher",
      avatar: "王",
      department: "计算机学院",
      staffId: "T-10034",
    },
  },
  {
    username: "counselor_huang",
    password: "123456",
    user: {
      id: "u_6789",
      username: "counselor_huang",
      name: "黄子轩",
      email: "huang@school.edu",
      role: "counselor",
      avatar: "黄",
      department: "心理辅导中心",
      staffId: "C-00012",
    },
  },
  {
    username: "admin_zhao",
    password: "123456",
    user: {
      id: "u_4567",
      username: "admin_zhao",
      name: "赵磊",
      email: "zhao@school.edu",
      role: "admin",
      avatar: "赵",
      department: "信息中心",
      staffId: "A-00001",
    },
  },
];

// 路由权限映射：哪些角色可以访问哪些路由
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // 所有角色可访问
  "/": ["student", "teacher", "counselor", "admin"],
  "/chat": ["student", "teacher", "counselor", "admin"],
  "/chat-demo": ["student", "teacher", "counselor", "admin"],
  "/memory": ["student", "teacher", "counselor", "admin"],
  "/services": ["student", "teacher", "counselor", "admin"],
  "/skills": ["student", "teacher", "counselor", "admin"],
  "/profile": ["student", "teacher", "counselor", "admin"],
  "/design-system": ["student", "teacher", "counselor", "admin"],

  // 仅教职员工
  "/monitor": ["teacher", "counselor", "admin"],
  "/tickets": ["teacher", "counselor", "admin"],
  "/feedback": ["teacher", "counselor", "admin"],
  "/flywheel": ["teacher", "admin"],
  "/evaluation": ["teacher", "admin"],
  "/analysis": ["teacher", "admin"],
  "/memory/profile/:userId": ["teacher", "counselor", "admin"],

  // 仅管理员
  "/admin/users": ["admin"],
  "/admin/skills": ["admin"],
  "/admin/safety": ["admin"],
  "/admin/settings": ["admin"],
};

export type AuthState = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  init: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasAccess: (path: string) => boolean;
};

// 检查当前用户是否有权访问指定路径
function checkAccess(user: CurrentUser | null, path: string): boolean {
  if (!user) return false;

  // 精确匹配
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path].includes(user.role);
  }

  // 动态路由 /memory/profile/:userId
  if (path.startsWith("/memory/profile/")) {
    return ROUTE_PERMISSIONS["/memory/profile/:userId"].includes(user.role);
  }

  // 未定义权限的路由默认允许已登录用户访问
  return true;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      init: () => {
        // persist 中间件会自动恢复 user/isAuthenticated
        // 这里仅做必要的初始化校验
        const { user } = get();
        if (user && !get().isAuthenticated) {
          set({ isAuthenticated: true });
        }
      },

      login: async (username: string, password: string) => {
        // 模拟网络延迟
        await new Promise((r) => setTimeout(r, 600));

        const account = LOGIN_ACCOUNTS.find(
          (a) => a.username === username && a.password === password,
        );

        if (!account) {
          return { success: false, error: "用户名或密码错误" };
        }

        set({ user: account.user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      hasAccess: (path: string) => {
        const { user } = get();
        return checkAccess(user, path);
      },
    }),
    {
      name: "ai-workbench-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
