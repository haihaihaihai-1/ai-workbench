# AI Workbench v7 实施计划

> **For Claude:** 本计划是 v7 项目从零到完整脚手架 + 4 核心页面的实施指南。

**Goal**: 在 `E:\我的世界java测试版\ai-workbench` 下创建独立的 React + TS + Vite + Supabase 项目，融合 7 大参考站机制，实现 17 页面框架（4 核心 + 13 占位），全套暗色主题，#5E6AD2 线性紫主色。

**Architecture**: 客户端单页应用 + Supabase BaaS + SSE 流式响应 + Zustand 状态 + TanStack Query 数据层 + Radix UI + Tailwind 设计系统。采用"原子组件 → 复合组件 → 页面"三层架构。

**Tech Stack**: Vite 5 + React 18 + TypeScript 5.9 + Tailwind 3.4 + Radix UI + Zustand 5 + TanStack Query 5 + cmdk + dnd-kit + Recharts + ECharts + Lucide + biome + Vitest

---

## Task 1: 项目脚手架

**Files**:
- `package.json`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.js`
- `biome.json`
- `index.html`
- `.gitignore`
- `.env.example`
- `README.md`

**Step 1**: 写完所有配置文件，包含正确的依赖与脚本。

**Step 2**: 跑 `pnpm install` 验证依赖解析正确。

**Step 3**: 跑 `pnpm dev` 验证 Vite 启动。

---

## Task 2: 设计系统（原子组件库）

**Files**:
- `src/index.css`（CSS Variables、字体、基础）
- `src/lib/utils.ts`（cn 函数）
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/command.tsx`（Cmd+K 面板）
- `src/components/ui/sonner.tsx`（Toast）

---

## Task 3: 全局布局

**Files**:
- `src/components/layouts/sidebar.tsx`（导航 + 工作区 + 用户）
- `src/components/layouts/topbar.tsx`（搜索 + 通知 + 主题切换）
- `src/components/layouts/command-palette.tsx`（Cmd+K）
- `src/components/layouts/app-shell.tsx`（外层容器）
- `src/components/layouts/nav-config.ts`（导航配置）

---

## Task 4: 状态管理 + 数据层

**Files**:
- `src/stores/theme-store.ts`（主题切换）
- `src/stores/sidebar-store.ts`（侧边栏折叠）
- `src/db/supabase.ts`（Supabase 客户端 mock）
- `src/lib/types.ts`（共用类型）

---

## Task 5: 核心页面 1 — 💬 对话工作台

**Files**:
- `src/pages/chat/index.tsx`（主页面）
- `src/pages/chat/conversation-list.tsx`（左侧会话列表）
- `src/pages/chat/message-bubble.tsx`（消息气泡）
- `src/pages/chat/trace-panel.tsx`（右侧工具调用面板）
- `src/pages/chat/sources-panel.tsx`（Perplexity 风格引用）
- `src/pages/chat/agent-switcher.tsx`（顶部 Agent 切换）
- `src/pages/chat/composer.tsx`（输入区 + 推荐问题）
- `src/pages/chat/streaming-mock.ts`（流式输出 mock）

**融合机制**:
- ChatGPT：流式打字机 / 模型切换 / 追问 chips
- Notion AI：Cmd+K / Slash 命令
- Perplexity：Sources 侧栏 / 引用溯源
- Liner：推荐问题 / 思考链
- 国内助手：领域 Agent 路由（学术/心理/教务/通用）
- v6 延续：工具调用可视化 / HITL 危机干预

---

## Task 6: 核心页面 2 — 📊 可观测中心

**Files**:
- `src/pages/monitor/index.tsx`
- `src/pages/monitor/metric-card.tsx`（顶部实时指标卡）
- `src/pages/monitor/timeseries-chart.tsx`（时序图）
- `src/pages/monitor/agent-distribution.tsx`（Agent 路由饼图）
- `src/pages/monitor/llm-trace.tsx`（LLM 调用追踪）
- `src/pages/monitor/tool-health.tsx`（工具健康度 TOP N）
- `src/pages/monitor/safety-panel.tsx`（PII/提示注入）
- `src/pages/monitor/refresh-control.tsx`（30s 自动刷新）

**融合机制**:
- Grafana：实时指标 / 时序图 / TOP N / 模板变量
- Datadog：SLO / 性能监控 / 火焰图入口
- Langfuse：LLM Trace / 工具调用链路
- v6 延续：QPS/延迟/错误率/Agent 路由

---

## Task 7: 核心页面 3 — 🎫 工单中心

**Files**:
- `src/pages/tickets/index.tsx`
- `src/pages/tickets/ticket-list.tsx`（列表视图）
- `src/pages/tickets/ticket-board.tsx`（看板视图）
- `src/pages/tickets/ticket-card.tsx`（工单卡片）
- `src/pages/tickets/ticket-detail.tsx`（详情抽屉）
- `src/pages/tickets/ticket-filters.tsx`（筛选器）
- `src/pages/tickets/ticket-stats.tsx`（顶部统计）
- `src/pages/tickets/sla-indicator.tsx`（SLA 倒计时）
- `src/pages/tickets/mock-data.ts`

**融合机制**:
- Linear：状态机 / 优先级 / 看板 / 列表双视图
- Zendesk：SLA 倒计时 / 自动路由 / 关联会话
- Jira：评论历史 / @协作
- v6 延续：HITL 升级 / 危机干预 / 投诉反馈

---

## Task 8: 核心页面 4 — 🧠 记忆中心

**Files**:
- `src/pages/memory/index.tsx`
- `src/pages/memory/memory-timeline.tsx`（时间线视图）
- `src/pages/memory/memory-card.tsx`（记忆卡片）
- `src/pages/memory/memory-editor.tsx`（新增/编辑）
- `src/pages/memory/memory-filters.tsx`（类型/标签/搜索）
- `src/pages/memory/memory-stats.tsx`（统计）
- `src/pages/memory/profile-panel.tsx`（用户画像侧栏）
- `src/pages/memory/mock-data.ts`

**融合机制**:
- Mem：事实/偏好/事件/技能分类 / 时间线 / 合并去重
- Notion：标签 / 搜索 / 全局命令面板
- Rewind：跨会话召回 / 隐私删除
- v6 延续：用户画像 / 活跃时段 / 情绪趋势

---

## Task 9: 占位页面（13 个）

**Files**:
- `src/pages/_placeholder.tsx`（通用占位）
- 13 个占位页面（flywheel / evaluation / data-analysis / skills / admin/* / home / services / profile / sample / not-found / tickets 占位 → 实际做）/ profile / analysis / monitor(实际做) / tickets(实际做)

实际：home / services / profile / data-analysis / flywheel / evaluation / admin/users / admin/skills / admin/safety / admin/settings / skills-market / user-profile / not-found

---

## Task 10: 路由 + 入口

**Files**:
- `src/routes.tsx`
- `src/App.tsx`
- `src/main.tsx`
- `src/global.d.ts`

---

## Task 11: 验证

- `pnpm install`
- `pnpm lint`（biome + typecheck）
- `pnpm build`
- 启动 dev 服务器，确保 17 页面可访问

---

## 验收标准

1. ✅ `pnpm i && pnpm dev` 一键启动
2. ✅ 17 页面全部存在
3. ✅ 4 核心页面（对话/可观测/工单/记忆）100% 完成
4. ✅ 暗色主题默认，亮色可切换
5. ✅ Cmd+K 打开命令面板
6. ✅ Lint + TypeCheck 通过
7. ✅ Build 通过
