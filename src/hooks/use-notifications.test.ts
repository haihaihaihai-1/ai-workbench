import { MOCK_NOTIFICATIONS } from "@/components/layouts/notification-mock-data";
import { useNotifications } from "@/hooks/use-notifications";
import { beforeEach, describe, expect, it } from "vitest";

describe("useNotifications", () => {
  beforeEach(() => {
    useNotifications.setState({
      items: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
    });
  });

  it("初始 unreadCount 等于未读数", () => {
    const expected = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
    expect(useNotifications.getState().unreadCount).toBe(expected);
    expect(expected).toBe(4);
  });

  it("markRead(id) 将指定项标记已读, unreadCount 减 1", () => {
    const before = useNotifications.getState().unreadCount;
    useNotifications.getState().markRead("n-001");
    const s = useNotifications.getState();
    expect(s.unreadCount).toBe(before - 1);
    const target = s.items.find((i) => i.id === "n-001");
    expect(target?.read).toBe(true);
  });

  it("markRead(id) 不会重复计数 (再次调用同 id 不变)", () => {
    useNotifications.getState().markRead("n-001");
    const after1 = useNotifications.getState().unreadCount;
    useNotifications.getState().markRead("n-001");
    expect(useNotifications.getState().unreadCount).toBe(after1);
  });

  it("markAllRead() 后 unreadCount = 0", () => {
    useNotifications.getState().markAllRead();
    const s = useNotifications.getState();
    expect(s.unreadCount).toBe(0);
    expect(s.items.every((i) => i.read)).toBe(true);
  });

  it("select(id) 返回对应通知", () => {
    const n = useNotifications.getState().select("n-001");
    expect(n?.title).toContain("P0 危机");
  });

  it("select(不存在的 id) 返回 undefined", () => {
    expect(useNotifications.getState().select("nope")).toBeUndefined();
  });

  it("countByType('all') 返回总条数", () => {
    expect(useNotifications.getState().countByType("all")).toBe(MOCK_NOTIFICATIONS.length);
  });

  it("countByType('ticket') 只统计该类型", () => {
    const expected = MOCK_NOTIFICATIONS.filter((n) => n.type === "ticket").length;
    expect(useNotifications.getState().countByType("ticket")).toBe(expected);
  });
});
