// 左侧锚点导航 - 滚动到指定 section

import { cn } from "@/lib/utils";

export type NavSection = { id: string; title: string };

type Props = {
  sections: NavSection[];
  activeId: string;
};

export function SidebarNav({ sections, activeId }: Props) {
  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <aside className="sticky top-4 hidden h-fit w-[220px] shrink-0 self-start md:block">
      <div className="rounded-lg border bg-card p-3">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          目录
        </div>
        <nav className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={handleClick(s.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                activeId === s.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {s.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
