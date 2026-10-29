import React, { useState } from 'react';
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
import { PreferencesModal } from './components/modals/PreferencesModal';
import { ProPaywallModal } from './components/modals/ProPaywallModal';
import { ManageSubjectsModal } from './components/modals/ManageSubjectsModal';
import { AddScheduleModal } from './components/modals/AddScheduleModal';

// Mock Data
import { 
  mockUser, 
  mockSubjects, 
  initialTasks, 
  initialSessions, 
  mockSchedule, 
  mockPredictions, 
  mockNotifications, 
  defaultPreferences 
} from './data/mockData';
import { Task, AISession, StudyPreferences, Subject, ScheduleItem } from './types';

export function App() {
  // Authentication status: defaults to false so initial visitors see the Welcome & Login flow
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home');

  // App data state
  const [user, setUser] = useState(mockUser);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sessions, setSessions] = useState<AISession[]>(initialSessions);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(mockSchedule);
  const [preferences, setPreferences] = useState<StudyPreferences>(defaultPreferences);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Modal visibility states
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | undefined>(undefined);
  const [focusDuration, setFocusDuration] = useState<number>(45);
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isManageSubjectsOpen, setIsManageSubjectsOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [scheduleDayTarget, setScheduleDayTarget] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Urgent task count for badge
  const urgentCount = tasks.filter(t => t.status !== 'completed' && (t.priorityLevel === 'critical' || t.priorityLevel === 'high')).length;

  // Handlers
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...t,
          status: nextStatus,
        };
      }
      return t;
    }));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        status: prev.status === 'completed' ? 'in_progress' : 'completed',
      } : null);
    }
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const id = `task-${Date.now()}`;
    const created: Task = { ...newTask, id };
    setTasks([created, ...tasks]);
    alert(`Tugas "${created.title}" berhasil ditambahkan dan dijadwalkan oleh AI! ✨`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
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

  const handleReschedule = () => {
    alert('⚡ AI Adaptive Rescheduling Aktif!\n\nUrutan prioritas belajar telah diperbarui dengan aman. Tugas Kimia tetap diprioritaskan pada antrean nomor 1.');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // ==========================================
  // SUBJECT CRUD HANDLERS
  // ==========================================
  const handleAddSubject = (newSub: Omit<Subject, 'id' | 'totalTasks'>) => {
    const id = `sub-${Date.now()}`;
    const created: Subject = { ...newSub, id, totalTasks: 0 };
    setSubjects(prev => [...prev, created]);
    alert(`Mata pelajaran "${created.name}" berhasil ditambahkan! ✨\nSekarang bisa dipilih untuk fitur Jadwal Sekolah dan Tugas.`);
  };

  const handleUpdateSubject = (id: string, updated: Partial<Subject>) => {
    const oldSubject = subjects.find(s => s.id === id);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));

    // Cascade update to matching tasks and schedule
    if (oldSubject) {
      const oldName = oldSubject.name;
      const newName = updated.name || oldName;
      const newColor = updated.color || oldSubject.color;

      setTasks(prev => prev.map(t => t.subject === oldName ? {
        ...t,
        subject: newName,
        subjectColor: newColor,
      } : t));

      setSchedule(prev => prev.map(sch => sch.subjectName === oldName ? {
        ...sch,
        subjectName: newName,
        subjectColor: newColor,
        teacher: updated.teacher || sch.teacher,
      } : sch));
    }
  };

  const handleDeleteSubject = (id: string) => {
    const subjectToDelete = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (subjectToDelete) {
      alert(`Mata pelajaran "${subjectToDelete.name}" telah dihapus.`);
    }
  };

  // ==========================================
  // SCHEDULE HANDLERS
  // ==========================================
  const handleAddScheduleItem = (newItem: Omit<ScheduleItem, 'id'>) => {
    const id = `sch-${Date.now()}`;
    const created: ScheduleItem = { ...newItem, id };
    setSchedule(prev => [...prev, created]);
    alert(`Jam pelajaran "${created.subjectName}" berhasil dimasukkan ke jadwal hari ${created.day}! 📅`);
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const handleOpenAddSchedule = (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => {
    setScheduleDayTarget(day);
    setIsAddScheduleOpen(true);
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
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                onOpenProModal={() => setIsProModalOpen(true)}
                onOpenHelp={() => alert('Pusat Bantuan Stoodify: Hubungi tim via kontak support atau baca panduan AI.')}
                onOpenManageSubjects={() => setIsManageSubjectsOpen(true)}
                onLogout={() => setIsLoggedIn(false)}
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

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={setPreferences}
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
