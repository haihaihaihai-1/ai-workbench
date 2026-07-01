// AI Workbench Service Worker - 离线缓存 + 资源预缓存
const VERSION = "v7.4.0";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const HTML_CACHE = `html-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/chat",
  "/memory",
  "/monitor",
  "/tickets",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

// 安装：预缓存关键资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // 预缓存 shell 资源（best effort，失败不阻塞）
      await Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u).catch(() => null)));
      await self.skipWaiting();
    })(),
  );
});

// 激活：清理旧版本
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE, HTML_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

// 拦截请求：缓存优先策略
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML 文档：network-first，回退到缓存
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(HTML_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/");
          if (fallback) return fallback;
          return new Response("Offline - AI Workbench", { status: 503 });
        }
      })(),
    );
    return;
  }

  // 静态资源（JS/CSS/img/font）：cache-first
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/assets/")
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          return cached || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }
});

// 接收消息：跳过等待
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
