'use client';

import React from 'react';
import { Package, Clock, Wallet } from 'lucide-react';
import { ServiceRecord } from '@/types/service';
import { formatRupiah } from '@/lib/supabase';

interface KpiCardsProps {
  services: ServiceRecord[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ services }) => {
  const totalCount = services.length;

  // Servis Aktif (Diterima, Diperiksa, Diproses)
  const activeCount = services.filter((s) =>
    ['Diterima', 'Diperiksa', 'Diproses'].includes(s.status)
  ).length;

  // Total Pendapatan dari servis yang Selesai / Diambil
  const totalRevenue = services
    .filter((s) => ['Selesai', 'Diambil'].includes(s.status))
    .reduce((sum, item) => sum + (Number(item.biaya_akhir) || 0), 0);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total Servis */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Servis Terdaftar
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{totalCount} Unit</h3>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi seluruh transaksi</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Servis Aktif / Dalam Proses */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Dalam Proses (Aktif)
          </p>
          <h3 className="text-2xl font-bold text-amber-600 tracking-tight">{activeCount} Unit</h3>
          <p className="text-[11px] text-slate-400 mt-1">Diterima, Diperiksa & Diproses</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Total Pendapatan Servis Selesai */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Pendapatan Servis
          </p>
          <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">{formatRupiah(totalRevenue)}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Biaya status Selesai & Diambil</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
