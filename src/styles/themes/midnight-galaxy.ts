/**
 * Midnight Galaxy 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 深紫 + 宇宙蓝 + 薰衣草 + 银 · 神秘 / 太空 / 夜晚
 */

import type { Theme } from "./types";

export const midnightGalaxy: Theme = {
  id: "midnight-galaxy",
  name: "Midnight Galaxy",
  source: "ComposioHQ/theme-factory",
  description: "深紫宇宙色，神秘高级感",
  colors: {
    primary: "#4a4e8f", // Cosmic Blue
    secondary: "#a490c2", // Lavender
    accent: "#2b1e3e", // Deep Purple
    background: "#1a0f2a", // 超深紫
    surface: "#2b1e3e",
    text: "#e6e6fa", // Silver
    textMuted: "#a490c2",
    border: "#3a2e4e",
  },
  fonts: {
    heading: '"FreeSans", "Inter", system-ui, sans-serif',
    body: '"FreeSans", "Inter", system-ui, sans-serif',
  },
  useCase: "AI 产品、神秘感、夜晚、监控大屏",
  isDark: true,
};
