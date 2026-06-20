/**
 * 主题注册中心
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 *
 * 10 套主题全部来自官方 theme-factory skill
 * 用法:
 *   import { themes, getTheme, applyTheme } from "@/styles/themes";
 *   applyTheme("midnight-galaxy");
 */

import { arcticFrost } from "./arctic-frost";
import { botanicalGarden } from "./botanical-garden";
import { desertRose } from "./desert-rose";
import { forestCanopy } from "./forest-canopy";
import { goldenHour } from "./golden-hour";
import { midnightGalaxy } from "./midnight-galaxy";
import { modernMinimalist } from "./modern-minimalist";
import { oceanDepths } from "./ocean-depths";
import { sunsetBoulevard } from "./sunset-boulevard";
import { techInnovation } from "./tech-innovation";
import type { Theme } from "./types";

export const themes: Theme[] = [
  arcticFrost,
  botanicalGarden,
  desertRose,
  forestCanopy,
  goldenHour,
  midnightGalaxy,
  modernMinimalist,
  oceanDepths,
  sunsetBoulevard,
  techInnovation,
];

export const defaultThemeId = "modern-minimalist";

export function getTheme(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

const STORAGE_KEY = "ai-workbench-theme-id";

/**
 * 把主题的色值写为 CSS 变量到 :root（或指定元素）
 * 覆盖优先级：主题 < dark 模式 < 组件
 */
export function applyTheme(themeId: string, target: HTMLElement = document.documentElement) {
  const theme = getTheme(themeId);
  if (!theme) {
    console.warn(`[themes] Unknown theme "${themeId}", falling back to default`);
    return;
  }

  const style = target.style;
  // 直接覆盖 CSS 变量（HSL 不需要，让 CSS 透传）
  // 这里用 hex，CSS 会把它们作为字符串赋给变量
  // 业务方使用 var(--brand-500) 时还是用 token.css 里的
  // 主题主要影响 :root 下的几个关键变量
  style.setProperty("--theme-primary", theme.colors.primary);
  style.setProperty("--theme-secondary", theme.colors.secondary);
  style.setProperty("--theme-accent", theme.colors.accent);
  style.setProperty("--theme-bg", theme.colors.background);
  style.setProperty("--theme-surface", theme.colors.surface);
  style.setProperty("--theme-text", theme.colors.text);
  style.setProperty("--theme-text-muted", theme.colors.textMuted);
  style.setProperty("--theme-border", theme.colors.border);
  style.setProperty("--theme-heading-font", theme.fonts.heading);
  style.setProperty("--theme-body-font", theme.fonts.body);

  // 同步 dark mode
  target.classList.toggle("theme-dark", !!theme.isDark);
  target.dataset.theme = themeId;

  // 持久化
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // localStorage 不可用（如隐私模式）忽略
  }
}

export function loadSavedTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? defaultThemeId;
  } catch {
    return defaultThemeId;
  }
}

export type { Theme } from "./types";
