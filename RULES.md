# AI CODING & SECURITY GUARDRAILS
## ATURAN HUKUM PENGEMBANGAN SISTEM SERVICETRACK

Dokumen ini memuat aturan hukum mutlak (Guardrails) yang wajib dipatuhi tanpa kompromi saat menulis atau merefaktor kode sumber aplikasi ServiceTrack di lingkungan IDE.

---

### 1. KEPATUHAN SKEMA & SPESIFIKASI SKPL

1. **Nama Tabel Database:** Wajib `services` (huruf kecil, persis sesuai Modul 2 SKPL). Dilarang mengubah menjadi `service`, `tbl_services`, atau nama lain.
2. **Nama Kolom Database:** Wajib menggunakan 6 kolom resmi:
   - `id`
   - `no_servis`
   - `nama_pelanggan`
   - `nama_barang`
   - `status`
   - `biaya_akhir`
3. **Pilihan Nilai Status:** Wajib persis dengan daftar ENUM SKPL:
   `'Diterima'`, `'Diperiksa'`, `'Diproses'`, `'Selesai'`, `'Diambil'`.
4. **Pencegahan Penyimpangan:** Dilarang mengarang kolom tambahan yang merusak kompatibilitas skema database yang sudah didefinisikan di `PRD.md` dan `supabase_schema.sql`.

---

### 2. ATURAN MUTLAK ANTI-XSS (`SEC-01`)

1. **Dilarang Penggunaan HTML Sinks Rentan:**
   DILARANG KERAS menggunakan property atau method berikut untuk merender data dari input pengguna atau response database Supabase:
   * ❌ `element.innerHTML = ...`
   * ❌ `element.outerHTML = ...`
   * ❌ `document.write(...)`
   * ❌ `element.insertAdjacentHTML(...)` (jika membungkus variabel mentah)

2. **Metode Render Aman yang Diwajibkan:**
   * ✅ Gunakan `element.textContent = data` saat mengisi teks ke dalam elemen DOM (`<span>`, `<td>`, `<p>`, dsb.).
   * ✅ Buat baris tabel secara dinamis menggunakan `document.createElement('tr')` dan manipulasi child element dengan `.textContent`.
   * ✅ Apabila menggunakan teknik template literal string, SELURUH variabel input dinamis WAJIB disaring melalui fungsi sanitasi `escapeHtml()`:
     ```javascript
     function escapeHtml(string) {
       if (string === null || string === undefined) return '';
       return String(string)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#39;');
     }
     ```
   * Pengujian dengan payload `<img src=x onerror=alert(1)>` wajib menghasilkan render teks string biasa di browser, bukan trigger fungsi JavaScript `alert`.

---

### 3. ATURAN MUTLAK VALIDASI INPUT LOGIC (`TC-01` & `TC-02`)

1. **Larangan Bergantung pada Atribut HTML:**
   Atribut HTML seperti `required`, `min="0"`, atau `maxlength` hanya berfungsi sebagai panduan UX lapis pertama dan SANGAT MUDAH di-bypass oleh pengguna melalui *Inspect Element / DevTools*.
2. **Kewajiban Validasi Logika di JavaScript:**
   Sebelum memanggil fungsi `supabase.from('services').insert(...)` atau `.update(...)`, wajib menjalankan validasi logika di JavaScript:
   ```javascript
   // Validasi wajib sebelum request Supabase
   const cleanNoServis = inputNoServis.value.trim();
   const cleanNamaPelanggan = inputNamaPelanggan.value.trim();
   const cleanNamaBarang = inputNamaBarang.value.trim();
   const cleanStatus = selectStatus.value;
   const parsedBiaya = parseFloat(inputBiayaAkhir.value);

   if (!cleanNoServis || !cleanNamaPelanggan || !cleanNamaBarang) {
     showErrorAlert("Nomor servis, nama pelanggan, dan nama barang wajib diisi.");
     return;
   }

   if (isNaN(parsedBiaya) || parsedBiaya < 0) {
     showErrorAlert("Biaya akhir harus berupa angka valid dan minimal 0.");
     return;
   }

   const validStatuses = ['Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil'];
   if (!validStatuses.includes(cleanStatus)) {
     showErrorAlert("Status servis yang dipilih tidak valid.");
     return;
   }
   ```
3. Jika validasi gagal, proses simpan wajib DIHENTIKAN (`return`), dan pesan error wajib ditampilkan pada *Alert Box* merah di layar sesuai kontrak `TC-02`.

---

### 4. ATURAN KEAMANAN KREDENSIAL SUPABASE (`SEC-02`)

1. **Hanya Public Anon Key yang Diizinkan:**
   Pada file frontend publik (`index.html` / `app.js`), hanya boleh memuat kredensial:
   * `SUPABASE_URL` (contoh: `https://xyzcompany.supabase.co`)
   * `SUPABASE_ANON_KEY` (Public Client Anonymous Key)
2. **Larangan Keras Secret Role Key:**
   DILARANG KERAS menaruh `SUPABASE_SERVICE_ROLE_KEY`, token admin, atau API key privat penyedia layanan pihak ketiga di file frontend. Kredensial *service role* memotong seluruh Row Level Security (RLS) dan membahayakan database jika terbaca di browser publik.
