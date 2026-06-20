/**
 * ThemePicker · 主题色板选择器
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 *
 * 10 套预制主题（颜色+字体），下拉单选，应用到 :root CSS 变量
 * 持久化到 localStorage
 * 配合现有的 ThemeSwitcher（dark/light/system）使用更佳
 */

import { IconCheck, IconPalette } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applyTheme, loadSavedTheme, themes } from "@/styles/themes";
import { useEffect, useState } from "react";

export function ThemePicker() {
  const [currentId, setCurrentId] = useState(() => loadSavedTheme());

  useEffect(() => {
    applyTheme(currentId);
  }, [currentId]);

  const current = themes.find((t) => t.id === currentId) ?? themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title={`主题: ${current.name}`}
          aria-label="切换主题"
        >
          <div
            className="h-4 w-4 rounded-full border border-border"
            style={{
              background: `linear-gradient(135deg, ${current.colors.primary} 50%, ${current.colors.secondary} 50%)`,
            }}
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <IconPalette className="h-3 w-3" />
          主题 · Theme Factory
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setCurrentId(t.id)}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border"
              style={{
                background: `linear-gradient(135deg, ${t.colors.primary} 50%, ${t.colors.secondary} 50%)`,
              }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {t.name}
                {t.isDark ? (
                  <span className="rounded bg-muted px-1 py-px text-[9px] text-muted-foreground">
                    dark
                  </span>
                ) : null}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">{t.useCase}</div>
            </div>
            {t.id === currentId ? <IconCheck className="h-3 w-3 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
          来源 · ComposioHQ/theme-factory
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
