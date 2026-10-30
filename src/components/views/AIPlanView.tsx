import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Zap, 
  MessageSquare, 
  ChevronRight, 
  BrainCircuit, 
  ShieldCheck, 
  Flame, 
  ArrowUpRight 
} from 'lucide-react';
import { AISession, Task } from '../../types';
import { AIPlanSkeleton } from '../layout/SkeletonLoaders';

interface AIPlanViewProps {
  sessions: AISession[];
  tasks: Task[];
  isLoading?: boolean;
  onOpenFocusTimer: (task?: Task) => void;
  onReschedulePrompt: () => void;
  onOpenChatbot?: () => void;
}

export const AIPlanView: React.FC<AIPlanViewProps> = ({
  sessions,
  tasks,
  isLoading,
  onOpenFocusTimer,
  onReschedulePrompt,
  onOpenChatbot,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'upcoming'>('all');

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const criticalCount = pendingTasks.filter(t => t.priorityLevel === 'critical' || t.priorityLevel === 'high').length;

  const filteredSessions = sessions.filter(session => {
    if (filterMode === 'today') return session.sessionDate.toLowerCase().includes('hari ini');
    if (filterMode === 'upcoming') return !session.sessionDate.toLowerCase().includes('hari ini');
    return true;
  });

  if (isLoading) {
    return <AIPlanSkeleton />;
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      
      {/* 1. TOP HEADER APP BAR */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0062FF] to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Rencana Belajar AI
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Smart Scheduler & Workload Balancer
            </p>
          </div>
        </div>

        <button 
          onClick={onReschedulePrompt}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-[0_4px_16px_rgba(20,40,90,0.06)] border border-white/80 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          title="Jalankan Adaptive Rescheduling Otomatis"
        >
          <RotateCcw className="w-4 h-4 text-[#0062FF]" />
        </button>
      </div>

      {/* 2. CHATBOT SHORTCUT BANNER (Points to the Persistent Slide Edge) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0062FF] via-[#0055E6] to-indigo-600 p-4 text-white shadow-md shadow-blue-500/15">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                Stoodify AI Assistant Aktif
              </span>
            </div>
            <h3 className="text-xs font-bold text-white leading-snug">
              Butuh konsultasi belajar atau tanya PR?
            </h3>
            <p className="text-[10.5px] text-white/80 leading-relaxed max-w-[240px]">
              Tarik tab AI di sisi kanan layar kapan saja, atau klik tombol di samping.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenChatbot}
            className="shrink-0 mt-1 bg-white hover:bg-blue-50 text-[#0062FF] text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>Tanya AI</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. WORKLOAD BALANCER OVERVIEW CARD */}
      <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_25px_rgba(20,40,90,0.05)] border border-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-[#0062FF] rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-900">
              Analisis Beban Belajar Siswa
            </span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Aman & Seimbang
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-semibold text-slate-500">Sesi Pekan Ini</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">{sessions.length} Sesi</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-semibold text-slate-500">Tugas Prioritas</p>
            <p className="text-base font-bold text-rose-600 mt-0.5">{criticalCount} Urgent</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-semibold text-slate-500">Rata-rata/Hari</p>
            <p className="text-base font-bold text-[#0062FF] mt-0.5">
              {sessions.length > 0 ? `${Math.round(sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / sessions.length)}m` : '0m'}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/60 leading-relaxed font-normal">
          💡 <strong className="font-semibold text-slate-700">Rekomendasi Algoritma:</strong> Tugas diurutkan secara cerdas berdasarkan urgensi tenggat dan tingkat kesulitan materi agar terdistribusi merata tanpa membebani siswa.
        </p>
      </div>

      {/* 4. SESSIONS FILTER PILLS */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Urutan Prioritas Belajar ({filteredSessions.length})
        </h2>

        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-[#0062FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterMode('today')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              filterMode === 'today' ? 'bg-[#0062FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterMode('upcoming')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              filterMode === 'upcoming' ? 'bg-[#0062FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mendatang
          </button>
        </div>
      </div>

      {/* 5. LIST OF AI STUDY SESSIONS */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-2 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white">
            <div className="w-12 h-12 bg-blue-50 text-[#0062FF] rounded-full flex items-center justify-center mx-auto">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              {sessions.length === 0 ? 'Belum Ada Sesi Belajar Terjadwal' : 'Tidak Ada Sesi di Filter Ini'}
            </h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              {sessions.length === 0
                ? 'Urutan prioritas belajar AI akan otomatis disusun setelah tugas atau jadwal mata pelajaran ditambahkan.'
                : 'Ubah tab filter untuk melihat sesi belajar lainnya.'}
            </p>
          </div>
        ) : (
          filteredSessions.map((session, idx) => {
          const relatedTask = tasks.find(t => t.id === session.taskId);

          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0062FF] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {session.priorityLabel || session.timeSlot || `Prioritas #${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Target: {session.sessionDate}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-blue-50 text-[#0062FF] px-2.5 py-0.5 rounded-full border border-blue-100">
                  {session.durationMinutes} Min Fokus
                </span>
              </div>

              <div>
                <span 
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white inline-block mb-1 shadow-xs"
                  style={{ backgroundColor: session.subjectColor }}
                >
                  {session.subject}
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {session.taskTitle}
                </h4>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-normal leading-relaxed">
                <strong className="font-semibold text-slate-700">Pertimbangan AI:</strong> {session.reason}
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => onOpenFocusTimer(relatedTask)}
                  className="flex-1 bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Zen Focus Sesi Ini</span>
                </button>

                <button
                  type="button"
                  onClick={onReschedulePrompt}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer active:scale-95"
                  title="Reschedule Sesi Ini"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* 6. BOTTOM ADAPTIVE RESCHEDULING BANNER */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-md">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Adaptive Rescheduling</span>
          </div>
          <p className="text-xs font-bold text-white">Ingin ubah susunan antrean tugas?</p>
          <p className="text-[10.5px] text-slate-400">AI otomatis menghitung ulang urutan prioritas sesuai tenggat terbaru.</p>
        </div>

        <button
          type="button"
          onClick={onReschedulePrompt}
          className="shrink-0 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm cursor-pointer transition-all"
        >
          Reschedule
        </button>
      </div>

    </div>
  );
};
