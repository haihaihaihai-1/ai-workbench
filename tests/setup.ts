import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// 静默 sonner toast (避免污染控制台)
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// matchMedia stub (jsdom 默认未实现或返回值不完整) — 用普通函数避免被 vi.restoreAllMocks 影响
if (typeof window !== "undefined") {
  const matchMediaFn = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
  try {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: matchMediaFn,
    });
  } catch {
    (window as unknown as { matchMedia: typeof matchMediaFn }).matchMedia = matchMediaFn;
  }

  // URL.createObjectURL / revokeObjectURL polyfill (部分 jsdom 版本缺失)
  if (typeof URL.createObjectURL !== "function") {
    try {
      Object.defineProperty(URL, "createObjectURL", {
        writable: true,
        configurable: true,
        value: () => "blob:mock-url",
      });
      Object.defineProperty(URL, "revokeObjectURL", {
        writable: true,
        configurable: true,
        value: () => {},
      });
    } catch {
      Object.assign(URL, {
        createObjectURL: () => "blob:mock-url",
        revokeObjectURL: () => {},
      });
    }
  }
}

// IntersectionObserver / ResizeObserver stub (避免组件库误用)
class StubObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

if (typeof window !== "undefined") {
  // @ts-expect-error - 注入测试桩
  if (!window.IntersectionObserver) window.IntersectionObserver = StubObserver;
  // @ts-expect-error - 注入测试桩
  if (!window.ResizeObserver) window.ResizeObserver = StubObserver;
}

// 每个 case 结束后清理
afterEach(() => {
  vi.restoreAllMocks();
  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});
