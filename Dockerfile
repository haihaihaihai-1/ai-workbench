# ===================================
# Stage 1: 依赖安装
# ===================================
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

# ===================================
# Stage 2: 构建
# ===================================
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ===================================
# Stage 3: Runtime (nginx)
# ===================================
FROM nginx:1.27-alpine AS runner
# 复制 SPA 静态资源
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制 nginx 配置（SPA fallback）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
