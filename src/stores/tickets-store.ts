// 工单状态变更持久化 Store
// 记录用户在工单视图里对每张工单做的覆盖 (状态/优先级/受理人)
// 实际数据仍以 MOCK_TICKETS 为准, 此处只存 delta

import type { Ticket, TicketPriority, TicketStatus } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketOverride = Partial<Pick<Ticket, "status" | "priority" | "assignee">>;

export type TicketsStore = {
  overrides: Record<string, TicketOverride>;
  setStatus: (id: string, status: TicketStatus) => void;
  setPriority: (id: string, priority: TicketPriority) => void;
  setAssignee: (id: string, assignee: string) => void;
  reset: () => void;
};

export const useTicketsStore = create<TicketsStore>()(
  persist(
    (set) => ({
      overrides: {},
      setStatus: (id, status) =>
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], status } },
        })),
      setPriority: (id, priority) =>
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], priority } },
        })),
      setAssignee: (id, assignee) =>
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], assignee } },
        })),
      reset: () => set({ overrides: {} }),
    }),
    { name: "ai-workbench-tickets" },
  ),
);

// 工具函数: 把 MOCK_TICKETS 与 overrides 合并, 返回带覆盖的最新工单
export function applyTicketOverrides<T extends Ticket>(tickets: T[]): T[] {
  const overrides = useTicketsStore.getState().overrides;
  return tickets.map((t) => {
    const o = overrides[t.id];
    if (!o) return t;
    return { ...t, ...o };
  });
}
