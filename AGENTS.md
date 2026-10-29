# AGENTS.md — Stoodify Mobile

Panduan untuk agen yang mengerjakan frontend Stoodify, aplikasi React untuk pengelolaan tugas dan materi belajar siswa SMA/SMK/sederajat. Ikuti instruksi tingkat direktori yang lebih spesifik jika ada.

## Bukti proyek dan batas asumsi

- Manifest saat ini memakai React 19, React DOM, TypeScript 6, Vite 8, Tailwind CSS 4 dengan plugin Vite, dan `lucide-react`. Periksa `package.json` dan konfigurasi sebelum mengandalkan versi atau menambah library.
- Source ada di `src/`: `components/{auth,layout,modals,views}`, `services/`, `data/`, `types.ts`, `App.tsx`, dan `index.css`. Ikuti pembagian yang ada; jangan membuat struktur baru tanpa kebutuhan konkret.
- `App.tsx` saat ini mengelola tab dan state lintas layar; request backend memakai `fetch` terpusat di `src/services/apiClient.ts`, dengan layanan per domain di `src/services/`. Tidak ditemukan router atau library state management khusus pada manifest/source yang diaudit.
- TypeScript app memakai `strict`. Styling menggunakan Tailwind v4 dan CSS global. Ikuti pola di file terkait.
- Script yang terbukti tersedia: `npm run dev`, `npm run build`, `npm run preview`. Saat audit ini tidak ditemukan script atau konfigurasi test/lint. Cek ulang manifest sebelum memberi instruksi command.
- `src/data/mockData.ts` menyediakan data contoh/fallback. Keberadaan service atau mock tidak membuktikan bahwa setiap alur berhasil di backend. Verifikasi kontrak API pada service dan bukti backend yang tersedia sebelum menyatakan perilaku.
- README menjelaskan integrasi sibling backend dan wrapper Android; perubahan di repo ini tetap dibatasi pada frontend kecuali task secara jelas mencakup repo lain.

## Cara mengambil keputusan

1. Sebelum mengubah kode, baca instruksi agent yang berlaku, `README.md`, `package.json`, konfigurasi terkait, dan file yang terlibat. Untuk desain, baca `docs/DESIGN.md` jika tersedia; bila tidak ada, cari panduan desain repo dan pertahankan bahasa visual yang sudah ada.
2. Bedakan fakta teramati, klaim dokumentasi, dan hipotesis. Jika keputusan bergantung pada hal yang belum terbukti, cari bukti di kode/konfigurasi/kontrak; catat ketidakpastian bila masih belum terjawab.
3. Jangan mengasumsikan navigasi, backend, state management, endpoint, fitur, atau library selain yang diverifikasi. Jangan menambah dependency atau mengganti arsitektur tanpa kebutuhan task dan manfaat yang jelas.
4. Gunakan skills yang tersedia hanya jika relevan dengan pekerjaan (mis. panduan frontend React/Vite atau QA). Gunakan MCP/tool hanya jika tersedia pada sesi dan benar-benar membantu task; Figma relevan untuk konteks desain yang dirujuk, bukan wajib untuk perubahan kode biasa. Jangan mengklaim penggunaan skill, MCP, atau validasi yang tidak dilakukan.

## Desain dan organisasi kode

- Jaga setiap file maksimal 300 baris. Toleransi hingga sekitar 400 baris hanya dengan alasan teknis yang kuat dan terdokumentasi. Jika file melewati batas, pecah berdasarkan tanggung jawab yang koheren; jangan memecah hanya demi angka atau melakukan refactor luas tanpa manfaat terukur.
- Komponen React fokus pada tanggung jawab UI yang jelas. Pisahkan logika/service atau komponen turunan saat itu meningkatkan keterbacaan, penggunaan ulang nyata, atau kemudahan pengujian. Hindari duplikasi dan abstraksi spekulatif.
- Ikuti pola React yang dipakai: function component, hooks hanya pada top-level komponen/custom hook, props bertipe, state lokal untuk kebutuhan lokal, serta `key` stabil untuk daftar. Hindari mutasi state dan efek samping saat render.
- Gunakan tipe domain dari `src/types.ts` atau tipe terdekat yang sudah ada. Hindari `any` baru; validasi dan persempit data eksternal sebelum menggunakannya.
- Gunakan service/API client yang ada untuk jaringan. Pertahankan alur loading, kosong, sukses, dan gagal yang sesuai konteks; jangan menyamarkan kegagalan server sebagai keberhasilan permanen atau mengubah data pengguna diam-diam.
- Gunakan Tailwind/CSS sesuai pola file yang disentuh dan ikon dari `lucide-react` bila sesuai. Pertahankan desain Stoodify yang ada dan perilaku mobile/responsif; jangan menyalin gaya dari proyek lain.
- Perubahan UI harus menjaga semantik HTML, label input, fokus keyboard, kontras, dan target sentuh yang wajar. Jangan mengorbankan aksesibilitas demi kemiripan visual.

## Alur kerja

1. **Audit:** periksa status Git, instruksi, struktur, skrip aktual, dan kode/kontrak yang akan disentuh. Jangan membaca atau mencetak rahasia dari `.env`; gunakan `.env.example` untuk nama variabel.
2. **Rencana:** tulis langkah kecil, dependensi, kriteria penerimaan, risiko, dan cara validasi sebelum pekerjaan lintas file atau perubahan kompleks. Untuk pekerjaan panjang, simpan checkpoint yang bisa dilanjutkan (tujuan, keputusan/bukti, file berubah, yang selesai, yang tersisa, hasil validasi, langkah berikutnya) di task plan yang sesuai atau tracker yang sudah dipakai. Perbarui checkpoint setelah tahap penting agar eksekusi dapat dilanjutkan setelah interupsi.
3. **Implementasi:** lakukan perubahan terkecil yang memenuhi kebutuhan. Jangan menimpa perubahan lokal pengguna; cek `git diff` sebelum dan sesudah, dan jaga perubahan tetap pada ruang lingkup task.
4. **Validasi:** pilih pemeriksaan berdasarkan dampak. Jalankan hanya command yang tersedia dan relevan: build saat perubahan memengaruhi source/config/build; test hanya jika suite tersedia atau diminta, dan lint hanya jika script/tool terpasang. Untuk UI, lakukan pemeriksaan manual pada ukuran layar relevan jika lingkungan tersedia. Jangan memasang dependency semata-mata untuk membuat pemeriksaan ada.
5. **Pelaporan:** ringkas perubahan, alasan, file terdampak, pemeriksaan yang benar-benar dijalankan beserta hasil, dan batasan/fakta yang belum dapat dipastikan. Jangan menyebut validasi yang tidak dilakukan.

## Keamanan dan perlindungan data

- Jangan membuka, menyalin, mencatat, atau mengirim nilai secret/token dari `.env`, storage browser, log, atau output command. Jangan commit `.env`; variabel frontend Vite harus dianggap dapat dibaca klien dan tidak boleh berisi secret server.
- Perlakukan data siswa (identitas, sekolah, tugas, jadwal, materi) sebagai data pribadi: minta dan tampilkan hanya yang diperlukan, jangan memasukkannya ke log/telemetri tanpa kebutuhan dan persetujuan yang sesuai.
- Jangan melemahkan autentikasi, otorisasi server, validasi input, atau penanganan error untuk mempermudah UI. Validasi frontend membantu pengalaman pengguna tetapi tidak menggantikan validasi backend.
- Biarkan React melakukan escaping teks. Jangan menambahkan `dangerouslySetInnerHTML` atau merender konten eksternal sebagai HTML tanpa sanitasi yang teruji dan kebutuhan yang jelas.
- Lindungi perubahan pengguna: jangan menghapus/mengganti data atau konfigurasi di luar permintaan; jangan melakukan operasi destruktif, reset, atau migrasi terhadap layanan/data nyata.

## Definition of done

- Kebutuhan dan kriteria penerimaan task terpenuhi; perubahan tetap fokus dan tidak menghapus perubahan pengguna.
- Tipe, pola komponen, kontrak service, keamanan data siswa, dan perilaku responsif tetap konsisten dengan bukti proyek.
- Pemeriksaan relevan yang tersedia sudah dijalankan, atau alasan dan validasi pengganti dicatat. Tidak ada klaim bahwa fitur/test/backend terverifikasi tanpa bukti.
- Checkpoint task kompleks diperbarui atau ditutup; laporan akhir menyebut hasil, file utama, validasi, dan ketidakpastian yang masih berdampak.
