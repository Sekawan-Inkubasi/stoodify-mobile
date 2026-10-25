# Stoodify Mobile Frontend 🚀

Aplikasi asisten belajar berbasis AI khusus untuk siswa SMA/SMK di Indonesia. Dirancang dengan **gaya mobile layout APK Gojek** (Thumb-Friendly, Bento Card, Status Bar Belajar, Quick Action Grid, dan Bottom Navigation) dengan palet warna utama **Clean White** dan aksen **Blue**.

---

## 🎨 Karakteristik Desain & Tata Letak (Gojek Style)
1. **Clean White & Blue Accent Theme:**
   - Background utama bersih putih (`bg-white` & `bg-slate-50`).
   - Warna aksen cerdas biru (`#2563EB` & `#0284C7`) untuk indikator aksi, navigasi aktif, dan status AI.
   - Aksen semantik pendukung: Coral/Oranye untuk deadline urgen, Emerald untuk tugas selesai, Amber untuk api streak.
2. **Auto Layout Responsif:**
   - Tampilan native 100% di layar ponsel/smartphone.
   - Pada desktop/tablet, otomatis terpusat di dalam mobile bezel mockup dengan rasio smartphone modern yang rapi.
3. **Kartu Status Belajar (Ala Kartu Saldo GoPay):**
   - Menampilkan hari aktif (*🔥 5 Hari Streak*), alokasi sesi malam (*⏱️ 45 Menit*), jumlah tugas mendesak, dan status beban belajar (*Aman & Terkendali*).
   - Dilengkapi tombol aksi cepat di dalam kartu (*Mulai Fokus*, *Riwayat Jam*, *Reschedule Otomatis*).
4. **Grid 4 Ikon Aksi Cepat:**
   - `➕ Tambah Tugas` &bull; `⏱️ Mode Fokus (Timer)` &bull; `🤖 Prediksi Materi` &bull; `📅 Jadwal Sekolah`.
5. **Navigasi Bawah (Bottom Navigation - 5 Tab):**
   - 🏠 **Beranda:** Ringkasan belajar harian, kartu sesi AI malam, feed tugas mendesak, dan prediksi materi.
   - 📋 **Tugas:** Manajemen tugas lengkap, filter status, filter mata pelajaran, dan checklist subtugas.
   - 📅 **Kalender:** Sinkronisasi jadwal pelajaran sekolah (Senin–Jumat) dan agenda belajar malam AI terpadu.
   - 🤖 **Rencana AI:** Blueprint jadwal belajar mingguan, alasan analitis AI, dan pemicu *Adaptive Rescheduling*.
   - 👤 **Profil:** Statistik kepatuhan, preferensi jam belajar malam, blokir jam rutin/les, dan status paket.

---

## 📱 Sub-Layar & Modal Interaktif
* **Persistent Side Slide Chatbot (SKOMDA AI Assistant):** Tab peluncur vertikal di tepi kanan layar (mengadopsi konsep slide edge sesuai referensi tim) yang selalu aktif dan dapat diakses dari halaman manapun tanpa meninggalkan konteks layar yang sedang dibuka. Dilengkapi drawer slide-over interaktif, respon cerdas berbasis data tugas, voice assistant aura wave, dan shortcut aksi langsung (adaptive rescheduling & focus timer).
* **Modal Tambah Tugas:** Form cepat dengan pemilihan mapel, kalkulasi skor prioritas AI, preset deadline, dan subtugas bertahap.
* **Modal Detail Tugas:** Slider progres interaktif (0-100%), checklist subtugas, dan rincian skor urgensi AI.
* **Zen Focus Mode (Pomodoro Timer):** Countdown visual melingkar, tombol Play/Pause/Reset, dan mode bebas distraksi.
* **Prediksi Materi Selanjutnya:** Perkiraan topik pembelajaran berikutnya per mapel, probabilitas keyakinan (%), materi prasyarat, dan tombol feedback siswa.
* **Pusat Notifikasi:** Log pengingat tugas dan rekomendasi jadwal baru.
* **Pengaturan Preferensi AI:** Atur jam belajar malam (misal 19:00 - 21:30), durasi per sesi, jeda istirahat, dan jam blokir kegiatan rutin (les offline/ekskul).
* **Alur Pre-Auth:** Onboarding Carousel 3 slide, Layar Login, Layar Registrasi Siswa, dan Pemulihan Kata Sandi.

---

## 💻 Cara Menjalankan Proyek

```bash
# 1. Masuk ke direktori
cd stoodify-mobile

# 2. Jalankan server pengembangan lokal (Vite)
npm run dev

# 3. Akses di browser pada http://localhost:5173
```
