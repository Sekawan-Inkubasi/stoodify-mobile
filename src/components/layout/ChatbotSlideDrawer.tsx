import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Send, 
  Mic, 
  Camera, 
  RotateCcw, 
  Play, 
  Bot, 
  Zap, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { Task, AISession } from '../../types';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time?: string;
  actionType?: 'reschedule' | 'focus_timer' | 'view_tasks';
  actionLabel?: string;
}

interface ChatbotSlideDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  tasks: Task[];
  sessions: AISession[];
  onReschedulePrompt: () => void;
  onOpenFocusTimer: (task?: Task) => void;
}

export const ChatbotSlideDrawer: React.FC<ChatbotSlideDrawerProps> = ({
  isOpen,
  onToggle,
  onClose,
  tasks,
  sessions,
  onReschedulePrompt,
  onOpenFocusTimer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Halo Naufal! 👋 Saya **Stoodify AI Assistant**.\n\nAda materi pelajaran yang ingin dibahas, tugas yang sulit, atau perlu saya sesuaikan urutan prioritas belajarmu hari ini?',
      time: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Position control: default placed at 60% vertical height (below quick action buttons and insight card)
  const [yPercent, setYPercent] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startYPercent = useRef(60);
  const hasDragged = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isThinking]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Drag handlers for vertical positioning along the right screen edge
  const handleStartDrag = (clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    startYPercent.current = yPercent;
    hasDragged.current = false;
  };

  const handleMoveDrag = useCallback((clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    if (Math.abs(deltaY) > 6) {
      hasDragged.current = true;
    }
    const containerHeight = tabRef.current?.parentElement?.clientHeight || 800;
    const deltaPercent = (deltaY / containerHeight) * 100;
    const nextPercent = Math.min(80, Math.max(16, startYPercent.current + deltaPercent));
    setYPercent(nextPercent);
  }, [isDragging]);

  const handleEndDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!hasDragged.current) {
      // It was a clean tap/click, not a drag movement
      onToggle();
    }
  }, [isDragging, onToggle]);

  // Global mouse/touch move listener for smooth vertical repositioning
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleMoveDrag(e.clientY);
    const onMouseUp = () => handleEndDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMoveDrag(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEndDrag();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMoveDrag, handleEndDrag]);

  const quickPrompts = [
    { label: '⚡ Susun Prioritas', prompt: 'Saya ada kegiatan tambahan, tolong sesuaikan urutan prioritas belajarku.' },
    { label: '🔮 Prediksi Soal Kimia', prompt: 'Apa topik ujian Kimia yang paling sering keluar untuk materi Titrasi Asam Basa?' },
    { label: '📊 Ringkasan Beban Belajar', prompt: 'Bisa berikan ringkasan progres dan tugas prioritasku pekan ini?' },
    { label: '💡 Tips Mode Fokus 45 Menit', prompt: 'Bagaimana cara menjaga fokus 45 menit tanpa tergiur buka media sosial?' },
    { label: '📝 Bahas PR Titrasi', prompt: 'Jelaskan cara mencari titik ekivalen pada kurva titrasi asam basa secara singkat.' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = 'Baik Naufal! Saya sudah menganalisis permintaanmu berdasarkan data belajar terkini di Stoodify.';
      let actionType: 'reschedule' | 'focus_timer' | 'view_tasks' | undefined;
      let actionLabel: string | undefined;

      if (lower.includes('susun') || lower.includes('jadwal') || lower.includes('les') || lower.includes('reschedule')) {
        replyText = '⚡ **AI Adaptive Rescheduler Aktif!**\n\nUrutan prioritas belajarmu telah disesuaikan:\n• **Prioritas #1 (Hari ini):** Laporan Praktikum Kimia (45 Menit Fokus)\n• **Prioritas #2 (Besok):** Latihan 10 Soal Vektor Dimensi Tiga\n\nKlik tombol di bawah untuk langsung menerapkan rekomendasi urutan ini.';
        actionType = 'reschedule';
        actionLabel = '⚡ Terapkan Urutan Prioritas Baru';
      } else if (lower.includes('kimia') || lower.includes('titrasi')) {
        replyText = '🔮 **Prediksi Materi & Bantuan PR Kimia:**\n\n1. **Titik Ekivalen:** Terjadi saat mol asam = mol basa ($n_a \\times M_a \\times V_a = n_b \\times M_b \\times V_b$).\n2. **Indikator PP:** Sangat cocok untuk titrasi Asam Kuat - Basa Kuat (rentang pH 8.3 - 10.0).\n3. Peluang keluar di lembar penilaian guru: **85% probabilitas tinggi**!';
        actionType = 'focus_timer';
        actionLabel = '⏱️ Mulai Mode Fokus Kimia (45 Min)';
      } else if (lower.includes('ringkasan') || lower.includes('beban') || lower.includes('progres')) {
        const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
        replyText = `📊 **Ringkasan Beban Belajar Siswa:**\n\n• Sisa Tugas Aktif: **${pendingCount} tugas**\n• Prioritas Tertinggi: **Kimia & Matematika**\n• Streak Aktif: **🔥 5 Hari Berturut-turut**\n• Estimasi total waktu yang dibutuhkan: **~2.5 Jam** terbagi dalam 3 sesi malam. Beban belajarmu masih dalam kategori **Aman & Terkendali**! ✨`;
      } else if (lower.includes('fokus') || lower.includes('tips') || lower.includes('distraksi')) {
        replyText = '💡 **Tips Zen Focus Mode ala Stoodify:**\n\n1. Jauhkan ponsel dari jangkauan pandangan mata.\n2. Siapkan hanya 1 botol air minum dan catatan tugas.\n3. Nyalakan timer fokus 45 menit lalu istirahat 10 menit (Pomodoro Adaptif).\n\nMau mulai sesi fokus sekarang?';
        actionType = 'focus_timer';
        actionLabel = '⏱️ Buka Zen Focus Timer';
      } else {
        replyText = `Tentu! Sebagai asisten belajar AI Stoodify, saya siap membantu membedah tugas **${tasks[0]?.title || 'sekolah'}**, merangkum materi pelajaran, atau mengoptimalkan jam istirahatmu. Ada topik khusus yang ingin kamu bahas?`;
      }

      const botMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        actionType,
        actionLabel,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 650);
  };

  const handleActionClick = (msg: ChatMessage) => {
    if (msg.actionType === 'reschedule') {
      onReschedulePrompt();
    } else if (msg.actionType === 'focus_timer') {
      const targetTask = tasks.find((t) => t.subject.toLowerCase().includes('kimia')) || tasks[0];
      onOpenFocusTimer(targetTask);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage('Jelaskan rumus Titrasi Kimia titik ekivalen secara ringkas.');
      }, 2400);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Halo Naufal! Percakapan baru telah dimulai. Ada yang bisa saya bantu terkait tugas, ujian, atau jadwal belajarmu?',
        time: 'Baru saja',
      },
    ]);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. PROFESSIONAL SLIDE TAB LAUNCHER                       */}
      {/* • Proportioned height (~140px) matching the reference    */}
      {/* • Styled in Stoodify Electric Royal Blue & clean border   */}
      {/* • NO generic AI sparkle star ("AI slop" removed)         */}
      {/* • Clean top arrow <, vertical text, bottom arrow <       */}
      {/* • Positioned cleanly at 60% vertical (below buttons)    */}
      {/* • Draggable up/down for flexible user placement          */}
      {/* ======================================================== */}
      <div
        ref={tabRef}
        style={{ top: `${yPercent}%` }}
        className={`absolute right-0 -translate-y-1/2 z-40 select-none transition-transform duration-200 ${
          isOpen ? 'opacity-0 pointer-events-none translate-x-full' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onMouseDown={(e) => handleStartDrag(e.clientY)}
          onTouchStart={(e) => e.touches[0] && handleStartDrag(e.touches[0].clientY)}
          aria-label={isOpen ? 'Tutup Asisten AI' : 'Buka Stoodify AI Assistant'}
          title="Geser naik/turun untuk atur posisi, atau klik untuk membuka chat"
          className={`flex flex-col items-center justify-between py-2.5 px-1.5 w-8 sm:w-8.5 h-[118px] rounded-l-2xl bg-gradient-to-b from-[#0062FF] via-[#0052D4] to-[#1D4ED8] text-white shadow-[-5px_4px_20px_rgba(0,98,255,0.35)] border-y border-l border-white/30 cursor-grab active:cursor-grabbing hover:-translate-x-1 hover:shadow-[-8px_6px_26px_rgba(0,98,255,0.5)] transition-all overflow-hidden ${
            isDragging ? 'scale-105 shadow-[-8px_10px_28px_rgba(0,98,255,0.55)]' : ''
          }`}
        >
          {/* Top Directional Arrow < */}
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/15 shrink-0">
            <ChevronLeft className="w-3 h-3 text-white stroke-[2.8px] -translate-x-[0.5px]" />
          </div>

          {/* Crisp Vertical Text "AI ASSISTANT" */}
          <div className="my-auto flex items-center justify-center py-1">
            <span 
              className="text-[9px] font-extrabold tracking-[0.16em] uppercase text-white whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] select-none"
              style={{ 
                writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)' 
              }}
            >
              AI ASSISTANT
            </span>
          </div>

          {/* Bottom Directional Arrow < */}
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/15 shrink-0">
            <ChevronLeft className="w-3 h-3 text-white stroke-[2.8px] -translate-x-[0.5px]" />
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. SLIDE-OUT DRAWER OVERLAY & PANEL                      */}
      {/* Clean, authentic Stoodify layout without AI slop         */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-0 z-50 overflow-hidden transition-all duration-300 ${
          isOpen ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        {/* Semi-transparent Dimmed Backdrop Overlay (Clicking on left outside closes drawer) */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup chatbot (klik di luar)"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 cursor-pointer"
        />

        {/* Slide-over Drawer Panel */}
        <aside
          role="dialog"
          aria-label="Stoodify AI Assistant"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-y-0 right-0 w-[90%] sm:w-[365px] bg-white shadow-[-16px_0_40px_rgba(20,40,90,0.22)] border-l border-slate-200/80 flex flex-col z-50 transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* DRAWER TOP HEADER (Stoodify Royal Electric Blue Theme with Back Arrow) */}
          <div className="bg-gradient-to-r from-[#0062FF] via-[#0055E6] to-[#1E40AF] text-white px-3.5 py-3.5 flex items-center justify-between shadow-md select-none shrink-0">
            <div className="flex items-center gap-2">
              {/* Dedicated Tombol Panah Back (< ChevronLeft) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Kembali / Tutup Chatbot"
                aria-label="Kembali"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.8px] -translate-x-[0.5px]" />
              </button>

              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 shadow-xs">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight text-white">
                    Stoodify AI Assistant
                  </h3>
                  <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.2 rounded-full text-blue-50">
                    Smart AI
                  </span>
                </div>
                <p className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online &bull; Siap membantumu 24/7
                </p>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetChat}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Mulai Percakapan Baru"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Tutup Panel"
              >
                <X className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          {/* COMPACT STATUS BANNER */}
          <div className="bg-gradient-to-b from-blue-50/60 to-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100/80 flex items-center justify-center text-[#0062FF]">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-slate-800">
                  {isListening ? 'Mendengarkan suaramu...' : 'Konsultasi Materi & Jadwal Belajar'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Tab samping dapat digeser naik/turun sesuai kenyamanan
                </p>
              </div>
            </div>

            {isListening && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                <span className="w-1.5 h-3 bg-blue-500 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-4 bg-blue-600 rounded-full animate-wave-bar" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-2.5 bg-blue-500 rounded-full animate-wave-bar" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          {/* QUICK PROMPT SUGGESTION CHIPS */}
          <div className="bg-white px-3 py-2 border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                className="shrink-0 bg-slate-50 hover:bg-blue-50 hover:text-[#0062FF] text-slate-700 text-[10.5px] font-semibold px-2.5 py-1 rounded-full border border-slate-200/70 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 bg-[#F8FAFD]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0062FF] to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-[11.5px] leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0062FF] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">
                    {msg.text}
                  </p>

                  {/* Interactive Action Buttons inside AI Responses */}
                  {msg.actionType && msg.actionLabel && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg)}
                        className="w-full bg-[#0062FF] hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        {msg.actionType === 'reschedule' && <Zap className="w-3.5 h-3.5" />}
                        {msg.actionType === 'focus_timer' && <Play className="w-3 h-3 fill-current" />}
                        <span>{msg.actionLabel}</span>
                      </button>
                    </div>
                  )}

                  {msg.time && (
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Thinking Indicator */}
            {isThinking && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0062FF] to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-3.5 py-2 flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-[#0062FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#0062FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#0062FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-500 font-semibold ml-1">AI sedang menganalisis...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* DRAWER FOOTER INPUT DOCK */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-1.5">
              {/* Camera / Scan Soal Button */}
              <button
                type="button"
                onClick={() => alert('📷 Fitur Scan Soal / PR: Siap memindai foto lembar tugasmu untuk dianalisis oleh Stoodify AI!')}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
                title="Foto Soal / Dokumen PR"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Mic Voice Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${
                  isListening
                    ? 'bg-[#0062FF] text-white shadow-md shadow-blue-500/40 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Bicara Suara (Voice Assistant)"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 flex items-center border border-slate-200/60 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanya materi, PR, atau jadwal..."
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isThinking}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm ${
                  inputText.trim() && !isThinking
                    ? 'bg-[#0062FF] shadow-blue-500/30 hover:bg-blue-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-3.5 h-3.5 -translate-y-[0.5px] translate-x-[0.5px]" />
              </button>
            </div>
            
            <p className="text-[9.5px] text-slate-400 text-center mt-1.5 select-none">
              Didukung model cerdas Stoodify AI &bull; Sekawan Inkubasi
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};
