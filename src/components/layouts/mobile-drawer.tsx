import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { SidebarContent } from "./sidebar";

// 移动端唤起的侧边栏 - 从左侧滑入
// 复用 SidebarContent 避免重复维护导航结构
// 仅在 < 768px 显示（由父级 useMediaQuery 控制挂载）

export function MobileDrawer() {
  const open = useSidebarStore((s) => s.mobileDrawerOpen);
  const setOpen = useSidebarStore((s) => s.setMobileDrawerOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          // 抽屉定位：左贴边、高度撑满、宽 80% 最大 320px
          "fixed left-0 top-0 z-50 h-full w-[80vw] max-w-[320px] -translate-x-0 -translate-y-0 gap-0 rounded-none border-r border-border p-0 shadow-2xl",
          // 滑入动画
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          "duration-300",
          // 隐藏默认的 X 关闭按钮（点击 overlay 或导航即可关闭）
          "[&>button.absolute]:hidden",
        )}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
