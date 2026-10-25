import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { Task } from '../../types';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSessionComplete?: (taskId?: string, minutesSpent?: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  task,
  onSessionComplete,
}) => {
  if (!isOpen) return null;

  const defaultMinutes = task ? task.estimatedDurationMinutes || 45 : 25;
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
      alert('Selamat! Sesi belajar berhasil tuntas! 🎉');
      if (onSessionComplete) onSessionComplete(task?.id, Math.round(totalSeconds / 60));
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(totalSeconds);
  };

  const handleSetDuration = (mins: number) => {
    setIsActive(false);
    setTotalSeconds(mins * 60);
    setSecondsRemaining(mins * 60);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[38px] p-6 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-1.5 bg-blue-50 text-[#0062FF] px-3.5 py-1 rounded-full text-[11px] font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zen Focus Mode</span>
        </div>

        {/* Task Title if attached */}
        {task ? (
          <div className="mb-3">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white inline-block mb-1"
              style={{ backgroundColor: task.subjectColor }}
            >
              {task.subject}
            </span>
            <h3 className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[240px] mx-auto">
              {task.title}
            </h3>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-normal mb-3">
            Fokus belajar tanpa distraksi gadget
          </p>
        )}

        {/* Circular Timer Visual with Ambient Glow */}
        <div className="relative w-48 h-48 flex items-center justify-center my-1">
          {/* Ambient Glow Ring */}
          <div className="absolute inset-4 bg-blue-500/10 rounded-full blur-xl" />

          {/* SVG Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-[#0062FF] transition-all duration-500"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={(2 * Math.PI * 44) * (1 - progressPercent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Time text in center */}
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              {isActive ? 'Sedang Berjalan' : 'Siap Mulai'}
            </span>
          </div>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex gap-2 my-3">
          {[25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSetDuration(mins)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                totalSeconds === mins * 60
                  ? 'bg-[#0062FF] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Main Controls: Play / Pause / Reset */}
        <div className="flex items-center gap-4 my-2">
          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer active:scale-95"
            title="Reset Waktu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full bg-[#0062FF] text-white flex items-center justify-center shadow-xl shadow-blue-500/35 hover:bg-blue-600 transition-all cursor-pointer active:scale-90"
          >
            {isActive ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => setAmbientAudio(!ambientAudio)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              ambientAudio ? 'bg-blue-50 text-[#0062FF] border border-blue-200' : 'bg-slate-100 text-slate-400'
            }`}
            title="Suara Lofi / Hujan"
          >
            {ambientAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Motivational note */}
        <p className="text-[11px] text-slate-400 font-medium italic mt-2">
          "Fokus satu tugas, satu waktu. Jauhkan distraksi gadget selama 45 menit! 🎧"
        </p>

        {/* Complete Session Button */}
        <button
          onClick={() => {
            alert('Sesi belajar disimpan! Waktu fokusmu bertambah.');
            if (onSessionComplete) onSessionComplete(task?.id, Math.round(totalSeconds / 60));
            onClose();
          }}
          className="w-full mt-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 font-semibold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesaikan Sesi Ini</span>
        </button>

      </div>
    </div>
  );
};
