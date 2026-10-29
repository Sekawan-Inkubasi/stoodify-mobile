import fs from 'fs'
import path from 'path'

const outputDir = 'C:\\Users\\NITRO\\sekawan-inkubasi\\stoodify-mobile\\figma\\svg-screens'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const svgDefs = `
  <defs>
    <linearGradient id="blueCardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B3CD5"/>
      <stop offset="50%" stop-color="#0055F6"/>
      <stop offset="100%" stop-color="#4338CA"/>
    </linearGradient>
    <linearGradient id="avatarRing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#FCD34D"/>
    </linearGradient>
    <linearGradient id="mascotGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0062FF"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#14285A" flood-opacity="0.08"/>
    </filter>
    <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#0055F6" flood-opacity="0.22"/>
    </filter>
    <filter id="navShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#14285A" flood-opacity="0.14"/>
    </filter>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&amp;display=swap');
      text { font-family: 'Poppins', system-ui, sans-serif; }
      .bold { font-weight: 700; }
      .semibold { font-weight: 600; }
      .medium { font-weight: 500; }
      .regular { font-weight: 400; }
    </style>
  </defs>
`

// Bottom Nav Bar component (Floating pill)
function renderBottomNav(activeTab = 'home') {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Beranda', x: 20 },
    { id: 'calendar', icon: '📅', label: 'Kalender', x: 88 },
    { id: 'tasks', icon: '📋', label: 'Tugas', x: 156 },
    { id: 'ai-plan', icon: '✨', label: 'Rencana AI', x: 224 },
    { id: 'profile', icon: '👤', label: 'Profil', x: 292 }
  ]

  let buttons = ''
  tabs.forEach(t => {
    const isActive = t.id === activeTab
    if (isActive) {
      buttons += `
        <g transform="translate(${t.x}, 6)">
          <rect width="48" height="40" rx="20" fill="#0062FF"/>
          <text x="24" y="25" font-size="18" fill="#ffffff" text-anchor="middle">${t.icon}</text>
        </g>
      `
    } else {
      buttons += `
        <g transform="translate(${t.x}, 6)">
          <text x="24" y="26" font-size="18" fill="#64748B" text-anchor="middle">${t.icon}</text>
        </g>
      `
    }
  })

  return `
    <!-- Floating Bottom Navigation -->
    <g transform="translate(18, 768)" filter="url(#navShadow)">
      <rect width="354" height="52" rx="26" fill="#ffffff" fill-opacity="0.97"/>
      ${buttons}
    </g>
  `
}

// Side floating chatbot tab
const sideChatbotTab = `
  <g transform="translate(362, 380)">
    <rect width="28" height="68" rx="14" fill="#0062FF"/>
    <text x="14" y="38" font-size="14" fill="#ffffff" text-anchor="middle">🤖</text>
  </g>
`

// ==========================================
// 1. BERANDA (HOMEVIEW)
// ==========================================
const homeSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  
  <!-- Canvas Bg -->
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Top App Bar -->
  <g transform="translate(16, 20)">
    <!-- Avatar with Ring -->
    <circle cx="24" cy="24" r="22" fill="url(#avatarRing)"/>
    <circle cx="24" cy="24" r="19" fill="#0062FF"/>
    <text x="24" y="29" font-size="14" fill="#ffffff" text-anchor="middle" class="bold">NP</text>
    <circle cx="38" cy="38" r="5" fill="#10B981" stroke="#ffffff" stroke-width="2"/>

    <!-- User Name & Meta -->
    <g transform="translate(56, 12)">
      <text y="0" font-size="15" fill="#0F172A" class="bold">Halo, Naufal 👋</text>
      <!-- Pill Fase F -->
      <rect x="110" y="-12" width="52" height="18" rx="9" fill="#0062FF" fill-opacity="0.1"/>
      <text x="136" y="1" font-size="10" fill="#0062FF" class="semibold" text-anchor="middle">Fase F</text>
      
      <!-- Subtitle -->
      <g transform="translate(0, 18)">
        <text y="0" font-size="11" fill="#64748B">SMAN 1 Teladan · </text>
        <rect x="94" y="-11" width="76" height="16" rx="8" fill="#FEF3C7"/>
        <text x="132" y="1" font-size="10" fill="#D97706" class="medium" text-anchor="middle">🔥 5d Streak</text>
      </g>
    </g>

    <!-- Top Action Icons -->
    <g transform="translate(280, 4)">
      <circle cx="18" cy="18" r="18" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="18" y="23" font-size="14" fill="#334155" text-anchor="middle">🔍</text>
      
      <circle cx="60" cy="18" r="18" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="60" y="23" font-size="14" fill="#334155" text-anchor="middle">🔔</text>
      <circle cx="70" cy="8" r="4" fill="#F43F5E" stroke="#ffffff" stroke-width="1.5"/>
    </g>
  </g>

  <!-- 2. SMART STUDY DECK (Ala GoPay Card) -->
  <g transform="translate(16, 84)" filter="url(#cardShadow)">
    <rect width="358" height="174" rx="28" fill="url(#blueCardGrad)"/>
    
    <!-- Ambient curves -->
    <circle cx="320" cy="20" r="60" fill="#ffffff" fill-opacity="0.1"/>
    <circle cx="300" cy="140" r="40" fill="#38BDF8" fill-opacity="0.15"/>

    <g transform="translate(18, 16)">
      <!-- Top Strip Status -->
      <rect width="168" height="24" rx="12" fill="#ffffff" fill-opacity="0.18"/>
      <text x="12" y="16" font-size="10" fill="#ffffff" class="medium">🛡️ AI Status: <tspan fill="#6EE7B7" class="bold">Terkendali &amp; Siap</tspan></text>

      <g transform="translate(230, 0)">
        <rect width="92" height="24" rx="12" fill="#ffffff" fill-opacity="0.18"/>
        <text x="46" y="16" font-size="10" fill="#E0F2FE" text-anchor="middle" class="medium">🔄 Reschedule</text>
      </g>

      <!-- Metrics -->
      <g transform="translate(0, 40)">
        <text y="0" font-size="11" fill="#BFDBFE" class="medium">Sesi Fokus Malam</text>
        <text y="28" font-size="26" fill="#ffffff" class="bold">45 <tspan font-size="12" fill="#93C5FD" class="regular">Menit (19:30)</tspan></text>

        <!-- Divider -->
        <line x1="160" y1="-5" x2="160" y2="35" stroke="#ffffff" stroke-opacity="0.2"/>

        <g transform="translate(176, 0)">
          <text y="0" font-size="11" fill="#BFDBFE" class="medium">Tugas Prioritas</text>
          <text y="28" font-size="26" fill="#FDE047" class="bold">2 <tspan font-size="12" fill="#93C5FD" class="regular">Tugas Aktif</tspan></text>
        </g>
      </g>

      <!-- Bottom Interactive Buttons -->
      <g transform="translate(0, 102)">
        <!-- Mulai Fokus Button -->
        <rect width="156" height="36" rx="18" fill="#ffffff"/>
        <text x="78" y="23" font-size="11" fill="#0062FF" class="bold" text-anchor="middle">⏱️ Mulai Mode Fokus</text>

        <!-- Tanya AI Button -->
        <g transform="translate(166, 0)">
          <rect width="156" height="36" rx="18" fill="#ffffff" fill-opacity="0.2" stroke="#ffffff" stroke-opacity="0.3"/>
          <text x="78" y="23" font-size="11" fill="#ffffff" class="medium" text-anchor="middle">✨ Tanya AI Asisten</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 3. QUICK ACTION SERVICE LAUNCHER (4 Clay Tiles ala Gojek) -->
  <g transform="translate(16, 274)">
    <!-- 1. Tambah Tugas -->
    <g transform="translate(0, 0)">
      <rect width="82" height="88" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <rect x="21" y="10" width="40" height="40" rx="14" fill="#0062FF" fill-opacity="0.1"/>
      <text x="41" y="35" font-size="18" fill="#0062FF" text-anchor="middle" class="bold">+</text>
      <text x="41" y="66" font-size="11" fill="#0F172A" class="semibold" text-anchor="middle">Tambah</text>
      <text x="41" y="79" font-size="10" fill="#94A3B8" class="regular" text-anchor="middle">Tugas</text>
    </g>

    <!-- 2. Mode Fokus -->
    <g transform="translate(92, 0)">
      <rect width="82" height="88" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <rect x="21" y="10" width="40" height="40" rx="14" fill="#EEF2FF"/>
      <text x="41" y="36" font-size="18" fill="#4F46E5" text-anchor="middle">⏱️</text>
      <text x="41" y="66" font-size="11" fill="#0F172A" class="semibold" text-anchor="middle">Fokus</text>
      <text x="41" y="79" font-size="10" fill="#94A3B8" class="regular" text-anchor="middle">Pomodoro</text>
    </g>

    <!-- 3. Prediksi Materi -->
    <g transform="translate(184, 0)">
      <rect width="82" height="88" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <rect x="21" y="10" width="40" height="40" rx="14" fill="#FEF3C7"/>
      <text x="41" y="36" font-size="18" fill="#D97706" text-anchor="middle">🧠</text>
      <text x="41" y="66" font-size="11" fill="#0F172A" class="semibold" text-anchor="middle">Prediksi</text>
      <text x="41" y="79" font-size="10" fill="#94A3B8" class="regular" text-anchor="middle">Materi</text>
    </g>

    <!-- 4. Jadwal Sekolah -->
    <g transform="translate(276, 0)">
      <rect width="82" height="88" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <rect x="21" y="10" width="40" height="40" rx="14" fill="#F1F5F9"/>
      <text x="41" y="36" font-size="18" fill="#334155" text-anchor="middle">📅</text>
      <text x="41" y="66" font-size="11" fill="#0F172A" class="semibold" text-anchor="middle">Jadwal</text>
      <text x="41" y="79" font-size="10" fill="#94A3B8" class="regular" text-anchor="middle">Sekolah</text>
    </g>
  </g>

  <!-- 4. SMART WORKLOAD LIVE INSIGHT STRIP -->
  <g transform="translate(16, 376)">
    <rect width="358" height="54" rx="18" fill="#ffffff" filter="url(#softShadow)"/>
    <rect x="12" y="9" width="36" height="36" rx="12" fill="#0062FF" fill-opacity="0.1"/>
    <text x="30" y="32" font-size="16" fill="#0062FF" text-anchor="middle">💡</text>
    
    <g transform="translate(56, 17)">
      <text y="0" font-size="11" fill="#0F172A" class="bold">Insight AI Beban Belajar</text>
      <text y="16" font-size="10" fill="#64748B">1 tugas kimia wajib tuntas malam ini agar siap praktikum.</text>
    </g>
    
    <rect x="304" y="15" width="42" height="24" rx="12" fill="#0062FF" fill-opacity="0.1"/>
    <text x="325" y="31" font-size="10" fill="#0062FF" class="bold" text-anchor="middle">Detail</text>
  </g>

  <!-- 5. HERO FEATURED SESI BELAJAR -->
  <g transform="translate(16, 442)">
    <rect width="358" height="170" rx="26" fill="#ffffff" filter="url(#softShadow)"/>
    
    <g transform="translate(18, 16)">
      <!-- Time slot pill & Subject tag -->
      <rect width="138" height="22" rx="11" fill="#EFF6FF"/>
      <text x="69" y="15" font-size="10" fill="#0062FF" class="semibold" text-anchor="middle">⏱️ 19:30 WIB · 45 Menit</text>

      <rect x="144" width="60" height="22" rx="11" fill="#0284C7" fill-opacity="0.12"/>
      <text x="174" y="15" font-size="10" fill="#0284C7" class="bold" text-anchor="middle">Kimia</text>

      <!-- Session Title -->
      <text y="50" font-size="15" fill="#0F172A" class="bold">Laporan Praktikum Titrasi Asam</text>
      <text y="68" font-size="11" fill="#64748B">Target: Hitung konsentrasi larutan &amp; kurva grafik titrasi.</text>

      <!-- Reason callout box -->
      <g transform="translate(0, 80)">
        <rect width="322" height="34" rx="12" fill="#F8FAFC"/>
        <text x="10" y="16" font-size="10" fill="#334155" class="medium">Alasan AI: <tspan fill="#64748B">Tenggat besok malam, tingkat kesulitan tinggi.</tspan></text>
      </g>

      <!-- Action Button -->
      <g transform="translate(0, 122)">
        <rect width="322" height="36" rx="18" fill="#0062FF"/>
        <text x="161" y="23" font-size="12" fill="#ffffff" class="bold" text-anchor="middle">Mulai Sesi Belajar Sekarang</text>
      </g>
    </g>
  </g>

  <!-- 6. URGENT TASKS MINI LIST -->
  <g transform="translate(16, 624)">
    <text x="0" y="0" font-size="13" fill="#0F172A" class="bold">Tugas Mendesak</text>
    <text x="358" y="0" font-size="11" fill="#0062FF" class="semibold" text-anchor="end">Lihat Semua (3) →</text>

    <!-- Mini Task Card -->
    <g transform="translate(0, 10)">
      <rect width="358" height="74" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <g transform="translate(16, 14)">
        <circle cx="14" cy="18" r="14" fill="#0284C7" fill-opacity="0.15"/>
        <text x="14" y="23" font-size="12" fill="#0284C7" text-anchor="middle">🧪</text>

        <g transform="translate(36, 6)">
          <text y="0" font-size="13" fill="#0F172A" class="semibold">Laporan Praktikum Titrasi</text>
          <text y="16" font-size="10" fill="#E11D48" class="medium">Besok, 23:59 WIB · Prioritas 92 (Critical)</text>
          
          <!-- Progress bar -->
          <rect y="24" width="220" height="4" rx="2" fill="#E2E8F0"/>
          <rect y="24" width="110" height="4" rx="2" fill="#0062FF"/>
        </g>

        <rect x="286" y="8" width="36" height="26" rx="13" fill="#FEF2F2"/>
        <text x="304" y="25" font-size="10" fill="#E11D48" class="bold" text-anchor="middle">50%</text>
      </g>
    </g>
  </g>

  <!-- Persistent Side Chatbot Tab -->
  ${sideChatbotTab}

  <!-- Bottom Navigation -->
  ${renderBottomNav('home')}
</svg>`

// ==========================================
// 2. DAFTAR TUGAS (TASKSVIEW)
// ==========================================
const tasksSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Top Header -->
  <g transform="translate(16, 24)">
    <text y="0" font-size="18" fill="#0F172A" class="bold">Daftar Tugas</text>
    <text y="18" font-size="11" fill="#64748B">3 tugas aktif dijadwalkan oleh AI</text>

    <!-- Add Task Button -->
    <g transform="translate(266, -10)">
      <rect width="92" height="34" rx="17" fill="#0062FF"/>
      <text x="46" y="21" font-size="11" fill="#ffffff" class="bold" text-anchor="middle">+ Tambah</text>
    </g>
  </g>

  <!-- Search Bar -->
  <g transform="translate(16, 76)">
    <rect width="358" height="44" rx="22" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="18" y="27" font-size="14" fill="#94A3B8">🔍</text>
    <text x="42" y="27" font-size="11" fill="#94A3B8">Cari tugas, materi, atau mata pelajaran...</text>
  </g>

  <!-- Status Filter Pills -->
  <g transform="translate(16, 134)">
    <!-- Active Semua -->
    <rect width="76" height="32" rx="16" fill="#0062FF"/>
    <text x="38" y="20" font-size="11" fill="#ffffff" class="bold" text-anchor="middle">Semua (3)</text>

    <!-- Prioritas -->
    <g transform="translate(84, 0)">
      <rect width="96" height="32" rx="16" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="48" y="20" font-size="11" fill="#334155" class="medium" text-anchor="middle">⚡ Prioritas</text>
    </g>

    <!-- Dikerjakan -->
    <g transform="translate(188, 0)">
      <rect width="90" height="32" rx="16" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="45" y="20" font-size="11" fill="#334155" class="medium" text-anchor="middle">Dikerjakan</text>
    </g>

    <!-- Tuntas -->
    <g transform="translate(286, 0)">
      <rect width="72" height="32" rx="16" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="36" y="20" font-size="11" fill="#334155" class="medium" text-anchor="middle">Tuntas</text>
    </g>
  </g>

  <!-- Task Card 1 (Critical with Subtasks) -->
  <g transform="translate(16, 182)">
    <rect width="358" height="234" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    
    <g transform="translate(16, 16)">
      <!-- Subject Badge & Priority Tag -->
      <rect width="56" height="22" rx="11" fill="#0284C7" fill-opacity="0.12"/>
      <text x="28" y="15" font-size="10" fill="#0284C7" class="bold" text-anchor="middle">Kimia</text>

      <rect x="64" width="138" height="22" rx="11" fill="#FEF2F2"/>
      <text x="133" y="15" font-size="10" fill="#E11D48" class="bold" text-anchor="middle">Skor 92 · Sangat Mendesak</text>

      <text x="326" y="15" font-size="11" fill="#64748B" text-anchor="end">Besok 23:59</text>

      <!-- Task Title & Desc -->
      <text y="52" font-size="15" fill="#0F172A" class="bold">Laporan Praktikum Titrasi Asam</text>
      <text y="70" font-size="11" fill="#64748B">Gunakan kertas folio bergaris sesuai arahan guru.</text>

      <!-- Progress Line -->
      <g transform="translate(0, 84)">
        <text y="0" font-size="10" fill="#64748B" class="medium">Progres Pengerjaan</text>
        <text x="326" y="0" font-size="10" fill="#0062FF" class="bold" text-anchor="end">50%</text>
        <rect y="6" width="326" height="5" rx="2.5" fill="#E2E8F0"/>
        <rect y="6" width="163" height="5" rx="2.5" fill="#0062FF"/>
      </g>

      <!-- Subtasks Checklist -->
      <g transform="translate(0, 116)">
        <line x1="0" y1="0" x2="326" y2="0" stroke="#F1F5F9"/>
        
        <g transform="translate(0, 18)">
          <circle cx="8" cy="4" r="7" fill="#10B981"/>
          <text x="8" y="7" font-size="9" fill="#ffffff" text-anchor="middle">✓</text>
          <text x="22" y="8" font-size="11" fill="#94A3B8" class="regular">Tulis dasar teori &amp; alat bahan</text>
        </g>

        <g transform="translate(0, 42)">
          <circle cx="8" cy="4" r="7" fill="#10B981"/>
          <text x="8" y="7" font-size="9" fill="#ffffff" text-anchor="middle">✓</text>
          <text x="22" y="8" font-size="11" fill="#94A3B8" class="regular">Tabulasi data hasil percobaan</text>
        </g>

        <g transform="translate(0, 66)">
          <circle cx="8" cy="4" r="7" fill="#ffffff" stroke="#CBD5E1" stroke-width="1.5"/>
          <text x="22" y="8" font-size="11" fill="#0F172A" class="medium">Hitung konsentrasi &amp; kurva titrasi</text>
        </g>

        <g transform="translate(0, 90)">
          <circle cx="8" cy="4" r="7" fill="#ffffff" stroke="#CBD5E1" stroke-width="1.5"/>
          <text x="22" y="8" font-size="11" fill="#0F172A" class="medium">Buat kesimpulan &amp; daftar pustaka</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Task Card 2 (Matematika) -->
  <g transform="translate(16, 432)">
    <rect width="358" height="136" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(16, 16)">
      <rect width="90" height="22" rx="11" fill="#EFF6FF"/>
      <text x="45" y="15" font-size="10" fill="#2563EB" class="bold" text-anchor="middle">Matematika</text>

      <rect x="98" width="112" height="22" rx="11" fill="#FFFBEB"/>
      <text x="154" y="15" font-size="10" fill="#D97706" class="bold" text-anchor="middle">Skor 81 · Prioritas</text>

      <text x="326" y="15" font-size="11" fill="#64748B" text-anchor="end">Lusa 21:00</text>

      <text y="52" font-size="15" fill="#0F172A" class="bold">Latihan 10 Soal Vektor Dimensi 3</text>
      <text y="70" font-size="11" fill="#64748B">Buku paket halaman 142 nomor 1 sampai 10.</text>

      <!-- Progress -->
      <g transform="translate(0, 84)">
        <rect y="6" width="326" height="5" rx="2.5" fill="#E2E8F0"/>
        <rect y="6" width="65" height="5" rx="2.5" fill="#2563EB"/>
        <text x="326" y="0" font-size="10" fill="#2563EB" class="bold" text-anchor="end">20%</text>
      </g>
    </g>
  </g>

  <!-- Task Card 3 (Biologi) -->
  <g transform="translate(16, 582)">
    <rect width="358" height="110" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(16, 16)">
      <rect width="64" height="22" rx="11" fill="#ECFDF5"/>
      <text x="32" y="15" font-size="10" fill="#059669" class="bold" text-anchor="middle">Biologi</text>
      
      <text x="326" y="15" font-size="11" fill="#64748B" text-anchor="end">3 Hari lagi</text>
      <text y="50" font-size="15" fill="#0F172A" class="bold">Resume Bab Metabolisme Enzim</text>
      <text y="68" font-size="11" fill="#64748B">Rangkuman 2 lembar siklus calvin &amp; krebs.</text>
    </g>
  </g>

  <!-- Bottom Navigation -->
  ${renderBottomNav('tasks')}
</svg>`

// ==========================================
// 3. KALENDER & JADWAL (CALENDARVIEW)
// ==========================================
const calendarSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Top Header -->
  <g transform="translate(16, 24)">
    <text y="0" font-size="18" fill="#0F172A" class="bold">Jadwal &amp; Kalender</text>
    <text y="18" font-size="11" fill="#64748B">Sinkronisasi jam sekolah dan sesi AI malam</text>

    <!-- Kelola Mapel Button -->
    <g transform="translate(254, -10)">
      <rect width="104" height="34" rx="17" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="52" y="21" font-size="11" fill="#0062FF" class="bold" text-anchor="middle">📖 Kelola Mapel</text>
    </g>
  </g>

  <!-- Day Selector Pills (Senin to Jumat) -->
  <g transform="translate(16, 76)">
    <!-- Senin Active -->
    <rect width="66" height="52" rx="20" fill="#0062FF"/>
    <text x="33" y="24" font-size="11" fill="#ffffff" class="bold" text-anchor="middle">Sen</text>
    <text x="33" y="40" font-size="13" fill="#ffffff" class="bold" text-anchor="middle">24</text>

    <!-- Selasa -->
    <g transform="translate(74, 0)">
      <rect width="66" height="52" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="33" y="24" font-size="11" fill="#64748B" class="medium" text-anchor="middle">Sel</text>
      <text x="33" y="40" font-size="13" fill="#0F172A" class="bold" text-anchor="middle">25</text>
    </g>

    <!-- Rabu -->
    <g transform="translate(148, 0)">
      <rect width="66" height="52" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="33" y="24" font-size="11" fill="#64748B" class="medium" text-anchor="middle">Rab</text>
      <text x="33" y="40" font-size="13" fill="#0F172A" class="bold" text-anchor="middle">26</text>
    </g>

    <!-- Kamis -->
    <g transform="translate(222, 0)">
      <rect width="66" height="52" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="33" y="24" font-size="11" fill="#64748B" class="medium" text-anchor="middle">Kam</text>
      <text x="33" y="40" font-size="13" fill="#0F172A" class="bold" text-anchor="middle">27</text>
    </g>

    <!-- Jumat -->
    <g transform="translate(296, 0)">
      <rect width="62" height="52" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="31" y="24" font-size="11" fill="#64748B" class="medium" text-anchor="middle">Jum</text>
      <text x="31" y="40" font-size="13" fill="#0F172A" class="bold" text-anchor="middle">28</text>
    </g>
  </g>

  <!-- Timeline Cards Header -->
  <g transform="translate(16, 146)">
    <text y="0" font-size="13" fill="#0F172A" class="bold">Agenda Hari Senin</text>
    <text x="358" y="0" font-size="11" fill="#64748B" text-anchor="end">4 Jadwal Terdaftar</text>
  </g>

  <!-- Schedule Slot 1 (Matematika) -->
  <g transform="translate(16, 160)">
    <rect width="358" height="96" rx="22" fill="#ffffff" filter="url(#softShadow)"/>
    <rect x="0" y="0" width="8" height="96" rx="4" fill="#2563EB"/>
    
    <g transform="translate(24, 18)">
      <text y="0" font-size="11" fill="#2563EB" class="bold">07:00 - 08:30 WIB · Jam Sekolah</text>
      <text y="24" font-size="15" fill="#0F172A" class="bold">Matematika Tingkat Lanjut</text>
      <text y="42" font-size="11" fill="#64748B">Ruang Kelas XI-Fase F · Pak Budi Hartono</text>
    </g>
  </g>

  <!-- Schedule Slot 2 (Kimia Praktikum) -->
  <g transform="translate(16, 268)">
    <rect width="358" height="96" rx="22" fill="#ffffff" filter="url(#softShadow)"/>
    <rect x="0" y="0" width="8" height="96" rx="4" fill="#0284C7"/>
    
    <g transform="translate(24, 18)">
      <text y="0" font-size="11" fill="#0284C7" class="bold">08:45 - 10:15 WIB · Jam Sekolah</text>
      <text y="24" font-size="15" fill="#0F172A" class="bold">Kimia Terapan</text>
      <text y="42" font-size="11" fill="#64748B">Lab Kimia Terpadu · Pak Agus Salim</text>
    </g>
  </g>

  <!-- Schedule Slot 3 (Fisika) -->
  <g transform="translate(16, 376)">
    <rect width="358" height="96" rx="22" fill="#ffffff" filter="url(#softShadow)"/>
    <rect x="0" y="0" width="8" height="96" rx="4" fill="#4F46E5"/>
    
    <g transform="translate(24, 18)">
      <text y="0" font-size="11" fill="#4F46E5" class="bold">10:30 - 12:00 WIB · Jam Sekolah</text>
      <text y="24" font-size="15" fill="#0F172A" class="bold">Fisika Mekanika</text>
      <text y="42" font-size="11" fill="#64748B">Ruang Teori XI-Fase F · Bu Retno</text>
    </g>
  </g>

  <!-- Schedule Slot 4: AI NIGHT STUDY SESSION -->
  <g transform="translate(16, 488)">
    <rect width="358" height="142" rx="24" fill="#0062FF" fill-opacity="0.06" stroke="#0062FF" stroke-dasharray="4 4" stroke-width="1.5"/>
    
    <g transform="translate(18, 16)">
      <rect width="138" height="22" rx="11" fill="#0062FF"/>
      <text x="69" y="15" font-size="10" fill="#ffffff" class="bold" text-anchor="middle">✨ Sesi Belajar Mandiri AI</text>

      <text y="50" font-size="15" fill="#0F172A" class="bold">19:30 - 20:15 WIB (45 Menit)</text>
      <text y="70" font-size="12" fill="#334155" class="medium">Fokus: Penyelesaian Laporan Praktikum Kimia</text>
      <text y="88" font-size="11" fill="#64748B">Dijadwalkan otomatis sebelum deadline besok malam.</text>

      <rect y="98" width="140" height="30" rx="15" fill="#0062FF"/>
      <text x="70" y="117" font-size="11" fill="#ffffff" class="bold" text-anchor="middle">⏱️ Pasang Alarm Sesi</text>
    </g>
  </g>

  <!-- Bottom Navigation -->
  ${renderBottomNav('calendar')}
</svg>`

// ==========================================
// 4. RENCANA AI (AIPLANVIEW)
// ==========================================
const aiPlanSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Top Header -->
  <g transform="translate(16, 24)">
    <circle cx="18" cy="18" r="18" fill="#0062FF"/>
    <text x="18" y="24" font-size="16" fill="#ffffff" text-anchor="middle">✨</text>
    
    <g transform="translate(46, 6)">
      <text y="0" font-size="18" fill="#0F172A" class="bold">Rencana Belajar AI</text>
      <text y="18" font-size="11" fill="#64748B">Smart Scheduler &amp; Workload Balancer</text>
    </g>
  </g>

  <!-- AI Readiness Banner -->
  <g transform="translate(16, 76)">
    <rect width="358" height="84" rx="22" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(16, 16)">
      <text y="0" font-size="13" fill="#0F172A" class="bold">Jadwal Belajar Adaptif Aktif</text>
      <text y="18" font-size="11" fill="#64748B">3 sesi fokus disiapkan untuk minggu ini berdasarkan bobot tenggat tugasmu.</text>
      
      <!-- Auto Reschedule Trigger -->
      <g transform="translate(240, 10)">
        <rect width="90" height="28" rx="14" fill="#0062FF" fill-opacity="0.1"/>
        <text x="45" y="18" font-size="10" fill="#0062FF" class="bold" text-anchor="middle">🔄 Auto-Heal</text>
      </g>
    </g>
  </g>

  <!-- Sesi 1: Malam Ini -->
  <g transform="translate(16, 174)">
    <rect width="358" height="196" rx="24" fill="#ffffff" filter="url(#cardShadow)"/>
    <rect x="0" y="0" width="358" height="6" rx="3" fill="#0062FF"/>

    <g transform="translate(16, 18)">
      <rect width="78" height="22" rx="11" fill="#FEF2F2"/>
      <text x="39" y="15" font-size="10" fill="#E11D48" class="bold" text-anchor="middle">Malam Ini</text>

      <rect x="84" width="108" height="22" rx="11" fill="#EFF6FF"/>
      <text x="138" y="15" font-size="10" fill="#0062FF" class="medium" text-anchor="middle">19:30 - 20:15 WIB</text>

      <text y="54" font-size="16" fill="#0F172A" class="bold">Praktikum Titrasi Asam Basa</text>
      <text y="74" font-size="12" fill="#64748B">Mata Pelajaran: Kimia · Target: Kurva Titrasi</text>

      <!-- AI Reason callout -->
      <g transform="translate(0, 86)">
        <rect width="326" height="42" rx="14" fill="#F8FAFC"/>
        <text x="12" y="18" font-size="11" fill="#0F172A" class="medium">Alasan Analitis AI:</text>
        <text x="12" y="32" font-size="10" fill="#64748B">Tenggat tersisa 24 jam dengan sisa estimasi 40 menit.</text>
      </g>

      <!-- Buttons -->
      <g transform="translate(0, 140)">
        <rect width="326" height="38" rx="19" fill="#0062FF"/>
        <text x="163" y="24" font-size="12" fill="#ffffff" class="bold" text-anchor="middle">Mulai Sesi Fokus (Pomodoro)</text>
      </g>
    </g>
  </g>

  <!-- Sesi 2: Besok -->
  <g transform="translate(16, 384)">
    <rect width="358" height="150" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(16, 18)">
      <rect width="94" height="22" rx="11" fill="#EFF6FF"/>
      <text x="47" y="15" font-size="10" fill="#0062FF" class="bold" text-anchor="middle">Besok Malam</text>

      <text y="50" font-size="15" fill="#0F172A" class="bold">Latihan 10 Soal Vektor Dimensi 3</text>
      <text y="68" font-size="11" fill="#64748B">Mata Pelajaran: Matematika · Durasi: 50 Menit</text>

      <g transform="translate(0, 80)">
        <rect width="326" height="32" rx="12" fill="#F8FAFC"/>
        <text x="12" y="20" font-size="10" fill="#64748B">Alasan: Mengantisipasi ujian mingguan materi vektor.</text>
      </g>
    </g>
  </g>

  <!-- Bottom Navigation -->
  ${renderBottomNav('ai-plan')}
</svg>`

// ==========================================
// 5. PROFIL SISWA (PROFILEVIEW)
// ==========================================
const profileSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Top Header -->
  <g transform="translate(16, 24)">
    <text y="0" font-size="18" fill="#0F172A" class="bold">Profil Siswa</text>
  </g>

  <!-- Profile Card -->
  <g transform="translate(16, 56)">
    <rect width="358" height="130" rx="26" fill="#ffffff" filter="url(#softShadow)"/>
    
    <g transform="translate(20, 20)">
      <!-- Avatar -->
      <circle cx="36" cy="36" r="34" fill="url(#avatarRing)"/>
      <circle cx="36" cy="36" r="30" fill="#0062FF"/>
      <text x="36" y="44" font-size="20" fill="#ffffff" text-anchor="middle" class="bold">NP</text>

      <g transform="translate(86, 14)">
        <text y="0" font-size="16" fill="#0F172A" class="bold">Naufal Pratama</text>
        <text y="18" font-size="11" fill="#64748B">SMA Kelas 11 - Fase F</text>
        <text y="34" font-size="11" fill="#0062FF" class="medium">SMAN 1 Teladan</text>
      </g>
    </g>
  </g>

  <!-- Bento Stats (3 Cards) -->
  <g transform="translate(16, 200)">
    <!-- 1. Streak -->
    <rect width="112" height="86" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="56" y="32" font-size="20" text-anchor="middle">🔥</text>
    <text x="56" y="54" font-size="16" fill="#0F172A" class="bold" text-anchor="middle">5 Hari</text>
    <text x="56" y="70" font-size="10" fill="#64748B" text-anchor="middle">Streak Belajar</text>

    <!-- 2. Jam Belajar -->
    <g transform="translate(122, 0)">
      <rect width="112" height="86" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="56" y="32" font-size="20" text-anchor="middle">⏱️</text>
      <text x="56" y="54" font-size="16" fill="#0F172A" class="bold" text-anchor="middle">14.5 Jam</text>
      <text x="56" y="70" font-size="10" fill="#64748B" text-anchor="middle">Total Waktu</text>
    </g>

    <!-- 3. Tugas Selesai -->
    <g transform="translate(244, 0)">
      <rect width="114" height="86" rx="20" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="57" y="32" font-size="20" text-anchor="middle">✅</text>
      <text x="57" y="54" font-size="16" fill="#0F172A" class="bold" text-anchor="middle">8 Tugas</text>
      <text x="57" y="70" font-size="10" fill="#64748B" text-anchor="middle">Tuntas Pekan Ini</text>
    </g>
  </g>

  <!-- Preferences & Settings Menu List -->
  <g transform="translate(16, 302)">
    <rect width="358" height="280" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    
    <g transform="translate(20, 20)">
      <!-- Item 1: Preferensi Jam Belajar -->
      <g>
        <circle cx="16" cy="16" r="16" fill="#EFF6FF"/>
        <text x="16" y="21" font-size="13" fill="#0062FF" text-anchor="middle">🌙</text>
        <text x="44" y="14" font-size="13" fill="#0F172A" class="semibold">Preferensi Jam Belajar Malam</text>
        <text x="44" y="28" font-size="10" fill="#64748B">19:00 - 21:30 WIB (45m/sesi)</text>
        <text x="300" y="20" font-size="14" fill="#94A3B8">→</text>
      </g>
      <line x1="0" y1="46" x2="318" y2="46" stroke="#F1F5F9"/>

      <!-- Item 2: Blokir Jam Kegiatan Rutin -->
      <g transform="translate(0, 60)">
        <circle cx="16" cy="16" r="16" fill="#FEF3C7"/>
        <text x="16" y="21" font-size="13" fill="#D97706" text-anchor="middle">🚫</text>
        <text x="44" y="14" font-size="13" fill="#0F172A" class="semibold">Blokir Waktu Rutinitas / Les</text>
        <text x="44" y="28" font-size="10" fill="#64748B">Hindari bentrok jadwal les offline</text>
        <text x="300" y="20" font-size="14" fill="#94A3B8">→</text>
      </g>
      <line x1="0" y1="106" x2="318" y2="106" stroke="#F1F5F9"/>

      <!-- Item 3: Kelola Notifikasi -->
      <g transform="translate(0, 120)">
        <circle cx="16" cy="16" r="16" fill="#F1F5F9"/>
        <text x="16" y="21" font-size="13" fill="#334155" text-anchor="middle">🔔</text>
        <text x="44" y="14" font-size="13" fill="#0F172A" class="semibold">Pengingat &amp; Notifikasi</text>
        <text x="44" y="28" font-size="10" fill="#64748B">Pengingat 15 menit sebelum sesi</text>
        <text x="300" y="20" font-size="14" fill="#94A3B8">→</text>
      </g>
      <line x1="0" y1="166" x2="318" y2="166" stroke="#F1F5F9"/>

      <!-- Item 4: Status Paket PRO -->
      <g transform="translate(0, 180)">
        <circle cx="16" cy="16" r="16" fill="#ECFDF5"/>
        <text x="16" y="21" font-size="13" fill="#059669" text-anchor="middle">💎</text>
        <text x="44" y="14" font-size="13" fill="#0F172A" class="semibold">Upgrade ke Stoodify Pro</text>
        <text x="44" y="28" font-size="10" fill="#059669">Fitur prediksi materi tak terbatas</text>
        <text x="300" y="20" font-size="14" fill="#94A3B8">→</text>
      </g>
    </g>
  </g>

  <!-- Bottom Navigation -->
  ${renderBottomNav('profile')}
</svg>`

// ==========================================
// 6. ONBOARDING & AUTH (AUTHVIEW)
// ==========================================
const authSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  <rect width="390" height="844" rx="36" fill="#EBF2FA"/>

  <!-- Center Mascot Hero -->
  <g transform="translate(195, 130)" text-anchor="middle">
    <!-- Playful Badge -->
    <rect x="-70" y="-36" width="140" height="26" rx="13" fill="#ffffff" filter="url(#softShadow)"/>
    <text y="-18" font-size="11" fill="#0B3CD5" class="bold">🤗 SMART LEARNING</text>

    <!-- Mascot Circle -->
    <circle cx="0" cy="50" r="48" fill="url(#avatarRing)"/>
    <circle cx="0" cy="50" r="44" fill="#0062FF"/>
    <text y="62" font-size="34" fill="#ffffff" class="bold">🎓</text>

    <!-- Floating Badges -->
    <g transform="translate(-76, 20)">
      <rect width="40" height="40" rx="14" fill="#F59E0B" filter="url(#softShadow)"/>
      <text x="20" y="27" font-size="18" fill="#ffffff">🏆</text>
    </g>

    <g transform="translate(42, 60)">
      <rect width="72" height="28" rx="14" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="36" y="18" font-size="10" fill="#0F172A" class="bold">📚 12 Sesi</text>
    </g>
  </g>

  <!-- Headings -->
  <g transform="translate(195, 290)" text-anchor="middle">
    <text y="0" font-size="24" fill="#0F172A" class="bold">Belajar Lebih Cerdas</text>
    <text y="30" font-size="24" fill="#0062FF" class="bold">Bersama Stoodify</text>
    <text y="64" font-size="13" fill="#64748B">Asisten AI yang menjadwalkan tugas,</text>
    <text y="84" font-size="13" fill="#64748B">tenggat praktikum, &amp; jam belajarmu.</text>
  </g>

  <!-- Habit Slider Box -->
  <g transform="translate(24, 430)">
    <rect width="342" height="136" rx="24" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(18, 16)">
      <text y="0" font-size="12" fill="#0F172A" class="bold">Target Waktu Belajar Mandiri Harian</text>
      <text y="18" font-size="10" fill="#64748B">Durasi sesi fokus yang direkomendasikan AI</text>

      <text y="58" font-size="28" fill="#0062FF" class="bold">45 <tspan font-size="14" fill="#64748B" class="regular">Menit / Malam</tspan></text>

      <!-- Slider Track -->
      <rect y="78" width="306" height="8" rx="4" fill="#E2E8F0"/>
      <rect y="78" width="180" height="8" rx="4" fill="#0062FF"/>
      <circle cx="180" cy="82" r="10" fill="#ffffff" stroke="#0062FF" stroke-width="3" filter="url(#softShadow)"/>
    </g>
  </g>

  <!-- Action CTA Buttons -->
  <g transform="translate(24, 600)">
    <rect width="342" height="52" rx="26" fill="#0062FF" filter="url(#cardShadow)"/>
    <text x="171" y="32" font-size="15" fill="#ffffff" class="bold" text-anchor="middle">Mulai Sekarang →</text>

    <!-- Login Link -->
    <g transform="translate(0, 68)">
      <rect width="342" height="52" rx="26" fill="#ffffff" filter="url(#softShadow)"/>
      <text x="171" y="32" font-size="14" fill="#0F172A" class="semibold" text-anchor="middle">Sudah Punya Akun? Masuk</text>
    </g>
  </g>
</svg>`

// ==========================================
// 7. MODAL TAMBAH TUGAS (ADDTASKMODAL)
// ==========================================
const modalSvg = `<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svgDefs}
  
  <!-- Dim Background -->
  <rect width="390" height="844" rx="36" fill="#0F172A" fill-opacity="0.55"/>

  <!-- Bottom Sheet / Modal Dialog -->
  <g transform="translate(16, 120)">
    <rect width="358" height="610" rx="30" fill="#ffffff" filter="url(#cardShadow)"/>

    <g transform="translate(20, 22)">
      <!-- Drag Handle -->
      <rect x="139" y="-6" width="40" height="4" rx="2" fill="#CBD5E1"/>

      <!-- Header -->
      <text y="24" font-size="18" fill="#0F172A" class="bold">Tambah Tugas Baru</text>
      <text y="42" font-size="11" fill="#64748B">AI akan otomatis menghitung skor prioritas pengerjaan</text>

      <circle cx="304" cy="22" r="14" fill="#F1F5F9"/>
      <text x="304" y="27" font-size="13" fill="#64748B" text-anchor="middle">✕</text>

      <line x1="0" y1="58" x2="318" y2="58" stroke="#F1F5F9"/>

      <!-- Field 1: Judul Tugas -->
      <g transform="translate(0, 72)">
        <text y="0" font-size="11" fill="#0F172A" class="semibold">Judul Tugas</text>
        <rect y="8" width="318" height="44" rx="22" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="16" y="35" font-size="12" fill="#0F172A">Laporan Praktikum Titrasi Asam</text>
      </g>

      <!-- Field 2: Mata Pelajaran -->
      <g transform="translate(0, 144)">
        <text y="0" font-size="11" fill="#0F172A" class="semibold">Mata Pelajaran</text>
        <rect y="8" width="318" height="44" rx="22" fill="#F8FAFC" stroke="#E2E8F0"/>
        <circle cx="24" cy="30" r="6" fill="#0284C7"/>
        <text x="38" y="35" font-size="12" fill="#0F172A">Kimia (Pak Agus Salim)</text>
        <text x="296" y="35" font-size="12" fill="#64748B">▼</text>
      </g>

      <!-- Field 3: Tenggat Waktu & Estimasi Durasi -->
      <g transform="translate(0, 216)">
        <g>
          <text y="0" font-size="11" fill="#0F172A" class="semibold">Tenggat Waktu</text>
          <rect y="8" width="152" height="44" rx="22" fill="#F8FAFC" stroke="#E2E8F0"/>
          <text x="14" y="35" font-size="11" fill="#0F172A">Besok, 23:59 WIB</text>
        </g>
        <g transform="translate(166, 0)">
          <text y="0" font-size="11" fill="#0F172A" class="semibold">Estimasi Jam</text>
          <rect y="8" width="152" height="44" rx="22" fill="#F8FAFC" stroke="#E2E8F0"/>
          <text x="14" y="35" font-size="11" fill="#0F172A">60 Menit</text>
        </g>
      </g>

      <!-- Field 4: Tingkat Kesulitan -->
      <g transform="translate(0, 288)">
        <text y="0" font-size="11" fill="#0F172A" class="semibold">Tingkat Kesulitan</text>
        <g transform="translate(0, 8)">
          <rect width="100" height="34" rx="17" fill="#F8FAFC" stroke="#E2E8F0"/>
          <text x="50" y="21" font-size="11" fill="#64748B" text-anchor="middle">Mudah</text>

          <rect x="108" width="100" height="34" rx="17" fill="#F8FAFC" stroke="#E2E8F0"/>
          <text x="158" y="21" font-size="11" fill="#64748B" text-anchor="middle">Sedang</text>

          <rect x="216" width="102" height="34" rx="17" fill="#0062FF"/>
          <text x="267" y="21" font-size="11" fill="#ffffff" class="bold" text-anchor="middle">Sulit 🔥</text>
        </g>
      </g>

      <!-- Field 5: AI Priority Calculation Live Preview -->
      <g transform="translate(0, 360)">
        <rect width="318" height="54" rx="18" fill="#FEF2F2" stroke="#FEE2E2"/>
        <text x="14" y="22" font-size="11" fill="#E11D48" class="bold">⚡ Prediksi Skor Prioritas AI: 92/100</text>
        <text x="14" y="38" font-size="10" fill="#E11D48">Kategori: Sangat Mendesak (Wajib dijadwalkan malam ini)</text>
      </g>

      <!-- Submit Button -->
      <g transform="translate(0, 440)">
        <rect width="318" height="48" rx="24" fill="#0062FF" filter="url(#cardShadow)"/>
        <text x="159" y="30" font-size="13" fill="#ffffff" class="bold" text-anchor="middle">Simpan &amp; Jadwalkan Sesi AI</text>
      </g>

      <!-- Cancel Button -->
      <g transform="translate(0, 500)">
        <text x="159" y="16" font-size="12" fill="#64748B" class="medium" text-anchor="middle">Batal</text>
      </g>
    </g>
  </g>
</svg>`

fs.writeFileSync(path.join(outputDir, '01-beranda-home.svg'), homeSvg)
fs.writeFileSync(path.join(outputDir, '02-daftar-tugas.svg'), tasksSvg)
fs.writeFileSync(path.join(outputDir, '03-kalender-jadwal.svg'), calendarSvg)
fs.writeFileSync(path.join(outputDir, '04-rencana-ai.svg'), aiPlanSvg)
fs.writeFileSync(path.join(outputDir, '05-profil-siswa.svg'), profileSvg)
fs.writeFileSync(path.join(outputDir, '06-onboarding-login.svg'), authSvg)
fs.writeFileSync(path.join(outputDir, '07-modal-tambah-tugas.svg'), modalSvg)

console.log('Successfully generated all Stoodify Mobile SVGs in: ' + outputDir)
