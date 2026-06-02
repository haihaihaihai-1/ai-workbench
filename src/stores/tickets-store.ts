// 工单状态变更持久化 Store
// 记录用户在工单视图里对每张工单做的覆盖 (状态/优先级/受理人)
// 实际数据仍以 MOCK_TICKETS 为准, 此处只存 delta
// v7.5: 集成 Dexie (IndexedDB) 作为主存储, localStorage 作为降级 fallback

import { aiDb } from "@/db/dexie";
import type { Ticket, TicketPriority, TicketStatus } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketOverride = Partial<Pick<Ticket, "status" | "priority" | "assignee">>;

export type TicketsStore = {
  overrides: Record<string, TicketOverride>;
  hydrated: boolean;
  setStatus: (id: string, status: TicketStatus) => void;
  setPriority: (id: string, priority: TicketPriority) => void;
  setAssignee: (id: string, assignee: string) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
};

export const useTicketsStore = create<TicketsStore>()(
  persist(
    (set, get) => ({
      overrides: {},
      hydrated: false,
      setStatus: (id, status) => {
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], status } },
        }));
        const o = get().overrides[id];
        if (o) void aiDb?.tickets_overrides.put({ id, ...o } as never).catch(() => null);
      },
      setPriority: (id, priority) => {
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], priority } },
        }));
        const o = get().overrides[id];
        if (o) void aiDb?.tickets_overrides.put({ id, ...o } as never).catch(() => null);
      },
      setAssignee: (id, assignee) => {
        set((s) => ({
          overrides: { ...s.overrides, [id]: { ...s.overrides[id], assignee } },
        }));
        const o = get().overrides[id];
        if (o) void aiDb?.tickets_overrides.put({ id, ...o } as never).catch(() => null);
      },
      reset: () => {
        set({ overrides: {} });
        void aiDb?.tickets_overrides.clear().catch(() => null);
      },
      hydrate: async () => {
        if (get().hydrated) return;
        if (!aiDb) {
          set({ hydrated: true });
          return;
        }
        try {
          const count = await aiDb.tickets_overrides.count();
          if (count > 0) {
            const rows = await aiDb.tickets_overrides.toArray();
            const overrides: Record<string, TicketOverride> = {};
            for (const r of rows) {
              const { id, ...rest } = r as { id: string } & TicketOverride;
              overrides[id] = rest;
            }
            set({ overrides, hydrated: true });
          } else {
            await aiDb.tickets_overrides.bulkPut(
              Object.entries(get().overrides).map(([id, o]) => ({ id, ...o })) as never[],
            );
            set({ hydrated: true });
          }
        } catch (err) {
          console.warn("[tickets-store] hydrate 失败, 降级到 in-memory", err);
          set({ hydrated: true });
        }
      },
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
