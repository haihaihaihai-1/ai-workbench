import {
  MOCK_NOTIFICATIONS,
  type Notification,
  type NotificationType,
} from "@/components/layouts/notification-mock-data";
import { create } from "zustand";

type NotificationStore = {
  items: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  select: (id: string) => Notification | undefined;
  countByType: (type: NotificationType | "all") => number;
};

const computeUnread = (items: Notification[]) => items.filter((n) => !n.read).length;

export const useNotifications = create<NotificationStore>((set, get) => ({
  items: MOCK_NOTIFICATIONS,
  unreadCount: computeUnread(MOCK_NOTIFICATIONS),
  markRead: (id) =>
    set((state) => {
      const items = state.items.map((it) => (it.id === id ? { ...it, read: true } : it));
      return { items, unreadCount: computeUnread(items) };
    }),
  markAllRead: () =>
    set((state) => {
      const items = state.items.map((it) => ({ ...it, read: true }));
      return { items, unreadCount: 0 };
    }),
  select: (id) => get().items.find((it) => it.id === id),
  countByType: (type) => {
    const items = get().items;
    if (type === "all") return items.length;
    return items.filter((n) => n.type === type).length;
  },
}));
