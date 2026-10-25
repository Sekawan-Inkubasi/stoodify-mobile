import React, { useState } from 'react';
import { X, Sparkles, Clock, Coffee, Plus, Trash2 } from 'lucide-react';
import { StudyPreferences } from '../../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: StudyPreferences;
  onSavePreferences: (updated: StudyPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences: initialPrefs,
  onSavePreferences,
}) => {
  if (!isOpen) return null;

  const [prefs, setPrefs] = useState<StudyPreferences>(initialPrefs);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineDay, setNewRoutineDay] = useState('Selasa & Kamis');
  const [newRoutineTime, setNewRoutineTime] = useState('16:00 - 18:00');

  const handleAddRoutine = () => {
    if (!newRoutineTitle.trim()) return;
    setPrefs({
      ...prefs,
      blockedRoutines: [
        ...prefs.blockedRoutines,
        {
          id: `br-${Date.now()}`,
          title: newRoutineTitle.trim(),
          day: newRoutineDay,
          time: newRoutineTime,
        },
      ],
    });
    setNewRoutineTitle('');
  };

  const handleRemoveRoutine = (id: string) => {
    setPrefs({
      ...prefs,
      blockedRoutines: prefs.blockedRoutines.filter(r => r.id !== id),
    });
  };

  const handleSave = () => {
    onSavePreferences(prefs);
    alert('Preferensi AI dan jadwal blokir waktu rutin berhasil disimpan! ✨');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Preferensi Belajar AI</h2>
              <p className="text-[11px] font-normal text-slate-500">Sesuaikan ritme dan jam istirahatmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* AI Window */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4 text-[#0062FF]" />
              <span>Jendela Waktu Belajar Malam</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-medium">Mulai Belajar</label>
                <input
                  type="time"
                  value={prefs.startTime}
                  onChange={(e) => setPrefs({ ...prefs, startTime: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 font-semibold text-slate-800 focus:outline-none focus:border-[#0062FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-medium">Batas Jam Tidur</label>
                <input
                  type="time"
                  value={prefs.endTime}
                  onChange={(e) => setPrefs({ ...prefs, endTime: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 font-semibold text-slate-800 focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>
          </div>

          {/* Durasi Sesi & Istirahat */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80">
              <label className="block text-slate-700 font-semibold mb-1">Durasi 1 Sesi</label>
              <select
                value={prefs.sessionDurationMinutes}
                onChange={(e) => setPrefs({ ...prefs, sessionDurationMinutes: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-medium text-slate-800"
              >
                <option value={25}>25m (Pomodoro)</option>
                <option value={45}>45m (Standar AI)</option>
                <option value={60}>60m (Panjang)</option>
              </select>
            </div>

            <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80">
              <label className="block text-slate-700 font-semibold mb-1">Jeda Istirahat</label>
              <select
                value={prefs.breakDurationMinutes}
                onChange={(e) => setPrefs({ ...prefs, breakDurationMinutes: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-medium text-slate-800"
              >
                <option value={5}>5 Menit</option>
                <option value={10}>10 Menit</option>
                <option value={15}>15 Menit</option>
              </select>
            </div>
          </div>

          {/* Jam Rutin Terlarang (Blocked Hours) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                <Coffee className="w-4 h-4 text-indigo-600" />
                <span>Blokir Jam Rutin & Waktu Luang</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-normal">AI dilarang jadwalkan</span>
            </div>

            <div className="space-y-2">
              {prefs.blockedRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">{routine.title}</h4>
                    <span className="text-[10px] text-slate-500 font-normal">{routine.day} &bull; {routine.time}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveRoutine(routine.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Add Routine */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-3.5 space-y-2 mt-2">
              <span className="text-[11px] font-semibold text-slate-700 block">+ Tambah Kegiatan Rutin</span>
              <input
                type="text"
                value={newRoutineTitle}
                onChange={(e) => setNewRoutineTitle(e.target.value)}
                placeholder="Nama kegiatan (contoh: Les Privat Inggris)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newRoutineDay}
                  onChange={(e) => setNewRoutineDay(e.target.value)}
                  placeholder="Hari (misal: Rabu)"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
                <input
                  type="text"
                  value={newRoutineTime}
                  onChange={(e) => setNewRoutineTime(e.target.value)}
                  placeholder="Jam (16:00 - 18:00)"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddRoutine}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                + Tambahkan ke Daftar Blokir
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Simpan Perubahan Preferensi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
