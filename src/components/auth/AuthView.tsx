import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Check, 
  ChevronDown, 
  Sparkles, 
  Info 
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
  // Mode: 'welcome' (Splash/Hero - First Screen opened), 'login' (Sign In), 'register' (Create Account)
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('nathan.roberts@example.com');
  const [loginPassword, setLoginPassword] = useState('axkLC8wyoA4M');

  // Register form state
  const [regName, setRegName] = useState('Vincze Nikolett');
  const [regEmail, setRegEmail] = useState('nathan.roberts@example.com');
  const [regRole, setRegRole] = useState('Siswa SMA / SMK (Fase F)');
  const [regPassword, setRegPassword] = useState('ZB0mLzLH7CU');
  const [regConfirmPassword, setRegConfirmPassword] = useState('••••••••••••');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('Naufal Pratama', loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(regName || 'Siswa Baru', regEmail || 'siswa@stoodify.id');
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
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between">
          
          {/* Top Blue Atmosphere Section (Responsive Full Bleed) */}
          <div className="relative w-full h-[52vh] min-h-[290px] max-h-[460px] bg-gradient-to-b from-[#1040E0] via-[#1B52F2] to-[#3B82F6] flex flex-col items-center justify-center overflow-hidden px-6">
            
            {/* Luminous Glow Halo */}
            <div className="absolute w-80 h-80 rounded-full bg-blue-300/30 blur-3xl pointer-events-none" />
            
            {/* Soft Gradient Fade to White at Bottom */}
            <div className="absolute -bottom-1 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

            {/* Centered Stoodify Icon & Brand */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 -mt-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-4 border border-white/40 shadow-2xl flex items-center justify-center">
                <img 
                  src={stoodifyLogo} 
                  alt="Stoodify Logo" 
                  className="w-full h-full object-contain filter brightness-0 invert drop-shadow-md" 
                />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Stoodify
              </h1>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="w-full flex-1 bg-white px-7 pt-4 pb-8 flex flex-col justify-between max-w-[420px] mx-auto">
            <p className="text-xs sm:text-sm text-slate-500 font-normal text-center max-w-[280px] mx-auto leading-relaxed">
              Your AI Assistant for Task Management and Study Schedule.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 w-full">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-lg shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-center"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="w-full py-3.5 px-6 rounded-full text-[#1E50FF] font-semibold text-xs sm:text-sm tracking-wide bg-white border border-[#1E50FF] hover:bg-blue-50/50 active:scale-98 transition-all cursor-pointer text-center"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition-colors pt-1 cursor-pointer block"
              >
                Masuk Mode Demo (Naufal Pratama)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SIGN IN SCREEN (Layar Detail Login)                    */}
      {/* ========================================================= */}
      {mode === 'login' && (
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between px-7 py-7 max-w-[420px] mx-auto overflow-y-auto no-scrollbar">
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

            {/* Sign In Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Field: Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nathan.roberts@example.com"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Field: Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-3 text-xs sm:text-sm text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
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
                  Sign In
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => alert('Link pemulihan kata sandi telah dikirim ke email terdaftar.')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#1E50FF] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Divider "Or" */}
              <div className="flex items-center gap-3 pt-1" aria-hidden="true">
                <div className="h-px flex-1 bg-slate-200/80" />
                <span className="text-[11px] text-slate-400 font-medium">Or</span>
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
                  <span>Continue with Google</span>
                </button>

                {/* 1-Click Demo Login */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] active:scale-98 text-[#1E50FF] font-semibold text-xs py-3 px-4 rounded-2xl border border-blue-200/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-[#1E50FF]" />
                  <span>Masuk Mode Demo (Naufal Pratama)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#1E50FF] hover:underline cursor-pointer ml-0.5"
              >
                Sign up
              </button>
            </p>

            <p className="text-[10px] text-slate-400 font-mono">
              &copy; 2026 Stoodify.Inc
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CREATE ACCOUNT SCREEN (Layar Register)                 */}
      {/* ========================================================= */}
      {mode === 'register' && (
        <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between px-7 py-7 max-w-[420px] mx-auto overflow-y-auto no-scrollbar">
          <div>
            {/* Header: Back Button + Title */}
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="p-1 -ml-1 text-slate-700 hover:text-[#1E50FF] cursor-pointer transition-colors"
                aria-label="Kembali ke Sign In"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Create Account
              </h2>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Vincze Nikolett"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* School / Work Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School / Work Email
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nathan.roberts@example.com"
                  className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <p className="text-[10px] text-amber-700/90 font-medium flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>Please use your school or student email address</span>
                </p>
              </div>

              {/* Role / Grade Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Tingkat
                </label>
                <div className="relative">
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none appearance-none transition-all cursor-pointer"
                  >
                    <option value="Siswa SMA / SMK (Fase F)">Siswa SMA / SMK (Fase F)</option>
                    <option value="Siswa SMP (Fase D)">Siswa SMP (Fase D)</option>
                    <option value="Mahasiswa (Undergraduate)">Mahasiswa (Undergraduate)</option>
                    <option value="Guru / Mentor">Guru / Mentor</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="ZB0mLzLH7CU"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F5F7FA] hover:bg-[#EEF2F6] focus:bg-white border border-transparent focus:border-[#1E50FF]/60 rounded-2xl pl-4 pr-11 py-2.5 text-xs text-slate-800 font-medium focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
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
                    I agree to the{' '}
                    <span className="text-slate-700 font-semibold underline">Terms & Conditions</span>
                    {' '}and{' '}
                    <span className="text-slate-700 font-semibold underline">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-md shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer text-center"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Link */}
          <div className="pt-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#1E50FF] hover:underline cursor-pointer ml-0.5"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
