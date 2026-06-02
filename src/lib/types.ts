// 通用类型定义 - 全应用共享

export type AgentDomain = "academic" | "emotional" | "affairs" | "general";

export type AgentInfo = {
  id: AgentDomain;
  name: string;
  description: string;
  color: string;
  emoji: string;
};

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  agent?: AgentDomain;
  createdAt: number;
  sources?: SourceRef[];
  toolCalls?: ToolCall[];
  feedback?: "up" | "down" | null;
};

export type SourceRef = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
};

export type ToolCall = {
  id: string;
  name: string;
  status: "running" | "success" | "error";
  input?: string;
  output?: string;
  durationMs?: number;
};

export type Conversation = {
  id: string;
  title: string;
  domain: AgentDomain;
  updatedAt: number;
  pinned?: boolean;
};

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketType = "hitl" | "crisis" | "complaint" | "feedback";

export type Ticket = {
  id: string;
  code: string; // 短码 #AB-123
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  level: "L1" | "L2" | "L3";
  assignee?: string;
  reporter: string;
  createdAt: number;
  updatedAt: number;
  slaDueAt: number;
  tags: string[];
  conversationId?: string;
  feedbackIds?: string[];
};

export type MemoryType = "fact" | "preference" | "event" | "skill";
export type Memory = {
  id: string;
  type: MemoryType;
  content: string;
  tags: string[];
  confidence: number;
  source: string;
  createdAt: number;
  pinned?: boolean;
};

export type MetricSnapshot = {
  ts: number;
  qps: number;
  latencyMs: number;
  errorRate: number;
  activeSessions: number;
};

export type AgentMetric = {
  agent: AgentDomain;
  count: number;
  successRate: number;
  avgDurationMs: number;
};

export type LLMMetric = {
  model: string;
  calls: number;
  successRate: number;
  avgLatencyMs: number;
  errors: number;
};

export type SafetyEvent = {
  id: string;
  type: "pii" | "injection" | "violation";
  severity: "low" | "medium" | "high" | "critical";
  content: string;
  user: string;
  action: "warn" | "block" | "redact";
  createdAt: number;
};
