import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  Info,
  GraduationCap
} from 'lucide-react';
import stoodifyLogo from '../../assets/logo_stoodify.png';

interface AuthViewProps {
  onLoginSuccess: (name: string, email: string) => void;
}

// Crisp Google Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
);

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  // Mode: 'welcome' (Layar Sambutan Awal), 'login' (Masuk), 'register' (Daftar Akun)
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('naufal.pratama@student.id');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('Kevin Raditya');
  const [regEmail, setRegEmail] = useState('kevin.raditya@student.id');
  const [regPassword, setRegPassword] = useState('password123');
  const [regConfirmPassword, setRegConfirmPassword] = useState('password123');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('Naufal Pratama', loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(regName || 'Siswa SMA', regEmail || 'siswa@stoodify.id');
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess('Naufal Pratama', 'naufal.pratama@student.id');
  };

  return (
    <div className="w-full h-full min-h-full flex-1 flex flex-col bg-white">
      
      {/* ========================================================= */}
      {/* 1. WELCOME / HERO SCREEN (Layar Pertama Kali Dibuka)       */}
      {/* ========================================================= */}
      {mode === 'welcome' && (
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between bg-white select-none">
          
          {/* Top Blue Atmosphere Section (Smooth Organic Gradient) */}
          <div 
            className="relative w-full h-[54vh] min-h-[320px] max-h-[460px] flex flex-col items-center justify-center overflow-hidden px-6"
            style={{
              background: 'radial-gradient(115% 72% at 50% 10%, #1147e8 0%, #1552eb 42%, #1b5bf0 58%, #2b6bf3 69%, #477ff6 78%, #729ef8 85%, #a4c2fb 91%, #d6e3fd 95.5%, #f2f6fe 98.2%, #ffffff 100%)'
            }}
          >
            {/* Luminous Glow Halo behind logo */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-300/25 blur-3xl pointer-events-none -mt-4" />

            {/* Centered Stoodify Icon & Brand */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 -mt-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-4 border border-white/40 shadow-xl shadow-blue-900/20 flex items-center justify-center">
                <img 
                  src={stoodifyLogo} 
                  alt="Stoodify Logo" 
                  className="w-full h-full object-contain filter brightness-0 invert drop-shadow-md" 
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  Stoodify
                </h1>
                <p className="text-[11px] font-semibold text-blue-100 tracking-wider uppercase mt-1">
                  Khusus Siswa SMA / SMK Sederajat
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="w-full flex-1 bg-white px-7 pt-2 pb-8 flex flex-col justify-between max-w-[420px] mx-auto z-10">
            <p className="text-xs sm:text-sm text-slate-500 font-normal text-center max-w-[290px] mx-auto leading-relaxed">
              Asisten AI cerdas untuk membagi waktu belajar dan menyelesaikan tugas sekolah tanpa burnout.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 w-full">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-lg shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-center"
              >
                Masuk ke Akun
              </button>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="w-full py-3.5 px-6 rounded-full text-[#1E50FF] font-semibold text-xs sm:text-sm tracking-wide bg-white border border-[#1E50FF] hover:bg-blue-50/50 active:scale-98 transition-all cursor-pointer text-center"
              >
                Daftar Akun Baru
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition-colors pt-1 cursor-pointer block"
              >
                Coba Mode Demo (Naufal Pratama)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SIGN IN SCREEN (Layar Masuk / Login)                    */}
      {/* ========================================================= */}
      {mode === 'login' && (
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between px-7 py-7 max-w-[420px] mx-auto overflow-y-auto no-scrollbar modal-enter-smooth">
          <div>
            {/* Top Row: Back button + Circular Stoodify Logo + Version */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setMode('welcome')} 
                  className="p-1 -ml-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Kembali ke halaman awal"
                  title="Kembali ke halaman awal"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
                </button>
                <div 
                  onClick={() => setMode('welcome')}
                  className="w-12 h-12 rounded-full bg-[#EEF4FF] border border-blue-100 flex items-center justify-center p-2.5 shadow-xs cursor-pointer hover:bg-blue-100/60 transition-all active:scale-95"
                  title="Kembali ke halaman awal"
                >
                  <img 
                    src={stoodifyLogo} 
                    alt="Stoodify Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tracking-tight">
                1.0.0 Stoodify
              </span>
            </div>

            {/* Title */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Selamat Datang Kembali
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masuk untuk mengakses jadwal dan tugas belajarmu
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Field: Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email atau Nama Pengguna
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="naufal.pratama@student.id"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Field: Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-3 text-xs sm:text-sm text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-md shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-center"
                >
                  Masuk Sekarang
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => alert('Petunjuk pemulihan kata sandi telah dikirim ke email terdaftar.')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#1E50FF] transition-colors cursor-pointer"
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              {/* Divider "Atau" */}
              <div className="flex items-center gap-3 pt-1" aria-hidden="true">
                <div className="h-px flex-1 bg-slate-200/80" />
                <span className="text-[11px] text-slate-400 font-medium">Atau</span>
                <div className="h-px flex-1 bg-slate-200/80" />
              </div>

              {/* Social & Demo Buttons */}
              <div className="space-y-2.5">
                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] active:scale-98 text-slate-700 font-semibold text-xs py-3 px-4 rounded-2xl border border-slate-200/60 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Lanjutkan dengan Google</span>
                </button>

                {/* 1-Click Demo Login */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] active:scale-98 text-[#1E50FF] font-semibold text-xs py-3 px-4 rounded-2xl border border-blue-200/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-[#1E50FF]" />
                  <span>Masuk Cepat Mode Demo</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#1E50FF] hover:underline cursor-pointer ml-0.5"
              >
                Daftar sekarang
              </button>
            </p>

            <p className="text-[10px] text-slate-400 font-mono">
              &copy; 2026 Stoodify.Inc &bull; SMA & SMK Sederajat
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CREATE ACCOUNT SCREEN (Layar Daftar Akun Baru)          */}
      {/* ========================================================= */}
      {mode === 'register' && (
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between px-7 py-7 max-w-[420px] mx-auto overflow-y-auto no-scrollbar modal-enter-smooth">
          <div>
            {/* Header: Back Button + Title */}
            <div className="flex items-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="p-1 -ml-1 text-slate-700 hover:text-[#1E50FF] cursor-pointer transition-colors"
                aria-label="Kembali ke halaman masuk"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
              </button>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Daftar Akun Baru
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-[#0062FF] px-2 py-0.5 rounded-full border border-blue-100">
                    <GraduationCap className="w-3 h-3" />
                    <span>Khusus Siswa SMA / SMK Sederajat</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Kevin Raditya"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* School / Student Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Siswa / Sekolah
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="kevin.raditya@student.id"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <p className="text-[10px] text-slate-500 font-normal flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3 text-[#0062FF] shrink-0" />
                  <span>Gunakan email sekolah atau email aktif siswa</span>
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Buat kata sandi baru"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-1">
                <label 
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="flex items-start gap-2 cursor-pointer select-none group"
                >
                  <div 
                    className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      agreeTerms ? 'bg-[#1E50FF] text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {agreeTerms && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Saya menyetujui{' '}
                    <span className="text-slate-700 font-semibold underline">Syarat & Ketentuan</span>
                    {' '}serta{' '}
                    <span className="text-slate-700 font-semibold underline">Kebijakan Privasi</span>
                    {' '}Stoodify.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-md shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-center"
                >
                  Daftar Akun Sekarang
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Link */}
          <div className="pt-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#1E50FF] hover:underline cursor-pointer ml-0.5"
              >
                Masuk
              </button>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
