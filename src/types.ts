export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  deadline: string; // ISO date string or formatted
  deadlineFormatted: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  estimatedDurationMinutes: number;
  priorityLevel: PriorityLevel;
  priorityScore: number;
  status: TaskStatus;
  aiReasoning: string;
  taskType: 'Individu' | 'Kelompok' | 'Praktikum' | 'Proyek' | 'Ulangan' | 'Hafalan';
  notes?: string;
  scheduledSlot?: string;
}

export interface AISession {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  subjectColor: string;
  sessionDate: string;
  timeSlot: string; // e.g. "19:30 - 20:15"
  durationMinutes: number;
  targetProgress: number; // e.g. 40%
  reason: string;
  status: 'recommended' | 'accepted' | 'in_progress' | 'completed' | 'skipped';
}

export interface Subject {
  id: string;
  name: string;
  teacher?: string;
  color: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  totalTasks: number;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  subjectName: string;
  subjectColor: string;
  time: string;
  room: string;
  teacher: string;
}

export interface MaterialPrediction {
  id: string;
  subject: string;
  subjectColor: string;
  predictedTopic: string;
  confidence: number; // 0 - 100
  reason: string;
  prerequisites: string[];
  preparationTips: string;
  userFeedback?: 'accurate' | 'inaccurate';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'deadline' | 'session' | 'system' | 'streak';
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  grade: string;
  school: string;
  email: string;
  streakDays: number;
  totalStudyHours: number;
  completedTasksThisWeek: number;
  isPro: boolean;
}

export interface StudyPreferences {
  startTime: string; // e.g. "19:00"
  endTime: string;   // e.g. "21:30"
  sessionDurationMinutes: number;
  breakDurationMinutes: number;
  maxSessionsPerDay: number;
  activeDays: string[];
  blockedRoutines: {
    id: string;
    title: string;
    time: string;
    day: string;
  }[];
}
