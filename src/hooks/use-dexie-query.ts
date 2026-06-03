// React Hook 桥接 Dexie liveQuery
// 用于让组件订阅 Dexie 表变化, 实现自动响应式更新

import { isDexieAvailable } from "@/db/dexie";
import { liveQuery } from "dexie";
import { useEffect, useState } from "react";

/**
 * 订阅一段 Dexie 查询, 表数据变化时自动重新执行并更新返回值.
 *
 * @example
 * const conversations = useDexieQuery(() => aiDb?.conversations.toArray() ?? [], []);
 *
 * 注意: 第二个参数 deps 用于控制订阅重新建立的时机, 类似 useEffect 的依赖数组.
 * 如果 deps 为空数组, 订阅只在 mount 时建立一次, query 函数内捕获的变量需保证稳定.
 */
export function useDexieQuery<T>(
  query: () => Promise<T> | T,
  deps: ReadonlyArray<unknown> = [],
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps 由调用方显式控制, 与 query 闭包绑定
  useEffect(() => {
    // 隐私模式 / 老浏览器降级 - 不订阅, 让组件回退到其他数据源
    if (!isDexieAvailable()) {
      return undefined;
    }

    const observable = liveQuery(query);
    const sub = observable.subscribe({
      next: (value: T) => {
        setData(value);
      },
      error: (err: unknown) => {
        console.warn("[useDexieQuery] 查询错误", err);
      },
    });

    return () => {
      sub.unsubscribe();
    };
  }, deps);

  return data;
}
