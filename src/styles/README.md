# Design Tokens · 借皮手册（v8 Lego System）

> 集中所有"借皮"参数。每张拼图分支只改本目录文件，组件零改动。

## 文件

- `tokens.css` — 所有 CSS 变量（颜色/字体/阴影/缓动/间距）
- `../index.css` — Tailwind 入口，已 `@import` 本文件
- `../../tailwind.config.js` — Tailwind 拓展，把 token 暴露成 class

## 借皮映射（方案 B · 分场景借皮）

| 场景 | 页面 | 借皮对象 | 招牌特征 |
|---|---|---|---|
| 全局壳 | — | **Linear** | 紧凑、细边框、紫蓝主色、`cubic-bezier(0.25,0.1,0.25,1)` |
| 对话 | `/chat` | **ChatGPT** | 极简白/灰、圆角 2xl 气泡、`cubic-bezier(0.165,0.84,0.44,1)` |
| 记忆 | `/memory` | **Notion** | 柔阴影、纸感、衬线标题、spring 弹性 |
| 工单 | `/tickets` | **Linear** | 看板紧凑、状态色块、键盘流 |
| 监控 | `/monitor` | **Grafana** | 暗仪表盘、密度高、tabular-nums |
| 服务 | `/services` | **Vercel** | 黑高对比、Geist（占位 Inter Display）、硬阴影 |
| 个人 | `/profile` | **GitHub** | 贡献热力图、卡片 |
| 管理 | `/admin/*` | **Vercel** | 暗色管理面板 |
| 飞轮 | `/flywheel` | Linear + LangSmith | 表格+图表混排 |
| 分析 | `/analysis` | Mixpanel | 折线/漏斗/分布 |
| 评估 | `/evaluation` | Langfuse | 表格密集、trace 时间轴 |

## Tailwind 拓展一览

### 颜色

```tsx
// 品牌
className="bg-brand-500 text-white"

// 中性（监控/管理面板用）
className="bg-neutral-900 text-neutral-50"

// 借皮快捷
className="text-linear-primary"
className="bg-grafana-panel shadow-grafana"
```

### 圆角

```tsx
className="rounded-xs | rounded-sm | rounded | rounded-md | rounded-lg | rounded-xl | rounded-2xl"
```

### 阴影

```tsx
className="shadow-xs | shadow-sm | shadow | shadow-md | shadow-lg | shadow-xl"
className="shadow-notion | shadow-vercel | shadow-linear | shadow-grafana"
```

### 字体

```tsx
className="font-sans"     // Inter
className="font-display"  // Inter Display
className="font-mono"     // JetBrains Mono
className="font-serif"    // Source Serif Pro
```

### 缓动 / 持续时间

```tsx
className="ease-linear-app | ease-spring | ease-apple | ease-vercel | ease-chatgpt"
className="duration-instant | duration-fast | duration-base | duration-slow | duration-slower | duration-vercel"
```

### 动画

```tsx
className="animate-fade-in | animate-slide-up | animate-scale-in"
```

### 借皮辅助

```tsx
// Linear
className="text-linear-display ring-linear"

// Notion
className="text-notion-title shadow-notion ease-spring ring-notion"

// ChatGPT
className="text-chatgpt-bubble ease-chatgpt ring-chatgpt"

// Vercel
className="text-vercel-mono shadow-vercel ring-vercel"

// Grafana
className="bg-grafana-panel shadow-grafana font-mono-tabular"

// GitHub
className="contrib-cell contrib-3"
```

## 新增借皮的流程

1. 在 `tokens.css` 加新变量段（参考现有 Section 1）
2. 在 `tailwind.config.js` 拓展 `colors/shadows/ease/animation`
3. 在本 README 表格加一行
4. 在对应 page 组件用新 token（保持组件代码其他逻辑不动）
