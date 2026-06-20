/**
 * Botanical Garden 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 蕨绿 + 万寿菊 + 赤陶 + 奶油 · 自然 / 有机 / 生命
 */

import type { Theme } from "./types";

export const botanicalGarden: Theme = {
  id: "botanical-garden",
  name: "Botanical Garden",
  source: "ComposioHQ/theme-factory",
  description: "自然绿与暖橙搭配，适合生命科学、内容平台",
  colors: {
    primary: "#4a7c59", // Fern Green
    secondary: "#f9a620", // Marigold
    accent: "#b7472a", // Terracotta
    background: "#f5f3ed", // Cream
    surface: "#fbfaf6",
    text: "#1f3a2a",
    textMuted: "#4a7c59",
    border: "#d4cfb8",
  },
  fonts: {
    heading: '"DejaVu Serif", "Source Serif Pro", Georgia, serif',
    body: '"DejaVu Sans", "Inter", system-ui, sans-serif',
  },
  useCase: "生命科学、有机品牌、博客、阅读型产品",
};
