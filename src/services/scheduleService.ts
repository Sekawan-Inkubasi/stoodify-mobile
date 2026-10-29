import { apiRequest } from "./apiClient";
import { ScheduleItem } from "../types";
import { subjectService } from "./subjectService";

const DAY_EN_TO_ID: Record<string, "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat"> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Senin",
  Sunday: "Senin",
};

const DAY_ID_TO_EN: Record<string, string> = {
  Senin: "Monday",
  Selasa: "Tuesday",
  Rabu: "Wednesday",
  Kamis: "Thursday",
  Jumat: "Friday",
};

const SUBJECT_COLORS: Record<string, string> = {
  Matematika: "#2563EB",
  Fisika: "#4F46E5",
  Kimia: "#0284C7",
  Biologi: "#059669",
  "Bahasa Indonesia": "#D97706",
  "Bahasa Inggris": "#7C3AED",
  "Sejarah Indonesia": "#E11D48",
  default: "#3B82F6",
};

export function adaptBackendSchedule(raw: any): ScheduleItem {
  const day = typeof raw.day_of_week === "string" 
    ? (DAY_EN_TO_ID[raw.day_of_week] || "Senin")
    : "Senin";

  const subjectName =
    raw.subject?.name || raw.subject_name || raw.title || "Mata Pelajaran";
  const color =
    raw.subject?.color || raw.subject_color || SUBJECT_COLORS[subjectName] || SUBJECT_COLORS.default;
  const time =
    raw.start_time && raw.end_time
      ? `${raw.start_time.slice(0, 5)} - ${raw.end_time.slice(0, 5)}`
      : raw.time || "07:00 - 08:30";

  return {
    id: String(raw.id),
    day,
    subjectName,
    subjectColor: color,
    time,
    room: raw.room || "Kelas XI-A",
    teacher: raw.teacher || raw.teacher_name || "Guru Pengampu",
  };
}

export const scheduleService = {
  async getSchedules(): Promise<ScheduleItem[]> {
    try {
      const res = await apiRequest("/schedules", { method: "GET" });
      const list = Array.isArray(res) ? res : res?.schedules || res?.data || [];
      return list.map(adaptBackendSchedule);
    } catch (err) {
      console.warn("Gagal memuat jadwal dari API:", err);
      return [];
    }
  },

  async createSchedule(
    item: Omit<ScheduleItem, "id"> & {
      startTime?: string;
      endTime?: string;
      subjectId?: string | number;
    },
  ): Promise<ScheduleItem> {
    const dayOfWeek = DAY_ID_TO_EN[item.day] || "Monday";
    let [startTime, endTime] = (item.time || "07:00 - 08:30")
      .split(" - ")
      .map((s) => s.trim());
    if (item.startTime) startTime = item.startTime;
    if (item.endTime) endTime = item.endTime;

    // Pastikan format tepat 5 karakter (HH:MM)
    const formattedStart = startTime.slice(0, 5);
    const formattedEnd = endTime.slice(0, 5);

    let subjectId = Number(item.subjectId);
    if (!subjectId || isNaN(subjectId)) {
      const subjects = await subjectService.getSubjects();
      const matched = subjects.find(
        (s) => s.name.toLowerCase() === (item.subjectName || "").toLowerCase(),
      );
      if (matched) {
        subjectId = Number(matched.id);
      } else {
        const created = await subjectService.createSubject({
          name: item.subjectName || "Umum",
          color: item.subjectColor || "#2563EB",
          difficulty: "Sedang",
        });
        subjectId = Number(created.id);
      }
    }

    const payload = {
      subject_id: subjectId,
      day_of_week: dayOfWeek,
      start_time: formattedStart,
      end_time: formattedEnd,
    };

    const res = await apiRequest("/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return adaptBackendSchedule(res);
  },

  async deleteSchedule(id: string): Promise<void> {
    await apiRequest(`/schedules/${id}`, { method: "DELETE" });
  },
};
