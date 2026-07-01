/**
 * Tech Innovation 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 电蓝 + 霓虹青 + 深灰 + 白 · 科技 / 创新 / AI
 */

import type { Theme } from "./types";

export const techInnovation: Theme = {
  id: "tech-innovation",
  name: "Tech Innovation",
  source: "ComposioHQ/theme-factory",
  description: "高对比电蓝霓虹，AI/科技感",
  colors: {
    primary: "#0066ff", // Electric Blue
    secondary: "#00ffff", // Neon Cyan
    accent: "#1e1e1e", // Dark Gray
    background: "#0a0a0a", // 接近黑
    surface: "#1a1a1a",
    text: "#ffffff",
    textMuted: "#00ffff",
    border: "#333333",
  },
  fonts: {
    heading: '"DejaVu Sans", "DM Sans", system-ui, sans-serif',
    body: '"DejaVu Sans", "DM Sans", system-ui, sans-serif',
  },
  useCase: "AI 产品、开发者工具、极客风格",
  isDark: true,
};
