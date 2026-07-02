/**
 * Desert Rose 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 玫瑰 + 黏土 + 沙 + 酒红 · 优雅 / 温暖 / 复古
 */

import type { Theme } from "./types";

export const desertRose: Theme = {
  id: "desert-rose",
  name: "Desert Rose",
  source: "ComposioHQ/theme-factory",
  description: "温暖复古的玫红黏土色，适合文艺、时尚",
  colors: {
    primary: "#b87d6d", // Clay
    secondary: "#d4a5a5", // Dusty Rose
    accent: "#5d2e46", // Deep Burgundy
    background: "#e8d5c4", // Sand
    surface: "#f3e8de",
    text: "#3a1e2a",
    textMuted: "#b87d6d",
    border: "#d4a5a5",
  },
  fonts: {
    heading: '"FreeSans", "Inter", system-ui, sans-serif',
    body: '"FreeSans", "Inter", system-ui, sans-serif',
  },
  useCase: "时尚、艺术、复古风格、社交内容",
};
