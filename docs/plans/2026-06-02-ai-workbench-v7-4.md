# AI Workbench v7.4 实施计划

> 目标：**为生产上线做准备** —— 路由分割 + 移动端 + 国际化 + PWA

**前置状态**：v7.3 已完成（commit `4e38ecd`），从 mock 走向真实可用。

---

## 全局规范

### 绝不动
- `src/components/ui/*`（17 原子组件）
- `src/index.css`（设计 token）
- 已有 17 页面（除非必要）

### 新增依赖（已装）
- `react-i18next` `17.0.8`
- `i18next` `26.3.0`
- `vite-plugin-pwa` (devDep)
- `workbox-window` (devDep)

---

## 4 大主题（4 subagent 并行）

### Subagent 1 · 路由级代码分割
**目标**：主包再降 40-50%，从 397KB 降到 < 250KB

**文件**：
- **修改** `src/routes.tsx`：用 `React.lazy` + `Suspense` 包裹所有页面
- **新增** `src/components/layouts/page-suspense.tsx`：通用 loading 占位
- **修改** `src/components/layouts/app-shell.tsx`：用 Suspense 包裹 Routes

**功能**：
1. **路由懒加载**：
   ```ts
   const HomePage = lazy(() => import("./pages/HomePage"));
   ```
2. **Loading 占位**：骨架屏（4-6 个色块 + shimmer 动效）
3. **预取提示**：在 Sidebar 鼠标 hover 时预取对应页面 chunk
4. **错误边界**：路由加载失败显示 fallback

**预期效果**：
- index.js 主包 < 250KB（gzip < 80KB）
- 每个页面独立 chunk
- 路由切换 < 100ms（已加载的页面）

### Subagent 2 · 移动端深度适配
**目标**：让移动端可用，不是简单响应式

**文件**：
- **新增** `src/components/layouts/mobile-nav.tsx`：汉堡菜单 + 底部 Tab Bar
- **新增** `src/hooks/use-media-query.ts`：响应式 hook
- **修改** `src/components/layouts/sidebar.tsx`：移动端隐藏，桌面端显示
- **修改** `src/components/layouts/app-shell.tsx`：移动端用 MobileNav
- **修改** `src/components/layouts/topbar.tsx`：移动端调整

**功能**：
1. **断点**：< 768px 移动端，≥ 768px 桌面端
2. **侧边栏**：移动端默认隐藏，汉堡菜单唤起 Drawer
3. **底部 Tab Bar**：移动端显示 4 个核心 Tab（对话/记忆/工单/监控）
4. **顶栏**：移动端隐藏搜索框，只保留 logo + 通知 + 用户
5. **页面适配**：
   - /chat 移动端：默认隐藏会话列表，全屏对话
   - /tickets 移动端：默认列表视图，看板横向滑动
   - /memory 移动端：1 列布局
   - /monitor 移动端：2 列 → 1 列

### Subagent 3 · 国际化 i18n
**目标**：中英双语 + 持久化语言选择

**文件**：
- **新增** `src/i18n/index.ts`：i18next 配置
- **新增** `src/i18n/locales/zh.json`：中文翻译
- **新增** `src/i18n/locales/en.json`：英文翻译
- **新增** `src/stores/locale-store.ts`：语言选择 + 持久化
- **新增** `src/components/layouts/locale-switcher.tsx`：语言切换器
- **修改** `src/main.tsx`：初始化 i18next
- **修改** `src/components/layouts/topbar.tsx`：集成 LocaleSwitcher
- **修改** `src/pages/chat/index.tsx` / `src/pages/monitor/index.tsx` / `src/pages/tickets/index.tsx` / `src/pages/memory/index.tsx` 等核心页面：用 `t()` 包裹文案

**功能**：
1. **语言切换**：顶栏 dropdown（中文 / English）
2. **持久化**：localStorage（`i18nextLng`）
3. **翻译范围**（MVP）：
   - 全局：品牌名、命令面板、快捷键帮助
   - 顶栏：搜索、主题、通知
   - 侧边栏：所有导航项
   - 4 核心页面：标题、按钮、状态、占位
4. **懒加载语言包**（`i18next-http-backend` 可选，先用静态 import）

### Subagent 4 · PWA 化
**目标**：可安装 + 离线访问 + 桌面图标

**文件**：
- **新增** `public/icon-192.png` / `public/icon-512.png`（图标，用 SVG 生成 PNG）
- **新增** `public/manifest.webmanifest`（或通过 plugin 生成）
- **修改** `vite.config.ts`：集成 `vite-plugin-pwa`（InjectManifest 或 generateSW）
- **新增** `src/components/layouts/pwa-install-prompt.tsx`：安装提示 Toast
- **新增** `src/hooks/use-pwa.ts`：检测 beforeinstallprompt + 安装

**功能**：
1. **manifest**：
   - name: "AI Workbench - 协作工作台"
   - short_name: "AI Workbench"
   - theme_color: "#5E6AD2"
   - background_color: "#09090B"
   - display: "standalone"
   - icons: 192×192 + 512×512
2. **Service Worker**：
   - 预缓存所有静态资源（vite-plugin-pwa 默认）
   - 离线 fallback 页面
3. **安装提示**：
   - 检测 `beforeinstallprompt` 事件
   - 底部 Toast「安装 AI Workbench」按钮
   - 用户接受后调用 `prompt()`

---

## 风险与约束

1. **绝不动** `src/components/ui/*` / `src/index.css`
2. **不要修改** 任何 17 页面的 mock-data（除非 i18n 需要）
3. **Subagent 1 修改 routes.tsx**：会让所有页面 lazy，其他 subagent 不需要改 routes
4. **Subagent 2 修改 sidebar / topbar / app-shell**：Subagent 1/3 也会改这 3 个文件，注意**协调**：Subagent 1 先跑，2/3 后跑，避免冲突

---

## 验证

1. `pnpm typecheck` (0 errors)
2. `pnpm lint` (0 errors)
3. `pnpm build`（主包应 < 250KB）
4. dev server 200
5. 移动端视图（用 DevTools 模拟 < 768px）
6. 切换语言刷新保持
7. `pnpm build` 后检查 `dist/sw.js` 生成
8. 提交 v7.4
