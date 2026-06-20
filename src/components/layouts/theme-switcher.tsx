import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import type { Theme } from "@/stores/theme-store";
import { IconCheck, IconMonitor, IconMoon, IconSun } from "@/components/icons"

type Option = {
  value: Theme;
  label: string;
  description: string;
  icon: typeof IconMoon;
};

const OPTIONS: Option[] = [
  { value: "dark", label: "暗色", description: "适合弱光环境", icon: IconMoon },
  { value: "light", label: "亮色", description: "明亮清晰", icon: IconSun },
  { value: "system", label: "跟随系统", description: "跟随操作系统设置", icon: IconMonitor },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const ActiveIcon = theme === "dark" ? IconMoon : theme === "light" ? IconSun : IconMonitor;

  return (
    <Popover>
      <PopoverTrigger
        aria-label="切换主题"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center gap-2 rounded-md text-sm font-medium",
          "transition-all hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "[&_svg]:size-4 [&_svg]:shrink-0",
        )}
      >
        <ActiveIcon className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <div className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">主题</div>
        <div className="flex flex-col gap-1" role="radiogroup" aria-label="主题">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring",
                  active && "bg-accent/60",
                )}
              >
                <input
                  type="radio"
                  name="theme-mode"
                  value={opt.value}
                  checked={active}
                  onChange={() => setTheme(opt.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                    active
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1">
                  <span className="block font-medium leading-tight">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground">{opt.description}</span>
                </span>
                {active && <IconCheck className="h-4 w-4 shrink-0 text-primary" />}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
