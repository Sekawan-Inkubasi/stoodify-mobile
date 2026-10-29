import { apiRequest } from "./apiClient";
import { AISession } from "../types";

export function adaptBackendSession(raw: any): AISession {
  const taskTitle =
    raw.task?.title || raw.task_title || raw.title || "Sesi Belajar Terjadwal";
  const subjectName =
    raw.task?.subject?.name ||
    raw.task?.subject_name ||
    raw.subject_name ||
    "Umum";
  const subjectColor =
    raw.task?.subject?.color || raw.task?.subject_color || "#2563EB";
  const duration = raw.duration || raw.duration_minutes || 45;
  const timeSlot = raw.start_time
    ? `${raw.start_time.slice(0, 5)} (${duration}m)`
    : "Prioritas #1";

  let dateStr = "";
  if (raw.session_date) {
    try {
      dateStr = new Date(raw.session_date).toISOString().split("T")[0];
    } catch {
      dateStr = String(raw.session_date);
    }
  }

  return {
    id: String(raw.id),
    taskId: String(raw.task_id || raw.taskId || ""),
    taskTitle,
    subject: subjectName,
    subjectColor,
    sessionDate: dateStr || new Date().toISOString().split("T")[0],
    timeSlot,
    durationMinutes: duration,
    targetProgress: raw.target_progress || 50,
    reason:
      raw.reason ||
      raw.ai_reasoning ||
      "Rekomendasi AI berdasarkan urgensi deadline dan jadwal belajar.",
    status: raw.status || "planned",
  };
}

export const studySessionService = {
  async getRecommendations(): Promise<AISession[]> {
    try {
      let res = await apiRequest("/ai/schedule-recommendations", {
        method: "GET",
      });
      let list = Array.isArray(res)
        ? res
        : res?.sessions || res?.recommendations || res?.data || [];

      // Jika belum ada rekomendasi, generate rekomendasi hari ini secara otomatis
      if (!list || list.length === 0) {
        try {
          const genRes = await apiRequest(
            "/ai/schedule-recommendations/generate",
            {
              method: "POST",
              body: JSON.stringify({}),
            },
          );
          list = Array.isArray(genRes)
            ? genRes
            : genRes?.sessions || genRes?.data || [];
        } catch {
          // ignore jika tugas kosong
        }
      }

      return (list || []).map(adaptBackendSession);
    } catch (err) {
      console.warn("Gagal memuat rekomendasi sesi AI dari API:", err);
      return [];
    }
  },

  async acceptSession(id: string): Promise<void> {
    await apiRequest(`/ai/schedule-recommendations/${id}/accept`, {
      method: "POST",
    });
  },

  async rejectSession(id: string, reason?: string): Promise<void> {
    await apiRequest(`/ai/schedule-recommendations/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "User skipped" }),
    });
  },

  async reschedule(): Promise<AISession[]> {
    const res = await apiRequest("/ai/reschedule", {
      method: "POST",
    });
    const list = Array.isArray(res)
      ? res
      : res?.sessions || res?.recommendations || res?.data || [];
    return (list || []).map(adaptBackendSession);
  },
};
