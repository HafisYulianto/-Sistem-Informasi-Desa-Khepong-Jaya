# Sistem Informasi Desa Khepong Jaya (100% Dinamis)

Portal web desa modern berkinerja tinggi yang dibangun dengan **Next.js (App Router)** dan **Supabase (PostgreSQL, Auth, Storage, RLS)**, dirancang agar **100% dinamis (Zero Hardcode)** dengan fitur Page Builder dan On-Demand Cache Revalidation.

---

## 🚀 Fitur Unggulan Sesuai PRD

1. **Zero Hardcoded Architecture**:
   - Seluruh teks, warna tema CSS (`--primary`, `--accent`), font, logo, menu navigasi, dan footer tersimpan di tabel `site_settings` Supabase berbasis JSONB.
2. **Dynamic Catch-All Page Builder (`/[slug]`)**:
   - Admin bebas membuat halaman tak terbatas (misal `/visi-misi`, `/sejarah`, `/karang-taruna`, `/bumdes`) dengan modular blocks (*Rich Text, Split Content, Image Banner, Download Dokumen PDF, Embed Maps/YouTube*).
3. **On-Demand Cache Revalidation**:
   - Setiap operasi CRUD di Admin Panel langsung memicu `revalidatePath` pada rute terkait sehingga pembaruan bersifat instan bagi pengunjung tanpa mengorbankan performa SSR/SSG.
4. **Client-Side WebP Image Compression**:
   - Setiap gambar yang diunggah dikompresi otomatis di sisi browser menjadi format WebP berukuran ringkas (<800 KB) sebelum masuk ke Supabase Storage `desa-media`.
5. **Keamanan Berlapis (Next.js Middleware + Supabase RLS)**:
   - Akses `/admin/*` diproteksi verifikasi sesi Supabase Auth.
   - Row Level Security (RLS) di PostgreSQL membatasi pengunjung umum hanya bisa membaca konten `published`, sedangkan operasi INSERT/UPDATE/DELETE memerlukan otentikasi role `super_admin` atau `editor`.
6. **Modul Publik Terstruktur Lengkap**:
   - **Berita & Pengumuman**: Kategorisasi, thumbnail, galeri foto, penghitung views.
   - **Transparansi APBDes**: Kalkulasi persentase realisasi anggaran otomatis, grafik progress, dan tabel pos Pendapatan, Belanja, dan Pembiayaan.
   - **Potensi & UMKM**: Katalog produk desa lengkap dengan tombol pesan langsung via WhatsApp.
   - **Struktur Organisasi**: Profil aparatur dan perangkat desa.
   - **Galeri Foto & Video**: Dokumentasi kegiatan gotong royong dan pembangunan.
   - **Aspirasi & Pengaduan Warga**: Form publik dengan unggah foto bukti dan pelacakan status tindak lanjut (*Menunggu*, *Diproses*, *Selesai*).

---

## 🛠️ Langkah Menjalankan Proyek

### 1. Konfigurasi Database Supabase
1. Buka dashboard proyek Supabase Anda di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase/schema.sql`](file:///d:/HAFIS%20(SELURUH%20PERKULIAHAN)/PENGHIJAUAN%20GITHUB/AKSARA/supabase/schema.sql) di repositori ini, salin seluruh kodenya, lalu tempel dan klik **Run**.
4. Skema SQL tersebut akan otomatis:
   - Membuat seluruh tabel, trigger user profile, dan RLS policies.
   - Menginisialisasi storage bucket `desa-media` dan perizinannya.
   - Mengisi data awal (*seed data*) Desa Khepong Jaya lengkap.

### 2. Atur Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat portal publik, dan [http://localhost:3000/admin](http://localhost:3000/admin) untuk masuk ke panel pengelola.
