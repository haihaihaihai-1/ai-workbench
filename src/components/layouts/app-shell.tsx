import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import { CommandPalette } from "./command-palette";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-6">{children}</div>
        </main>
      </div>
      <CommandPalette />
      <Toaster richColors position="top-right" />
    </div>
  );
}
