# AI Workbench v7

> AI 协作工作台 · 一站式对话 / 观测 / 工单 / 记忆

融合 7 大参考站成熟机制：ChatGPT · Claude · Notion AI · Cursor · Perplexity · Grafana · Linear · Mem · Zendesk · 通义 · 智谱

## 技术栈

- Vite 5 + React 18 + TypeScript 5
- Tailwind 3.4 + Radix UI（设计系统）
- Zustand 5（状态）
- TanStack Query 5（数据）
- cmdk（Cmd+K 命令面板）
- Recharts（图表）
- React Router 6（路由）
- Sonner（Toast）
- Lucide（图标）
- Biome（Lint + Format）

## 快速开始

```bash
pnpm install
pnpm dev          # 启动 http://127.0.0.1:5173
pnpm build        # 生产构建
pnpm preview      # 预览生产构建
pnpm lint         # Lint 检查
pnpm typecheck
pnpm test:e2e     # Playwright E2E 测试
```

## 目录结构

```
src/
├── components/
│   ├── ui/            # 原子组件（设计系统）
│   ├── layouts/       # 全局布局
│   ├── chat/          # 对话相关
│   ├── monitor/       # 监控相关
│   ├── tickets/       # 工单相关
│   └── memory/        # 记忆相关
├── pages/             # 17 页面
├── stores/            # Zustand
├── hooks/             # 自定义 Hooks
├── lib/               # 工具
├── db/                # Supabase
└── routes.tsx
```

## 17 页面

### 核心 4 页面（v1 完整实现）
- 💬 `/chat` 对话工作台 — ChatGPT + Notion AI + Perplexity
- 📊 `/monitor` 可观测中心 — Grafana + Datadog + Langfuse
- 🎫 `/tickets` 工单中心 — Linear + Zendesk
- 🧠 `/memory` 记忆中心 — Mem + Notion

### 辅助 13 页面（v1 占位）
- 🏠 `/` 首页
- 🛠 `/services` 服务大厅
- 👤 `/profile` 个人中心
- 🔬 `/flywheel` 数据飞轮
- 🧪 `/evaluation` 评估中心
- 📈 `/analysis` 数据分析
- 🛒 `/skills` 技能市场
- 👥 `/admin/users` 用户管理
- 🔒 `/admin/safety` 安全监控
- ⚙️ `/admin/settings` 系统设置
- 🤖 `/admin/skills` 技能管理
- 👤 `/memory/profile/:userId` 用户画像
- ❌ 404

## 视觉系统

- **主色**：`#5E6AD2` 线性紫
- **强调**：`#10B981` 绿 / `#F59E0B` 琥珀 / `#EF4444` 玫红
- **默认主题**：暗色
- **字体**：Inter + 思源黑体 + JetBrains Mono

## 文档

- [设计文档](docs/DESIGN.md)
- [架构文档](docs/ARCHITECTURE.md)
- [实施计划](docs/plans/2026-06-02-ai-workbench-v7.md)

## E2E 测试

使用 [Playwright](https://playwright.dev) 覆盖核心路径（导航 / 首页 / 对话 / 命令面板 / 主题切换）。

```bash
# 首次运行需要安装浏览器二进制（约 200MB）
pnpm exec playwright install chromium

# 跑全部 E2E（自动启动 pnpm dev 作为 webServer）
pnpm test:e2e

# 打开 Playwright UI 调试
pnpm test:e2e:ui
```

测试位于 `tests/e2e/`，配置见 `playwright.config.ts`：
- `testDir: ./tests/e2e` — 测试目录
- `baseURL: http://127.0.0.1:5173` — Vite dev server
- `webServer: pnpm dev` — 自动启动 + 复用现有 server
- 失败时自动保留 trace / 截图
