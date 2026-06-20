/**
 * Modern Minimalist 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 炭灰 + 石板灰 + 浅灰 + 白 · 极简 / 通用 / 专业
 */

import type { Theme } from "./types";

export const modernMinimalist: Theme = {
  id: "modern-minimalist",
  name: "Modern Minimalist",
  source: "ComposioHQ/theme-factory",
  description: "极简灰阶，最通用",
  colors: {
    primary: "#36454f", // Charcoal
    secondary: "#708090", // Slate Gray
    accent: "#d3d3d3", // Light Gray
    background: "#ffffff",
    surface: "#fafafa",
    text: "#36454f",
    textMuted: "#708090",
    border: "#e5e5e5",
  },
  fonts: {
    heading: '"DejaVu Sans", "Inter", system-ui, sans-serif',
    body: '"DejaVu Sans", "Inter", system-ui, sans-serif',
  },
  useCase: "通用、商务、报告、设计作品集",
};
