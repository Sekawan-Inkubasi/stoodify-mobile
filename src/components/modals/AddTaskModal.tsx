import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Subject, Task } from '../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddTask: (newTask: Omit<Task, 'id'>) => void;
  onOpenManageSubjects?: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddTask,
  onOpenManageSubjects,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Matematika Tingkat Lanjut');
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [duration, setDuration] = useState(45);
  const [deadlineDate, setDeadlineDate] = useState('Besok, 23:59 WIB');
  const [taskType, setTaskType] = useState<'Individu' | 'Kelompok' | 'Praktikum' | 'Proyek'>('Individu');
  const [subtasks, setSubtasks] = useState<string[]>(['Baca instruksi materi', 'Kerjakan soal evaluasi']);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([...subtasks, newSubtaskInput.trim()]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let priorityLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    let priorityScore = 70;
    if (difficulty === 'Sulit') {
      priorityLevel = 'critical';
      priorityScore = 90;
    } else if (difficulty === 'Sedang') {
      priorityLevel = 'high';
      priorityScore = 78;
    } else {
      priorityLevel = 'low';
      priorityScore = 55;
    }

    onAddTask({
      title: title.trim(),
      subject: selectedSubject,
      subjectColor: currentSubjectObj?.color || '#0062FF',
      deadline: new Date(Date.now() + 86400000).toISOString(),
      deadlineFormatted: deadlineDate,
      difficulty,
      estimatedDurationMinutes: duration,
      priorityLevel,
      priorityScore,
      progress: 0,
      status: 'not_started',
      taskType,
      aiReasoning: `Prioritas ${priorityLevel} dihitung otomatis dari tingkat kesulitan ${difficulty.toLowerCase()} dan durasi ${duration} menit.`,
      subtasks: subtasks.map((st, idx) => ({
        id: `st-new-${Date.now()}-${idx}`,
        title: st,
        isCompleted: false,
      })),
      notes: '',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Tambah Tugas Baru</h2>
            <p className="text-[11px] font-normal text-slate-500">AI menghitung estimasi waktu & beban belajar</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Judul Tugas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Tugas / PR</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Latihan 10 Soal Vektor Dimensi 3"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062FF]"
            />
          </div>

          {/* Mata Pelajaran Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Mata Pelajaran</label>
              {onOpenManageSubjects && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManageSubjects();
                  }}
                  className="text-[11px] font-semibold text-[#0062FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Kelola Mapel</span>
                </button>
              )}
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tingkat Kesulitan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mudah', 'Sedang', 'Sulit'] as const).map(diff => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'bg-[#0062FF] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Estimasi Durasi Waktu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Estimasi Durasi Belajar</label>
              <span className="font-bold text-[#0062FF]">{duration} Menit</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[25, 45, 60, 90].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-2 rounded-xl font-medium text-[11px] border transition-all cursor-pointer ${
                    duration === mins
                      ? 'bg-blue-50 text-[#0062FF] border-blue-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Subtugas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Langkah Pengerjaan</label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <span className="text-slate-700 text-[11px] truncate flex-1">{i + 1}. {st}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Tambah langkah subtugas..."
                className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* AI Banner Preview */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0062FF] shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-semibold text-blue-950 block">AI Scheduling Support</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed font-normal">
                Tugas ini akan disinkronkan ke slot fokus malam dan diberi bobot prioritas adaptif.
              </p>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Simpan & Jadwalkan dengan AI
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
