import type { Ticket } from "@/lib/types";
import { applyTicketOverrides, useTicketsStore } from "@/stores/tickets-store";
import { beforeEach, describe, expect, it } from "vitest";

const mockTicket = (id: string, overrides: Partial<Ticket> = {}): Ticket => ({
  id,
  code: `#MOCK-${id}`,
  title: `工单 ${id}`,
  description: "desc",
  type: "hitl",
  status: "open",
  priority: "medium",
  level: "L2",
  reporter: "tester",
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
  slaDueAt: 1_700_086_400_000,
  tags: [],
  ...overrides,
});

describe("tickets-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useTicketsStore.setState({ overrides: {} });
  });

  it("默认 overrides 为空对象", () => {
    expect(useTicketsStore.getState().overrides).toEqual({});
  });

  it("setStatus 写入覆盖", () => {
    useTicketsStore.getState().setStatus("t1", "in_progress");
    expect(useTicketsStore.getState().overrides.t1).toEqual({ status: "in_progress" });
  });

  it("setPriority 写入覆盖", () => {
    useTicketsStore.getState().setPriority("t1", "high");
    expect(useTicketsStore.getState().overrides.t1).toEqual({ priority: "high" });
  });

  it("setAssignee 写入覆盖", () => {
    useTicketsStore.getState().setAssignee("t1", "alice");
    expect(useTicketsStore.getState().overrides.t1).toEqual({ assignee: "alice" });
  });

  it("多次设置会合并到同一个 id 下", () => {
    useTicketsStore.getState().setStatus("t1", "resolved");
    useTicketsStore.getState().setPriority("t1", "urgent");
    useTicketsStore.getState().setAssignee("t1", "bob");
    expect(useTicketsStore.getState().overrides.t1).toEqual({
      status: "resolved",
      priority: "urgent",
      assignee: "bob",
    });
  });

  it("reset() 清空所有覆盖", () => {
    useTicketsStore.getState().setStatus("t1", "closed");
    useTicketsStore.getState().setStatus("t2", "open");
    useTicketsStore.getState().reset();
    expect(useTicketsStore.getState().overrides).toEqual({});
  });

  it("applyTicketOverrides: 无覆盖时原样返回", () => {
    const tickets = [mockTicket("t1"), mockTicket("t2")];
    const result = applyTicketOverrides(tickets);
    expect(result).toEqual(tickets);
  });

  it("applyTicketOverrides: 命中覆盖时合并字段", () => {
    useTicketsStore.getState().setStatus("t1", "resolved");
    useTicketsStore.getState().setPriority("t2", "urgent");
    const tickets = [mockTicket("t1"), mockTicket("t2")];
    const result = applyTicketOverrides(tickets);
    expect(result[0].status).toBe("resolved");
    expect(result[0].priority).toBe("medium");
    expect(result[1].status).toBe("open");
    expect(result[1].priority).toBe("urgent");
  });

  it("持久化 key 为 'ai-workbench-tickets'", () => {
    useTicketsStore.getState().setStatus("t1", "closed");
    const raw = window.localStorage.getItem("ai-workbench-tickets");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.state.overrides.t1.status).toBe("closed");
  });
});
