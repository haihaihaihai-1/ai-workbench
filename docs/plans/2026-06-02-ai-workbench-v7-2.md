# AI Workbench v7.2 实施计划

> 目标：把 v7.1 留下的 13 个占位页面全部升级为完整实现。

**前置状态**：v7.1 已完成（commit d00af63），4 核心页面 + 设计系统 + 全局布局 + 路由就绪。

---

## 全局设计规范（v7.2 必读）

### 视觉
- 主色 `#5E6AD2` 线性紫（已在 `src/index.css` 配好 token）
- 暗色默认，支持 `next-themes` 切换
- 圆角 6-12px、阴影极轻、间距 4-8 节奏

### 已有设计系统（直接复用，不要重写）
- `src/components/ui/*` 17 个原子组件（Button/Input/Card/Dialog/Table/Tabs/Tooltip/Popover/Select/Switch/Checkbox/Avatar/Badge/ScrollArea/Separator/Progress/Textarea/Command/CommandDialog/DropdownMenu/Sonner）
- `src/lib/utils.ts`（`cn` / `formatDate` / `relativeTime` / `shortNumber` / `percent` / `randomId`）
- `src/lib/types.ts`（共用类型 AgentDomain/ChatMessage/Ticket/Memory 等）
- 图表：`recharts` 已装
- 图标：`lucide-react`

### 已有状态管理
- Zustand 5（`src/stores/theme-store.ts` / `sidebar-store.ts`）
- 已有 `useThemeStore`、`useSidebarStore`

### Mock 数据规范
- 每个页面单独 `mock-data.ts`，**禁止复用其他页面的 mock**
- 数据规模：5-20 条样本，覆盖各种状态
- 时间为 `Date.now()` 相对值，不要硬编码日期
- 颜色用 Tailwind token 语义类（`text-info` / `text-success` / `text-warning` / `text-destructive` / `text-primary`），不要硬编码 hex

### 页面结构
- 顶部 `<header>`：图标 + 标题 + 描述 + 工具栏
- 中部：核心内容（卡片 + 图表 + 表格）
- 避免单文件超过 500 行，**子组件拆到 `./xxx-component.tsx`**

### 验收标准（每个页面）
- ✅ `pnpm typecheck` 通过
- ✅ `pnpm lint` 通过
- ✅ 视觉与 4 核心页面一致（暗色、间距、圆角）
- ✅ 含 mock 数据可立即看到效果
- ✅ 交互（筛选/搜索/切换/详情）完整可用

---

## 13 页面分配

### Subagent 1 · 用户前台 4 页面
- **HomePage**（`/`）：工作台仪表盘（今日活跃/总会话/平均响应 + 最近对话 + 待办工单 + 飞轮健康度 + 实时事件流 + 快捷入口）
- **ServicesPage**（`/services`）：4 大分类服务卡片（学业/心理/教务/生活，每类 5-6 个服务）
- **ProfilePage**（`/profile`）：个人中心（我的对话/反馈/收藏/使用统计 Tab 切换）
- **FeedbackPage**（`/feedback`）：反馈列表 + 评分分布 + 详情弹窗 + 状态管理

### Subagent 2 · 数据分析 3 页面
- **FlywheelPage**（`/flywheel`）：飞轮健康度 + 意图覆盖 + 新意图发现 + 工具健康度 + 优化建议生成器
- **EvaluationPage**（`/evaluation`）：离线评估 + 测试集管理 + 质量/路由/危机识别指标 + 详细表格
- **DataAnalysisPage**（`/analysis`）：用户活跃度 + Agent 路由 + 反馈分析 + 意图分布

### Subagent 3 · 资源管理 3 页面
- **SkillsPage**（`/skills`）：技能市场（卡片网格 + 详情 + 安装）
- **UsersPage**（`/admin/users`）：用户列表 + 角色 + 状态 + 筛选
- **AdminSkillsPage**（`/admin/skills`）：技能管理（管理员视角，CRUD + 权限）

### Subagent 4 · 后台运维 2 页面
- **SafetyPage**（`/admin/safety`）：安全监控（PII/提示注入/内容违规，统计 + 事件表 + 趋势图）
- **SettingsPage**（`/admin/settings`）：系统设置（AI 模型 + 通知 + 服务状态监控）

### Subagent 5 · 用户画像 1 页面
- **UserProfilePage**（`/memory/profile/:userId`）：用户画像详情（兴趣/活跃/情绪/学习风格 + 记忆 + 趋势图）

---

## 风险与约束

1. **路径一致性**：用 `@/...` 别名，不要相对路径
2. **类型安全**：所有 props 显式类型，不要 `any`
3. **不要重写现有组件**：从 `@/components/ui/*` 导入
4. **不要修改 `src/components/ui/*` 或 `src/index.css`**：设计系统已定
5. **dev server 持续运行**：subagent 修改文件后会自动 HMR

---

## 验证

最后由我（主进程）做：
1. `pnpm typecheck`（必须 0 errors）
2. `pnpm lint`（必须 0 errors）
3. `pnpm build`（必须成功）
4. curl `http://127.0.0.1:5173/` 验证 200
5. 逐页 review 子组件拆分合理性
6. 修复可能的 subagent 间冲突
7. `git commit -m "feat: v7.2 - 13 pages complete implementation"`
