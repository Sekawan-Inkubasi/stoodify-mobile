import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Check, 
  User, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Subject, Task, ScheduleItem } from '../../types';

interface ManageSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  tasks: Task[];
  schedule: ScheduleItem[];
  onAddSubject: (newSubject: Omit<Subject, 'id' | 'totalTasks'>) => void;
  onUpdateSubject: (id: string, updated: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
}

const COLOR_PALETTE = [
  '#0062FF', // Electric Blue
  '#0284C7', // Sky Blue
  '#4F46E5', // Indigo
  '#7C3AED', // Purple
  '#059669', // Emerald
  '#0D9488', // Teal
  '#D97706', // Amber
  '#E11D48', // Rose
  '#EC4899', // Pink
  '#475569', // Slate
];

export const ManageSubjectsModal: React.FC<ManageSubjectsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  tasks,
  schedule,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  if (!isOpen) return null;

  // View state: 'list' | 'add' | 'edit'
  const [viewState, setViewState] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formColor, setFormColor] = useState(COLOR_PALETTE[0]);
  const [formDifficulty, setFormDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');

  const startAdd = () => {
    setFormName('');
    setFormTeacher('');
    setFormColor(COLOR_PALETTE[subjects.length % COLOR_PALETTE.length]);
    setFormDifficulty('Sedang');
    setViewState('add');
  };

  const startEdit = (sub: Subject) => {
    setEditingId(sub.id);
    setFormName(sub.name);
    setFormTeacher(sub.teacher || '');
    setFormColor(sub.color);
    setFormDifficulty(sub.difficulty);
    setViewState('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (viewState === 'add') {
      onAddSubject({
        name: formName.trim(),
        teacher: formTeacher.trim() || undefined,
        color: formColor,
        difficulty: formDifficulty,
      });
    } else if (viewState === 'edit' && editingId) {
      onUpdateSubject(editingId, {
        name: formName.trim(),
        teacher: formTeacher.trim() || undefined,
        color: formColor,
        difficulty: formDifficulty,
      });
    }

    setViewState('list');
  };

  const handleDelete = (id: string, name: string) => {
    const tasksCount = tasks.filter(t => t.subject === name).length;
    const scheduleCount = schedule.filter(s => s.subjectName === name).length;

    let warning = `Yakin ingin menghapus mata pelajaran "${name}"?`;
    if (tasksCount > 0 || scheduleCount > 0) {
      warning += `\n\nPerhatian: Terdapat ${tasksCount} tugas dan ${scheduleCount} jam jadwal yang terhubung dengan mapel ini.`;
    }

    if (confirm(warning)) {
      onDeleteSubject(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm backdrop-smooth flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl modal-enter-smooth">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {viewState === 'list' ? 'Kelola Mata Pelajaran' : viewState === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
              </h2>
              <p className="text-[11px] font-normal text-slate-500">
                {viewState === 'list' ? `${subjects.length} mapel terdaftar untuk Jadwal & Tugas` : 'Sesuaikan nama, guru pengajar, dan warna label'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {viewState !== 'list' && (
              <button
                onClick={() => setViewState('list')}
                className="text-xs font-semibold text-[#0062FF] hover:underline px-2 py-1 cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* ======================================================= */}
          {/* 1. LIST VIEW OF SUBJECTS                                */}
          {/* ======================================================= */}
          {viewState === 'list' && (
            <div className="space-y-3">
              
              {/* Add New Subject Button Bar */}
              <button
                onClick={startAdd}
                className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3 rounded-full shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.2px]" />
                <span>Tambah Mata Pelajaran Baru</span>
              </button>

              {/* Subjects List */}
              <div className="space-y-2 pt-1">
                {subjects.map((sub) => {
                  const tasksCount = tasks.filter(t => t.subject === sub.name).length;
                  const scheduleCount = schedule.filter(s => s.subjectName === sub.name).length;

                  return (
                    <div
                      key={sub.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(20,40,90,0.04)] flex items-center justify-between gap-3 hover:border-blue-100 transition-all"
                    >
                      {/* Left: Color Dot & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs ring-2 ring-white"
                          style={{ backgroundColor: sub.color }}
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 truncate">
                              {sub.name}
                            </h4>
                            <span className={`text-[9px] font-semibold px-2 py-0.2 rounded-full ${
                              sub.difficulty === 'Sulit' 
                                ? 'bg-rose-50 text-rose-700' 
                                : sub.difficulty === 'Sedang' 
                                ? 'bg-amber-50 text-amber-700' 
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {sub.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            {sub.teacher && (
                              <span className="flex items-center gap-1 truncate font-normal">
                                <User className="w-3 h-3 text-slate-400" />
                                {sub.teacher}
                              </span>
                            )}
                            <span className="text-slate-300">&bull;</span>
                            <span className="font-normal text-slate-400">
                              {tasksCount} tugas &bull; {scheduleCount} jadwal
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(sub)}
                          className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 hover:text-[#0062FF] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Mapel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* 2. ADD / EDIT FORM                                      */}
          {/* ======================================================= */}
          {viewState !== 'list' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Mapel */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kimia, Informatika, Sosiologi..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062FF]"
                />
              </div>

              {/* Guru Pengajar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru Pengajar (Opsional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    placeholder="Contoh: Pak Budi, Bu Retno..."
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062FF]"
                  />
                </div>
              </div>

              {/* Pilih Warna Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Warna Label Mapel
                </label>
                <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {COLOR_PALETTE.map((color) => {
                    const isSelected = formColor === color;
                    return (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setFormColor(color)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ring-2 ${
                          isSelected ? 'ring-slate-900 scale-110 shadow-sm' : 'ring-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tingkat Kesulitan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tingkat Kesulitan Materi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mudah', 'Sedang', 'Sulit'] as const).map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setFormDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        formDifficulty === diff
                          ? 'bg-[#0062FF] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Badge */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-normal text-slate-500">Preview Tampilan:</span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: formColor }}
                >
                  {formName || 'Nama Mapel'}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewState('list')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 rounded-full transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {viewState === 'add' ? 'Simpan Mapel' : 'Perbarui Mapel'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
