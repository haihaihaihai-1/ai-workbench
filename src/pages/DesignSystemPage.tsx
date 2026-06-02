// 设计系统主页 - 左侧锚点导航 + 右侧内容
// 替代 Storybook: 直接在产品内展示原子组件 + Design Tokens

import { useEffect, useState } from "react";
import { SectionButton } from "./design-system/section-button";
import { SectionData } from "./design-system/section-data";
import { SectionDisplay } from "./design-system/section-display";
import { SectionFeedback } from "./design-system/section-feedback";
import { SectionInput } from "./design-system/section-input";
import { SectionOverlay } from "./design-system/section-overlay";
import { SectionOverview } from "./design-system/section-overview";
import { SidebarNav } from "./design-system/sidebar-nav";

const SECTIONS = [
  { id: "overview", title: "概览 / Tokens" },
  { id: "button", title: "Button" },
  { id: "input", title: "Input / Form" },
  { id: "display", title: "Display" },
  { id: "overlay", title: "Overlay" },
  { id: "data", title: "Data" },
  { id: "feedback", title: "Feedback" },
] as const;

export default function DesignSystemPage() {
  const [activeId, setActiveId] = useState<string>("overview");

  // 滚动监听: 自动高亮当前 section
  useEffect(() => {
    const onScroll = () => {
      const offset = 120;
      let current: string = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex gap-6">
      <SidebarNav sections={[...SECTIONS]} activeId={activeId} />
      <div className="min-w-0 flex-1 space-y-12 pb-16">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">设计系统</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            AI Workbench 的原子组件库与 Design Tokens。 所有组件基于 Radix UI + Tailwind CSS + cva
            构建， 支持 dark / light 主题自动适配。
          </p>
        </header>
        <SectionOverview />
        <SectionButton />
        <SectionInput />
        <SectionDisplay />
        <SectionOverlay />
        <SectionData />
        <SectionFeedback />
      </div>
    </div>
  );
}
