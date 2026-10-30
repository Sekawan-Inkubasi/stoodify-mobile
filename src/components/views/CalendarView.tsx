import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  BookOpen,
  Plus,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { ScheduleItem, AISession, Task, Subject } from '../../types';
import { useDialog } from '../../context/DialogContext';
import { CalendarSkeleton } from '../layout/SkeletonLoaders';

interface CalendarViewProps {
  schedule: ScheduleItem[];
  sessions: AISession[];
  tasks: Task[];
  subjects: Subject[];
  isLoading?: boolean;
  onOpenFocusTimer: (task?: Task) => void;
  onOpenAddSchedule: (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => void;
  onDeleteScheduleItem: (id: string) => void;
  onOpenManageSubjects: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedule,
  sessions,
  tasks,
  subjects,
  isLoading,
  onOpenFocusTimer,
  onOpenAddSchedule,
  onDeleteScheduleItem,
  onOpenManageSubjects,
}) => {
  const { showConfirm } = useDialog();
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [viewMode, setViewMode] = useState<'integrated' | 'timetable'>('integrated');

  const daySchedule = schedule.filter(s => s.day === selectedDay);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Jadwal & Kalender</h1>
          <p className="text-[11px] font-normal text-slate-500">
            Sinkronisasi jam sekolah dan sesi fokus AI malam hari
          </p>
        </div>

        <button
          onClick={onOpenManageSubjects}
          className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          title="Kelola Mata Pelajaran"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#0062FF]" />
          <span>Kelola Mapel</span>
        </button>
      </div>

      {/* Segmented Switcher */}
      <div className="bg-white/80 backdrop-blur-md p-1 rounded-full border border-white shadow-xs flex items-center">
        <button
          onClick={() => setViewMode('integrated')}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-full transition-all cursor-pointer ${
            viewMode === 'integrated'
              ? 'bg-[#0062FF] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kalender Terpadu
        </button>
        <button
          onClick={() => setViewMode('timetable')}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-full transition-all cursor-pointer ${
            viewMode === 'timetable'
              ? 'bg-[#0062FF] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Jam Sekolah Saja
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 px-1 rounded-2xl text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0062FF] text-white shadow-md shadow-blue-500/25'
                  : 'bg-white/70 hover:bg-white text-slate-700 border border-white'
              }`}
            >
              <span className="block text-[10px] font-medium opacity-80">{day.substring(0, 3)}</span>
              <span className="block text-xs font-bold mt-0.5">{day}</span>
            </button>
          );
        })}
      </div>

      {/* 2. JADWAL SEKOLAH HARIAN */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#0062FF]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pelajaran {selectedDay} ({daySchedule.length})
            </h3>
          </div>

          <button
            onClick={() => onOpenAddSchedule(selectedDay)}
            className="text-xs font-semibold text-[#0062FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2px]" />
            <span>Tambah Jam Mapel</span>
          </button>
        </div>

        {daySchedule.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center space-y-2 border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 font-normal">
              Belum ada jam pelajaran yang dijadwalkan untuk hari {selectedDay}.
            </p>
            <button
              onClick={() => onOpenAddSchedule(selectedDay)}
              className="bg-[#0062FF] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Masukkan Mata Pelajaran</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {daySchedule.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white flex items-center gap-3 relative overflow-hidden group"
              >
                <div 
                  className="w-1.5 absolute left-0 top-0 bottom-0 rounded-r-full"
                  style={{ backgroundColor: item.subjectColor }}
                />

                <div className="w-20 text-center pl-1">
                  <span className="text-[11px] font-semibold text-slate-900 block leading-tight">
                    {item.time.split(' - ')[0]}
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 block">
                    {item.time.split(' - ')[1]}
                  </span>
                </div>

                <div className="w-px h-8 bg-slate-100" />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {item.subjectName}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.room}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-slate-400" />
                      {item.teacher}
                    </span>
                  </div>
                </div>

                {/* Delete button on right */}
                <button
                  onClick={() => {
                    showConfirm({
                      title: 'Hapus dari Jadwal',
                      message: `Hapus mata pelajaran "${item.subjectName}" dari jadwal hari ${item.day}?`,
                      confirmText: 'Hapus Jadwal',
                      cancelText: 'Batal',
                      isDestructive: true,
                      onConfirm: () => {
                        onDeleteScheduleItem(item.id);
                      },
                    });
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
                  title="Hapus dari Jadwal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. REKOMENDASI PRIORITAS BELAJAR AI */}
      {viewMode === 'integrated' && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-1.5 px-1">
            <Sparkles className="w-4 h-4 text-[#0062FF]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekomendasi Prioritas Belajar AI
            </h3>
          </div>

          {sessions.length > 0 ? (
            <div className="bg-white rounded-[26px] p-4 shadow-[0_4px_20px_rgba(20,40,90,0.05)] border border-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#0062FF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {sessions[0].timeSlot || 'Prioritas #1'} &bull; {sessions[0].sessionDate}
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Urutan Teratas
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 pt-1">
                {sessions[0].taskTitle}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                {sessions[0].reason}
              </p>

              <button
                onClick={() => {
                  const targetTask = tasks.find(t => t.id === sessions[0].taskId);
                  onOpenFocusTimer(targetTask);
                }}
                className="mt-2 w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-2.5 rounded-full shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mulai Sesi Fokus Ini</span>
              </button>
            </div>
          ) : tasks.length > 0 ? (
            <div className="bg-white rounded-[26px] p-4 shadow-[0_4px_20px_rgba(20,40,90,0.05)] border border-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#0062FF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Prioritas Utama &bull; {tasks[0].deadlineFormatted}
                </span>
                <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {tasks[0].subject}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 pt-1">
                {tasks[0].title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                {tasks[0].aiReasoning || 'Tugas diprioritaskan berdasarkan batas waktu penyelesaian.'}
              </p>

              <button
                onClick={() => onOpenFocusTimer(tasks[0])}
                className="mt-2 w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-2.5 rounded-full shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mulai Sesi Fokus Ini</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[26px] p-5 shadow-[0_4px_20px_rgba(20,40,90,0.04)] border border-white text-center space-y-1.5">
              <p className="text-xs font-bold text-slate-700">Belum Ada Sesi AI</p>
              <p className="text-[11px] text-slate-400">
                Tambahkan tugas sekolah untuk mendapatkan rekomendasi urutan belajar harian.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
