import { apiRequest } from './apiClient';
import { AISession } from '../types';

export function adaptBackendSession(raw: any): AISession {
  return {
    id: String(raw.id),
    taskId: String(raw.task_id || raw.taskId || ''),
    taskTitle: raw.task_title || raw.title || 'Sesi Belajar Terjadwal',
    subject: raw.subject_name || raw.subject || 'Umum',
    subjectColor: raw.subject_color || '#2563EB',
    sessionDate: raw.session_date || raw.scheduled_date || new Date().toISOString(),
    timeSlot: raw.time_slot || raw.priority_label || 'Prioritas #1',
    durationMinutes: raw.duration_minutes || raw.duration || 45,
    targetProgress: raw.target_progress || 50,
    reason: raw.reason || raw.ai_reasoning || 'Rekomendasi AI berdasarkan urgensi deadline.',
    status: raw.status || 'recommended',
  };
}

export const studySessionService = {
  async getRecommendations(): Promise<AISession[]> {
    try {
      const res = await apiRequest('/v1/study-sessions/recommendations', { method: 'GET' });
      const list = Array.isArray(res) ? res : res?.sessions || res?.recommendations || res?.data || [];
      return list.map(adaptBackendSession);
    } catch (err) {
      console.warn('Gagal memuat rekomendasi sesi AI dari API:', err);
      return [];
    }
  },

  async acceptSession(id: string): Promise<void> {
    await apiRequest(`/v1/study-sessions/${id}/accept`, { method: 'POST' });
  },

  async rejectSession(id: string, reason?: string): Promise<void> {
    await apiRequest(`/v1/study-sessions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async reschedule(): Promise<AISession[]> {
    const res = await apiRequest('/v1/study-sessions/reschedule', { method: 'POST' });
    const list = Array.isArray(res) ? res : res?.sessions || res?.recommendations || res?.data || [];
    return list.map(adaptBackendSession);
  },
};
