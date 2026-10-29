import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Camera, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Image as ImageIcon 
} from 'lucide-react';
import { Subject, Task, TaskAttachment } from '../../types';
import { CameraCaptureModal } from './CameraCaptureModal';

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

  // Form states
  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Matematika Tingkat Lanjut');
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [taskType, setTaskType] = useState<'Individu' | 'Kelompok' | 'Praktikum' | 'Proyek'>('Individu');
  const [notes, setNotes] = useState('');

  // 1. Batas Waktu / Deadline (Hanya Tanggal Saja)
  const tomorrow = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const [deadlineDate, setDeadlineDate] = useState(tomorrowStr);

  // 2. File / Foto Tugas (Opsional, Max 15MB)
  const [attachment, setAttachment] = useState<TaskAttachment | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);

  // Quick deadline chips (Hari Ini, Besok, Lusa)
  const setQuickDeadline = (daysAhead: number) => {
    const targetDate = new Date(Date.now() + daysAhead * 86400000);
    setDeadlineDate(targetDate.toISOString().split('T')[0]);
  };

  // Helper format Indonesian date (Hanya Tanggal, Tanpa Jam)
  const formatIndonesianDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Helper file size formatter
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // File handler with 15MB max limit
  const handleFileSelected = (file?: File) => {
    if (!file) return;

    const maxSizeBytes = 15 * 1024 * 1024; // 15 MB
    if (file.size > maxSizeBytes) {
      alert(`Ukuran file "${file.name}" (${formatFileSize(file.size)}) melebihi batas maksimal 15 MB! Silakan pilih file yang lebih kecil.`);
      return;
    }

    const isImg = file.type.startsWith('image/');
    const isDoc = file.type.includes('pdf') || file.type.includes('word') || file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc');

    const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

    setAttachment({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      type: isImg ? 'image' : isDoc ? 'document' : 'other',
      previewUrl,
    });
  };

  // AI calculates duration automatically
  const calculateEstimatedMinutes = (diff: 'Mudah' | 'Sedang' | 'Sulit', type: string): number => {
    let base = diff === 'Sulit' ? 60 : diff === 'Sedang' ? 45 : 30;
    if (type === 'Proyek' || type === 'Praktikum') base += 15;
    return base;
  };

  const estimatedDuration = calculateEstimatedMinutes(difficulty, taskType);

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

    const formattedDeadline = formatIndonesianDate(deadlineDate);
    const deadlineIso = new Date(`${deadlineDate}T23:59:59`).toISOString();

    onAddTask({
      title: title.trim(),
      subject: selectedSubject,
      subjectColor: currentSubjectObj?.color || '#0062FF',
      deadline: deadlineIso,
      deadlineFormatted: formattedDeadline,
      difficulty,
      estimatedDurationMinutes: estimatedDuration,
      priorityLevel,
      priorityScore,
      status: 'not_started',
      taskType,
      aiReasoning: `Prioritas ${priorityLevel} dihitung otomatis oleh AI dari tingkat kesulitan ${difficulty.toLowerCase()}.`,
      notes: notes.trim(),
      attachment: attachment || undefined,
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tambah Tugas Baru</h2>
              <p className="text-[11px] font-normal text-slate-500">AI mengatur alokasi jadwal pengerjaan otomatis</p>
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
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062FF] focus:bg-white transition-all"
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
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] focus:bg-white transition-all cursor-pointer"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 1. Batas Waktu / Deadline (Hanya Tanggal Kalender, Tanpa Jam) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#0062FF]" />
                  <span>Batas Waktu Tanggal (Deadline)</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuickDeadline(0)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-[#0062FF] bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDeadline(1)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-[#0062FF] bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Besok
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDeadline(2)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-[#0062FF] bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Lusa
                  </button>
                </div>
              </div>

              {/* Input Kalender Tanggal */}
              <div className="relative">
                <input
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-[#0062FF] rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none transition-all cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium pl-0.5 flex items-center gap-1">
                <span>Tenggat: <strong className="text-slate-800">{formatIndonesianDate(deadlineDate)}</strong></span>
              </p>
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
                    className={`py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
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

            {/* Jenis Pengerjaan */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Pengerjaan</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Individu', 'Kelompok', 'Praktikum', 'Proyek'] as const).map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setTaskType(type)}
                    className={`py-1.5 rounded-xl font-medium text-[10px] border transition-all cursor-pointer ${
                      taskType === type
                        ? 'bg-blue-50 text-[#0062FF] border-blue-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Input File / Foto Tugas (Kamera Langsung & File Picker, Max 15MB) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-[#0062FF]" />
                  <span>File / Foto Tugas <span className="font-normal text-slate-400 text-[10px]">(Opsional, Maks 15 MB)</span></span>
                </label>
              </div>

              {/* Hidden file input for gallery/docs */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
                className="hidden"
              />

              {/* If attachment already selected */}
              {attachment ? (
                <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {attachment.previewUrl ? (
                      <img 
                        src={attachment.previewUrl} 
                        alt="Preview" 
                        className="w-10 h-10 object-cover rounded-xl border border-blue-200 shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded-xl border border-blue-200 flex items-center justify-center shrink-0 text-[#0062FF]">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{attachment.name}</p>
                      <p className="text-[10px] font-medium text-slate-500">{attachment.sizeFormatted}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0"
                    title="Hapus Lampiran"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Upload Buttons Grid */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="py-2.5 px-3 bg-slate-50 hover:bg-blue-50/50 active:scale-98 border border-dashed border-slate-200 hover:border-blue-300 rounded-2xl flex items-center justify-center gap-2 text-slate-700 hover:text-[#0062FF] font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#0062FF]" />
                    <span>Ambil Foto Soal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-slate-50 hover:bg-blue-50/50 active:scale-98 border border-dashed border-slate-200 hover:border-blue-300 rounded-2xl flex items-center justify-center gap-2 text-slate-700 hover:text-[#0062FF] font-semibold text-xs transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-[#0062FF]" />
                    <span>Pilih File / Galeri</span>
                  </button>
                </div>
              )}
              
              <p className="text-[10px] text-slate-400 font-normal pl-0.5">
                Bisa memotret lembar soal langsung dari kamera atau memilih file dokumen/foto.
              </p>
            </div>

            {/* Catatan Tambahan (Opsional) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kumpulkan di meja guru atau via LMS"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062FF] focus:bg-white transition-all"
              />
            </div>

            {/* AI Banner Preview */}
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#0062FF] shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <span className="font-semibold text-blue-950 block">AI Scheduling Support</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed font-normal">
                  Tugas ini akan diprioritaskan dan diatur pembagian jadwalnya oleh AI Stoodify secara cerdas.
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

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(capturedAttachment) => setAttachment(capturedAttachment)}
      />
    </>
  );
};
