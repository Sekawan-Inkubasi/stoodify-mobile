import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  Sparkles, 
  Compass, 
  Target, 
  Clock, 
  Circle, 
  CheckCircle2, 
  ChevronRight, 
  Brain, 
  ArrowUpRight,
  Flame,
  Zap,
  Timer,
  Plus,
  Calendar
} from 'lucide-react';
import { UserProfile, Task, AISession, MaterialPrediction } from '../../types';

interface HomeViewProps {
  user: UserProfile;
  tasks: Task[];
  sessions: AISession[];
  predictions: MaterialPrediction[];
  onOpenAddTask: () => void;
  onOpenFocusTimer: (task?: Task) => void;
  onOpenPredictions: () => void;
  onOpenNotifications: () => void;
  onSelectTask: (task: Task) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onNavigateTab: (tab: string) => void;
  onReschedulePrompt?: () => void;
  onOpenChatbot?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  tasks,
  sessions,
  predictions,
  onOpenAddTask,
  onOpenFocusTimer,
  onOpenPredictions,
  onOpenNotifications,
  onSelectTask,
  onToggleTaskComplete,
  onNavigateTab,
  onReschedulePrompt,
  onOpenChatbot,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'logic' | 'visual' | 'focus'>('all');
  
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const criticalCount = pendingTasks.filter(t => t.priorityLevel === 'critical' || t.priorityLevel === 'high').length;
  const urgentTasks = pendingTasks.slice(0, 3);
  const todaySession = sessions[0];
  const topPrediction = predictions[0];

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER APP BAR (Clean Modern Avatar + Actions)     */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pt-1 pb-1">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => onNavigateTab('profile')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-300 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                Halo, {user.name.split(' ')[0]}
              </h2>
              <span className="text-[9px] font-semibold bg-[#0062FF]/10 text-[#0062FF] px-2 py-0.2 rounded-full">
                Fase F
              </span>
            </div>
            <p className="text-[11px] font-normal text-slate-500 flex items-center gap-1">
              <span>{user.school.split(' ')[0]}</span>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded-full">
                🔥 {user.streakDays}d Streak
              </span>
            </p>
          </div>
        </div>

        {/* Circular Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateTab('tasks')}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-[0_4px_16px_rgba(20,40,90,0.06)] border border-white/80 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            aria-label="Cari tugas"
          >
            <Search className="w-4 h-4 stroke-[2px]" />
          </button>
          
          <button 
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-[0_4px_16px_rgba(20,40,90,0.06)] border border-white/80 flex items-center justify-center relative hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            aria-label="Notifikasi"
          >
            <Bookmark className="w-4 h-4 stroke-[2px]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SIGNATURE "SMART STUDY DECK" (Fintech Card x Bento)    */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-[#0B3CD5] via-[#0055F6] to-[#4338CA] rounded-[28px] p-5 text-white shadow-[0_16px_40px_rgba(0,85,246,0.22)] relative overflow-hidden">
        
        {/* Subtle Topographic Ambient Curves in Background */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-32 h-32 bg-cyan-400/15 rounded-full blur-xl pointer-events-none" />
        
        {/* Center Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-white/15 relative z-10">
          <div>
            <span className="text-[11px] text-blue-100/90 font-medium block">
              Total Tugas
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                {tasks.length}
              </span>
              <span className="text-xs font-normal text-blue-200">
                Tugas Terdaftar
              </span>
            </div>
          </div>

          <div className="border-l border-white/15 pl-4">
            <span className="text-[11px] text-blue-100/90 font-medium block">
              Tugas Prioritas
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold tracking-tight text-amber-300">
                {criticalCount}
              </span>
              <span className="text-xs font-normal text-blue-200">
                {criticalCount > 0 ? 'Mendesak' : 'Terkendali'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Command Strip */}
        <div className="flex items-center justify-between gap-2.5 relative z-10">
          <button
            onClick={() => onOpenFocusTimer()}
            className="flex-1 bg-white hover:bg-blue-50 text-[#0062FF] font-semibold text-xs py-2.5 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 transition-all cursor-pointer active:scale-95"
          >
            <Timer className="w-4 h-4 text-[#0062FF]" />
            <span>Mulai Mode Fokus</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai-plan')}
            className="flex-1 bg-white/15 hover:bg-white/25 text-white font-medium text-xs py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md border border-white/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Tanya AI Asisten</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. QUICK ACTION SERVICE LAUNCHER (4 Clay/Pill Tiles)      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2.5 pt-0.5">
        
        {/* 1. Tambah Tugas */}
        <button
          onClick={onOpenAddTask}
          className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-blue-200 flex flex-col items-center justify-center text-center group cursor-pointer transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0062FF]/10 text-[#0062FF] flex items-center justify-center group-hover:bg-[#0062FF] group-hover:text-white transition-all shadow-xs mb-1.5">
            <Plus className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">
            Tambah
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            Tugas
          </span>
        </button>

        {/* 2. Mode Fokus */}
        <button
          onClick={() => onOpenFocusTimer()}
          className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-indigo-200 flex flex-col items-center justify-center text-center group cursor-pointer transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs mb-1.5">
            <Timer className="w-5 h-5 stroke-[2px]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">
            Fokus
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            Pomodoro
          </span>
        </button>

        {/* 3. Prediksi Materi */}
        <button
          onClick={onOpenPredictions}
          className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-amber-200 flex flex-col items-center justify-center text-center group cursor-pointer transition-all active:scale-95 relative"
        >
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs mb-1.5">
            <Brain className="w-5 h-5 stroke-[2px]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">
            Prediksi
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            Materi
          </span>
        </button>

        {/* 4. Jadwal Sekolah */}
        <button
          onClick={() => onNavigateTab('calendar')}
          className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-blue-200 flex flex-col items-center justify-center text-center group cursor-pointer transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#0062FF] group-hover:text-white transition-all shadow-xs mb-1.5">
            <Calendar className="w-5 h-5 stroke-[2px]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">
            Jadwal
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            Sekolah
          </span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* 4. SMART WORKLOAD LIVE INSIGHT STRIP                      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-3.5 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 fill-[#0062FF]/20" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-slate-900 leading-tight">
            Insight AI Beban Belajar
          </h4>
          <p className="text-[11px] text-slate-500 leading-snug truncate mt-0.5 font-normal">
            1 tugas kimia berada di urutan prioritas teratas hari ini.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('ai-plan')}
          className="text-[10px] font-semibold text-[#0062FF] bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
        >
          Detail
        </button>
      </div>

      {/* ========================================================= */}
      {/* 5. HERO FEATURED CARD ("UX Motion Lab" style + AI Reason) */}
      {/* ========================================================= */}
      {todaySession && (
        <div className="bg-white rounded-[28px] p-5 shadow-[0_12px_32px_rgba(24,54,120,0.07)] border border-white relative overflow-hidden transition-all">
          
          {/* Header Row: Session Slot Tag & Circular Progress 2/3 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 bg-blue-50 text-[#0062FF] px-3 py-1 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 stroke-[2px]" />
              <span>{todaySession.timeSlot || 'Prioritas #1'} &bull; {todaySession.sessionDate}</span>
            </div>

            {/* Circular Progress Badge */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="text-[#0062FF]"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * (1 - 2 / 3)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-slate-700">2/3</span>
            </div>
          </div>

          {/* Title & Subject Pill */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span 
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: todaySession.subjectColor }}
                >
                  {todaySession.subject}
                </span>
                <span className="text-[10px] font-normal text-slate-400">
                  Target: {todaySession.durationMinutes}m Fokus
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug">
                {todaySession.taskTitle}
              </h3>
            </div>

            {/* 3D Glossy Badge Icon */}
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0062FF] to-indigo-500 shadow-md shadow-blue-500/20 flex flex-col items-center justify-center text-white shrink-0">
              <span className="text-[9px] font-semibold tracking-wider uppercase opacity-85">PRIORITAS</span>
              <span className="text-sm font-bold leading-none mt-0.5">#1</span>
            </div>
          </div>

          {/* Transparent AI Reason Box (Clean font-normal leading-relaxed) */}
          <p className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-normal mb-3.5">
            <strong className="font-semibold text-slate-800">Pertimbangan AI:</strong> {todaySession.reason}
          </p>

          {/* Action Row: Blue Full-width Pill Button */}
          <div className="pt-0.5">
            <button
              onClick={() => {
                const targetTask = tasks.find(t => t.id === todaySession.taskId);
                onOpenFocusTimer(targetTask);
              }}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3 rounded-full shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Mulai Belajar Sekarang</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 6. DUAL ACCENT POWER CARDS (Ref 1: Side by Side)           */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Left Card: Soft Periwinkle / Indigo Gradient */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="bg-gradient-to-b from-[#7084FF] to-[#5468F4] rounded-[26px] p-4 text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:opacity-95 transition-all flex flex-col justify-between min-h-[165px] group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Compass className="w-4 h-4 text-white stroke-[2px]" />
            </div>
            <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              2/3
            </span>
          </div>

          <div className="my-1.5">
            <h4 className="text-xs font-semibold leading-snug text-white tracking-normal group-hover:underline">
              Lanjutkan Materi Kimia Titrasi
            </h4>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Mentor"
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/60" 
            />
            <span className="text-[11px] font-medium text-white/90 truncate">
              oleh Pak Budi
            </span>
          </div>
        </div>

        {/* Right Card: Sunny Sunset Orange Gradient */}
        <div 
          onClick={() => onOpenFocusTimer()}
          className="bg-gradient-to-b from-[#FFA238] to-[#F57B18] rounded-[26px] p-4 text-white shadow-lg shadow-orange-500/20 cursor-pointer hover:opacity-95 transition-all flex flex-col justify-between min-h-[165px] group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Target className="w-4 h-4 text-white stroke-[2px]" />
            </div>
            <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              1/3
            </span>
          </div>

          <div className="my-1.5">
            <h4 className="text-xs font-semibold leading-snug text-white tracking-normal group-hover:underline">
              Rasakan Sensasi Deep Focus 45m
            </h4>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-medium">
              ✨
            </div>
            <span className="text-[11px] font-medium text-white/90 truncate">
              oleh Stoodify AI
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 7. URGENT TASKS FEED (With Real Subtask Checklists)       */}
      {/* ========================================================= */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Prioritas Tugas Terdekat ({pendingTasks.length})
          </h3>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-semibold text-[#0062FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Lihat Semua
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {urgentTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="bg-white rounded-2xl p-3.5 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-blue-100 transition-all cursor-pointer flex items-start gap-3 group"
              >
                {/* Complete checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTaskComplete(task.id);
                  }}
                  className="mt-0.5 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span 
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: task.subjectColor }}
                    >
                      {task.subject}
                    </span>
                    
                    <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {task.priorityLevel === 'critical' ? '⚡ Mendesak' : '🔥 Tinggi'}
                    </span>
                  </div>

                  <h4 className={`text-xs font-semibold text-slate-900 truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h4>

                  {/* Schedule & Deadline */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1 text-slate-600 font-normal">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{task.deadlineFormatted}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold px-2 py-0.5 rounded-md ${
                        isCompleted ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'
                      }`}>
                        {isCompleted ? '✓ Selesai' : '⏱️ Terjadwal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. QUICK PREDICTION PREVIEW CARD                          */}
      {/* ========================================================= */}
      {topPrediction && (
        <div 
          onClick={onOpenPredictions}
          className="bg-white rounded-2xl p-3.5 border border-white shadow-[0_4px_16px_rgba(20,40,90,0.04)] flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#0062FF] uppercase tracking-wide">Prediksi Materi Selanjutnya</span>
                <span className="text-[9px] font-semibold bg-blue-50 text-blue-700 px-1.5 rounded-full">
                  {topPrediction.confidence}% Yakin
                </span>
              </div>
              <h4 className="text-xs font-medium text-slate-900 mt-0.5 line-clamp-1">
                {topPrediction.subject}: {topPrediction.predictedTopic}
              </h4>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      )}

    </div>
  );
};
