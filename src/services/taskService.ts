import { apiRequest } from './apiClient';
import { Task, PriorityLevel, TaskStatus } from '../types';

const SUBJECT_COLORS: Record<string, string> = {
  Matematika: '#2563EB',
  Fisika: '#4F46E5',
  Kimia: '#0284C7',
  Biologi: '#059669',
  'Bahasa Indonesia': '#D97706',
  'Bahasa Inggris': '#7C3AED',
  'Sejarah Indonesia': '#E11D48',
  default: '#3B82F6',
};

function formatDeadlineDate(dateStr: string): string {
  if (!dateStr) return 'Segera';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function adaptBackendTask(raw: any): Task {
  const subjectName = raw.subject_name || raw.subject?.name || raw.subject || 'Umum';
  const color = raw.subject_color || SUBJECT_COLORS[subjectName] || SUBJECT_COLORS.default;
  
  let difficulty: 'Mudah' | 'Sedang' | 'Sulit' = 'Sedang';
  if (raw.difficulty === 1 || raw.difficulty === 2 || raw.difficulty === 'Mudah') difficulty = 'Mudah';
  else if (raw.difficulty === 4 || raw.difficulty === 5 || raw.difficulty === 'Sulit') difficulty = 'Sulit';

  let priorityLevel: PriorityLevel = 'medium';
  const score = raw.priority_score || 50;
  if (score >= 90 || raw.priority_level === 'critical') priorityLevel = 'critical';
  else if (score >= 75 || raw.priority_level === 'high') priorityLevel = 'high';
  else if (score <= 40 || raw.priority_level === 'low') priorityLevel = 'low';

  let status: TaskStatus = 'in_progress';
  if (raw.progress_percentage === 100 || raw.status === 'completed' || raw.status === 'done') {
    status = 'completed';
  } else if (raw.progress_percentage === 0 || raw.status === 'not_started' || raw.status === 'pending') {
    status = 'not_started';
  }

  return {
    id: String(raw.id),
    title: raw.title || 'Tugas Tanpa Judul',
    subject: subjectName,
    subjectColor: color,
    deadline: raw.deadline || new Date().toISOString(),
    deadlineFormatted: formatDeadlineDate(raw.deadline),
    difficulty,
    estimatedDurationMinutes: raw.estimated_time || raw.estimated_duration || 45,
    priorityLevel,
    priorityScore: score,
    status,
    aiReasoning: raw.ai_reasoning || 'Dianalisis berdasarkan batas waktu dan tingkat kesulitan materi.',
    taskType: (raw.task_type as any) || 'Individu',
    notes: raw.description || raw.notes || '',
    scheduledSlot: raw.scheduled_slot || (priorityLevel === 'critical' ? 'Prioritas #1' : undefined),
  };
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiRequest('/v1/tasks', { method: 'GET' });
      const list = Array.isArray(res) ? res : res?.tasks || res?.data || [];
      return list.map(adaptBackendTask);
    } catch (err) {
      console.warn('Gagal memuat tugas dari API:', err);
      return [];
    }
  },

  async createTask(task: Partial<Task> & { title: string; subject: string; deadline: string }): Promise<Task> {
    const payload = {
      title: task.title,
      description: task.notes || '',
      subject_name: task.subject,
      deadline: task.deadline.includes('T') ? task.deadline : `${task.deadline}T23:59:00Z`,
      difficulty: task.difficulty === 'Sulit' ? 4 : task.difficulty === 'Mudah' ? 2 : 3,
      estimated_time: task.estimatedDurationMinutes || 45,
      type: task.taskType || 'assignment',
    };

    const res = await apiRequest('/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return adaptBackendTask(res);
  },

  async updateTaskProgress(taskId: string, progressPercentage: number): Promise<void> {
    await apiRequest(`/v1/tasks/${taskId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress_percentage: progressPercentage }),
    });
  },

  async toggleComplete(task: Task): Promise<TaskStatus> {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    const nextProgress = nextStatus === 'completed' ? 100 : 50;
    try {
      await this.updateTaskProgress(task.id, nextProgress);
    } catch (err) {
      console.warn('Gagal update progress ke backend:', err);
    }
    return nextStatus;
  },

  async deleteTask(taskId: string): Promise<void> {
    await apiRequest(`/v1/tasks/${taskId}`, { method: 'DELETE' });
  },
};
