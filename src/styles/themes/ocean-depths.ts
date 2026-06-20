/**
 * Ocean Depths 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 深海军蓝 + 青绿 + 海沫 + 奶油 · 海洋 / 深度 / 平静
 */

import type { Theme } from "./types";

export const oceanDepths: Theme = {
  id: "ocean-depths",
  name: "Ocean Depths",
  source: "ComposioHQ/theme-factory",
  description: "深海蓝调，平静专业",
  colors: {
    primary: "#2d8b8b", // Teal
    secondary: "#a8dadc", // Seafoam
    accent: "#1a2332", // Deep Navy
    background: "#f1faee", // Cream
    surface: "#ffffff",
    text: "#1a2332",
    textMuted: "#2d8b8b",
    border: "#c4d8d8",
  },
  fonts: {
    heading: '"DejaVu Sans", "Inter", system-ui, sans-serif',
    body: '"DejaVu Sans", "Inter", system-ui, sans-serif',
  },
  useCase: "海洋、数据可视化、企业、医疗",
};
