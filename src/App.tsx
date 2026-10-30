import React, { useState, useEffect, useCallback } from 'react';
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
import { useDialog } from './context/DialogContext';

import { Task, AISession, Subject, ScheduleItem, AppNotification, MaterialPrediction, UserProfile } from './types';

// API Services
import { 
  authService, 
  taskService, 
  scheduleService, 
  subjectService, 
  studySessionService, 
  statisticsService,
  notificationService,
  predictionService 
} from './services';

export function App() {
  const { showAlert } = useDialog();

  // Authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home');

  const [user, setUser] = useState<UserProfile>({
    name: 'Siswa',
    grade: 'SMA - Fase F',
    school: 'Stoodify',
    email: '',
    streakDays: 0,
    totalStudyHours: 0,
    completedTasksThisWeek: 0,
    onTimeRate: 0,
    isPro: false,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [predictions, setPredictions] = useState<MaterialPrediction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

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

  const refreshBackendData = useCallback(async () => {
    if (!authService.isLoggedIn()) return;
    setIsLoadingData(true);
    try {
      const apiSubjects = await subjectService.getSubjects();
      const [apiTasks, apiSchedules, apiStats, apiNotifs] = await Promise.all([
        taskService.getTasks(apiSubjects),
        scheduleService.getSchedules(),
        statisticsService.getOverview(),
        notificationService.getNotifications(),
      ]);

      const [apiSessions, apiPredictions] = await Promise.all([
        studySessionService.getRecommendations(apiTasks),
        predictionService.getAllPredictions(apiSubjects),
      ]);

      setSubjects(apiSubjects || []);
      setTasks(apiTasks || []);
      setSchedule(apiSchedules || []);
      setSessions(apiSessions || []);
      setNotifications(apiNotifs || []);
      setPredictions(apiPredictions || []);

      if (apiStats) {
        setUser(prev => ({
          ...prev,
          streakDays: apiStats.streakDays,
          totalStudyHours: apiStats.totalStudyHours,
          completedTasksThisWeek: apiStats.completedTasksThisWeek,
          onTimeRate: apiStats.onTimeRate,
        }));
      }
    } catch (err) {
      console.warn('Gagal memuat live data dari Stoodify Backend API:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

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
        } else {
          setIsLoggedIn(false);
        }
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshBackendData();
    }
  }, [isLoggedIn, refreshBackendData]);

  // Urgent task count for badge
  const urgentCount = tasks.filter(t => t.status !== 'completed' && (t.priorityLevel === 'critical' || t.priorityLevel === 'high')).length;

  // Handlers
  const handleToggleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const nextStatus = await taskService.toggleComplete(task);
      setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: nextStatus } : t)));

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(prev => (prev ? { ...prev, status: nextStatus } : null));
      }

      const stats = await statisticsService.getOverview();
      setUser(prev => ({
        ...prev,
        streakDays: stats.streakDays,
        totalStudyHours: stats.totalStudyHours,
        completedTasksThisWeek: stats.completedTasksThisWeek,
        onTimeRate: stats.onTimeRate,
      }));
    } catch (e: any) {
      showAlert(e.message || 'Gagal mengubah status tugas di server.', 'Gagal Update Tugas', 'warning');
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
      showAlert(`Tugas "${created.title}" berhasil ditambahkan ke database backend! ✨`, 'Tugas Berhasil Ditambahkan', 'success');

      statisticsService.getOverview().then(stats => {
        setUser(prev => ({
          ...prev,
          streakDays: stats.streakDays,
          totalStudyHours: stats.totalStudyHours,
          completedTasksThisWeek: stats.completedTasksThisWeek,
          onTimeRate: stats.onTimeRate,
        }));
      });
    } catch (err: any) {
      showAlert(err.message || 'Gagal menyimpan tugas ke database backend.', 'Gagal Tambah Tugas', 'warning');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedTask(null);
      showAlert('Tugas berhasil dihapus dari database.', 'Tugas Dihapus', 'info');

      statisticsService.getOverview().then(stats => {
        setUser(prev => ({
          ...prev,
          streakDays: stats.streakDays,
          totalStudyHours: stats.totalStudyHours,
          completedTasksThisWeek: stats.completedTasksThisWeek,
          onTimeRate: stats.onTimeRate,
        }));
      });
    } catch (e: any) {
      showAlert(e.message || 'Gagal menghapus tugas dari database.', 'Gagal Hapus Tugas', 'warning');
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

  const handleSessionComplete = async (taskId?: string, minutesSpent: number = 45) => {
    try {
      const stats = await statisticsService.getOverview();
      setUser(prev => ({
        ...prev,
        totalStudyHours: stats.totalStudyHours,
        streakDays: stats.streakDays,
        completedTasksThisWeek: stats.completedTasksThisWeek,
        onTimeRate: stats.onTimeRate,
      }));
    } catch {
      setUser(prev => ({
        ...prev,
        totalStudyHours: Number((prev.totalStudyHours + minutesSpent / 60).toFixed(1)),
      }));
    }
  };

  const handleReschedule = async () => {
    try {
      const updated = await studySessionService.reschedule();
      setSessions(updated || []);
      showAlert('Urutan prioritas belajar telah diperbarui dari model AI backend.', 'AI Adaptive Rescheduling Aktif', 'success');
    } catch (err: any) {
      showAlert(err.message || 'Tidak ada sesi yang perlu disusun ulang saat ini.', 'Adaptive Rescheduling', 'info');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await notificationService.markAllAsRead();
  };

  const handleAddSubject = async (newSub: Omit<Subject, 'id' | 'totalTasks'>) => {
    try {
      const created = await subjectService.createSubject(newSub);
      setSubjects(prev => [...prev, created]);
      showAlert(`Mata pelajaran "${created.name}" berhasil ditambahkan ke database! ✨`, 'Mata Pelajaran Ditambahkan', 'success');
      refreshBackendData();
    } catch (err: any) {
      showAlert(err.message || 'Gagal menambahkan mata pelajaran ke server.', 'Gagal Tambah Mapel', 'warning');
    }
  };

  const handleUpdateSubject = async (id: string, updated: Partial<Subject>) => {
    try {
      const saved = await subjectService.updateSubject(id, updated);
      setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...saved } : s)));
      refreshBackendData();
    } catch (e: any) {
      showAlert(e.message || 'Gagal memperbarui mata pelajaran di server.', 'Gagal Update Mapel', 'warning');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const subjectToDelete = subjects.find(s => s.id === id);
    try {
      await subjectService.deleteSubject(id);
      setSubjects(prev => prev.filter(s => s.id !== id));
      if (subjectToDelete) {
        showAlert(`Mata pelajaran "${subjectToDelete.name}" telah dihapus.`, 'Mata Pelajaran Dihapus', 'info');
      }
      refreshBackendData();
    } catch (e: any) {
      showAlert(e.message || 'Gagal menghapus mata pelajaran dari server.', 'Gagal Hapus Mapel', 'warning');
    }
  };

  const handleAddScheduleItem = async (newItem: Omit<ScheduleItem, 'id'>) => {
    try {
      const created = await scheduleService.createSchedule(newItem);
      setSchedule(prev => [...prev, created]);
      showAlert(`Jam pelajaran "${created.subjectName}" berhasil dimasukkan ke jadwal database! 📅`, 'Jadwal Ditambahkan', 'success');
    } catch (err: any) {
      if (err.status === 409) {
        showAlert('Terdeteksi konflik jadwal! Jam pelajaran bentrok dengan jadwal lain pada hari yang sama.', 'Konflik Jadwal Pelajaran', 'warning');
        return;
      }
      showAlert(err.message || 'Gagal menyimpan jadwal ke database backend.', 'Gagal Tambah Jadwal', 'warning');
    }
  };

  const handleDeleteScheduleItem = async (id: string) => {
    try {
      await scheduleService.deleteSchedule(id);
      setSchedule(prev => prev.filter(s => s.id !== id));
      showAlert('Jadwal pelajaran berhasil dihapus.', 'Jadwal Dihapus', 'info');
    } catch (e: any) {
      showAlert(e.message || 'Gagal menghapus jadwal dari database.', 'Gagal Hapus Jadwal', 'warning');
    }
  };

  const handleOpenAddSchedule = (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => {
    setScheduleDayTarget(day);
    setIsAddScheduleOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser({
      name: '',
      grade: 'SMA - Fase F',
      school: 'Stoodify',
      email: '',
      streakDays: 0,
      totalStudyHours: 0,
      completedTasksThisWeek: 0,
      onTimeRate: 0,
      isPro: false,
    });
    setTasks([]);
    setSubjects([]);
    setSchedule([]);
    setSessions([]);
    setNotifications([]);
    setPredictions([]);
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
              user={user}
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
                predictions={predictions}
                isLoading={isLoadingData}
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
                isLoading={isLoadingData}
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
                isLoading={isLoadingData}
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
                isLoading={isLoadingData}
                onOpenFocusTimer={handleOpenFocusTimer}
                onReschedulePrompt={handleReschedule}
                onOpenChatbot={() => setIsChatbotOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                subjectsCount={subjects.length}
                isLoading={isLoadingData}
                onOpenProModal={() => setIsProModalOpen(true)}
                onOpenHelp={() => showAlert('Hubungi tim kami via kontak support sekolah atau baca panduan asisten AI Stoodify untuk tips belajar efektif.', 'Pusat Bantuan Stoodify', 'info')}
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
        predictions={predictions}
        subjects={subjects}
        onGenerateNew={async (subId) => {
          const sub = subjects.find(s => s.id === subId);
          const newPred = await predictionService.generatePrediction(subId, sub);
          if (newPred) {
            setPredictions(prev => [newPred, ...prev.filter(p => p.id !== newPred.id)]);
          }
        }}
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
