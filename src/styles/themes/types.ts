/**
 * 主题类型定义
 *
 * 一套主题 = 4 个主色 + 4 个语义色 + 2 个字体
 * 应用方式：CSS 变量覆盖 → 全局生效
 */

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
};

export type ThemeFonts = {
  heading: string;
  body: string;
};

export type Theme = {
  id: string;
  name: string;
  source: string; // 例 "ComposioHQ/theme-factory"
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  useCase: string;
  isDark?: boolean;
};
