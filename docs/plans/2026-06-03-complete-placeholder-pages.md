# 补全占位页面 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Goal:** 补全 ProfilePage 中"我的反馈"和"收藏"两个占位 Tab，使其与项目其他页面保持一致的设计质量和交互体验。
> **Architecture:** 遵循 SkillsPage 的设计模式——主入口持有状态，子组件按职责拆分，受控筛选，useMemo 派生过滤，toast 反馈操作。复用已有 UI 组件（Card/Tabs/Badge/Table/Dialog）和 mock 数据。
> **Tech Stack:** React 18 + TypeScript + Tailwind 3.4 + Radix UI + Recharts + Sonner

---

## 现状分析

**3个"占位页面"实际状态：**
- `ServicesPage` — ✅ 已完整实现（搜索、分类Tab、服务卡片网格、状态Badge）
- `ProfilePage` — ⚠️ 部分实现（5个Tab中，"我的反馈"和"收藏"仅占位文本）
- `FeedbackPage` — ✅ 已完整实现（统计、图表、表格、筛选、详情弹窗、导出CSV）

**真正需要补全的：ProfilePage 的 2 个占位 Tab**

---

### Task 1: 补全"我的反馈"Tab

**Files:**
- Modify: `src/pages/ProfilePage.tsx:87-100`（当前占位区域）
- Reference: `src/pages/profile/mock-data.ts`（已有 `myFeedbacks` 数据）
- Reference: `src/pages/feedback/mock-data.ts`（`Feedback` 类型参考）
- Reference: `src/components/ui/badge.tsx`
- Reference: `src/components/ui/card.tsx`

**Step 1: 确认 mock 数据可用性**

已有 `myFeedbacks: FeedbackItem[]`，每条含 `id, conversationTitle, domain, rating, tags, comment, createdAt, status`。数据充分，无需新增。

**Step 2: 实现"我的反馈"Tab 内容**

替换当前占位文本，实现：
- 反馈列表：每条 `Card` 展示 `conversationTitle`、`domain` Badge、星级评分（1-5星）、`tags` Badge 组、`comment` 摘要、`status` Badge（pending=warning, processed=success）、`relativeTime(createdAt)`
- 空状态：无反馈时显示友好提示
- 交互：点击卡片 toast.info 展示详情

**Step 3: 验证渲染**

Run: `pnpm dev` → 访问 `/profile` → 切换到"我的反馈"Tab → 确认列表正常渲染

**Step 4: Commit**

```
git add src/pages/ProfilePage.tsx
git commit -m "feat: 补全 ProfilePage 我的反馈 Tab"
```

---

### Task 2: 补全"收藏"Tab

**Files:**
- Modify: `src/pages/ProfilePage.tsx:101-110`（当前占位区域）
- Reference: `src/pages/profile/mock-data.ts`（已有 `myFavorites` 数据）
- Reference: `src/components/ui/badge.tsx`
- Reference: `src/components/ui/card.tsx`

**Step 1: 确认 mock 数据可用性**

已有 `myFavorites: FavoriteItem[]`，每条含 `id, title, excerpt, domain, createdAt`。数据充分。

**Step 2: 实现"收藏"Tab 内容**

替换当前占位文本，实现：
- 收藏列表：每条 `Card` 展示 `title`、`domain` Badge、`excerpt` 摘要（line-clamp-2）、`relativeTime(createdAt)`
- 操作：每条卡片右侧"取消收藏"按钮（X 图标），点击后从列表移除 + toast.success
- 空状态：收藏为空时显示"暂无收藏内容，点击星标即可收藏"

**Step 3: 验证渲染**

Run: `pnpm dev` → 访问 `/profile` → 切换到"收藏"Tab → 确认列表和取消收藏交互正常

**Step 4: Commit**

```
git add src/pages/ProfilePage.tsx
git commit -m "feat: 补全 ProfilePage 收藏 Tab"
```

---

### Task 3: 类型检查 + 测试验证

**Step 1: 运行类型检查**

Run: `pnpm typecheck`
Expected: 无错误

**Step 2: 运行单元测试**

Run: `pnpm test:run`
Expected: 104+ tests PASS

**Step 3: 最终 Commit（如有修复）**

```
git add -A
git commit -m "fix: 类型检查和测试修复"
```

---

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits
