// AI Workbench 本地 IndexedDB (基于 Dexie)
// 单一职责: 创建 Dexie 实例 + 提供降级保护 (隐私模式/老浏览器/SSR 等场景)

import Dexie, { type Table } from "dexie";
import type {
  ConversationRow,
  MemoryRow,
  MessageRow,
  NotificationRow,
  TicketOverrideRow,
  TicketRow,
} from "./schema";

// 数据库名 - 不要随便改, 与 IndexedDB 中的 DB 名绑定
const DB_NAME = "ai-workbench";
const DB_VERSION = 1;

export class AiWorkbenchDB extends Dexie {
  conversations!: Table<ConversationRow, string>;
  messages!: Table<MessageRow, string>;
  memories!: Table<MemoryRow, string>;
  tickets!: Table<TicketRow, string>;
  tickets_overrides!: Table<TicketOverrideRow, string>;
  notifications!: Table<NotificationRow, string>;

  constructor() {
    super(DB_NAME);
    // Schema v1 - 主键 + 常用索引
    this.version(DB_VERSION).stores({
      conversations: "id, domain, updatedAt, pinned",
      messages: "id, conversationId, role, createdAt",
      memories: "id, type, createdAt, pinned",
      tickets: "id, status, priority, level, createdAt",
      tickets_overrides: "id",
      notifications: "id, type, read, createdAt",
    });
  }
}

// 检测 IndexedDB 是否可用 (隐私模式 / SSR / 老浏览器降级判断依据)
export function isDexieAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    if (typeof indexedDB === "undefined") return false;
    return indexedDB !== null;
  } catch {
    return false;
  }
}

// 单例 - 仅在 IndexedDB 可用时创建; 失败时返回 null, 调用方自动降级
let _aiDb: AiWorkbenchDB | null = null;
let _initFailed = false;

export function getAiDb(): AiWorkbenchDB | null {
  if (_aiDb) return _aiDb;
  if (_initFailed) return null;
  if (!isDexieAvailable()) {
    _initFailed = true;
    return null;
  }
  try {
    _aiDb = new AiWorkbenchDB();
    return _aiDb;
  } catch (err) {
    console.warn("[dexie] 初始化失败, 降级到 localStorage", err);
    _initFailed = true;
    return null;
  }
}

// 模块加载时尝试初始化一次, 便于其他模块直接 import
export const aiDb: AiWorkbenchDB | null = getAiDb();
