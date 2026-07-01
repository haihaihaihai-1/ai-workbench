/**
 * Forest Canopy 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 森林绿 + 鼠尾草 + 橄榄 + 象牙 · 静谧 / 自然 / 可持续
 */

import type { Theme } from "./types";

export const forestCanopy: Theme = {
  id: "forest-canopy",
  name: "Forest Canopy",
  source: "ComposioHQ/theme-factory",
  description: "深森林绿，环保与可持续主题",
  colors: {
    primary: "#2d4a2b", // Forest Green
    secondary: "#7d8471", // Sage
    accent: "#a4ac86", // Olive
    background: "#faf9f6", // Ivory
    surface: "#ffffff",
    text: "#1a2a18",
    textMuted: "#7d8471",
    border: "#c8cdb6",
  },
  fonts: {
    heading: '"FreeSerif", "Source Serif Pro", Georgia, serif',
    body: '"FreeSans", "DM Sans", system-ui, sans-serif',
  },
  useCase: "环保、可持续、自然、健康",
};
