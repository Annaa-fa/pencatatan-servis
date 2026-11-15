# DESIGN SYSTEM & UI GUIDELINES
## APLIKASI SERVICETRACK (SISTEM PENCATATAN SERVIS)

Dokumen ini merupakan panduan visual dan implementasi antarmuka yang wajib dipatuhi oleh asisten AI dan pengembang dalam mengimplementasikan kode frontend di IDE.

---

### 1. PALET WARNA TAILWIND CSS

Aplikasi menggunakan skema warna modern, profesional, dan bersih berbasis Tailwind CSS v3:

* **Background Utama Halaman:** `bg-slate-50`
* **Card Container:** `bg-white border border-slate-200 shadow-sm rounded-xl`
* **Warna Teks Utama:** `text-slate-900` (Heading & Angka Kunci), `text-slate-600` (Label & Body), `text-slate-400` (Placeholder & Helper)
* **Warna Primer (Branding & Aksi Utama):**
  * Normal: `bg-indigo-600`, `text-white`, `border-transparent`
  * Hover: `hover:bg-indigo-700`
  * Focus Ring: `focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`
* **Warna Sukses (Status 'Selesai' & Indikator Koneksi):**
  * Badge/Card: `bg-emerald-50 text-emerald-700 border-emerald-200`
  * Icon / Text Aksen: `text-emerald-600`
* **Warna Bahaya / Error / Hapus (`rose-600`):**
  * Tombol Hapus: `text-rose-600 hover:text-rose-800 hover:bg-rose-50`
  * Alert Box Validasi: `bg-rose-50 text-rose-800 border-rose-200`
* **Palet Status Bertahap Servis (Status Badges):**
  * `Diterima`: `bg-slate-100 text-slate-700 border-slate-200`
  * `Diperiksa`: `bg-amber-50 text-amber-700 border-amber-200`
  * `Diproses`: `bg-sky-50 text-sky-700 border-sky-200`
  * `Selesai`: `bg-emerald-50 text-emerald-700 border-emerald-200`
  * `Diambil`: `bg-purple-50 text-purple-700 border-purple-200`

---

### 2. TIPOGRAFI & LOKALISASI FORMAT

* **Font Family:** `font-sans` menggunakan font sans-serif modern seperti **Plus Jakarta Sans** atau **Inter** melalui Google Fonts:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```
* **Format Mata Uang (Rupiah Indonesia - `id-ID`):**
  Semua representasi nominal biaya perbaikan (`biaya_akhir` dan KPI Total Pendapatan) wajib diformat menggunakan standar `Intl.NumberFormat` bahasa Indonesia tanpa angka desimal nol dibelakang koma:
  ```javascript
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number || 0);
  };
  ```
* **Format Penulisan Kode No Servis:**
  Menggunakan `font-mono tracking-wider font-semibold text-slate-800` untuk mempermudah identifikasi kode seperti `SRV-2026-001`.

---

### 3. ATURAN KOMPONEN INTERAKTIF

#### A. Tombol & Loading State
* Saat melakukan *fetching*, *saving*, atau *deleting* ke Supabase:
  * Tombol dinonaktifkan (`disabled = true`) dan ditambahkan class opacity `opacity-75 cursor-not-allowed`.
  * Teks tombol digantikan dengan ikon *spinner SVG* berputar (`animate-spin`) dan keterangan teks aksi, contoh: *"Menyimpan data..."*.

#### B. Alert Banner Box (Uji `TC-01` & `TC-02`)
* Komponen penampung error validasi berada tepat di atas form input.
* Struktur HTML:
  ```html
  <div id="errorAlert" class="hidden flex items-start gap-3 p-4 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
    <svg class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <div id="errorMessage" class="font-medium"></div>
  </div>
  ```

#### C. Empty State Tabel
* Jika data tabel servis bernilai kosong (baik belum ada transaksi maupun tidak cocok dengan kata kunci pencarian):
  * Jangan menampilkan tabel kosong yang terputus.
  * Tampilkan elemen *empty state container* yang memuat icon arsip/kaca pembesar, pesan judul *"Tidak ada data servis ditemukan"*, serta subjudul *"Silakan masukkan data servis baru melalui formulir di sebelah kiri atau ubah filter pencarian Anda."*.

#### D. Modal Konfirmasi Hapus Data
* Penghapusan data baris servis dilarang mengeksekusi langsung tanpa persetujuan.
* Wajib memunculkan modal dialog atau *native confirmation window* dengan pesan peringatan jelas:
  *"Apakah Anda yakin ingin menghapus data servis nomor [NO_SERVIS] atas nama pelanggan [NAMA_PELANGGAN]?"*.
