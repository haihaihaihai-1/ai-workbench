/**
 * Golden Hour 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 芥末黄 + 赤陶 + 暖米 + 巧克力 · 温暖 / 复古 / 黄金时刻
 */

import type { Theme } from "./types";

export const goldenHour: Theme = {
  id: "golden-hour",
  name: "Golden Hour",
  source: "ComposioHQ/theme-factory",
  description: "温暖金色调，怀旧温暖",
  colors: {
    primary: "#f4a900", // Mustard Yellow
    secondary: "#c1666b", // Terracotta
    accent: "#d4b896", // Warm Beige
    background: "#4a403a", // Chocolate Brown (dark)
    surface: "#3a322d",
    text: "#f4e8d4",
    textMuted: "#c1666b",
    border: "#6a5a4a",
  },
  fonts: {
    heading: '"FreeSans", "DM Sans", system-ui, sans-serif',
    body: '"FreeSans", "DM Sans", system-ui, sans-serif',
  },
  useCase: "复古、暗色 + 暖色、咖啡店、阅读",
  isDark: true,
};
