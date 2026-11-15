# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## SISTEM PENCATATAN SERVIS (SERVICETRACK)

---

### 1. IDENTITAS & TUJUAN APLIKASI

* **Nama Aplikasi:** ServiceTrack (Sistem Pencatatan Servis)
* **Kategori:** Web-based Service & Repair Management System
* **Target Pengguna (Role):** Petugas Servis / Teknisi Counter (Single Role)
* **Ringkasan Sistem:** 
  ServiceTrack adalah aplikasi web pencatatan dan pelacakan transaksi servis barang (elektronik, perangkat keras, komputer, gadget) yang dirancang untuk membantu tempat servis mengelola alur kerja penerimaan barang, pelacakan tahapan reparasi secara transparan, serta pencatatan kalkulasi biaya akhir pengerjaan servis secara terstruktur dan terintegrasi.
* **Capaian Utama (Main Achievement):** 
  Terbangunnya aplikasi tracking servis berbasis web yang fungsional, mencakup manajemen transaksi servis (CRUD utuh), *multi-stage status tracking* (Diterima $\rightarrow$ Diperiksa $\rightarrow$ Diproses $\rightarrow$ Selesai $\rightarrow$ Diambil), dan kalkulasi biaya akhir yang divalidasi secara ketat melalui pengujian *Black Box Testing* dan *Security Assessment*.
* **Tujuan Aplikasi:**
  1. Mempermudah pencatatan penerimaan barang servis dan data identitas pelanggan secara cepat dan akurat.
  2. Menyediakan pembaruan status pengerjaan servis secara bertahap dan transparan.
  3. Mengelola pencatatan biaya akhir servis secara akurat guna mencegah kesalahan penagihan.
* **Alur Utama Sistem:**
  Buka Aplikasi $\rightarrow$ Dashboard / Summary KPI $\rightarrow$ Tambah Transaksi Servis $\rightarrow$ Terbit Nomor Servis Unik $\rightarrow$ Pembaruan Status Bertahap (`Diterima` $\rightarrow$ `Diperiksa` $\rightarrow$ `Diproses` $\rightarrow$ `Selesai`) $\rightarrow$ Catat Biaya Akhir $\rightarrow$ Barang Diambil Pelanggan (`Diambil`).
* **Batasan Scope (Non-Functional Constraints):**
  * Hanya ada satu peran pengguna: **Petugas Servis** (tanpa multi-level hak akses kompleks).
  * Tidak mencakup manajemen inventori gudang / modul stok spare part.
  * Tidak mencakup portal publik mandiri untuk pelanggan (customer portal).
  * Tidak mencakup integrasi pengiriman notifikasi otomatis (SMS Gateway/WhatsApp API).

---

### 2. SPESIFIKASI FUNGSIONAL LENGKAP (CRUD + KALKULASI & FILTER)

Spesifikasi fungsional memperluas kebutuhan dasar `REQ-01` s/d `REQ-03` dari dokumen SKPL menjadi siklus CRUD modern dan interaktif:

| ID Kebutuhan | Nama Fitur | Siklus | Deskripsi Fungsionalitas Rinci |
| :--- | :--- | :--- | :--- |
| **REQ-01** | **Penerimaan Servis (Create Data)** | Create | Sistem menyediakan formulir input untuk mencatat data servis baru: `nama_pelanggan`, `nama_barang`. Sistem secara otomatis atau semi-otomatis menerbitkan `no_servis` unik (format: `SRV-YYYY-XXXX`). Nilai default `status` diatur ke `'Diterima'` dan `biaya_akhir` diatur ke `0`. |
| **REQ-02** | **Multi-Stage Tracking Status (Update Status)** | Update | Petugas servis dapat memperbarui tahapan pengerjaan servis secara fleksibel melalui dropdown status dengan 5 tahap sekuensial: `'Diterima'`, `'Diperiksa'`, `'Diproses'`, `'Selesai'`, dan `'Diambil'`. |
| **REQ-03** | **Biaya Akhir & Penyelesaian (Calculation & Update Biaya)** | Update | Ketika pengerjaan selesai atau barang siap diambil, petugas dapat memasukkan nominal `biaya_akhir` perbaikan. Sistem memvalidasi bahwa nominal tidak boleh negatif (`>= 0`) dan menyimpan nilai numerik secara presisi. |
| **REQ-04** | **Tabel Riwayat & Ringkasan Metrik (Read Data & KPI)** | Read | Sistem menampilkan seluruh riwayat transaksi servis dalam bentuk tabel responsif. Di bagian atas layar, sistem menghitung dan merender 3 Kartu Ringkasan (KPI):<br>1. **Total Servis Terdaftar** (Count seluruh transaksi).<br>2. **Servis Aktif / Dalam Proses** (Count status `'Diterima'`, `'Diperiksa'`, `'Diproses'`).<br>3. **Total Pendapatan Servis Selesai** (Sum nominal `biaya_akhir` dari status `'Selesai'` & `'Diambil'`). |
| **REQ-05** | **Manajemen Koreksi & Hapus (Edit & Delete)** | Update / Delete | Petugas dapat mengedit data servis yang salah input melalui form edit interaktif (mengisi kembali input form dengan data yang dipilih). Petugas dapat menghapus baris data servis dengan konfirmasi dialog modal aman (*confirmation prompt*) sebelum eksekusi delete permanen. |
| **REQ-06** | **Pencarian & Filter Interaktif (Search & Filter)** | Read | Sistem menyediakan bilah pencarian *real-time* (instan tanpa reload) berdasarkan `no_servis`, `nama_pelanggan`, atau `nama_barang`, serta dropdown filter untuk memfilter baris data berdasarkan `status`. |

---

### 3. SPESIFIKASI SKEMA DATA (SUPABASE POSTGRESQL)

Skema database disesuaikan 100% dengan **Modul 2 SKPL** menggunakan nama tabel dan kolom identik.

* **Nama Tabel:** `public.services`
* **Deskripsi Tabel:** Menyimpan riwayat pengerjaan servis, identitas pelanggan, barang, status tahapan, dan nominal biaya perbaikan.

| Nama Kolom (Field) | Tipe Data PostgreSQL | Aturan Validasi / Constraints | Keterangan Fungsional |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY` | Identifier unik baris data (*Primary Key* otomatis bertambah). |
| `no_servis` | `VARCHAR(30)` | `NOT NULL UNIQUE`, `CHECK (length(trim(no_servis)) > 0)` | Nomor servis unik registrasi (contoh: `SRV-2026-001`). Tidak boleh duplikat atau kosong. |
| `nama_pelanggan` | `VARCHAR(100)` | `NOT NULL`, `CHECK (length(trim(nama_pelanggan)) > 0)` | Nama lengkap pemilik barang/pelanggan yang mendaftarkan servis. |
| `nama_barang` | `VARCHAR(100)` | `NOT NULL`, `CHECK (length(trim(nama_barang)) > 0)` | Merk, jenis, atau tipe barang yang diservis (contoh: `Laptop ASUS ROG G513`). |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'Diterima'`, `CHECK (status IN ('Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil'))` | Tahapan proses perbaikan servis barang. |
| `biaya_akhir` | `DECIMAL(10,2)` | `NOT NULL DEFAULT 0.00`, `CHECK (biaya_akhir >= 0)` | Nominal biaya akhir pengerjaan servis. Wajib angka positif/nol (tidak boleh negatif). |

---

### 4. KONTRAK PENGUJIAN BLACK BOX & KEAMANAN (ACUAN MUTLAK QA)

Kontrak pengujian ini adalah acuan mutlak bagi tim penguji dan *developer* untuk memastikan integritas logika bisnis serta ketahanan aplikasi:

| ID Test | Kategori | Skenario Pengujian | Langkah / Input Data | Hasil yang Diharapkan | Status Acuan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Fungsional (Positif) | Update Status Servis & Biaya Akhir (Sesuai SKPL Modul 3) | 1. Pilih servis berstatus `Diproses`<br>2. Ubah status ke: `Selesai`<br>3. Masukkan Biaya Akhir: `150000`<br>4. Klik tombol "Simpan" | Status berhasil diperbarui menjadi `Selesai`, biaya akhir `Rp 150.000` tersimpan ke database, dan tabel serta KPI ter-refresh otomatis. | **PASS** |
| **TC-02** | Fungsional (Negatif) | Validasi Nilai Biaya Akhir Negatif & Form Kosong | 1. Masukkan biaya akhir bernilai negatif: `-50000`<br>2. Kosongkan field `nama_pelanggan`<br>3. Klik tombol "Simpan" | Sistem memblokir request ke API Supabase, menampilkan *Alert Error Box* merah dengan pesan: *"Nama pelanggan wajib diisi dan biaya akhir tidak boleh kurang dari 0"*. Data tidak tersimpan ke database. | **REJECTED (Tervalidasi)** |
| **SEC-01** | Keamanan (Anti-XSS) | Uji Injeksi Script XSS pada Input Teks | Masukkan payload serangan XSS pada `nama_pelanggan` & `nama_barang`:<br>`<img src=x onerror=alert(1)>` atau `<script>alert('XSS')</script>` | Sistem tidak menjalankan skrip modal alert. Karakter di-escape secara aman atau dirender melalui `.textContent` sebagai teks literal biasa. | **PASS (Aman)** |
| **SEC-02** | Keamanan (Kredensial) | Audit Ketiadaan Secret Key di Frontend | Lakukan inspeksi berkas frontend (`index.html`, `app.js`, atau console network browser) | Hanya `SUPABASE_URL` dan `SUPABASE_ANON_KEY` yang terekspos. Kredensial rahasia berprivilese tinggi (`SUPABASE_SERVICE_ROLE_KEY` atau API Key privat lainnya) **TIDAK DITEMUKAN** di sisi client. | **PASS (Aman)** |
