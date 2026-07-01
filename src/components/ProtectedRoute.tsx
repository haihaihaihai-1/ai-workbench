// ProtectedRoute - 路由守卫
// 1. 未登录 → 重定向到 /login
// 2. 已登录但角色不匹配 → 显示 403 页面

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { UserRole } from "@/lib/types";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRole[];
}) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}

function ForbiddenPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl font-bold text-muted-foreground/30">403</div>
      <div>
        <h2 className="text-lg font-semibold">权限不足</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          当前角色（{user?.role}）无权访问此页面
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={() => window.history.back()}>
        返回上一页
      </Button>
    </div>
  );
}
