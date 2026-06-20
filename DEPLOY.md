# AI Workbench · 部署指南

## 快速开始 (5 分钟)

### 1. 准备服务器

```bash
# Ubuntu 22.04+ 推荐
sudo apt update && sudo apt install -y docker.io docker-compose-v2 openssh-server
sudo usermod -aG docker $USER
```

### 2. 配置 SSH 免密登录

```bash
# 本地
ssh-keygen -t ed25519
ssh-copy-id deploy@your-server
```

### 3. 配置环境变量

```bash
# 服务器上
mkdir -p /opt/ai-workbench && cd /opt/ai-workbench
cp .env.production.example .env.production
vim .env.production  # 填入实际值
chmod 600 .env.production
```

### 4. 部署

```bash
# 本地（从项目根目录）
./deploy.sh production --tag v1.0.0
```

输出示例：
```
[deploy] ===== 1/5 预检 =====
[ok] 本地工具齐全
[ok] SSH 连通
[ok] 远程 Docker 可用
[deploy] ===== 2/5 构建镜像 =====
[ok] 构建完成: ai-workbench/web:v1.0.0
[deploy] ===== 3/5 上传镜像 =====
[ok] 镜像上传完成
[deploy] ===== 4/5 部署 =====
[ok] 容器已启动
[deploy] ===== 5/5 验证 =====
[ok] 部署成功 🎉
[deploy] 地址: http://your-server/
```

## 高级场景

### 回滚

```bash
./deploy.sh production --rollback
```

### 不使用 deploy.sh（手动 Docker Compose）

```bash
# 服务器上
cd /opt/ai-workbench
docker compose -f docker-compose.production.yml --env-file .env.production pull
docker compose -f docker-compose.production.yml --env-file .env.production up -d
docker compose -f docker-compose.production.yml logs -f
```

### 启用监控 (Watchtower)

```bash
# 服务器上
docker compose -f docker-compose.production.yml --profile monitoring up -d
```

### 配置 SSL (Let's Encrypt)

```bash
# 服务器上
sudo apt install certbot
sudo certbot certonly --standalone -d ai-workbench.example.com
mkdir -p /opt/ai-workbench/ssl
cp /etc/letsencrypt/live/ai-workbench.example.com/fullchain.pem /opt/ai-workbench/ssl/
cp /etc/letsencrypt/live/ai-workbench.example.com/privkey.pem /opt/ai-workbench/ssl/

# 取消 nginx.conf 中 SSL 段落的注释
# 重启容器
docker restart ai-workbench-web
```

## 故障排查

### 容器起不来
```bash
docker logs ai-workbench-web
docker inspect ai-workbench-web
```

### 健康检查失败
```bash
curl -v http://your-server/
docker exec ai-workbench-web wget -q --spider http://localhost/
```

### SSH 连不上
```bash
ssh -v deploy@your-server
```

## 容量规划

| 资源 | 最小 | 推荐 | 备注 |
|---|---|---|---|
| CPU | 1 核 | 2 核 | SSR 重应用 4 核 |
| 内存 | 1 GB | 2 GB | 含 build 缓存 4 GB |
| 磁盘 | 5 GB | 20 GB | 镜像 1.2GB + 增量 5GB + 备份 10GB |
| 带宽 | 1 Mbps | 10 Mbps | 静态资源 CDN 后可降 |

## 监控集成

### Prometheus + Grafana (推荐)

```yaml
# docker-compose.production.yml 中添加
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  environment:
    GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
```

## 自部署镜像（替代 iframe 嵌入）

| 借皮对象 | 自部署开源替代 | 端口 |
|---|---|---|
| /chat | [Lobe Chat](https://github.com/lobehub/lobe-chat) | 3210 |
| /memory | [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | 8080 |
| /tickets | [Plane](https://github.com/makeplane/plane) | 8000 |
| /monitor | [Grafana](https://github.com/grafana/grafana) | 3000 |
| /services | [Dokploy](https://github.com/Dokploy/dokploy) | 3000 |
| /evaluation | [Langfuse](https://github.com/langfuse/langfuse) | 3000 |
| /flywheel | [LangSmith](https://github.com/langchain-ai/langsmith) | 1984 |

docker-compose 编排示例见 `docker-compose.fullstack.example.yml`。
