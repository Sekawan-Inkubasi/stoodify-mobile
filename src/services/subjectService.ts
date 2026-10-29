import { apiRequest } from "./apiClient";
import { Subject } from "../types";

export function adaptBackendSubject(raw: any): Subject {
  let difficulty: "Mudah" | "Sedang" | "Sulit" = "Sedang";
  const diffVal = raw.difficulty || raw.difficulty_level || 3;
  if (diffVal <= 2 || raw.difficulty === "Mudah") difficulty = "Mudah";
  else if (diffVal >= 4 || raw.difficulty === "Sulit") difficulty = "Sulit";

  return {
    id: String(raw.id),
    name: raw.name || "Mata Pelajaran",
    teacher: raw.teacher || raw.teacher_name || "",
    color: raw.color || "#2563EB",
    difficulty,
    totalTasks: raw.total_tasks || raw.active_task_count || 0,
  };
}

export const subjectService = {
  async getSubjects(): Promise<Subject[]> {
    try {
      const res = await apiRequest("/subjects", { method: "GET" });
      const list = Array.isArray(res) ? res : res?.subjects || res?.data || [];
      return list.map(adaptBackendSubject);
    } catch (err) {
      console.warn("Gagal memuat mata pelajaran dari API:", err);
      return [];
    }
  },

  async createSubject(
    subject: Omit<Subject, "id" | "totalTasks">,
  ): Promise<Subject> {
    const payload = {
      name: subject.name,
      color: subject.color || "#2563EB",
      difficulty:
        subject.difficulty === "Sulit"
          ? 4
          : subject.difficulty === "Mudah"
            ? 2
            : 3,
    };

    const res = await apiRequest("/subjects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return adaptBackendSubject(res);
  },

  async updateSubject(id: string, subject: Partial<Subject>): Promise<Subject> {
    const payload: any = {};
    if (subject.name) payload.name = subject.name;
    if (subject.color) payload.color = subject.color;
    if (subject.difficulty) {
      payload.difficulty =
        subject.difficulty === "Sulit"
          ? 4
          : subject.difficulty === "Mudah"
            ? 2
            : 3;
    }

    const res = await apiRequest(`/subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return adaptBackendSubject(res);
  },

  async deleteSubject(id: string): Promise<void> {
    await apiRequest(`/subjects/${id}`, { method: "DELETE" });
  },
};
