import { apiRequest } from "./apiClient";

export interface UserStats {
  streakDays: number;
  totalStudyHours: number;
  completedTasksThisWeek: number;
  onTimeRate: number;
}

export const statisticsService = {
  async getOverview(): Promise<UserStats> {
    try {
      const res = await apiRequest("/statistics/overview", { method: "GET" });
      const studyMinutes = res?.total_study_minutes || 0;
      const hours = Number((studyMinutes / 60).toFixed(1));
      const onTime = typeof res?.on_time_rate === 'number' ? Math.round(res.on_time_rate) : 0;
      return {
        streakDays: res?.streak_days || 0,
        totalStudyHours: hours,
        completedTasksThisWeek: res?.done_tasks ?? res?.completed_tasks ?? 0,
        onTimeRate: onTime,
      };
    } catch {
      return {
        streakDays: 0,
        totalStudyHours: 0,
        completedTasksThisWeek: 0,
        onTimeRate: 0,
      };
    }
  },
};
