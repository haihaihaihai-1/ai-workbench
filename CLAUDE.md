# CLAUDE.md

AI Workbench · Claude Code 工作指引

---

## 🎯 项目目标

打造**主流产品的拼装式前端工作台**。**不重复造轮子**，**借皮不借骨** —— 从 Linear/Notion/Vercel/Grafana/ChatGPT/GitHub 借视觉与交互，从开源项目借功能模块。

---

## 🧩 已集成的 Skill（来自 GitHub）

所有 skill 源仓库位于 `../skill-sources/`，本项目已落地的有：

| Skill | 来源 | 集成位置 | 状态 |
|---|---|---|---|
| **`theme-factory`** | ComposioHQ/awesome-claude-skills | `src/styles/themes/` · 10 套主题 | ✅ |
| **`artifacts-builder`** | ComposioHQ | （按需参考） | 📋 |
| **`webapp-testing`** | ComposioHQ | （Playwright 已用） | 📋 |
| **`brand-guidelines`** | Anthropic 官方 | token 体系参考 | 📋 |
| **`mcp-builder`** | ComposioHQ | （按需参考） | 📋 |
| **`skill-creator`** | ComposioHQ | 写新 skill 用 | 📋 |
| **66 个 fullstack skill** | Jeffallan/claude-skills | 知识库（未集成） | 📚 |
| **763 个领域 skill** | alirezarezvani/claude-skills | 知识库（未集成） | 📚 |

### theme-factory 集成详情

10 套预制主题，切换器在顶栏：

- `arctic-frost` 冰蓝钢蓝
- `botanical-garden` 蕨绿万寿菊
- `desert-rose` 玫瑰黏土
- `forest-canopy` 森林绿
- `golden-hour` 芥末黄（暗）
- `midnight-galaxy` 深紫宇宙（暗）
- `modern-minimalist` 炭灰极简（默认）
- `ocean-depths` 深海蓝
- `sunset-boulevard` 烧橙紫
- `tech-innovation` 电蓝霓虹（暗）

**使用方法**：
```tsx
// 切换主题
import { applyTheme } from "@/styles/themes";
applyTheme("midnight-galaxy");

// 读取当前主题色
<div style={{ background: "var(--theme-primary)" }} />

// 使用 utility class
<div className="bg-theme-surface text-theme" />
```

---

## 🏗️ 项目结构

```
ai-workbench/
├── src/
│   ├── components/
│   │   ├── common/         # 通用组件 (SafeEmbed 等)
│   │   ├── icons/          # 借皮图标系统 (phosphor + geist + lucide)
│   │   ├── layouts/        # AppShell, Sidebar, Topbar, ThemePicker...
│   │   └── ui/             # shadcn/ui 原子组件
│   ├── data/
│   │   └── embeds.ts       # L1 iframe 可嵌入资源清单
│   ├── pages/              # 17 个页面（4 核心 + 13 占位）
│   ├── stores/             # Zustand stores
│   ├── styles/
│   │   ├── tokens.css      # 设计 token 基座 (品牌色/字体/缓动/阴影)
│   │   ├── README.md       # 借皮手册
│   │   └── themes/         # 10 套主题 (theme-factory)
│   ├── db/                 # Dexie 索引数据库
│   ├── hooks/
│   ├── i18n/
│   └── lib/
├── scripts/                # 一次性迁移/工具脚本
├── public/
├── docs/
├── Dockerfile + docker-compose.yml
├── nginx.conf
└── playwright.config.ts / vitest.config.ts
```

---

## 🎨 设计 token 体系

**核心入口**：`src/styles/tokens.css` + `src/styles/README.md`

### 借皮映射（方案 B · 分场景借皮）

| 场景 | 借皮 | 招牌特征 |
|---|---|---|
| 全局壳 | Linear | 紧凑、细边框、紫蓝主色 |
| `/chat` | ChatGPT | 极简白/灰、圆角 2xl 气泡 |
| `/memory` | Notion | 柔阴影、纸感、衬线标题 |
| `/tickets` | Linear | 看板紧凑、状态色块 |
| `/monitor` | Grafana | 暗仪表盘、tabular-nums |
| `/services` | Vercel | 黑高对比、Geist 字体 |
| `/profile` | GitHub | 贡献热力图、卡片 |
| `/admin/*` | Vercel | 暗色管理面板 |
| `/flywheel` | Linear + LangSmith | 表格+图表 |
| `/analysis` | Mixpanel | 折线/漏斗 |
| `/evaluation` | Langfuse | trace 时间轴 |

### Tailwind 拓展

- 颜色：`brand-50..950` / `neutral-0..1000` / `color-red..rose`
- 圆角：`xs/sm/md/lg/xl/2xl/full`
- 阴影：`xs/sm/md/lg/xl/notion/vercel/linear/grafana`
- 字体：`sans/display/mono/serif`
- 缓动：`ease-linear-app/spring/apple/vercel/chatgpt`
- 动画：`animate-fade-in/slide-up/scale-in`
- 主题：`bg-theme/text-theme/font-theme-heading`

---

## 🖼️ 图标系统

**核心入口**：`src/components/icons/index.tsx`

业务方统一从 `@/components/icons` 导入：

```tsx
import { IconHome, IconActivity, IconChatCircle } from "@/components/icons";

<IconHome className="h-4 w-4" />
<IconActivity skin="chatgpt" weight="duotone" />  // 强制借皮
```

底层：Phosphor (3000+) → Geist (Vercel) → Lucide (fallback)

---

## 🪟 L1 iframe 拼图

**核心组件**：`src/components/common/SafeEmbed.tsx`

可嵌入资源清单：`src/data/embeds.ts`

接入位置：`/monitor` → "Grafana Live" 标签

---

## 🚀 开发命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动 dev server (http://127.0.0.1:5173)
pnpm build          # 生产构建
pnpm typecheck      # TypeScript 检查
pnpm test           # Vitest 单元测试
pnpm test:e2e       # Playwright e2e
pnpm lint           # Biome check
pnpm lint:fix       # Biome auto-fix
```

---

## 🌿 Git 工作流

每个"拼图" = 一个独立分支 + commit + 推送：

```
main
├── feat/design-tokens-v8      # Phase 0 · token 基座
├── feat/l1-iframe-monitor     # L1 拼图 1 · Grafana iframe
├── feat/icons-borrow-skin     # 借皮图标系统
├── feat/skills-integration    # skill 集成
├── feat/l3-linear-tickets     # L3 · /tickets Linear 化
├── feat/l3-chatgpt-chat       # L3 · /chat 化
├── feat/l3-notion-memory      # L3 · /memory 化
├── feat/l3-vercel-services    # L3 · /services 化
└── feat/l3-github-profile     # L3 · /profile 化
```

合并用 PR（GitHub 流程）。

---

## 📦 远程服务器部署（待办）

- 已有 `Dockerfile` + `docker-compose.yml` + `nginx.conf`
- 推荐平台：Cloudflare Pages / Vercel（零成本）/ 自建服务器（Dokploy）
- 镜像自部署：Plane / Grafana / Lobe Chat / AppFlowy（替代对应借皮页面的 iframe）

---

## 📚 知识库

- `../skill-sources/awesome-claude-skills/` · 33 个 skill
- `../skill-sources/jeffallan/` · 66 个 fullstack skill
- `../skill-sources/alirezarezvani/` · 763 个领域 skill
- `../skill-sources/awesome-claude-skills/SKILLS_GUIDE.md`（Jeffallan） · 19KB 创作指南

按需查，按需集成。

---

## ⚠️ 注意事项

- **不重复造轮子**：新功能先看主流开源项目有没有现成的
- **借皮不借骨**：抄视觉与交互，代码自己写
- **token 优先**：所有色彩/字体/阴影/缓动都用 token，不要写死
- **图标统一入口**：只用 `@/components/icons`，不直接 import phosphor/geist/lucide
- **每个拼图独立分支**：方便 review 与回滚
