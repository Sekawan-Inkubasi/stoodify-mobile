import { apiRequest } from "./apiClient";
import { ScheduleItem } from "../types";

const DAY_MAP_TO_NUM: Record<string, number> = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
};

const NUM_TO_DAY_MAP: Record<
  number,
  "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat"
> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
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
  const dayNum =
    typeof raw.day_of_week === "number"
      ? raw.day_of_week
      : DAY_MAP_TO_NUM[raw.day] || 1;
  const day = NUM_TO_DAY_MAP[dayNum] || "Senin";
  const subjectName =
    raw.subject_name || raw.subject?.name || raw.title || "Mata Pelajaran";
  const color =
    raw.subject_color || SUBJECT_COLORS[subjectName] || SUBJECT_COLORS.default;
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
      subjectId?: string;
    },
  ): Promise<ScheduleItem> {
    const dayNum = DAY_MAP_TO_NUM[item.day] || 1;
    let [startTime, endTime] = (item.time || "07:00 - 08:30")
      .split(" - ")
      .map((s) => s.trim());
    if (item.startTime) startTime = item.startTime;
    if (item.endTime) endTime = item.endTime;

    const payload = {
      day_of_week: dayNum,
      start_time: startTime.length === 5 ? `${startTime}:00` : startTime,
      end_time: endTime.length === 5 ? `${endTime}:00` : endTime,
      subject_name: item.subjectName,
      subject_id: item.subjectId,
      room: item.room,
      teacher: item.teacher,
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
