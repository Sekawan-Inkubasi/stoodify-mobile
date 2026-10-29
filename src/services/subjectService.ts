import { apiRequest } from './apiClient';
import { Subject } from '../types';

export function adaptBackendSubject(raw: any): Subject {
  let difficulty: 'Mudah' | 'Sedang' | 'Sulit' = 'Sedang';
  if (raw.difficulty === 'Mudah' || raw.difficulty_level === 1 || raw.difficulty_level === 2) difficulty = 'Mudah';
  else if (raw.difficulty === 'Sulit' || raw.difficulty_level === 4 || raw.difficulty_level === 5) difficulty = 'Sulit';

  return {
    id: String(raw.id),
    name: raw.name || 'Mata Pelajaran',
    teacher: raw.teacher || raw.teacher_name || '',
    color: raw.color || '#2563EB',
    difficulty,
    totalTasks: raw.total_tasks || raw.active_task_count || 0,
  };
}

export const subjectService = {
  async getSubjects(): Promise<Subject[]> {
    try {
      const res = await apiRequest('/v1/subjects', { method: 'GET' });
      const list = Array.isArray(res) ? res : res?.subjects || res?.data || [];
      return list.map(adaptBackendSubject);
    } catch (err) {
      console.warn('Gagal memuat mata pelajaran dari API:', err);
      return [];
    }
  },

  async createSubject(subject: Omit<Subject, 'id' | 'totalTasks'>): Promise<Subject> {
    const payload = {
      name: subject.name,
      teacher: subject.teacher,
      color: subject.color,
      difficulty_level: subject.difficulty === 'Sulit' ? 4 : subject.difficulty === 'Mudah' ? 2 : 3,
    };

    const res = await apiRequest('/v1/subjects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return adaptBackendSubject(res);
  },

  async updateSubject(id: string, subject: Partial<Subject>): Promise<Subject> {
    const payload: any = {};
    if (subject.name) payload.name = subject.name;
    if (subject.color) payload.color = subject.color;
    if (subject.teacher) payload.teacher = subject.teacher;
    if (subject.difficulty) {
      payload.difficulty_level = subject.difficulty === 'Sulit' ? 4 : subject.difficulty === 'Mudah' ? 2 : 3;
    }

    const res = await apiRequest(`/v1/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return adaptBackendSubject(res);
  },

  async deleteSubject(id: string): Promise<void> {
    await apiRequest(`/v1/subjects/${id}`, { method: 'DELETE' });
  },
};
