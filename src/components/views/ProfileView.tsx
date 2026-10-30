import React from 'react';
import { 
  User, 
  Settings, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Flame, 
  CheckCircle,
  Crown
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ProfileSkeleton } from '../layout/SkeletonLoaders';

interface ProfileViewProps {
  user: UserProfile;
  subjectsCount: number;
  isLoading?: boolean;
  onOpenProModal: () => void;
  onOpenHelp: () => void;
  onOpenManageSubjects: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  subjectsCount,
  isLoading,
  onOpenProModal,
  onOpenHelp,
  onOpenManageSubjects,
  onLogout,
}) => {
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      
      {/* 1. TOP HEADER */}
      <div className="pt-1 pb-1">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">Profil & Akun</h1>
        <p className="text-[11px] font-normal text-slate-500">
          Statistik belajar dan preferensi penjadwalan AI
        </p>
      </div>

      {/* 2. STUDENT CARD */}
      <div className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgba(20,40,90,0.06)] border border-white">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-300 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 truncate">{user.name || 'Siswa Stoodify'}</h3>
              <span className="text-[9px] font-semibold bg-blue-50 text-[#0062FF] px-2 py-0.5 rounded-full">
                {user.grade || 'Fase F'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.grade || 'SMA'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.school || 'Stoodify'}</p>
          </div>
        </div>

        {/* Pro Banner */}
        <div 
          onClick={onOpenProModal}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#0062FF] transition-colors">
                Paket Siswa Reguler
              </span>
              <span className="block text-[10px] text-slate-500">
                Upgrade ke Stoodify Pro untuk AI tanpa batas
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 3. PERFORMANCE STATS CARDS */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white">
          <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="text-base font-bold text-slate-900 block leading-tight">{user.streakDays}d</span>
          <span className="text-[10px] text-slate-400 font-medium">Streak</span>
        </div>

        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 block leading-tight">{user.totalStudyHours}h</span>
          <span className="text-[10px] text-slate-400 font-medium">Fokus</span>
        </div>

        <div className="bg-white rounded-2xl p-3 text-center shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white">
          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 block leading-tight">
            {typeof user.onTimeRate === 'number' && user.onTimeRate > 0 ? `${user.onTimeRate}%` : user.completedTasksThisWeek > 0 ? '100%' : '0%'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Tepat Waktu</span>
        </div>
      </div>

      {/* 4. SETTINGS MENU LIST */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(20,40,90,0.04)] border border-white divide-y divide-slate-50 overflow-hidden">
        
        {/* Mata Pelajaran */}
        <button
          onClick={onOpenManageSubjects}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Mata Pelajaran</h4>
              <p className="text-[10px] text-slate-500 font-normal">{subjectsCount} mata pelajaran aktif terdaftar</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0062FF] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Pusat Bantuan */}
        <button
          onClick={onOpenHelp}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Pusat Bantuan & Panduan</h4>
              <p className="text-[10px] text-slate-500">Tanya jawab dan cara kerja rekomendasi AI</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0062FF] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-rose-50/60 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-600">Keluar dari Akun</h4>
              <p className="text-[10px] text-slate-400">Kembali ke layar masuk</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-300 group-hover:translate-x-0.5 transition-all" />
        </button>

      </div>

    </div>
  );
};
