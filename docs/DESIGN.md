# Stoodify — Design System

Dokumen ini merekam bahasa visual yang teramati pada implementasi frontend saat audit. Nilai dan pola di bawah berasal dari source; bagian “Panduan penerapan” menjadi aturan konsistensi untuk perubahan berikutnya, bukan klaim bahwa setiap layar telah sepenuhnya seragam.

## Arah visual

Stoodify memakai antarmuka mobile-first yang ringan dan akrab untuk aktivitas belajar harian. Latar biru pucat, permukaan putih, aksen biru kuat, kartu membulat, label ringkas, dan ikon sederhana membentuk kesan tenang serta mudah dipindai. Informasi tugas dan jadwal disusun dalam kartu vertikal dengan aksi utama yang jelas.

## Warna

| Peran | Nilai teramati | Pemakaian |
| --- | --- | --- |
| Primary | `#0062FF` | Aksi utama, tab terpilih, tautan, ikon dan indikator fokus |
| Primary dark | `#0055E6`, `#1746E0` | Variasi gradien dan interaksi |
| Indigo | `#4F46E5`, `#7C3AED` | Aksen sekunder, beberapa subjek/ikon |
| App canvas | `#EBF2FA`, `#EAF1FC` | Latar luar dan area aplikasi |
| Surface | `#FFFFFF` | Kartu, dialog, bar navigasi |
| Text primary | Tailwind `slate-900` | Judul dan informasi penting |
| Text secondary | Tailwind `slate-500` / `slate-600` | Deskripsi, metadata, label |
| Success | Tailwind emerald; contoh `#059669` | Selesai, progres positif |
| Warning | Tailwind amber; contoh `#D97706` | Tenggat dekat, streak, perhatian |
| Danger | Tailwind rose; contoh `#E11D48` | Deadline/aksi berisiko atau status mendesak |

Latar layar beranda menggabungkan gradien biru tua ke biru/indigo pada kartu ringkasan. Gunakan gradien sebagai aksen area penting, bukan untuk semua permukaan. Status harus tetap punya label/ikon; jangan menyampaikan makna hanya dengan warna.

## Tipografi

- Keluarga utama: **Poppins**, didefinisikan di `src/index.css` dan dimuat melalui Google Fonts di `index.html`, dengan fallback system sans-serif.
- Hierarki yang tampak: judul layar sekitar 16 px tebal; judul kartu 12–14 px semibold/bold; isi dan kontrol umumnya 11–12 px; metadata 9–10 px.
- Banyak label kecil mengikuti ruang layar ponsel. Jangan mengecilkan teks penting di bawah pola yang sudah ada; utamakan keterbacaan, terutama untuk tenggat, nama tugas, dan kontrol.
- Gunakan bobot 400 untuk deskripsi, 500–600 untuk label/aksi sekunder, dan 700 ke atas untuk judul serta angka penting. Ikuti komponen sekitar daripada menambahkan skala baru.

## Tata letak dan bentuk

- `MobileContainer` membatasi lebar konten hingga 448 px, memakai tinggi viewport dinamis (`dvh`), area konten yang dapat digulir, dan ruang untuk navigasi bawah. Pada layar lebar, aplikasi tetap terpusat dalam bentuk satu kolom.
- Konten menggunakan susunan vertikal dengan jarak rapat dan kartu sebagai unit informasi. Grid digunakan untuk quick actions dan statistik; bar filter dapat digulir horizontal.
- Permukaan utama putih, biasanya dengan border putih/abu tipis dan bayangan lembut. Radius yang dominan berupa `rounded-2xl`/`rounded-3xl` pada kartu dan `rounded-full` pada tombol, chip, serta navigasi.
- Tombol aksi utama biasanya biru dengan teks putih dan bentuk pil; aksi sekunder memakai permukaan putih atau abu pucat. Pertahankan perbedaan visual antara pilihan aktif dan tidak aktif.
- Navigasi bawah berupa kapsul putih semi-transparan dengan ikon, tab aktif biru, dan badge status bila diperlukan.

## Komponen dan pola

- **Header layar:** judul ringkas, keterangan sekunder, dan aksi kontekstual di sisi kanan bila ada.
- **Kartu:** gunakan permukaan putih, padding sedang, radius besar, pemisah tipis bila ada beberapa kelompok informasi, dan bayangan halus.
- **Filter/chip:** pilihan aktif memakai latar primary dan teks putih; nonaktif memakai putih/abu dengan teks slate. Pertahankan ukuran konten yang ringkas dan scroll horizontal di ruang sempit.
- **Status tugas:** bedakan selesai (emerald), segera/mendesak (amber/rose sesuai urgensi), dan status biasa (slate/blue). Gunakan istilah status konsisten dengan domain.
- **Modal dan drawer:** sumber menggunakan overlay gelap dan animasi masuk/keluar. Jaga fokus pada tugas utama modal, sediakan cara keluar yang jelas, dan hindari menumpuk banyak aksen dekoratif.
- **Ikon:** gunakan `lucide-react`, umumnya ukuran 14–20 px pada kontrol/kartu. Ikon dekoratif tidak menggantikan label aksi.

## Gerak dan interaksi

CSS global menyediakan transisi tab/drawer, animasi masuk modal, dan animasi kecil untuk waveform/pesan. Timing khusus yang teramati berada sekitar 280–420 ms dengan easing lembut. Gunakan gerak untuk menegaskan perubahan state, bukan sebagai dekorasi terus-menerus. Pastikan state hover juga memiliki padanan aktif/fokus yang terlihat pada perangkat sentuh dan keyboard; hormati `prefers-reduced-motion` saat menambah animasi baru.

## Aksesibilitas dan konten

- Pertahankan elemen semantik, label input yang terhubung, nama aksesibel untuk tombol ikon, urutan fokus logis, dan indikator fokus yang jelas.
- Jaga kontras teks dan kontrol; jangan mengandalkan warna saja untuk prioritas/status. Sasaran ukuran sentuh minimal sekitar 44 × 44 px untuk aksi utama.
- Gunakan bahasa Indonesia yang lugas dan konsisten. Teks kontrol menjelaskan hasil aksi; pesan kosong/error menyebut keadaan dan langkah yang dapat dilakukan.
- Pastikan teks tugas panjang dapat dibaca tanpa memotong informasi penting; gunakan pemotongan hanya untuk ringkasan dengan akses ke detail.

## Panduan penerapan

1. Periksa pola layar dan komponen yang berdekatan sebelum mengubah visual; pertahankan konsistensi tanpa memaksakan redesign.
2. Gunakan token/pola di dokumen ini sebagai dasar. Jika source menampilkan variasi yang bermakna, dokumentasikan alasan atau koreksi dokumen setelah perubahan disetujui.
3. Uji layout pada lebar ponsel sekitar 360–430 px dan viewport lebih lebar bila lingkungan tersedia. Periksa scroll, navigasi bawah, modal, dan keyboard/fokus.
4. Jangan menambah font, warna, animasi, atau library UI baru tanpa alasan kebutuhan yang jelas.

## Batas bukti

- Nilai warna, tipografi, radius, lebar container, dan animasi di atas ditemukan di `src/index.css`, `index.html`, `src/components/layout/`, dan layar-layar `src/components/views/` saat ekstraksi.
- Belum ada token terpusat selain font di `@theme`; warna dan ukuran banyak ditulis langsung sebagai Tailwind utility. Tabel ini merangkum pola yang dominan, bukan token runtime formal.
- Tidak ada file Figma/design brief yang dirujuk selama ekstraksi ini. Perilaku visual tertentu perlu ditinjau pada browser untuk memastikan hasil render, khususnya breakpoint dan variasi perangkat.
- Animasi CSS saat ini belum terlihat menerapkan `prefers-reduced-motion`; dukungan tersebut dicantumkan sebagai panduan untuk perubahan baru, bukan klaim implementasi yang sudah ada.
