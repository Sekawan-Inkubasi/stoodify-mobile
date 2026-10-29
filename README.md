# Stoodify Mobile Frontend 🚀

Source code antarmuka utama (Frontend UI & Business Logic) aplikasi **Stoodify** — Asisten belajar berbasis AI untuk siswa SMA/SMK di Indonesia. Dibangun menggunakan **React 19**, **Tailwind CSS v4**, **TypeScript**, dan **Vite** dengan tata letak ramah genggaman satu tangan (*Thumb-Friendly Mobile Layout*).

---

## 🏗️ Hubungan dengan Repositori `stoodify-apk`

Folder **`stoodify-mobile`** merupakan tempat utama untuk seluruh pengembangan tampilan visual dan pemanggilan REST API. Folder ini harus diletakkan **berdampingan (sibling)** dengan folder **`stoodify-apk`**:

```text
my-projects/
├── stoodify-mobile/   <-- [KODING DI SINI] Edit UI, Desain, Komponen, & Integrasi API
├── stoodify-apk/      <-- [BUILD APK] Shell Native Android yang Membungkus Web Ini
└── stoodify-backend/  <-- Backend REST API (Golang / Gin)
```

> [!TIP]
> - Setiap kali Anda selesai mengedit frontend dan ingin membuat file APK Android release, cukup pindah ke folder `stoodify-apk` dan jalankan `npm run build:apk`.
> - Skrip tersebut akan otomatis mengompilasi kode dari folder ini (`npm run build`) dan menanamkannya ke dalam APK Android agar bisa dibuka **100% offline tanpa internet**.

---

## 🔌 Integrasi REST API Backend

Aplikasi ini telah terintegrasi langsung dengan backend API Stoodify ([`stoodify-backend`](file:///home/naufal/Documents/my-projects/inkubasi-journey/main-arch/stoodify-backend/)). Seluruh layer pemanggilan API modular berada di direktori **[`src/services/`](file:///home/naufal/Documents/my-projects/inkubasi-journey/main-arch/stoodify-mobile/src/services/)**:

- **`apiClient.ts`**: Client HTTP terpusat dengan injeksi Bearer Token, base URL dinamis (`VITE_API_BASE_URL` atau default `http://localhost:8080/api`), dan penanganan auto-refresh token (401 handler).
- **`authService.ts`**: Autentikasi siswa (Login, Registrasi akun, Mode Demo instan, dan pengambilan data profil).
- **`taskService.ts`**: Pengambilan tugas dari database, pembuatan tugas baru dengan perhitungan skor prioritas AI, update progress belajar, dan penghapusan tugas.
- **`scheduleService.ts`**: Sinkronisasi jadwal pelajaran sekolah mingguan dengan deteksi konflik jam belajar (409 Conflict).
- **`subjectService.ts`**: Manajemen mata pelajaran sekolah (CRUD).
- **`studySessionService.ts`**: Rekomendasi sesi belajar mandiri oleh AI dan fitur *Adaptive Rescheduling*.
- **`statisticsService.ts`**: Ringkasan data belajar (streak harian, total jam belajar, tugas terselesaikan).

---

## 💻 Panduan Menjalankan & Perintah

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Local Dev)
```bash
npm run dev
```
Akses di browser laptop Anda melalui `http://localhost:5173`.

### 3. Menjalankan untuk Pengujian di Smartphone (LAN Wi-Fi)
```bash
npm run dev -- --host
```
Gunakan opsi `--host` agar server dapat diakses oleh perangkat lain (smartphone/tablet) yang berada dalam satu jaringan Wi-Fi yang sama (misal `http://192.168.1.x:5173`).

### 4. Kompilasi Web (Build)
```bash
npm run build
```
Perintah ini akan menjalankan pemeriksaan tipe TypeScript (`tsc -b`) dan kompilasi bundel Vite ke dalam folder `dist/`.

### 5. Mem-build APK Android
Untuk membuat file installer APK Android dari hasil perubahan kode di folder ini:
```bash
cd ../stoodify-apk
npm run build:apk
```

---

## 🎨 Karakteristik Desain & Tata Letak

1. **Clean White & Blue Accent Theme:**
   - Background utama bersih putih (`bg-white` & `bg-slate-50`).
   - Warna aksen cerdas biru (`#2563EB` & `#0284C7`) untuk indikator aksi, navigasi aktif, dan status AI.
   - Aksen semantik pendukung: Coral/Oranye untuk deadline urgen, Emerald untuk tugas selesai, Amber untuk api streak.
2. **Auto Layout Responsif:**
   - Tampilan native 100% di layar ponsel/smartphone.
   - Pada desktop/tablet, otomatis terpusat di dalam mobile bezel mockup dengan rasio smartphone modern yang rapi.
3. **Kartu Status Belajar & Quick Action Grid:**
   - Menampilkan hari aktif (*🔥 5 Hari Streak*), alokasi sesi malam (*⏱️ 45 Menit*), jumlah tugas mendesak, dan status beban belajar.
   - Grid 4 aksi cepat: Tambah Tugas, Mode Fokus (Pomodoro), Prediksi Materi, dan Jadwal Sekolah.
4. **Navigasi Bawah (Bottom Navigation - 5 Tab):**
   - 🏠 **Beranda:** Ringkasan belajar harian, kartu sesi AI malam, feed tugas mendesak, dan prediksi materi.
   - 📋 **Tugas:** Manajemen tugas lengkap, filter status, filter mata pelajaran, dan checklist subtugas.
   - 📅 **Kalender:** Sinkronisasi jadwal pelajaran sekolah (Senin–Jumat) dan agenda belajar malam AI terpadu.
   - 🤖 **Rencana AI:** Blueprint jadwal belajar mingguan, alasan analitis AI, dan pemicu *Adaptive Rescheduling*.
   - 👤 **Profil:** Statistik kepatuhan, preferensi jam belajar malam, blokir jam rutin/les, dan status paket.
5. **Modal & Floating AI Chatbot:**
   - **Persistent Side Slide Chatbot:** Tab peluncur di tepi kanan layar yang dapat dibuka kapan saja tanpa berpindah halaman.
   - **8 Modal Interaktif:** Tambah Tugas, Detail Tugas, Focus Timer, Prediksi Materi, Pusat Notifikasi, Paywall Pro, Kelola Mapel, dan Tambah Jadwal.
