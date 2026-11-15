'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ServiceFormData, ServiceRecord, ServiceStatus } from '@/types/service';
import { generateNoServis } from '@/lib/supabase';

interface ServiceFormProps {
  editItem: ServiceRecord | null;
  onSave: (data: ServiceFormData, id?: number) => Promise<void>;
  onCancelEdit: () => void;
  externalFormData: ServiceFormData | null;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  editItem,
  onSave,
  onCancelEdit,
  externalFormData,
}) => {
  const [noServis, setNoServis] = useState('');
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [status, setStatus] = useState<ServiceStatus>('Diterima');
  const [biayaAkhir, setBiayaAkhir] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Inisialisasi awal No Servis
  useEffect(() => {
    if (!editItem) {
      setNoServis(generateNoServis());
    }
  }, [editItem]);

  // Handle Edit Mode
  useEffect(() => {
    if (editItem) {
      setNoServis(editItem.no_servis);
      setNamaPelanggan(editItem.nama_pelanggan);
      setNamaBarang(editItem.nama_barang);
      setStatus(editItem.status);
      setBiayaAkhir(String(editItem.biaya_akhir));
      setErrorMessage(null);
    }
  }, [editItem]);

  // Handle Pengisian Form dari Panel Uji Cepat SKPL
  useEffect(() => {
    if (externalFormData) {
      setNoServis(externalFormData.no_servis);
      setNamaPelanggan(externalFormData.nama_pelanggan);
      setNamaBarang(externalFormData.nama_barang);
      setStatus(externalFormData.status);
      setBiayaAkhir(String(externalFormData.biaya_akhir));
      setErrorMessage(null);
    }
  }, [externalFormData]);

  const handleReset = () => {
    setNoServis(generateNoServis());
    setNamaPelanggan('');
    setNamaBarang('');
    setStatus('Diterima');
    setBiayaAkhir('');
    setErrorMessage(null);
    onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanNoServis = noServis.trim();
    const cleanPelanggan = namaPelanggan.trim();
    const cleanBarang = namaBarang.trim();
    const parsedBiaya = parseFloat(biayaAkhir.trim());

    // 1. Validasi String Wajib
    if (!cleanNoServis || !cleanPelanggan || !cleanBarang) {
      setErrorMessage('Nomor servis, nama pelanggan, dan nama barang wajib diisi.');
      return;
    }

    // 2. Validasi Ketat TC-01 & TC-02 (Nominal harus lebih dari 0)
    if (biayaAkhir.trim() === '' || isNaN(parsedBiaya) || parsedBiaya <= 0) {
      setErrorMessage('Nominal harus lebih dari 0');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(
        {
          no_servis: cleanNoServis,
          nama_pelanggan: cleanPelanggan,
          nama_barang: cleanBarang,
          status: status,
          biaya_akhir: parsedBiaya,
        },
        editItem?.id
      );

      setSuccessMessage(
        editItem
          ? `Data servis ${cleanNoServis} berhasil diperbarui.`
          : `Data servis baru ${cleanNoServis} berhasil disimpan.`
      );
      handleReset();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setErrorMessage('Gagal menyimpan data: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {editItem ? 'Edit Data Transaksi Servis' : 'Form Transaksi Servis'}
          </h2>
          <p className="text-xs text-slate-500">
            {editItem ? `Memperbarui ID: ${editItem.id} (${editItem.no_servis})` : 'Pencatatan penerimaan barang dan update status'}
          </p>
        </div>
        {editItem && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            Mode Edit
          </span>
        )}
      </div>

      {/* Alert Error Box (TC-01 / Validasi Gagal) */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-rose-900 text-xs uppercase tracking-wide">
              Peringatan Validasi:
            </span>
            <span className="text-rose-700 font-semibold text-xs">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Alert Sukses Box */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. No Servis */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="no_servis" className="block text-xs font-semibold text-slate-700">
              Nomor Servis (Unique)
            </label>
            <button
              type="button"
              onClick={() => setNoServis(generateNoServis())}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
            >
              Auto Generate
            </button>
          </div>
          <input
            type="text"
            id="no_servis"
            value={noServis}
            onChange={(e) => setNoServis(e.target.value)}
            placeholder="Contoh: SRV-2026-001"
            className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* 2. Nama Pelanggan */}
        <div>
          <label htmlFor="nama_pelanggan" className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Pelanggan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="nama_pelanggan"
            value={namaPelanggan}
            onChange={(e) => setNamaPelanggan(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* 3. Nama Barang */}
        <div>
          <label htmlFor="nama_barang" className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Barang / Perangkat <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="nama_barang"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            placeholder="Contoh: Laptop ASUS ROG G513 / iPhone 13"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* 4. Status Servis */}
        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-1">
            Status Pengerjaan
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ServiceStatus)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
          >
            <option value="Diterima">Diterima (Unit Masuk)</option>
            <option value="Diperiksa">Diperiksa (Pengecekan Teknis)</option>
            <option value="Diproses">Diproses (Sedang Diperbaiki)</option>
            <option value="Selesai">Selesai (Siap Diambil)</option>
            <option value="Diambil">Diambil (Telah Diserahkan)</option>
          </select>
        </div>

        {/* 5. Biaya Akhir / Nominal (TIDAK MEMAKAI min="1" AGAR BISA UJI INPUT -50000) */}
        <div>
          <label htmlFor="biaya_akhir" className="block text-xs font-semibold text-slate-700 mb-1">
            Biaya Akhir / Nominal (Rp) <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
              Rp
            </div>
            {/* JANGAN PASANG min="0" atau min="1" agar penguji bebas input negatif */}
            <input
              type="number"
              id="biaya_akhir"
              value={biayaAkhir}
              onChange={(e) => setBiayaAkhir(e.target.value)}
              step="1000"
              placeholder="0"
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Biaya perbaikan (masukkan angka bulat, contoh: 150000 atau 20000)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{editItem ? 'Perbarui Transaksi' : 'Simpan Transaksi'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
