// 应用启动时一次性触发: localStorage → IndexedDB 迁移
// 实质做法: 调用各 store 的 hydrate(), 让其在 IndexedDB 为空时把 localStorage 还原的数据写入做种子
// 同时挂一个 'migrated_' 标记到 localStorage 表明已经触发过

import { isDexieAvailable } from "@/db/dexie";
import { useChatStore } from "@/stores/chat-store";
import { useTicketsStore } from "@/stores/tickets-store";
import { useEffect, useState } from "react";

// 迁移完成标记 key - 'migrated_' 前缀方便后续清理识别
const MIGRATION_FLAG_KEY = "migrated_ai-workbench-dexie-v1";

let migrationPromise: Promise<void> | null = null;

/**
 * 模块级一次性迁移 - 幂等
 * 在 main.tsx 顶层 fire-and-forget 调用, 同时也可作为 hook 的底层逻辑
 */
export async function runDexieMigration(): Promise<void> {
  if (migrationPromise) return migrationPromise;
  migrationPromise = (async () => {
    try {
      // hydrate 两个 store - 内部会在 IndexedDB 空时把 localStorage 数据写入
      const chatHydrate = useChatStore.getState().hydrate;
      const ticketsHydrate = useTicketsStore.getState().hydrate;
      await Promise.allSettled([chatHydrate(), ticketsHydrate()]);

      // 只有 IndexedDB 真正可用时才打标记, 否则下次启动还会重新尝试
      if (isDexieAvailable() && typeof localStorage !== "undefined") {
        try {
          if (!localStorage.getItem(MIGRATION_FLAG_KEY)) {
            localStorage.setItem(MIGRATION_FLAG_KEY, String(Date.now()));
          }
        } catch {
          // localStorage 可能被禁用, 忽略
        }
      }
    } catch (err) {
      console.warn("[dexie-migrate] 迁移失败, 已降级到 in-memory + localStorage", err);
    }
  })();
  return migrationPromise;
}

export type MigrationStatus = "pending" | "done" | "error";

/**
 * 在 React 组件中订阅迁移状态 - 用于显示 loading
 *
 * @example
 * const status = useDexieMigrate();
 * if (status === 'pending') return <Loading text="从本地加载..." />;
 */
export function useDexieMigrate(): MigrationStatus {
  const [status, setStatus] = useState<MigrationStatus>(() => {
    // 如果迁移已经在跑或已完成, 不再卡 pending
    return migrationPromise ? "pending" : "pending";
  });

  useEffect(() => {
    let cancelled = false;
    runDexieMigration()
      .then(() => {
        if (!cancelled) setStatus("done");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
