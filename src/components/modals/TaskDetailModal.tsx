import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Timer, 
  Trash2,
  CalendarCheck2,
  Hourglass
} from 'lucide-react';
import { Task } from '../../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onToggleTaskComplete,
  onStartFocus,
  onDeleteTask,
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: task.subjectColor }}
            >
              {task.subject}
            </span>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
              {task.taskType}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (confirm('Yakin ingin menghapus tugas ini?')) {
                  onDeleteTask(task.id);
                  onClose();
                }
              }}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 flex items-center justify-center hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus Tugas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Title & Deadline Header */}
          <div>
            <h2 className={`text-base font-bold text-slate-900 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-slate-500 text-[11px] font-normal">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Batas Waktu: <strong className="font-semibold text-slate-800">{task.deadlineFormatted}</strong></span>
              <span>&bull;</span>
              <span>{task.estimatedDurationMinutes} Menit Alokasi</span>
            </div>
          </div>

          {/* Pembagian Jadwal & Waktu Tugas (Fokus Stoodify) */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                <CalendarCheck2 className="w-4 h-4 text-[#0062FF]" />
                <span>Alokasi Jadwal & Waktu</span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isCompleted ? '✓ Selesai' : '⏱️ Terjadwal'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs">
                <span className="text-[10px] text-slate-400 font-medium block">Durasi Belajar</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Hourglass className="w-3.5 h-3.5 text-[#0062FF]" />
                  {task.estimatedDurationMinutes} Menit
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs">
                <span className="text-[10px] text-slate-400 font-medium block">Slot Waktu AI</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-[#0062FF] shrink-0" />
                  <span className="truncate">{task.scheduledSlot || 'Sesi Malam'}</span>
                </span>
              </div>
            </div>

            {task.notes && (
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
                <strong className="text-slate-700 font-semibold">Catatan: </strong>
                {task.notes}
              </div>
            )}
          </div>

          {/* AI Priority & Reasoning Card */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-3xl p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#0062FF] font-semibold text-[11px]">
                <Sparkles className="w-4 h-4" />
                <span>Skor Prioritas AI: {task.priorityScore}/100</span>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                task.priorityLevel === 'critical' 
                  ? 'bg-rose-500 text-white' 
                  : task.priorityLevel === 'high' 
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#0062FF] text-white'
              }`}>
                {task.priorityLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              {task.aiReasoning}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onStartFocus(task);
              }}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4" />
              <span>Mulai Sesi Fokus ({task.estimatedDurationMinutes}m)</span>
            </button>

            <button
              onClick={() => onToggleTaskComplete(task.id)}
              className={`w-full py-3 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isCompleted
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isCompleted ? (
                <span>Tandai Belum Selesai</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tandai Tugas Selesai</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
