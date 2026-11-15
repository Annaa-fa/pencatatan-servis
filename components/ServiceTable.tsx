'use client';

import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Inbox } from 'lucide-react';
import { ServiceRecord, ServiceStatus } from '@/types/service';
import { formatRupiah } from '@/lib/supabase';

interface ServiceTableProps {
  services: ServiceRecord[];
  onEdit: (item: ServiceRecord) => void;
  onDelete: (id: number, no_servis: string, nama_pelanggan: string) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter & Search Logic
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.no_servis && item.no_servis.toLowerCase().includes(q)) ||
        (item.nama_pelanggan && item.nama_pelanggan.toLowerCase().includes(q)) ||
        (item.nama_barang && item.nama_barang.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [services, searchQuery, statusFilter]);

  const getStatusBadgeClass = (status: ServiceStatus) => {
    switch (status) {
      case 'Diterima':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Diperiksa':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Diproses':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Selesai':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Diambil':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
        {/* Search Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor servis, pelanggan, barang..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700"
          >
            <option value="ALL">Semua Status</option>
            <option value="Diterima">Diterima</option>
            <option value="Diperiksa">Diperiksa</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Diambil">Diambil</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">No Servis</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Barang / Unit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Biaya Akhir</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredServices.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                {/* 1. No Servis */}
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                  {item.no_servis}
                </td>

                {/* 2. Nama Pelanggan (Anti-XSS: React renders text literal safely) */}
                <td className="px-4 py-3 text-xs font-semibold text-slate-900">
                  {item.nama_pelanggan}
                </td>

                {/* 3. Nama Barang */}
                <td className="px-4 py-3 text-xs text-slate-600">
                  {item.nama_barang}
                </td>

                {/* 4. Status Badge */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* 5. Biaya Akhir */}
                <td className="px-4 py-3 text-xs font-bold text-slate-900 whitespace-nowrap">
                  {formatRupiah(item.biaya_akhir)}
                </td>

                {/* 6. Aksi */}
                <td className="px-4 py-3 text-xs text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors mr-1"
                    title="Edit Data"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id, item.no_servis, item.nama_pelanggan)}
                    className="inline-flex items-center p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              Belum Ada Data Transaksi Servis
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Silakan tambah servis baru melalui formulir atau sesuaikan filter pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Menampilkan {filteredServices.length} dari {services.length} data transaksi
        </span>
        <span className="text-slate-400">
          Tabel: <code className="font-mono text-indigo-600">public.services</code>
        </span>
      </div>
    </div>
  );
};
