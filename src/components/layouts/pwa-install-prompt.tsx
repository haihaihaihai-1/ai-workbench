import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { IconDownload, IconX } from "@/components/icons"
import { useEffect, useState } from "react";

export function PWAInstallPrompt() {
  const { canInstall, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // 24h 内不再提示
  useEffect(() => {
    const last = localStorage.getItem("pwa-install-dismissed");
    if (last && Date.now() - Number(last) < 24 * 3600_000) {
      setDismissed(true);
    }
  }, []);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-lg border border-border bg-popover/95 p-3 shadow-lg backdrop-blur md:bottom-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-primary-foreground">
        <IconDownload className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">安装 AI Workbench</div>
        <div className="text-[10px] text-muted-foreground">添加到桌面，离线也能用</div>
      </div>
      <Button
        size="sm"
        className="h-7"
        onClick={() => {
          install();
        }}
      >
        安装
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => {
          setDismissed(true);
          localStorage.setItem("pwa-install-dismissed", String(Date.now()));
        }}
        aria-label="关闭"
      >
        <IconX className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
