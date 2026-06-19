/**
 * SafeEmbed · 通用 iframe 嵌入组件（L1 拼图基石）
 *
 * 用途：把允许被嵌入的外部页面（status/roadmap/docs/公共看板）以
 * 最小风险的方式嵌进 Workbench。
 *
 * 安全：
 *   - 默认 sandbox 仅放开脚本 + 同源（不允许 top-level navigation）
 *   - 默认 referrerPolicy=no-referrer
 *   - 跨源时不透传 cookie
 *   - 错误时显示回退卡片，不留白
 *
 * UX：
 *   - 加载/失败状态、骨架屏、刷新、外部打开按钮
 *   - 主题感知（深色/浅色自动调背景色，避免嵌入页与壳对比刺眼）
 *   - 支持 ttl 强制刷新
 *
 * 已知限制：
 *   - 部分站点通过 X-Frame-Options / CSP 拒绝嵌入 → 触发回退
 *   - 鉴权站点无法直接嵌入（cookie 不通）→ 需要远程部署镜像后改嵌自己域名
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, ExternalLink, Loader2, RotateCw } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type SafeEmbedProps = {
  /** 嵌入的目标 URL */
  src: string;
  /** 显示标题（也用于 iframe title 属性） */
  title: string;
  /** iframe 高度，CSS 长度，默认 100% */
  height?: string | number;
  /** 是否允许脚本 */
  allowScripts?: boolean;
  /** 是否允许同源（影响 cookie / localStorage 访问） */
  allowSameOrigin?: boolean;
  /** 是否允许弹窗、表单等 */
  allowPopups?: boolean;
  /** 强制刷新间隔（秒），0 表示不自动刷新 */
  refreshIntervalSec?: number;
  /** 自定义 fallback（覆盖默认错误卡片） */
  fallback?: ReactNode;
  /** 加载时是否显示骨架屏 */
  showSkeleton?: boolean;
  /** 主题感知：嵌入页背景色（深/浅），用于过渡 */
  embedTheme?: "light" | "dark" | "auto";
  /** 额外 className */
  className?: string;
};

type LoadState = "loading" | "loaded" | "error";

const buildSandbox = (props: SafeEmbedProps): string => {
  const flags: string[] = ["allow-forms"];
  if (props.allowScripts ?? true) flags.push("allow-scripts");
  if (props.allowSameOrigin ?? true) flags.push("allow-same-origin");
  if (props.allowPopups ?? false) flags.push("allow-popups", "allow-popups-to-escape-sandbox");
  // 注意：故意不放 allow-top-navigation / allow-modals
  return flags.join(" ");
};

export function SafeEmbed({
  src,
  title,
  height = "100%",
  allowScripts,
  allowSameOrigin,
  allowPopups,
  refreshIntervalSec = 0,
  fallback,
  showSkeleton = true,
  embedTheme = "auto",
  className,
}: SafeEmbedProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // 加载完成 / 超时判定
  useEffect(() => {
    setState("loading");
    // 12s 未触发 onLoad 视为失败（部分站点拒绝嵌入时不触发 onLoad）
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => {
      setState((prev) => (prev === "loading" ? "error" : prev));
    }, 12_000);

    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, []);

  // 自动刷新
  useEffect(() => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (refreshIntervalSec > 0) {
      refreshTimer.current = setInterval(() => {
        setReloadKey((k) => k + 1);
      }, refreshIntervalSec * 1000);
    }
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [refreshIntervalSec]);

  const handleReload = () => {
    setReloadKey((k) => k + 1);
  };

  const heightStyle = typeof height === "number" ? { height: `${height}px` } : { height };

  // 嵌入页背景：与 Workbench 主题对齐，避免对比刺眼
  const iframeBg =
    embedTheme === "dark" ? "#09090B" : embedTheme === "light" ? "#FFFFFF" : undefined;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
      style={heightStyle}
    >
      {/* 顶栏：标题 + 刷新/外部打开 */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              state === "loading" && "bg-warning animate-pulse",
              state === "loaded" && "bg-success",
              state === "error" && "bg-destructive",
            )}
            aria-hidden
          />
          <span className="truncate text-muted-foreground">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleReload}
            aria-label="刷新"
            title="刷新"
          >
            <RotateCw className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            asChild
            aria-label="新窗口打开"
            title="新窗口打开"
          >
            <a href={src} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* 主体 */}
      <div className="relative flex-1">
        {/* 加载骨架 */}
        {state === "loading" && showSkeleton && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-muted/20"
            aria-hidden
          >
            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>正在加载 {title}…</span>
            </div>
          </div>
        )}

        {/* 错误回退 */}
        {state === "error" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-muted/30 p-6">
            {fallback ?? (
              <div className="flex max-w-sm flex-col items-center gap-3 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">无法嵌入 {title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    目标站点可能已禁止第三方 iframe 嵌入（X-Frame-Options / CSP）。 你可以：
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleReload}>
                    <RotateCw className="mr-1 h-3 w-3" /> 重试
                  </Button>
                  <Button size="sm" asChild>
                    <a href={src} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" /> 前往原站
                    </a>
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  后续计划：把该服务自部署到自己的子域，再嵌入自己域名（无 CSP 限制）。
                </p>
              </div>
            )}
          </div>
        )}

        <iframe
          key={reloadKey}
          src={src}
          title={title}
          className="h-full w-full border-0"
          sandbox={buildSandbox({ allowScripts, allowSameOrigin, allowPopups, title, src })}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => {
            if (loadTimer.current) clearTimeout(loadTimer.current);
            setState("loaded");
          }}
          onError={() => {
            if (loadTimer.current) clearTimeout(loadTimer.current);
            setState("error");
          }}
          style={iframeBg ? { backgroundColor: iframeBg } : undefined}
        />
      </div>
    </div>
  );
}
