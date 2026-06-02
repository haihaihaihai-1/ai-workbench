# AI Workbench v7.5 实施计划

> 目标：**工程质量 + 部署就绪** —— 单元测试 + IndexedDB + CI/CD + Docker + Storybook（部分）

**前置状态**：v7.4 已完成（commit `706bbef`），17 页面 + i18n + PWA + 移动端。

---

## 规范

### 绝不动
- `src/components/ui/*`（17 原子组件）
- `src/index.css`
- 已有 mock data / 业务页面（除非需要持久化集成）

### 已装依赖
- `vitest` `4.1.8` + `@testing-library/react` `16.3.2` + `@testing-library/jest-dom` + `jsdom`
- `dexie`（待装）

### 暂不装（网络问题）
- Storybook（依赖太多）+ `vite-plugin-pwa`（已手写 PWA）+ `@vitest/ui`（暂用 vitest 终端）
- Dexie 已装

---

## 5 大主题（5 subagent 并行）

### Subagent 1 · Vitest 单元测试
**目标**：关键模块 80% 覆盖率

**文件**：
- **新增** `vitest.config.ts`（或合并到 vite.config）
- **新增** `tests/setup.ts`（jsdom + jest-dom）
- **新增** `src/lib/utils.test.ts`（cn / formatDate / relativeTime / shortNumber / percent / randomId）
- **新增** `src/stores/theme-store.test.ts`
- **新增** `src/stores/sidebar-store.test.ts`
- **新增** `src/stores/chat-store.test.ts`
- **新增** `src/stores/tickets-store.test.ts`
- **新增** `src/hooks/use-media-query.test.ts`
- **新增** `src/hooks/use-hotkeys.test.ts`
- **新增** `src/hooks/use-notifications.test.ts`
- **新增** `src/lib/export.test.ts`
- **新增** `src/lib/motion-presets.test.ts`
- **修改** `package.json`：添加 `test` / `test:run` / `test:coverage` scripts

**功能**：
- 单元测试覆盖：utils / stores / hooks
- 集成测试：可选（不强制）
- 覆盖率报告：可选
- vitest config 用 jsdom 环境

### Subagent 2 · Storybook 组件文档
**目标**：17 原子组件可独立预览

**注意**：Storybook 网络问题暂不装。**改用替代方案**：
- **新增** `docs/COMPONENTS.md` 组件文档（手动 Markdown）
- 包含每个组件的：用途、Props、用法示例、可视化（占位说明）
- 或者用 `histoire`（轻量 Storybook 替代）/ `react-doc-gen` 自动生成

**或者**直接放弃 Storybook，做更好的事情：**README + 组件示例 gallery**（一个 /design-system 路由）

让我评估下，最终决定：做 `/design-system` 路由作为 Storybook 替代。
- 路由 `/design-system`
- 展示 17 个原子组件，每个有 Props 表 + 用法示例 + 实时预览
- dark/light 主题切换
- 这是更有用的"组件文档"，不依赖额外依赖

**Subagent 2 重新定义为：实现 /design-system 路由**

**文件**：
- **新增** `src/pages/DesignSystemPage.tsx`（主页面）
- **新增** `src/pages/design-system/component-section.tsx`
- **新增** `src/pages/design-system/theme-tokens.tsx`（设计 token 展示）
- **新增** `src/pages/design-system/sidebar-nav.tsx`
- **修改** `src/routes.tsx`：加 `/design-system` lazy 路由
- **修改** `src/components/layouts/sidebar.tsx` 和 `nav-config.tsx`：加导航项
- **修改** `src/i18n/locales/zh.json` + `en.json`：加翻译

### Subagent 3 · GitHub Actions CI/CD
**目标**：每次 push 自动跑 lint + typecheck + test + build

**文件**：
- **新增** `.github/workflows/ci.yml`
- **新增** `.github/workflows/release.yml`（可选）
- **新增** `.github/dependabot.yml`（可选）
- **修改** `README.md`：加 CI badge

**功能**：
- **ci.yml**：
  - 触发：push / pull_request 到 main
  - 矩阵：Node 20 / 22
  - 步骤：checkout → setup-node → pnpm install → lint → typecheck → test → build
  - 上传 coverage 报告（如有）
  - 缓存：pnpm store

### Subagent 4 · Docker 化
**目标**：生产可部署 Docker 镜像

**文件**：
- **新增** `Dockerfile`（多阶段构建）
- **新增** `docker-compose.yml`
- **新增** `docker/.dockerignore`
- **新增** `nginx.conf`（SPA fallback）
- **修改** `package.json`：添加 docker scripts（`docker:build` / `docker:run`）
- **修改** `README.md`：加 Docker 部署说明

**功能**：
- **Dockerfile**（多阶段）：
  - Stage 1: deps（pnpm install）
  - Stage 2: build（pnpm build）
  - Stage 3: runtime（nginx alpine + 静态文件）
- 暴露端口 80
- SPA fallback：所有路由 → index.html
- 缓存 headers + gzip

### Subagent 5 · IndexedDB 持久化（Dexie）
**目标**：会话 / 记忆 / 工单数据真实持久化到 IndexedDB

**文件**：
- **新增** `src/db/dexie.ts`（Dexie 实例 + schema）
- **新增** `src/hooks/use-dexie-store.ts`（Dexie ↔ React 同步 hook）
- **修改** `src/stores/chat-store.ts`（Dexie 持久化）
- **修改** `src/stores/tickets-store.ts`（Dexie 持久化）
- **新增** `src/pages/memory/mock-data.ts` 改造（可选，用 Dexie 替代 localStorage）

**功能**：
- Dexie 数据库 `ai-workbench`：
  - Table `conversations` (id, title, domain, updatedAt, pinned, messageCount)
  - Table `messages` (id, conversationId, role, content, agent, createdAt)
  - Table `memories` (id, type, content, tags, confidence, source, createdAt, pinned)
  - Table `tickets` (id, code, title, status, priority, ...)
  - Table `tickets_overrides` (id, status, priority, assignee)
  - Table `notifications` (id, type, title, read)
- 迁移：把现有 localStorage 数据平滑迁移到 IndexedDB
- 大数据存 IndexedDB，元数据（设置）存 localStorage

---

## 风险与约束

1. **Subagent 1** 可能在 `src/stores/theme-store.test.ts` 等与 Subagent 2-5 范围重叠，**注意边界**
2. **Subagent 2** 改 routes.tsx 可能与之前冲突
3. **Subagent 5** 改 store 内部，**保留 API 兼容**（避免影响使用 store 的页面）

---

## 验证

1. `pnpm typecheck` (0 errors)
2. `pnpm lint` (0 errors)
3. `pnpm test` (新单元测试通过)
4. `pnpm build` 成功
5. dev server 200
6. `pnpm test --coverage` 覆盖率报告
7. 提交 v7.5
