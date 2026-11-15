# ServiceTrack - Sistem Pencatatan Servis

Aplikasi manajemen penerimaan barang dan pelacakan status servis elektronik berbasis web yang modern, aman, dan responsif. Dibangun berdasarkan dokumen Spesifikasi Kebutuhan Perangkat Lunak (**SKPL_07**).

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) + [React 18](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Deployment:** [Vercel](https://vercel.com/)

---

## ✨ Fitur Utama

1. **Siklus CRUD Lengkap:**
   - **Create:** Form pendaftaran unit servis baru dengan auto-generate `no_servis`.
   - **Read:** Tabel transaksi servis interaktif dengan pencarian *real-time* dan filter status.
   - **Update:** Edit data transaksi dan pembaruan tahapan pengerjaan bertahap (`Diterima` $\rightarrow$ `Diperiksa` $\rightarrow$ `Diproses` $\rightarrow$ `Selesai` $\rightarrow$ `Diambil`).
   - **Delete:** Hapus data transaksi dengan dialog konfirmasi aman.
2. **Kalkulasi & KPI Dinamis:**
   - Total Unit Servis Terdaftar.
   - Total Unit Servis Aktif (dalam proses perbaikan).
   - Total Pendapatan Biaya Servis Selesai dalam format Rupiah (`id-ID`).
3. **Kepatuhan Pengujian Black Box & Keamanan:**
   - **`TC-01` & `TC-02`:** Validasi logika form menolak nominal $\le 0$ atau negatif (menampilkan pesan *"Nominal harus lebih dari 0"*).
   - **`SEC-01` (Anti-XSS):** Data input pengguna dirender aman melalui textContent di React JSX tanpa risiko eksekusi payload script.
   - **`SEC-02` (Keamanan Kredensial):** Hanya Public Anon Key yang digunakan di sisi frontend; database dilindungi Row Level Security (RLS).
4. **Dual-Mode (Zero-Config Demo):**
   - Berjalan otomatis di mode **Local Demo Mode** (menggunakan `localStorage` dengan data awal dummy) jika environment Supabase belum diisi.
   - Beralih ke **Cloud Supabase** begitu variabel environment dikonfigurasikan.

---

## 🛠️ Menjalankan di Lokal (Development)

1. Clone repositori:
   ```bash
   git clone https://github.com/Annaa-fa/pencatatan-servis.git
   cd pencatatan-servis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Opsional) Konfigurasi Supabase:
   Salin `.env.local.example` menjadi `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Isi dengan kredensial dari project Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Jika dibiarkan kosong, aplikasi tetap berjalan dalam Local Demo Mode).*

4. Jalankan development server:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Deploy ke Vercel

Proyek ini telah dikonfigurasi penuh untuk di-deploy secara otomatis di Vercel:

1. Masuk ke [Vercel Dashboard](https://vercel.com/).
2. Klik **Add New...** &rarr; **Project**.
3. Import repositori GitHub `Annaa-fa/pencatatan-servis`.
4. Pada bagian **Environment Variables**, tambahkan jika menggunakan Cloud Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**.
