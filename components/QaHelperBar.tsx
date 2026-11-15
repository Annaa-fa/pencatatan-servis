'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Bug } from 'lucide-react';
import { ServiceFormData } from '@/types/service';
import { generateNoServis } from '@/lib/supabase';

interface QaHelperBarProps {
  onFillTest: (data: ServiceFormData, note: string) => void;
}

export const QaHelperBar: React.FC<QaHelperBarProps> = ({ onFillTest }) => {
  const triggerTC01 = () => {
    onFillTest(
      {
        no_servis: 'SRV-TEST-NEG',
        nama_pelanggan: 'Penguji Negatif QA',
        nama_barang: 'Laptop Asus (Uji TC-01)',
        status: 'Diproses',
        biaya_akhir: -50000,
      },
      'Data uji coba TC-01 (-50000) terpasang. Klik "Simpan Transaksi" untuk membuktikan penolakan sistem.'
    );
  };

  const triggerTC02 = () => {
    onFillTest(
      {
        no_servis: generateNoServis(),
        nama_pelanggan: 'Siti Rahmawati',
        nama_barang: 'Printer Canon MP287',
        status: 'Selesai',
        biaya_akhir: 150000,
      },
      'Data valid TC-02 (Rp 150.000) terpasang. Klik "Simpan Transaksi" untuk menyimpan.'
    );
  };

  const triggerSEC01 = () => {
    onFillTest(
      {
        no_servis: 'SRV-SEC-XSS',
        nama_pelanggan: `<img src=x onerror=alert('Jebol_XSS_Pelanggan!')>`,
        nama_barang: `<img src=x onerror=alert('Jebol_XSS_Barang!')>`,
        status: 'Diproses',
        biaya_akhir: 75000,
      },
      'Payload SEC-01 terpasang. Simpan dan perhatikan tabel: skrip tidak tereksekusi berkat textContent rendering di React!'
    );
  };

  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          Panel Uji Cepat SKPL (QA & Security Mode)
        </span>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
          1-Klik Otomatis
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Klik tombol uji di bawah untuk mengisi formulir dengan payload pengujian SKPL secara instan:
      </p>
      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={triggerTC01}
          className="text-left text-xs font-medium px-3 py-2 bg-slate-50 hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 hover:border-rose-300 rounded-lg transition-all flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              <strong>Uji TC-01</strong> (Input -50000 & Validasi)
            </span>
          </span>
          <span className="text-[10px] text-rose-600 bg-rose-100/70 px-1.5 py-0.5 rounded">
            Uji Negatif
          </span>
        </button>

        <button
          type="button"
          onClick={triggerTC02}
          className="text-left text-xs font-medium px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              <strong>Uji TC-02</strong> (Input Valid Selesai Rp 150.000 / 20.000)
            </span>
          </span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded">
            Uji Positif
          </span>
        </button>

        <button
          type="button"
          onClick={triggerSEC01}
          className="text-left text-xs font-medium px-3 py-2 bg-slate-50 hover:bg-amber-50 text-amber-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-lg transition-all flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Uji SEC-01</strong> (Payload XSS &lt;img src=x onerror=...&gt;)
            </span>
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
            Anti-XSS
          </span>
        </button>
      </div>
    </div>
  );
};
