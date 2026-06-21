# AI Workbench v8 · 借皮主题大规模集成 🚀

> **不重复造轮子 · 借皮不借骨**
>
> AI 协作工作台 · 一站式对话 / 观测 / 工单 / 记忆 · 视觉与交互全部借皮自主流产品

[📦 v8.0.0 Release](https://github.com/haihaihaihai-1/ai-workbench/releases) · [📋 CLAUDE.md](./CLAUDE.md) · [🚀 DEPLOY.md](./DEPLOY.md) · [🎨 借皮手册](./src/styles/README.md)

---

## 🎨 借皮地图（13 场景全覆盖）

| 区域 | 页面 | 借皮对象 | 招牌元素 |
|---|---|---|---|
| **首页** | `/home` | **Vercel + Linear** | 黑底渐变 hero · 大字标题 · 双 CTA · 装饰光斑 |
| **导航壳** | AppShell | **Linear** | 紧凑 · 细边框 · 紫蓝主色 |
| **对话** | `/chat` | **ChatGPT** | 28px 圆角输入框 · 15px 字号 · 浅灰气泡 · 流式光标 |
| **记忆** | `/memory` | **Notion** | 柔阴影 · 衬线标题 · `[[ 双向链接]]` · 弹性动画 |
| **工单** | `/tickets` | **Linear** | 三圆点优先级 ●●● ●●○ ●○○ ○○○ · 4px 状态色条 |
| **监控** | `/monitor` | **Grafana** | 暗仪表盘 · tabular-nums · L1 iframe 嵌入 |
| **服务** | `/services` | **Vercel** | 项目列表行 · 硬阴影 · Deploy 按钮（黑底白字） |
| **个人** | `/profile` | **GitHub** | 53 周 × 7 天贡献热力图 · 大头像 + banner |
| **反馈** | `/feedback` | **Linear** | 紧凑行 · 状态 chip · hover 高亮 |
| **飞轮** | `/flywheel` | **LangSmith** | 红色下划线 · brand 渐变 · 监控 |
| **分析** | `/analysis` | **Mixpanel** | 紫色 #7856FF · 紧凑大数字 |
| **评估** | `/evaluation` | **Langfuse** | 蓝色 #3B82F6 · 监控表格 |
| **技能** | `/skills` | **OpenAI GPT Store** | 绿色渐变 · 紧凑 hero |
| **管理** | `/admin/*` | Linear / Grafana / Vercel | 顶部借皮（users/skills/safety/settings） |

---

## ⚡ 性能突破

| 指标 | v7 | v8 | 提升 |
|---|---|---|---|
| **main bundle** | 5.4 MB | **0.67 MB** | **-88%** |
| **总 bundle** | ~7.2 MB | **~2.5 MB** | **-65%** |
| **phosphor 加载** | 全量 3000+ | 90+ eager + 2900+ lazy | -4.7 MB |
| **simple-icons 加载** | 全量 3000+ | 12 eager + 其余 lazy | 独立 chunk |

---

## 📊 战果

- **19 个 feat 分支** 全部合并到 main
- **13 个借皮页面** 视觉与交互 100% 借皮
- **8000+ 行** 新增代码（业务逻辑改动 0）
- **10 套主题** 一键切换（theme-factory）
- **60+ 品牌图标**（simple-icons）
- **240+ 借皮图标**（Phosphor/Geist/Lucide）
- **Playwright e2e 套件**（19 用例）
- **部署脚本**（deploy.sh + Docker Compose + DEPLOY.md）
- **完整文档**（CLAUDE.md + DEPLOY.md + 借皮手册）

---

## 🚀 快速开始

```bash
# 1. 克隆 & 安装
git clone https://github.com/haihaihaihai-1/ai-workbench.git
cd ai-workbench
pnpm install

# 2. 启动开发服务器
pnpm dev          # → http://127.0.0.1:5173

# 3. 生产构建
pnpm build        # → dist/ (2.5 MB total)

# 4. 预览
pnpm preview
```

---

## 🧪 测试

```bash
pnpm typecheck
pnpm lint
pnpm test:run                                  # Vitest 单元测试
pnpm exec playwright install chromium           # 首次需要
pnpm exec playwright test
```

---

## 🎨 主题切换

10 套主题通过顶栏 ThemePicker 一键切换：

```
arctic-frost       冰蓝钢蓝      modern-minimalist  炭灰极简（默认）
botanical-garden   蕨绿万寿菊    ocean-depths       深海蓝
desert-rose        玫瑰黏土      sunset-boulevard   烧橙紫
forest-canopy      森林绿        tech-innovation    电蓝霓虹（暗）
golden-hour        芥末黄（暗）  midnight-galaxy    深紫宇宙（暗）
```

主题色全部通过 CSS 变量 (`--theme-*`) 注入，业务代码用 `bg-theme / text-theme / font-theme-heading`。

---

## 📦 部署

```bash
sudo apt install -y docker.io docker-compose-v2 openssh-server
ssh-copy-id deploy@your-server

cp .env.production.example .env.production
vim .env.production

REMOTE_HOST=your-server REMOTE_USER=deploy \
  ./deploy.sh production --tag v8.0.0

# 回滚
./deploy.sh production --rollback
```

完整部署指南：[DEPLOY.md](./DEPLOY.md)

---

## 🏗️ 技术栈

### 核心
- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** + **Radix UI**（设计系统底座）
- **Zustand 5**（状态）· **TanStack Query 5**（数据）· **React Router 6**（路由）

### 借皮借的工具
- **Phosphor Icons**（3045+ 图标，借皮主选）· **Geist Icons**（Vercel）· **Lucide React**（兜底）
- **simple-icons**（60+ 品牌 logo）
- **Recharts**（图表）· **cmdk**（命令面板）· **Sonner**（Toast）· **Motion**（动效）

### 借皮技能
- **theme-factory**（ComposioHQ）10 套主题
- **Lobe Chat / Plane / AppFlowy**（开源镜像替代，可部署到自部署子域）

---

## 📁 项目结构

```
ai-workbench/
├── src/
│   ├── components/
│   │   ├── common/          # SafeEmbed 等通用组件
│   │   ├── icons/           # 借皮图标 + 品牌图标系统
│   │   ├── layouts/         # AppShell, Sidebar, Topbar, ThemePicker
│   │   └── ui/              # shadcn/ui 原子组件
│   ├── data/                # L1 iframe 可嵌入资源
│   ├── pages/               # 13 个借皮页面
│   ├── stores/              # Zustand stores
│   ├── styles/
│   │   ├── tokens.css       # 设计 token 基座
│   │   └── themes/          # 10 套主题
│   ├── db/                  # Dexie 索引数据库
│   ├── hooks/               # React Hooks
│   ├── i18n/                # 国际化
│   └── lib/                 # 工具函数 + 类型
├── tests/e2e/               # Playwright 测试
├── scripts/                  # 一次性迁移脚本
├── deploy.sh                 # 远程部署脚本
├── docker-compose.production.yml
├── DEPLOY.md                 # 部署指南
├── CLAUDE.md                 # Claude Code 工作指引
└── README.md                 # 本文件
```

---

## 🔀 Git 工作流

**每个拼图 = 一个独立分支**

```
main  (release/v8-lego)
  ├─ feat/design-tokens-v8        # 设计 token 基座
  ├─ feat/l1-iframe-monitor       # L1 拼图 Grafana iframe
  ├─ feat/icons-borrow-skin       # 借皮图标系统
  ├─ feat/skills-integration      # theme-factory 10 主题
  ├─ feat/l3-linear-tickets       # /tickets Linear 化
  ├─ feat/l3-chatgpt-chat         # /chat ChatGPT 化
  ├─ feat/l3-notion-memory        # /memory Notion 化
  ├─ feat/l3-vercel-services      # /services Vercel 化
  ├─ feat/l3-github-profile       # /profile GitHub 化
  ├─ feat/brand-icons             # simple-icons 品牌图标
  ├─ feat/l3-linear-feedback      # /feedback Linear 化
  ├─ feat/l3-langsmith-flywheel   # /flywheel LangSmith 化
  ├─ feat/l3-mixpanel-analysis    # /analysis Mixpanel 化
  ├─ feat/l3-langfuse-evaluation  # /evaluation Langfuse 化
  ├─ feat/deploy-scripts          # 部署脚本
  ├─ feat/l3-admin-pages          # 4 admin 页面借皮
  ├─ feat/l3-gpt-store-skills     # /skills OpenAI GPT Store 化
  ├─ feat/brand-icons-dynamic     # simple-icons 动态加载
  ├─ feat/e2e-tests               # Playwright e2e 套件
  ├─ feat/phosphor-dynamic        # phosphor 动态加载
  └─ feat/l3-vercel-home          # /home Vercel+Linear 化
```

---

## 🌐 借皮方法论（3 条铁律）

1. **不重复造轮子**：所有功能/视觉/交互从主流产品或开源项目拿
2. **借皮不借骨**：抄视觉规范 + 交互模式（颜色/字体/动画/快捷键），代码自己写
3. **大规模推进**：每个改动是独立 git 分支，可独立 review/回滚/合并

**借皮层级**：
- L1 真 iframe：嵌入公共页面（status/docs）
- L2 镜像自部署：开源项目 Docker 部署后嵌自己子域
- **L3 深借皮**：抄视觉 + 交互，重写代码（主流）
- L4 自研：兜底

---

## 🤝 借皮对象与替代

| 借皮 | 开源替代（可自部署） |
|---|---|
| ChatGPT | [Lobe Chat](https://github.com/lobehub/lobe-chat) |
| Notion | [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) |
| Linear | [Plane](https://github.com/makeplane/plane) |
| Grafana | [Grafana OSS](https://github.com/grafana/grafana) |
| Langfuse | [Langfuse](https://github.com/langfuse/langfuse) |

---

## 📚 知识库

- [CLAUDE.md](./CLAUDE.md) — Claude Code 工作指引（含借皮映射、token 体系）
- [DEPLOY.md](./DEPLOY.md) — 部署指南
- [src/styles/README.md](./src/styles/README.md) — 借皮手册
- `../skill-sources/` — GitHub 拉取的 862+ skill 源（ComposioHQ / Jeffallan / alirezarezvani）

---

## 📝 License

MIT © 2026 AI Workbench

---

## 🏆 Credits

- 借皮对象：Linear · Notion · Vercel · Grafana · GitHub · ChatGPT · LangSmith · Mixpanel · Langfuse · OpenAI
- 图标：Phosphor Icons · Geist UI · Lucide · Simple Icons
- 主题：ComposioHQ `theme-factory`
- 部署：Docker · nginx · Watchtower

🤖 **AI Workbench v8 · 借皮不借骨 · 拼图式前端工作台**
