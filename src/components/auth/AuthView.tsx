import React, { useState } from 'react';
import { 
  Eye, 
  Headphones, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  Mail, 
  Lock, 
  User, 
  Sparkles,
  Trophy,
  Check
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (name: string, email: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'onboarding' | 'login' | 'register'>('onboarding');
  
  // Onboarding habit controls (From Reference 1 Screen 1)
  const [studyMinutes, setStudyMinutes] = useState(30);
  const [selectedStyle, setSelectedStyle] = useState<'visual' | 'listen' | 'practical' | 'routine'>('visual');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('naufal.pratama@student.id');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Waveform bars simulation
  const waveformBars = [
    12, 18, 14, 24, 30, 22, 16, 28, 36, 42, 38, 32, 28, 34, 40, 48, 44, 36, 30, 25, 20, 16, 22, 28, 32, 24, 18, 14, 10
  ];

  const handleFinishOnboarding = () => {
    onLoginSuccess('Naufal Pratama', 'naufal.pratama@student.id');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('Naufal Pratama', loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(regName || 'Siswa Baru', regEmail || 'siswa@stoodify.id');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-4 pt-1 pb-6">
      
      {/* ========================================================= */}
      {/* 1. ONBOARDING SCREEN (Exact replica of Reference 1 Screen 1) */}
      {/* ========================================================= */}
      {mode === 'onboarding' && (
        <div className="space-y-4">
          
          {/* Top 3D Mascot & "Learning" Title Header */}
          <div className="relative pt-2 pb-1 text-center flex flex-col items-center">
            {/* Playful Floating Emojis / Badges */}
            <div className="flex items-center gap-1.5 mb-1 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white shadow-xs">
              <span className="text-base">🤗</span>
              <span className="text-[11px] font-semibold text-blue-900 tracking-wide uppercase">Smart Learning</span>
            </div>

            {/* Mascot & Graphic Composition */}
            <div className="relative my-1 w-full max-w-[280px] h-36 flex items-center justify-center">
              {/* Central Mascot Badge */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-300 p-1 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                    alt="Student Mascot"
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Floating Trophy Badge */}
              <div className="absolute -left-2 top-8 w-11 h-11 bg-amber-400 rounded-2xl flex items-center justify-center shadow-md shadow-amber-400/30 text-white animate-bounce duration-1000">
                <Trophy className="w-6 h-6 fill-white" />
              </div>

              {/* Floating Lightbulb badge */}
              <div className="absolute -right-1 top-4 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/30 text-white">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>

              {/* Floating Books Pill */}
              <div className="absolute bottom-0 right-4 bg-white px-2.5 py-1 rounded-xl shadow-md border border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <span>📚 12 Sesi</span>
              </div>
            </div>

            {/* Big "Learning" Title */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Learning
            </h1>
            <p className="text-xs text-slate-500 font-normal max-w-xs mt-0.5">
              Sesuaikan target dan gaya belajarmu sebelum AI mengatur jadwal pekan ini.
            </p>
          </div>

          {/* White Card: "Set your daily study time" (Reference 1 Screen 1) */}
          <div className="bg-white rounded-[26px] p-4 shadow-[0_8px_30px_rgba(20,40,90,0.06)] border border-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Set your daily study time
              </span>
              <span className="text-xs font-bold text-[#0062FF] bg-blue-50 px-2 py-0.5 rounded-full">
                {studyMinutes} Min / hari
              </span>
            </div>

            {/* Waveform graphic */}
            <div className="h-10 flex items-end justify-between gap-[2px] px-2 pt-2">
              {waveformBars.map((height, idx) => {
                const percentPosition = (idx / (waveformBars.length - 1)) * 100;
                const activePercent = ((studyMinutes - 10) / 50) * 100;
                const isPassed = percentPosition <= activePercent;

                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-200 ${
                      isPassed ? 'bg-[#0062FF]' : 'bg-slate-200'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>

            {/* Slider Scrubber with Pill Bubble */}
            <div className="relative pt-1">
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(Number(e.target.value))}
                className="w-full accent-[#0062FF] cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                <span>10 Min</span>
                <span>60 Min</span>
              </div>
            </div>
          </div>

          {/* 4 Soft Pastel Learning Style Cards (Reference 1 Screen 1) */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* 1. Visual Thinker */}
            <div
              onClick={() => setSelectedStyle('visual')}
              className={`rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                selectedStyle === 'visual'
                  ? 'bg-[#E8F2FE] border-[#B9D7FB] shadow-xs'
                  : 'bg-[#F2F7FE]/70 border-transparent hover:bg-[#E8F2FE]/70'
              }`}
            >
              <div>
                <h4 className="text-xs font-semibold text-[#1E3A8A]">Visual Thinker</h4>
                <p className="text-[10px] text-[#3B82F6] font-normal leading-tight mt-0.5">
                  Remembers ideas using visuals
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-[#1E3A8A] flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 stroke-[2.2px]" />
                </div>
                {selectedStyle === 'visual' && (
                  <div className="w-4 h-4 rounded-full bg-[#0062FF] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Listen & Learn */}
            <div
              onClick={() => setSelectedStyle('listen')}
              className={`rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                selectedStyle === 'listen'
                  ? 'bg-[#FEF4E6] border-[#FCD9AC] shadow-xs'
                  : 'bg-[#FFF8EF]/70 border-transparent hover:bg-[#FEF4E6]/70'
              }`}
            >
              <div>
                <h4 className="text-xs font-semibold text-[#78350F]">Listen & Learn</h4>
                <p className="text-[10px] text-[#D97706] font-normal leading-tight mt-0.5">
                  Processes ideas by listening
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-[#78350F] flex items-center justify-center">
                  <Headphones className="w-3.5 h-3.5 stroke-[2.2px]" />
                </div>
                {selectedStyle === 'listen' && (
                  <div className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Practical Learner */}
            <div
              onClick={() => setSelectedStyle('practical')}
              className={`rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                selectedStyle === 'practical'
                  ? 'bg-[#FEECEB] border-[#FCC4C0] shadow-xs'
                  : 'bg-[#FFF3F3]/70 border-transparent hover:bg-[#FEECEB]/70'
              }`}
            >
              <div>
                <h4 className="text-xs font-semibold text-[#881337]">Practical Learner</h4>
                <p className="text-[10px] text-[#E11D48] font-normal leading-tight mt-0.5">
                  Applies knowledge while learning
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-[#881337] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 stroke-[2.2px]" />
                </div>
                {selectedStyle === 'practical' && (
                  <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                )}
              </div>
            </div>

            {/* 4. Routine Learner */}
            <div
              onClick={() => setSelectedStyle('routine')}
              className={`rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                selectedStyle === 'routine'
                  ? 'bg-[#F1EEFD] border-[#D4CBFB] shadow-xs'
                  : 'bg-[#F8F6FE]/70 border-transparent hover:bg-[#F1EEFD]/70'
              }`}
            >
              <div>
                <h4 className="text-xs font-semibold text-[#4C1D95]">Routine Learner</h4>
                <p className="text-[10px] text-[#7C3AED] font-normal leading-tight mt-0.5">
                  Progresses through planned routines
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-[#4C1D95] flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 stroke-[2.2px]" />
                </div>
                {selectedStyle === 'routine' && (
                  <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Solid Electric Blue Pill Button: "Next" */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleFinishOnboarding}
              className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2px]" />
            </button>

            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-1">
              <button 
                onClick={() => setMode('login')} 
                className="hover:text-[#0062FF] cursor-pointer"
              >
                Sudah Ada Akun? Masuk
              </button>
              <span>&bull;</span>
              <button 
                onClick={() => setMode('register')} 
                className="hover:text-[#0062FF] cursor-pointer"
              >
                Daftar Akun
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. LOGIN SCREEN (Clean Modern Aesthetic)                  */}
      {/* ========================================================= */}
      {mode === 'login' && (
        <div className="space-y-4 pt-4">
          <button
            onClick={() => setMode('onboarding')}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Masuk ke Stoodify</h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">Lanjutkan jadwal belajar cerdas yang telah tersusun.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Siswa</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="naufal@student.id"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </div>
          </form>

          <div className="text-center pt-3 text-xs text-slate-500">
            Belum punya akun?{' '}
            <button
              onClick={() => setMode('register')}
              className="font-semibold text-[#0062FF] hover:underline cursor-pointer"
            >
              Daftar di sini
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. REGISTER SCREEN (Clean Modern Aesthetic)               */}
      {/* ========================================================= */}
      {mode === 'register' && (
        <div className="space-y-3 pt-3">
          <button
            onClick={() => setMode('onboarding')}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daftar Akun Siswa</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">Gabung ribuan siswa yang belajar teratur tanpa burnout.</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Naufal Pratama"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={regSchool}
                onChange={(e) => setRegSchool(e.target.value)}
                placeholder="SMAN 1 Bandung"
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-[#0062FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Siswa</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@student.id"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-[#0062FF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                Mulai Belajar Sekarang
              </button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Sudah punya akun?{' '}
            <button
              onClick={() => setMode('login')}
              className="font-bold text-[#0062FF] hover:underline cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
