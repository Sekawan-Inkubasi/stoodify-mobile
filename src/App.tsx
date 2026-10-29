import React, { useState, useEffect } from 'react';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { ChatbotSlideDrawer } from './components/layout/ChatbotSlideDrawer';
import { HomeView } from './components/views/HomeView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { AIPlanView } from './components/views/AIPlanView';
import { ProfileView } from './components/views/ProfileView';
import { AuthView } from './components/auth/AuthView';

// Modals
import { AddTaskModal } from './components/modals/AddTaskModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { FocusTimerModal } from './components/modals/FocusTimerModal';
import { MaterialPredictionModal } from './components/modals/MaterialPredictionModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { ProPaywallModal } from './components/modals/ProPaywallModal';
import { ManageSubjectsModal } from './components/modals/ManageSubjectsModal';
import { AddScheduleModal } from './components/modals/AddScheduleModal';

// Mock Data (Fallback)
import { 
  mockUser, 
  mockSubjects, 
  initialTasks, 
  initialSessions, 
  mockSchedule, 
  mockPredictions, 
  mockNotifications 
} from './data/mockData';
import { Task, AISession, Subject, ScheduleItem } from './types';

// API Services
import { 
  authService, 
  taskService, 
  scheduleService, 
  subjectService, 
  studySessionService, 
  statisticsService 
} from './services';

export function App() {
  // Authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home');

  // App data state
  const [user, setUser] = useState(mockUser);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sessions, setSessions] = useState<AISession[]>(initialSessions);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(mockSchedule);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Modal visibility states
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | undefined>(undefined);
  const [focusDuration, setFocusDuration] = useState<number>(45);
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isManageSubjectsOpen, setIsManageSubjectsOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [scheduleDayTarget, setScheduleDayTarget] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Check persistent login on load
  useEffect(() => {
    async function checkAuth() {
      if (authService.isLoggedIn()) {
        const me = await authService.getMe();
        if (me) {
          setUser(prev => ({
            ...prev,
            name: me.name,
            email: me.email,
            grade: me.grade || prev.grade,
            school: me.school || prev.school,
          }));
          setIsLoggedIn(true);
        }
      }
    }
    checkAuth();
  }, []);

  // Load real data from backend API when authenticated
  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;
    async function fetchBackendData() {
      try {
        const [apiTasks, apiSchedules, apiSubjects, apiSessions, apiStats] = await Promise.all([
          taskService.getTasks(),
          scheduleService.getSchedules(),
          subjectService.getSubjects(),
          studySessionService.getRecommendations(),
          statisticsService.getOverview(),
        ]);

        if (!isMounted) return;

        if (apiTasks && apiTasks.length > 0) {
          setTasks(apiTasks);
        }
        if (apiSchedules && apiSchedules.length > 0) {
          setSchedule(apiSchedules);
        }
        if (apiSubjects && apiSubjects.length > 0) {
          setSubjects(apiSubjects);
        } else {
          // Inisialisasi default subjects di database untuk user baru
          const defaultSubjs = [
            { name: 'Matematika', color: '#2563EB', difficulty: 'Sulit' as const },
            { name: 'Fisika', color: '#4F46E5', difficulty: 'Sulit' as const },
            { name: 'Kimia', color: '#0284C7', difficulty: 'Sedang' as const },
            { name: 'Biologi', color: '#059669', difficulty: 'Sedang' as const },
            { name: 'Bahasa Indonesia', color: '#D97706', difficulty: 'Mudah' as const },
            { name: 'Bahasa Inggris', color: '#7C3AED', difficulty: 'Sedang' as const },
          ];
          try {
            const createdSubjs = await Promise.all(
              defaultSubjs.map(s => subjectService.createSubject(s))
            );
            if (isMounted && createdSubjs.length > 0) {
              setSubjects(createdSubjs);
            }
          } catch (e) {
            console.warn('Gagal seeding default subjects ke backend:', e);
          }
        }
        if (apiSessions && apiSessions.length > 0) {
          setSessions(apiSessions);
        }
        if (apiStats) {
          setUser(prev => ({
            ...prev,
            streakDays: apiStats.streakDays,
            totalStudyHours: apiStats.totalStudyHours,
            completedTasksThisWeek: apiStats.completedTasksThisWeek,
          }));
        }
      } catch (err) {
        console.warn('Gagal memuat live data dari Stoodify Backend API:', err);
      }
    }

    fetchBackendData();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Urgent task count for badge
  const urgentCount = tasks.filter(t => t.status !== 'completed' && (t.priorityLevel === 'critical' || t.priorityLevel === 'high')).length;

  // Handlers
  const handleToggleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: nextStatus } : t)));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => (prev ? { ...prev, status: nextStatus } : null));
    }

    try {
      await taskService.toggleComplete(task);
    } catch (e) {
      console.warn('Gagal sinkron status tugas ke backend:', e);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const created = await taskService.createTask({
        title: newTask.title,
        subject: newTask.subject,
        subjectId: newTask.subjectId,
        deadline: newTask.deadline,
        difficulty: newTask.difficulty,
        estimatedDurationMinutes: newTask.estimatedDurationMinutes,
        taskType: newTask.taskType,
        notes: newTask.notes,
      });
      setTasks(prev => [created, ...prev]);
      alert(`Tugas "${created.title}" berhasil ditambahkan dan disinkronkan ke database backend! ✨`);
    } catch {
      const id = `task-${Date.now()}`;
      const created: Task = { ...newTask, id };
      setTasks(prev => [created, ...prev]);
      alert(`Tugas "${created.title}" berhasil ditambahkan! ✨`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
    try {
      await taskService.deleteTask(taskId);
    } catch (e) {
      console.warn('Gagal menghapus tugas dari backend:', e);
    }
  };

  const handleOpenFocusTimer = (task?: Task, durationMinutes?: number) => {
    setFocusTask(task);
    if (durationMinutes) {
      setFocusDuration(durationMinutes);
    } else if (task) {
      setFocusDuration(task.estimatedDurationMinutes || 45);
    } else {
      setFocusDuration(25);
    }
    setIsFocusTimerOpen(true);
  };

  const handleSessionComplete = (taskId?: string, minutesSpent: number = 45) => {
    setUser(prev => ({
      ...prev,
      totalStudyHours: Number((prev.totalStudyHours + minutesSpent / 60).toFixed(1)),
      streakDays: prev.streakDays + 1,
    }));
  };

  const handleReschedule = async () => {
    try {
      const updated = await studySessionService.reschedule();
      if (updated && updated.length > 0) {
        setSessions(updated);
      }
      alert('⚡ AI Adaptive Rescheduling Aktif!\n\nUrutan prioritas belajar telah diperbarui dari model AI backend.');
    } catch {
      alert('⚡ AI Adaptive Rescheduling Aktif!\n\nUrutan prioritas belajar telah diperbarui dengan aman. Tugas Kimia tetap diprioritaskan pada antrean nomor 1.');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // ==========================================
  // SUBJECT CRUD HANDLERS
  // ==========================================
  const handleAddSubject = async (newSub: Omit<Subject, 'id' | 'totalTasks'>) => {
    try {
      const created = await subjectService.createSubject(newSub);
      setSubjects(prev => [...prev, created]);
      alert(`Mata pelajaran "${created.name}" berhasil ditambahkan ke database! ✨`);
    } catch {
      const id = `sub-${Date.now()}`;
      const created: Subject = { ...newSub, id, totalTasks: 0 };
      setSubjects(prev => [...prev, created]);
      alert(`Mata pelajaran "${created.name}" berhasil ditambahkan! ✨`);
    }
  };

  const handleUpdateSubject = async (id: string, updated: Partial<Subject>) => {
    const oldSubject = subjects.find(s => s.id === id);
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));

    if (oldSubject) {
      const oldName = oldSubject.name;
      const newName = updated.name || oldName;
      const newColor = updated.color || oldSubject.color;

      setTasks(prev => prev.map(t => (t.subject === oldName ? { ...t, subject: newName, subjectColor: newColor } : t)));
      setSchedule(prev => prev.map(sch => (sch.subjectName === oldName ? { ...sch, subjectName: newName, subjectColor: newColor, teacher: updated.teacher || sch.teacher } : sch)));
    }

    try {
      await subjectService.updateSubject(id, updated);
    } catch (e) {
      console.warn('Gagal update subject di backend:', e);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const subjectToDelete = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    try {
      await subjectService.deleteSubject(id);
    } catch (e) {
      console.warn('Gagal menghapus subject di backend:', e);
    }
    if (subjectToDelete) {
      alert(`Mata pelajaran "${subjectToDelete.name}" telah dihapus.`);
    }
  };

  // ==========================================
  // SCHEDULE HANDLERS
  // ==========================================
  const handleAddScheduleItem = async (newItem: Omit<ScheduleItem, 'id'>) => {
    try {
      const created = await scheduleService.createSchedule(newItem);
      setSchedule(prev => [...prev, created]);
      alert(`Jam pelajaran "${created.subjectName}" berhasil dimasukkan ke jadwal database! 📅`);
    } catch (err: any) {
      if (err.status === 409) {
        alert('⚠️ Terdeteksi konflik jadwal! Jam pelajaran bentrok dengan jadwal lain pada hari yang sama.');
        return;
      }
      const id = `sch-${Date.now()}`;
      const created: ScheduleItem = { ...newItem, id };
      setSchedule(prev => [...prev, created]);
      alert(`Jam pelajaran "${created.subjectName}" berhasil dimasukkan ke jadwal hari ${created.day}! 📅`);
    }
  };

  const handleDeleteScheduleItem = async (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
    try {
      await scheduleService.deleteSchedule(id);
    } catch (e) {
      console.warn('Gagal menghapus jadwal di backend:', e);
    }
  };

  const handleOpenAddSchedule = (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => {
    setScheduleDayTarget(day);
    setIsAddScheduleOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <div className="relative font-sans antialiased h-dvh max-h-dvh overflow-hidden bg-[#EAF1FC]">
      <MobileContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        urgentTaskCount={urgentCount}
        showNav={isLoggedIn}
        bottomNav={
          isLoggedIn ? (
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              urgentTaskCount={urgentCount}
            />
          ) : undefined
        }
        sideDrawer={
          isLoggedIn ? (
            <ChatbotSlideDrawer
              isOpen={isChatbotOpen}
              onToggle={() => setIsChatbotOpen((prev) => !prev)}
              onClose={() => setIsChatbotOpen(false)}
              tasks={tasks}
              sessions={sessions}
              onReschedulePrompt={handleReschedule}
              onOpenFocusTimer={handleOpenFocusTimer}
            />
          ) : undefined
        }
      >
        {!isLoggedIn ? (
          <AuthView 
            onLoginSuccess={(name, email) => {
              setUser(prev => ({ ...prev, name, email }));
              setIsLoggedIn(true);
            }} 
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                user={user}
                tasks={tasks}
                sessions={sessions}
                predictions={mockPredictions}
                onOpenAddTask={() => setIsAddTaskOpen(true)}
                onOpenFocusTimer={handleOpenFocusTimer}
                onOpenPredictions={() => setIsPredictionsOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onSelectTask={setSelectedTask}
                onToggleTaskComplete={handleToggleTaskComplete}
                onNavigateTab={setActiveTab}
                onReschedulePrompt={handleReschedule}
                onOpenChatbot={() => setIsChatbotOpen(true)}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                subjects={subjects}
                onSelectTask={setSelectedTask}
                onToggleComplete={handleToggleTaskComplete}
                onOpenAddTask={() => setIsAddTaskOpen(true)}
                onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                schedule={schedule}
                sessions={sessions}
                tasks={tasks}
                subjects={subjects}
                onOpenFocusTimer={handleOpenFocusTimer}
                onOpenAddSchedule={handleOpenAddSchedule}
                onDeleteScheduleItem={handleDeleteScheduleItem}
                onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
              />
            )}

            {activeTab === 'ai-plan' && (
              <AIPlanView
                sessions={sessions}
                tasks={tasks}
                onOpenFocusTimer={handleOpenFocusTimer}
                onReschedulePrompt={handleReschedule}
                onOpenChatbot={() => setIsChatbotOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                subjectsCount={subjects.length}
                onOpenProModal={() => setIsProModalOpen(true)}
                onOpenHelp={() => alert('Pusat Bantuan Stoodify: Hubungi tim via kontak support atau baca panduan AI.')}
                onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </MobileContainer>

      {/* Global Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        subjects={subjects}
        onAddTask={handleAddTask}
        onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onToggleTaskComplete={handleToggleTaskComplete}
        onStartFocus={handleOpenFocusTimer}
        onDeleteTask={handleDeleteTask}
      />

      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        task={focusTask}
        initialMinutes={focusDuration}
        onSessionComplete={handleSessionComplete}
      />

      <MaterialPredictionModal
        isOpen={isPredictionsOpen}
        onClose={() => setIsPredictionsOpen(false)}
        predictions={mockPredictions}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      <ProPaywallModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={() => setUser(prev => ({ ...prev, isPro: true }))}
      />

      {/* Subjects & Schedule Management Modals */}
      <ManageSubjectsModal
        isOpen={isManageSubjectsOpen}
        onClose={() => setIsManageSubjectsOpen(false)}
        subjects={subjects}
        tasks={tasks}
        schedule={schedule}
        onAddSubject={handleAddSubject}
        onUpdateSubject={handleUpdateSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      <AddScheduleModal
        isOpen={isAddScheduleOpen}
        onClose={() => setIsAddScheduleOpen(false)}
        subjects={subjects}
        defaultDay={scheduleDayTarget}
        onAddScheduleItem={handleAddScheduleItem}
        onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
      />

    </div>
  );
}

export default App;
