// Supabase 客户端（占位 - 真实部署时配置 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）
// 当前版本使用 mock 数据，无需真实后端即可完整体验 UI

export const SUPABASE_CONFIGURED = false;

export const supabasePlaceholder = {
  url: import.meta.env.VITE_SUPABASE_URL ?? "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  note: "当前为 mock 模式，所有数据使用前端模拟。生产部署需配置 .env 并接入真实 Supabase。",
};

export async function fakeDelay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}
