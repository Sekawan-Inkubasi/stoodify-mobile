import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Plus, BookOpen } from 'lucide-react';
import { Subject, ScheduleItem } from '../../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  defaultDay?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  onAddScheduleItem: (newItem: Omit<ScheduleItem, 'id'>) => void;
  onOpenManageSubjects: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  subjects,
  defaultDay = 'Senin',
  onAddScheduleItem,
  onOpenManageSubjects,
}) => {
  if (!isOpen) return null;

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;
  const [day, setDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>(defaultDay);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [startTime, setStartTime] = useState('07:15');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('R. 11 MIPA 1');
  const [teacher, setTeacher] = useState('');

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  useEffect(() => {
    if (activeSubject) {
      setTeacher(activeSubject.teacher || '');
    }
  }, [selectedSubjectId, activeSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject) return;

    onAddScheduleItem({
      day,
      subjectName: activeSubject.name,
      subjectColor: activeSubject.color,
      time: `${startTime} - ${endTime}`,
      room: room.trim() || 'R. Kelas',
      teacher: teacher.trim() || activeSubject.teacher || 'Guru Pengajar',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tambah Jam Pelajaran</h2>
              <p className="text-[11px] font-normal text-slate-500">Masukkan mata pelajaran ke jadwal mingguan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Day Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hari Pelajaran</label>
            <div className="grid grid-cols-5 gap-1.5">
              {days.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDay(d)}
                  className={`py-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                    day === d
                      ? 'bg-[#0062FF] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Dropdown with Add Mapel Shortcut */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Pilih Mata Pelajaran</label>
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
            </div>

            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} {sub.teacher ? `(${sub.teacher})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Jam Pelajaran (Start - End) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Pelajaran</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-slate-400 font-medium mb-1">Jam Mulai</span>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0062FF]"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-medium mb-1">Jam Selesai</span>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>
          </div>

          {/* Ruangan & Guru */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan / Lab</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="R. 11 MIPA 1"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Guru</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Nama Guru"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Simpan ke Jadwal {day}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
