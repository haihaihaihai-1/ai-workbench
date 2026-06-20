/**
 * Arctic Frost 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 冰蓝 + 钢蓝 + 银 + 雪白 · 冷静 / 数据 / 北欧
 */

import type { Theme } from "./types";

export const arcticFrost: Theme = {
  id: "arctic-frost",
  name: "Arctic Frost",
  source: "ComposioHQ/theme-factory",
  description: "冰蓝钢蓝冷色调，适合数据、监控、北欧风",
  colors: {
    primary: "#4a6fa5", // Steel Blue
    secondary: "#c0c0c0", // Silver
    accent: "#d4e4f7", // Ice Blue
    background: "#fafafa", // Crisp White
    surface: "#ffffff",
    text: "#1a2a3a",
    textMuted: "#4a6fa5",
    border: "#d4e4f7",
  },
  fonts: {
    heading: '"DejaVu Sans", "Inter", system-ui, sans-serif',
    body: '"DejaVu Sans", "Inter", system-ui, sans-serif',
  },
  useCase: "数据展示、监控、报告、寒色系界面",
};
