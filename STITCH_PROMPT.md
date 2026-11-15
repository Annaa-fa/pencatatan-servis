# PROMPT DESAIN UI/UX UNTUK GOOGLE STITCH

Salin seluruh teks prompt di bawah ini ke formulir prompt di https://stitch.withgoogle.com/ :

```text
Create a modern, clean, and highly responsive single-page web application interface for "ServiceTrack - Sistem Pencatatan Servis" using HTML5 and Tailwind CSS. The design must look professional, intuitive for counter repair service staff, and use a refined enterprise color palette (slate-50 background, white cards with subtle borders, indigo-600 primary accents, emerald-600 success accents, and rose-600 error accents).

The layout must strictly include the following UI sections and components:

1. Top Header Bar:
   - Application Brand Title: "ServiceTrack" with a modern wrench/device repair SVG icon in an indigo-600 rounded badge.
   - Subtitle: "Sistem Manajemen Penerimaan & Pelacakan Status Servis".
   - Top-right Status Pill: A database connection indicator badge with a pulsating green dot and the text "Supabase Connected" (emerald-50 bg, emerald-700 text, emerald-200 border).

2. Summary / KPI Cards (Grid of 3 Cards below Header):
   - Card 1 (Total Servis): Large numerical counter (e.g., "24 Unit"), label "Total Servis Terdaftar", subtle blue repair icon.
   - Card 2 (Servis Aktif): Numerical counter (e.g., "8 Unit"), label "Dalam Pengerjaan (Aktif)", subtle amber clock icon.
   - Card 3 (Total Pendapatan): Currency counter formatted in Indonesian Rupiah (e.g., "Rp 3.850.000"), label "Total Biaya Servis Selesai", subtle emerald wallet/cash icon.

3. Main Split Layout (Two Responsive Columns - Left: 4 cols on lg screens, Right: 8 cols on lg screens):

   A. Left Column - Transaction & Status Form Card:
      - Card Title: "Form Registrasi & Update Servis" with a descriptive helper text.
      - Dynamic Alert Error Box (Red alert banner: bg-rose-50 border-rose-200 text-rose-700 rounded-lg p-3.5 mb-4 hidden by default or sample error preview) containing an exclamation icon and explicit error text: "Nomor servis dan nama pelanggan wajib diisi, serta biaya akhir tidak boleh kurang dari 0".
      - Input Fields matching the database schema:
        * No Servis (Text input with placeholder "Contoh: SRV-2026-001", monospace font style, with an "Auto" badge button).
        * Nama Pelanggan (Text input, placeholder "Contoh: Budi Santoso").
        * Nama Barang (Text input, placeholder "Contoh: Laptop Asus ROG G513 / iPhone 13").
        * Status Servis (Styled select dropdown containing 5 options: 'Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil').
        * Biaya Akhir (Number input with Indonesian Rupiah currency prefix "Rp", default value "0", step "1000", placeholder "0").
      - Form Action Buttons:
        * Primary Button: "Simpan Transaksi" (indigo-600 hover:indigo-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm flex items-center justify-center gap-2).
        * Secondary Button: "Reset / Batal Edit" (bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg).

   B. Right Column - Data Table, Search & Filter Card:
      - Filter Toolbar Bar at the top of the table:
        * Search Box with magnifying glass icon: input with placeholder "Cari nomor servis, pelanggan, atau barang...".
        * Status Filter Dropdown: options for "Semua Status", "Diterima", "Diperiksa", "Diproses", "Selesai", "Diambil".
      - Responsive Data Table with clean divider lines:
        * Table Columns: No Servis (bold monospace), Nama Pelanggan, Nama Barang, Status Pengerjaan, Biaya Akhir, Aksi.
        * Multi-stage Status Badges:
          - 'Diterima': slate-100 bg, slate-700 text.
          - 'Diperiksa': amber-100 bg, amber-700 text.
          - 'Diproses': sky-100 bg, sky-700 text.
          - 'Selesai': emerald-100 bg, emerald-700 text.
          - 'Diambil': purple-100 bg, purple-700 text.
        * Biaya Akhir column formatted as Indonesian currency (e.g., "Rp 150.000").
        * Action Column in each row: Two compact icon buttons:
          - "Edit" button (indigo text, subtle hover background) to populate data back into the form.
          - "Hapus" button (rose-600 text, subtle hover background) to trigger delete confirmation.
      - Empty State UI preview: A clean centered empty state illustration or SVG folder icon with text "Belum ada transaksi servis yang sesuai kriteria pencarian" when results are empty.

4. Typography & Details:
   - Modern clean sans-serif typography (Inter / Plus Jakarta Sans).
   - Generous padding, smooth transitions (`transition-all duration-200`), rounded corners (`rounded-xl` for cards, `rounded-lg` for inputs/buttons), and subtle border lines (`border-slate-200`).
```
