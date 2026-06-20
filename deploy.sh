#!/usr/bin/env bash
# ============================================================================
# AI Workbench · 远程部署脚本
# ----------------------------------------------------------------------------
# 用法:
#   ./deploy.sh <env>              # env: staging | production
#   ./deploy.sh production --tag v1.2.3
#   ./deploy.sh staging --no-cache
#   ./deploy.sh production --rollback
#
# 前置:
#   1. 已配置 SSH 免密登录到目标服务器
#   2. 目标服务器已装 Docker + Docker Compose
#   3. 服务器有 .env.production 文件
# ============================================================================
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_NAME="ai-workbench"
readonly IMAGE_NAME="ai-workbench/web"
readonly DEFAULT_TAG="$(date +%Y%m%d-%H%M%S)"

: "${REMOTE_HOST:?需要设置 REMOTE_HOST 环境变量}"
: "${REMOTE_USER:?需要设置 REMOTE_USER 环境变量}"
: "${REMOTE_DIR:=/opt/ai-workbench}"
: "${REMOTE_PORT:=22}"

readonly CONTAINER_NAME="${PROJECT_NAME}-web"

if [ -t 1 ]; then
    readonly C_RED=$'\033[0;31m'
    readonly C_GREEN=$'\033[0;32m'
    readonly C_YELLOW=$'\033[0;33m'
    readonly C_BLUE=$'\033[0;34m'
    readonly C_RESET=$'\033[0m'
else
    readonly C_RED="" C_GREEN="" C_YELLOW="" C_BLUE="" C_RESET=""
fi

log()  { printf "%b[deploy]%b %s\n" "$C_BLUE" "$C_RESET" "$*"; }
warn() { printf "%b[warn]%b %s\n" "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf "%b[error]%b %s\n" "$C_RED" "$C_RESET" "$*" >&2; }
ok()   { printf "%b[ok]%b %s\n" "$C_GREEN" "$C_RESET" "$*"; }

ENVIRONMENT="production"
IMAGE_TAG="$DEFAULT_TAG"
NO_CACHE=""
ROLLBACK=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        staging|production) ENVIRONMENT="$1"; shift ;;
        --tag)             IMAGE_TAG="$2"; shift 2 ;;
        --no-cache)        NO_CACHE="--no-cache"; shift ;;
        --rollback)        ROLLBACK="yes"; shift ;;
        -h|--help)
            sed -n '2,20p' "$0" | sed 's/^# //;s/^#//'
            exit 0
            ;;
        *) err "未知参数: $1"; exit 1 ;;
    esac
done

remote_exec() {
    ssh -p "$REMOTE_PORT" "${REMOTE_USER}@${REMOTE_HOST}" "$@"
}

remote_copy() {
    scp -P "$REMOTE_PORT" "$@"
}

health_check() {
    local url="$1"
    local retries="${2:-10}"
    local sleep="${3:-3}"
    log "健康检查: $url (最多 ${retries}x)"
    for i in $(seq 1 $retries); do
        if curl -fsS -o /dev/null -m 5 "$url"; then
            ok "健康检查通过 (第 $i 次)"
            return 0
        fi
        warn "第 $i/$retries 次未通过, ${sleep}s 后重试..."
        sleep "$sleep"
    done
    err "健康检查失败"
    return 1
}

preflight() {
    log "===== 1/5 预检 ====="
    command -v docker >/dev/null || { err "未安装 docker"; exit 1; }
    command -v ssh >/dev/null   || { err "未安装 ssh"; exit 1; }
    command -v scp >/dev/null   || { err "未安装 scp"; exit 1; }
    ok "本地工具齐全"

    if ! ssh -o ConnectTimeout=10 -p "$REMOTE_PORT" \
         -o BatchMode=yes "${REMOTE_USER}@${REMOTE_HOST}" true 2>/dev/null; then
        err "无法 SSH 到 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
        exit 1
    fi
    ok "SSH 连通"

    if ! remote_exec "command -v docker >/dev/null"; then
        err "远程服务器未安装 Docker"
        exit 1
    fi
    ok "远程 Docker 可用"
}

build_image() {
    log "===== 2/5 构建镜像 ====="
    local build_args=""
    [[ -n "$NO_CACHE" ]] && build_args="$NO_CACHE"

    log "构建 ${IMAGE_NAME}:${IMAGE_TAG} (env: ${ENVIRONMENT})"
    docker build $build_args \
        --build-arg "ENV=${ENVIRONMENT}" \
        -t "${IMAGE_NAME}:${IMAGE_TAG}" \
        -t "${IMAGE_NAME}:${ENVIRONMENT}-latest" \
        "$SCRIPT_DIR"
    ok "构建完成: ${IMAGE_NAME}:${IMAGE_TAG}"
}

upload_image() {
    log "===== 3/5 上传镜像 ====="
    log "保存镜像为 tar..."
    local tmp_tar
    tmp_tar="$(mktemp -t ai-workbench.XXXXXX.tar)"
    trap "rm -f $tmp_tar" EXIT
    docker save "${IMAGE_NAME}:${IMAGE_TAG}" -o "$tmp_tar"
    local size
    size=$(du -h "$tmp_tar" | cut -f1)
    log "镜像大小: $size"

    log "scp 到 ${REMOTE_HOST}:${REMOTE_DIR}/"
    remote_exec "mkdir -p ${REMOTE_DIR}/images"
    remote_copy "$tmp_tar" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/images/${IMAGE_TAG}.tar"
    rm -f "$tmp_tar"

    log "远程加载镜像..."
    remote_exec "docker load -i ${REMOTE_DIR}/images/${IMAGE_TAG}.tar"
    ok "镜像上传完成"
}

deploy() {
    log "===== 4/5 部署 ====="
    log "备份当前容器状态..."
    remote_exec "
        if docker ps -a --format '{{.Names}}' | grep -q '^${CONTAINER_NAME}\$'; then
            docker commit ${CONTAINER_NAME} ${IMAGE_NAME}:${ENVIRONMENT}-previous 2>/dev/null || true
        fi
    "

    log "停止旧容器..."
    remote_exec "docker stop ${CONTAINER_NAME} 2>/dev/null || true"
    remote_exec "docker rm -f ${CONTAINER_NAME} 2>/dev/null || true"

    log "启动新容器: ${IMAGE_NAME}:${IMAGE_TAG}"
    remote_exec "
        cd ${REMOTE_DIR}
        if [ -f .env.${ENVIRONMENT} ]; then
            set -a; source .env.${ENVIRONMENT}; set +a
        fi
        docker run -d \
            --name ${CONTAINER_NAME} \
            --restart unless-stopped \
            -p 80:80 \
            -p 443:443 \
            \${ENV_VARS:-} \
            ${IMAGE_NAME}:${IMAGE_TAG}
    "
    ok "容器已启动"
}

verify() {
    log "===== 5/5 验证 ====="
    local url="http://${REMOTE_HOST}/"
    if ! health_check "$url" 10 3; then
        err "部署失败,启动回滚..."
        rollback
        exit 1
    fi
    ok "部署成功"
    log "镜像: ${IMAGE_NAME}:${IMAGE_TAG}"
    log "环境: ${ENVIRONMENT}"
    log "地址: ${url}"
}

rollback() {
    warn "回滚到 ${ENVIRONMENT}-previous"
    remote_exec "
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
        if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q '${IMAGE_NAME}:${ENVIRONMENT}-previous'; then
            docker run -d \
                --name ${CONTAINER_NAME} \
                --restart unless-stopped \
                -p 80:80 \
                -p 443:443 \
                ${IMAGE_NAME}:${ENVIRONMENT}-previous
            ok '回滚完成'
        else
            err '无 previous 镜像可回滚'
        fi
    "
}

if [[ "$ROLLBACK" == "yes" ]]; then
    rollback
    exit 0
fi

preflight
build_image
upload_image
deploy
verify
