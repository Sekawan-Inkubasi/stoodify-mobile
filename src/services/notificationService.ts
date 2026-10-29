import { apiRequest } from "./apiClient";
import { AppNotification } from "../types";

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "Baru saja";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Kemarin";
    return `${diffDays} hari lalu`;
  } catch {
    return dateStr;
  }
}

export function adaptBackendNotification(raw: any): AppNotification {
  let type: 'deadline' | 'session' | 'system' | 'streak' = 'system';
  if (raw.type === 'reminder' || raw.type === 'deadline') type = 'deadline';
  else if (raw.type === 'warning' || raw.type === 'session') type = 'session';
  else if (raw.type === 'streak') type = 'streak';

  return {
    id: String(raw.id),
    title: raw.title || "Notifikasi",
    message: raw.message || "",
    timeAgo: formatRelativeTime(raw.scheduled_at || raw.created_at),
    type,
    isRead: Boolean(raw.is_read),
  };
}

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await apiRequest("/notifications", { method: "GET" });
      const list = Array.isArray(res) ? res : res?.notifications || res?.data || [];
      return list.map(adaptBackendNotification);
    } catch (err) {
      console.warn("Gagal memuat notifikasi dari API:", err);
      return [];
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
    } catch (err) {
      console.warn("Gagal tandai notifikasi dibaca:", err);
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiRequest("/notifications/read-all", { method: "PATCH" });
    } catch (err) {
      console.warn("Gagal tandai semua notifikasi dibaca:", err);
    }
  },
};
