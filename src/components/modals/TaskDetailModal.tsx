import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Timer, 
  Trash2,
  FileText
} from 'lucide-react';
import { Task } from '../../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateProgress: (taskId: string, newProgress: number) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onToggleSubtask,
  onUpdateProgress,
  onToggleTaskComplete,
  onStartFocus,
  onDeleteTask,
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';
  const completedSubtasks = task.subtasks.filter(s => s.isCompleted).length;

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
          
          {/* Title & Deadline */}
          <div>
            <h2 className={`text-base font-bold text-slate-900 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-slate-500 text-[11px] font-normal">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Batas Waktu: <strong className="font-semibold text-slate-800">{task.deadlineFormatted}</strong></span>
              <span>&bull;</span>
              <span>{task.estimatedDurationMinutes} Menit</span>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700">Progres Pengerjaan</span>
              <span className="font-bold text-[#0062FF] text-sm">{task.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={task.progress}
              onChange={(e) => onUpdateProgress(task.id, Number(e.target.value))}
              className="w-full accent-[#0062FF] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-normal">
              <span>0% Belum Mulai</span>
              <span>100% Tuntas</span>
            </div>
          </div>

          {/* Checklist Subtugas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                Checklist Subtugas ({completedSubtasks}/{task.subtasks.length})
              </h3>
            </div>

            <div className="space-y-2">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    st.isCompleted 
                      ? 'bg-slate-50 border-slate-200 text-slate-400' 
                      : 'bg-white border-slate-200/80 text-slate-800 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  {st.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={`text-xs ${st.isCompleted ? 'line-through' : 'font-medium'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Priority Breakdown */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-3xl p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#0062FF] font-semibold text-[11px]">
                <Sparkles className="w-4 h-4" />
                <span>Skor AI: {task.priorityScore}/100</span>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                task.priorityLevel === 'critical' ? 'bg-rose-500 text-white' : 'bg-[#0062FF] text-white'
              }`}>
                {task.priorityLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              {task.aiReasoning}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onStartFocus(task);
              }}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4" />
              <span>Mulai Sesi Fokus 45m</span>
            </button>

            <button
              onClick={() => onToggleTaskComplete(task.id)}
              className={`w-full py-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isCompleted ? 'Tandai Belum Selesai' : '✓ Tandai Tugas Selesai 100%'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
