// Dexie 表对应的 TypeScript 接口
// 复用 @/lib/types 中的类型, 必要时扩展字段

import type {
  ChatMessage,
  Conversation,
  Memory,
  MemoryType,
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/lib/types";

// 重新导出基础类型, 方便调用方一站式 import
export type { ChatMessage, Conversation, Memory, MemoryType, Ticket, TicketPriority, TicketStatus };

// 会话行 - 直接复用 Conversation
export type ConversationRow = Conversation;

// 消息行 - 比 ChatMessage 多一个外键 conversationId, 其余复用
export interface MessageRow {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent?: string;
  createdAt: number;
}

// 记忆行 - 直接复用 Memory
export type MemoryRow = Memory;

// 工单行 - 直接复用 Ticket
export type TicketRow = Ticket;

// 工单覆盖行 - 用户在 UI 上对工单做的状态/优先级/受理人覆盖
export interface TicketOverrideRow {
  id: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

// 通知行 - 与 NotificationMock 结构一致, 但加 createdAt 索引
export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  detail: string;
  ts: number;
  read: boolean;
  url?: string;
  createdAt: number;
}
