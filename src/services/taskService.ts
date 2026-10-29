import { apiRequest } from "./apiClient";
import { Task, PriorityLevel, TaskStatus } from "../types";
import { subjectService } from "./subjectService";

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

function formatDeadlineDate(dateStr: string): string {
  if (!dateStr) return "Segera";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function adaptBackendTask(raw: any): Task {
  const subjectName =
    raw.subject?.name || raw.subject_name || raw.subject || "Umum";
  const color =
    raw.subject?.color ||
    raw.subject_color ||
    SUBJECT_COLORS[subjectName] ||
    SUBJECT_COLORS.default;

  let difficulty: "Mudah" | "Sedang" | "Sulit" = "Sedang";
  const diffVal = typeof raw.difficulty === "number" ? raw.difficulty : 3;
  if (diffVal <= 2 || raw.difficulty === "Mudah") difficulty = "Mudah";
  else if (diffVal >= 4 || raw.difficulty === "Sulit") difficulty = "Sulit";

  let priorityLevel: PriorityLevel = "medium";
  const score = raw.priority_score || 50;
  if (score >= 80 || raw.priority_level === "critical") priorityLevel = "critical";
  else if (score >= 60 || raw.priority_level === "high") priorityLevel = "high";
  else if (score <= 35 || raw.priority_level === "low") priorityLevel = "low";

  let status: TaskStatus = "in_progress";
  const progress =
    typeof raw.progress === "number"
      ? raw.progress
      : raw.progress_percentage || 0;
  if (progress === 100 || raw.status === "done" || raw.status === "completed") {
    status = "completed";
  } else if (
    progress === 0 &&
    (raw.status === "pending" || raw.status === "not_started")
  ) {
    status = "not_started";
  }

  return {
    id: String(raw.id),
    title: raw.title || "Tugas Tanpa Judul",
    subject: subjectName,
    subjectColor: color,
    deadline: raw.deadline || new Date().toISOString(),
    deadlineFormatted: formatDeadlineDate(raw.deadline),
    difficulty,
    estimatedDurationMinutes:
      raw.estimated_duration || raw.estimated_time || 45,
    priorityLevel,
    priorityScore: score,
    status,
    aiReasoning:
      raw.ai_reasoning ||
      "Dianalisis berdasarkan batas waktu dan tingkat kesulitan materi.",
    taskType: (raw.type as any) || (raw.task_type as any) || "Individu",
    notes: raw.description || raw.notes || "",
    scheduledSlot:
      raw.scheduled_slot ||
      (priorityLevel === "critical" ? "Prioritas #1" : undefined),
  };
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiRequest("/tasks", { method: "GET" });
      const list = Array.isArray(res) ? res : res?.tasks || res?.data || [];
      return list.map(adaptBackendTask);
    } catch (err) {
      console.warn("Gagal memuat tugas dari API:", err);
      return [];
    }
  },

  async createTask(
    task: Partial<Task> & {
      title: string;
      subject: string;
      deadline: string;
      subjectId?: string | number;
    },
  ): Promise<Task> {
    let subjectId = Number(task.subjectId);
    if (!subjectId || isNaN(subjectId)) {
      const existingSubjects = await subjectService.getSubjects();
      const matched = existingSubjects.find(
        (s) => s.name.toLowerCase() === (task.subject || "").toLowerCase(),
      );
      if (matched) {
        subjectId = Number(matched.id);
      } else {
        const created = await subjectService.createSubject({
          name: task.subject || "Umum",
          color: "#2563EB",
          difficulty: "Sedang",
        });
        subjectId = Number(created.id);
      }
    }

    let deadlineIso = task.deadline;
    if (!deadlineIso.includes("T")) {
      deadlineIso = `${deadlineIso}T23:59:00Z`;
    }

    const payload = {
      subject_id: subjectId,
      title: task.title,
      description: task.notes || "",
      deadline: deadlineIso,
      difficulty:
        task.difficulty === "Sulit" ? 4 : task.difficulty === "Mudah" ? 2 : 3,
      estimated_duration: task.estimatedDurationMinutes || 45,
      type:
        task.taskType === "Proyek"
          ? "project"
          : task.taskType === "Praktikum"
            ? "project"
            : "assignment",
      notes: task.notes || "",
    };

    const res = await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return adaptBackendTask(res);
  },

  async updateTaskProgress(
    taskId: string,
    progressPercentage: number,
  ): Promise<void> {
    const progress = Math.min(100, Math.max(0, Math.round(progressPercentage)));
    await apiRequest(`/tasks/${taskId}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ progress }),
    });
  },

  async toggleComplete(task: Task): Promise<TaskStatus> {
    const nextStatus: TaskStatus =
      task.status === "completed" ? "in_progress" : "completed";
    const nextProgress = nextStatus === "completed" ? 100 : 50;
    try {
      await this.updateTaskProgress(task.id, nextProgress);
      await apiRequest(`/tasks/${task.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus === "completed" ? "done" : "in_progress",
        }),
      });
    } catch (err) {
      console.warn("Gagal update status tugas ke backend:", err);
    }
    return nextStatus;
  },

  async deleteTask(taskId: string): Promise<void> {
    await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
  },
};
