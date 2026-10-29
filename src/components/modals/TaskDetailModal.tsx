import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Timer, 
  Trash2,
  FileText
} from 'lucide-react';
import { Task } from '../../types';
import { useDialog } from '../../context/DialogContext';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onStartFocus: (task: Task, durationMinutes?: number) => void;
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
  const { showConfirm } = useDialog();
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';

  // Sesi Fokus duration selection states
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  useEffect(() => {
    if (task) {
      setSelectedDuration(45);
      setIsCustomDuration(false);
      setCustomInput('');
    }
  }, [task.id]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm backdrop-smooth flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl modal-enter-smooth">
        
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
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isCompleted 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isCompleted ? '✓ Selesai' : '⏱️ Terjadwal'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                showConfirm({
                  title: 'Hapus Tugas',
                  message: `Yakin ingin menghapus tugas "${task.title}"?`,
                  confirmText: 'Hapus Tugas',
                  cancelText: 'Batal',
                  isDestructive: true,
                  onConfirm: () => {
                    onDeleteTask(task.id);
                    onClose();
                  },
                });
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
            </div>
          </div>

          {/* Catatan Tugas (Jika Ada) */}
          {task.notes && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs text-slate-600">
              <strong className="text-slate-800 font-semibold block mb-0.5 text-[11px]">Catatan Tugas:</strong>
              <p className="font-normal text-slate-600 leading-relaxed text-[11px]">{task.notes}</p>
            </div>
          )}

          {/* File / Foto Lampiran Tugas (Jika Ada) */}
          {task.attachment && (
            <div className="bg-slate-50 p-3.5 rounded-3xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#0062FF]" />
                <span>File Lampiran Tugas</span>
              </div>

              {task.attachment.previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group">
                  <img 
                    src={task.attachment.previewUrl} 
                    alt="Lampiran Tugas" 
                    className="w-full max-h-48 object-cover cursor-pointer hover:opacity-95 transition-all"
                    onClick={() => window.open(task.attachment?.previewUrl, '_blank')}
                  />
                  <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">{task.attachment.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{task.attachment.sizeFormatted}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-800 block truncate">{task.attachment.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{task.attachment.sizeFormatted}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Opsi Pilihan & Input Durasi Sesi Fokus */}
          <div className="bg-slate-50 p-3.5 rounded-3xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>Atur Durasi Sesi Fokus</span>
              </span>
              <span className="text-xs font-bold text-[#0062FF]">
                {selectedDuration} Menit
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 gap-1.5">
              {[25, 45, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => {
                    setSelectedDuration(mins);
                    setIsCustomDuration(false);
                  }}
                  className={`py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                    !isCustomDuration && selectedDuration === mins
                      ? 'bg-[#0062FF] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {mins}m
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsCustomDuration(true);
                  if (!customInput) setCustomInput(String(selectedDuration));
                }}
                className={`py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  isCustomDuration
                    ? 'bg-[#0062FF] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                Kustom
              </button>
            </div>

            {/* Custom Input Field */}
            {isCustomDuration && (
              <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    const val = Number(e.target.value);
                    if (val > 0) setSelectedDuration(val);
                  }}
                  placeholder="Misal: 35"
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-xs font-semibold text-slate-500 shrink-0">Menit</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onStartFocus(task, selectedDuration);
              }}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4" />
              <span>Mulai Sesi Fokus ({selectedDuration}m)</span>
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
