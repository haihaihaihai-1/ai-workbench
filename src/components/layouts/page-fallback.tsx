// 路由切换时的通用 loading 占位 - 纯 CSS 骨架屏，零依赖、最小体积

export function PageFallback() {
  return (
    <output
      aria-live="polite"
      aria-label="Loading"
      className="flex w-full min-h-[60vh] flex-col gap-6 p-2"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-32 w-full animate-pulse rounded-lg bg-muted" />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-12 w-2/3 animate-pulse rounded-md bg-muted" />
      <span className="sr-only">Loading…</span>
    </output>
  );
}

export default PageFallback;
