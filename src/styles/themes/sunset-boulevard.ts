/**
 * Sunset Boulevard 主题
 * 来源: ComposioHQ/awesome-claude-skills/theme-factory
 * 烧橙 + 珊瑚 + 暖沙 + 深紫 · 日落 / 城市 / 戏剧
 */

import type { Theme } from "./types";

export const sunsetBoulevard: Theme = {
  id: "sunset-boulevard",
  name: "Sunset Boulevard",
  source: "ComposioHQ/theme-factory",
  description: "城市日落暖橙紫",
  colors: {
    primary: "#e76f51", // Burnt Orange
    secondary: "#f4a261", // Coral
    accent: "#264653", // Deep Purple
    background: "#fef8e8", // 暖白
    surface: "#fffcf2",
    text: "#264653",
    textMuted: "#e76f51",
    border: "#f4d8a8",
  },
  fonts: {
    heading: '"DejaVu Serif", "Source Serif Pro", Georgia, serif',
    body: '"DejaVu Sans", "Inter", system-ui, sans-serif',
  },
  useCase: "营销、活动、温暖暖色、品牌",
};
