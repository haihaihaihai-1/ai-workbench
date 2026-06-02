# AI Workbench v7.3 实施计划

> 目标：从「好看」走向「真实可用」—— 主题切换、通知中心、快捷键、拖拽、动效、持久化、导出、E2E 测试

**前置状态**：v7.2 已完成（commit `4ade99b`），17 页面全部完整实现。

---

## 全局规范

### 设计系统（绝不动）
- `src/components/ui/*`（17 原子组件）
- `src/index.css`（设计 token）

### 已有依赖（直接用）
- Vite 5 / React 18 / TypeScript 5.9 / Tailwind 3.4
- Zustand 5 / TanStack Query 5 / cmdk / Recharts
- Radix UI（17+ 组件）
- Sonner / Lucide / date-fns
- **新增**：`@dnd-kit/core` `6.3.1` + `@dnd-kit/sortable` `10.0.0` + `@dnd-kit/utilities` `3.2.2`
- **新增**：`@playwright/test` (dev)

---

## 5 大主题（5 subagent 并行）

### Subagent 1 · 顶栏增强（主题系统 + 通知中心）
**目标**：让顶栏「活」起来

**文件**：
- **新增**：`src/components/layouts/theme-switcher.tsx`（主题切换下拉）
- **新增**：`src/components/layouts/notification-center.tsx`（通知抽屉）
- **新增**：`src/components/layouts/notification-mock-data.ts`
- **修改**：`src/stores/theme-store.ts`（扩展支持 light/dark/system）
- **修改**：`src/hooks/use-theme.ts`（跟随系统主题）
- **修改**：`src/components/layouts/topbar.tsx`（集成主题切换 + 通知中心）
- **修改**：`src/App.tsx`（应用主题 class 到 html）

**功能**：
1. 主题切换：暗色 / 亮色 / 跟随系统（3 选 1，当前实时切换）
2. 主题选择持久化（localStorage 已有 Zustand persist）
3. 通知中心：点击顶栏铃铛打开右侧 Drawer
4. 通知列表：4 类（系统 / 工单 / 反馈 / 危机），10-15 条 mock
5. 未读计数 badge
6. 标记已读 / 全部已读
7. 点击通知跳转到对应页面
8. 通知过滤 Tab

**子组件拆分**：
- `notification-center.tsx`（主 Drawer）
- `notification-item.tsx`（单条通知）
- `notification-filters.tsx`（顶部 Tab 过滤）

### Subagent 2 · 全局体验（快捷键 + 持久化 + 导出）
**目标**：让产品「可被键盘玩转」「防刷新丢失」「能导出数据」

**文件**：
- **新增**：`src/hooks/use-hotkeys.ts`（全局快捷键 hook）
- **新增**：`src/hooks/use-persist.ts`（通用持久化 hook）
- **新增**：`src/lib/export.ts`（CSV / JSON 导出工具）
- **修改**：`src/stores/chat-store.ts`（**新增**，会话状态 + 持久化）
- **修改**：`src/stores/tickets-store.ts`（**新增**，工单状态 + 持久化）
- **修改**：`src/components/layouts/sidebar.tsx`（集成 ⌘B 切换）
- **修改**：`src/pages/chat/index.tsx`（使用 chat-store）

**功能**：
1. **快捷键**：
   - `⌘K` / `Ctrl+K`：命令面板（已有）
   - `⌘N` / `Ctrl+N`：新建对话（跳到 /chat 并清空）
   - `⌘B` / `Ctrl+B`：切换侧边栏
   - `⌘1-9`：跳到对应页面（1=首页 2=对话 3=记忆 4=监控 5=工单 6=飞轮 7=评估 8=分析 9=技能）
   - `Esc`：关闭弹窗/Drawer
   - `?`：显示快捷键帮助弹窗
2. **持久化**：
   - 会话列表（已选 / 收藏 / 历史）
   - 主题 / 侧边栏（已有）
   - 工单状态变更（v7.3 拖拽后）
3. **导出**：
   - `exportToCSV(data, filename)` 工具
   - `exportToJSON(data, filename)` 工具
   - 在 FeedbackPage / TicketsPage / DataAnalysisPage 等真正可用

### Subagent 3 · 工单拖拽（dnd-kit 集成）
**目标**：让工单看板真正可拖

**文件**：
- **新增**：`src/pages/tickets/draggable-ticket-card.tsx`
- **新增**：`src/pages/tickets/droppable-column.tsx`
- **修改**：`src/pages/tickets/ticket-board.tsx`（集成 dnd-kit）
- **修改**：`src/pages/tickets/index.tsx`（拖拽后状态切换 + toast）
- **修改**：`src/pages/tickets/ticket-stats.tsx`（实时统计）

**功能**：
1. 看板 4 列（待处理/处理中/已完成/已取消）支持卡片拖拽
2. 拖拽到目标列后：
   - 乐观更新（先改 UI）
   - 显示 toast「已将 #CW-1024 移到「处理中」」
   - 状态机校验（不允许的转换自动回弹 + 提示）
3. 拖拽过程视觉反馈：
   - 拖起卡片半透明 + 旋转 2°
   - 目标列高亮边框
   - 鼠标光标 grab/grabbing
4. 状态统计自动更新（顶部 6 个统计卡）
5. 与 Subagent 2 的 tickets-store 集成，状态持久化

### Subagent 4 · 微动效 + 性能优化
**目标**：让产品「流畅且精致」

**文件**：
- **修改**：`vite.config.ts`（chunk 拆分）
- **新增**：`src/lib/motion-presets.ts`（动效预设）
- **修改**：`src/components/layouts/app-shell.tsx`（页面切换动效）
- **修改**：`src/pages/chat/message-bubble.tsx`（消息入场动效）
- **修改**：`src/pages/tickets/ticket-card.tsx`（hover / drag 动效）
- **修改**：`src/pages/memory/memory-card.tsx`（入场动效）
- **修改**：`src/pages/home/event-stream.tsx`（新事件滑入动效）
- **修改**：`src/pages/home/welcome-banner.tsx`（入场 fade-in）

**功能**：
1. **Vite chunk 拆分**：
   - recharts 单独 chunk
   - 每个页面懒加载（按路由分块）
   - 减少初始包大小到 < 600KB
2. **动效**（用 framer-motion 即 motion 库）：
   - 页面切换：淡入 + 轻微上移
   - 卡片 hover：scale 1.02
   - 列表项入场：stagger 0.05s
   - 拖拽中：rotate 2° + scale 1.05
   - toast：spring 弹性
3. **统一动效 token**：避免每个组件写死动画参数

### Subagent 5 · E2E 测试
**目标**：核心路径自动化测试

**文件**：
- **新增**：`playwright.config.ts`
- **新增**：`tests/e2e/home.spec.ts`
- **新增**：`tests/e2e/chat.spec.ts`
- **新增**：`tests/e2e/navigation.spec.ts`
- **新增**：`tests/e2e/theme.spec.ts`
- **修改**：`package.json`（添加 test:e2e 脚本）

**功能**：
1. **Playwright 配置**（Chromium only，先不装浏览器二进制到 CI）
2. **核心测试**：
   - 首页：访问 / 看到欢迎语 + 4 个统计卡
   - 导航：点击侧边栏 4 个核心页面，URL 变化 + 内容渲染
   - 对话：访问 /chat 看到对话列表 + 发送消息
   - 命令面板：按 ⌘K 打开，输入跳转
   - 主题切换：点击切换，html.dark class 变化
3. **scripts**：`test:e2e` 跑 Playwright

---

## 风险与约束

1. **绝不要修改**：`src/components/ui/*` / `src/index.css`
2. **路径**：用 `@/...`，不要相对
3. **类型**：所有 props 显式
4. **dev server**：装完依赖后启动
5. **不要破坏**：v7.2 已有功能

---

## 验证（主进程）

1. `pnpm typecheck` (0 errors)
2. `pnpm lint` (0 errors)
3. `pnpm build`（chunk 拆分后初始包应 < 600KB）
4. dev server 启动，curl `/` 200
5. 主题切换、命令面板、通知中心、拖拽功能手动验证
6. `pnpm test:e2e`（如果浏览器可用）
7. `git commit -m "feat: v7.3 - real-usable upgrade"`
