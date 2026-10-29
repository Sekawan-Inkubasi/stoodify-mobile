import { apiRequest } from "./apiClient";
import { AISession, Task } from "../types";

export function adaptBackendSession(
  raw: any,
  tasksMap?: Map<string | number, Task>,
): AISession {
  const relatedTask = tasksMap
    ? tasksMap.get(raw.task_id) || tasksMap.get(String(raw.task_id)) || tasksMap.get(Number(raw.task_id))
    : undefined;

  const taskTitle =
    raw.task?.title ||
    raw.task_title ||
    relatedTask?.title ||
    raw.title ||
    "Sesi Belajar Terjadwal";
  const subjectName =
    raw.task?.subject?.name ||
    raw.task?.subject_name ||
    relatedTask?.subject ||
    raw.subject_name ||
    "Umum";
  const subjectColor =
    raw.task?.subject?.color ||
    raw.task?.subject_color ||
    relatedTask?.subjectColor ||
    "#2563EB";
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
  async getRecommendations(tasks?: Task[]): Promise<AISession[]> {
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

      const tasksMap = tasks
        ? new Map(tasks.map((t) => [t.id, t]))
        : undefined;

      return (list || []).map((item: any) => adaptBackendSession(item, tasksMap));
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
