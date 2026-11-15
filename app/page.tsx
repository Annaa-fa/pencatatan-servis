'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { KpiCards } from '@/components/KpiCards';
import { QaHelperBar } from '@/components/QaHelperBar';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceTable } from '@/components/ServiceTable';
import { ServiceFormData, ServiceRecord } from '@/types/service';
import {
  isSupabaseConfigured,
  supabase,
  getLocalServices,
  saveLocalServices,
} from '@/lib/supabase';
import { Info, X } from 'lucide-react';

export default function Home() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [editItem, setEditItem] = useState<ServiceRecord | null>(null);
  const [externalFormData, setExternalFormData] = useState<ServiceFormData | null>(null);
  const [isCloudMode, setIsCloudMode] = useState<boolean>(false);
  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fetch Services from Supabase or LocalStorage
  const loadServices = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setServices(data || []);
        setIsCloudMode(true);
        setShowNotice(false);
        return;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
      }
    }

    // LocalStorage Fallback
    setIsCloudMode(false);
    setShowNotice(true);
    const local = getLocalServices();
    setServices([...local].sort((a, b) => b.id - a.id));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadServices();
  }, [loadServices]);

  // Handle Save (Create / Update)
  const handleSave = async (data: ServiceFormData, id?: number) => {
    if (isCloudMode && supabase) {
      if (id) {
        // UPDATE
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('services')
          .insert([data]);
        if (error) throw error;
      }
      await loadServices();
    } else {
      // LocalStorage Mode
      let current = getLocalServices();
      if (id) {
        current = current.map((item) => (item.id === id ? { ...item, ...data } : item));
      } else {
        const newId = current.length > 0 ? Math.max(...current.map((i) => i.id)) + 1 : 1;
        current.unshift({ id: newId, ...data });
      }
      saveLocalServices(current);
      setServices([...current].sort((a, b) => b.id - a.id));
    }

    setEditItem(null);
    setExternalFormData(null);
  };

  // Handle Delete
  const handleDelete = async (id: number, no_servis: string, nama_pelanggan: string) => {
    const confirmed = confirm(
      `Apakah Anda yakin ingin menghapus data servis ${no_servis} atas nama pelanggan "${nama_pelanggan}"?`
    );
    if (!confirmed) return;

    if (isCloudMode && supabase) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) {
        alert('Gagal menghapus dari Supabase: ' + error.message);
        return;
      }
      await loadServices();
    } else {
      const current = getLocalServices().filter((item) => item.id !== id);
      saveLocalServices(current);
      setServices([...current].sort((a, b) => b.id - a.id));
    }

    if (editItem?.id === id) {
      setEditItem(null);
    }
  };

  // Helper Bar Fill
  const handleFillTest = (data: ServiceFormData) => {
    setEditItem(null);
    setExternalFormData({ ...data });
  };

  if (!isMounted) {
    return null; // Prevent SSR hydration flash
  }

  return (
    <>
      {/* Header */}
      <Header isCloudMode={isCloudMode} />

      {/* Notice Banner (LocalStorage Demo Mode) */}
      {showNotice && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border-b border-amber-200/80 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-900 gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Mode Demo Lokal Aktif (localStorage):</strong> Kredensial Supabase di{' '}
                <code className="bg-amber-200/60 px-1 rounded font-mono">.env.local</code> belum diisi.
                Seluruh fitur CRUD, kalkulasi KPI, dan pengujian{' '}
                <code className="bg-amber-200/60 px-1 rounded font-mono">TC-01</code>,{' '}
                <code className="bg-amber-200/60 px-1 rounded font-mono">TC-02</code>, dan{' '}
                <code className="bg-amber-200/60 px-1 rounded font-mono">SEC-01</code> berjalan penuh!
              </span>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="text-amber-700 hover:text-amber-950 text-sm font-bold p-1 rounded"
              title="Tutup Pesan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* KPI Summary Cards */}
        <KpiCards services={services} />

        {/* Split Layout: Form (Left) & Table (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <QaHelperBar onFillTest={handleFillTest} />
            <ServiceForm
              editItem={editItem}
              onSave={handleSave}
              onCancelEdit={() => setEditItem(null)}
              externalFormData={externalFormData}
            />
          </div>

          {/* Kolom Kanan */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ServiceTable
              services={services}
              onEdit={(item) => setEditItem(item)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ServiceTrack &copy; 2026 - Modul Implementasi SKPL Sistem Pencatatan Servis</span>
          <span className="text-[11px] text-slate-400">
            Next.js + React Framework &bull; Anti-XSS Secured (<code className="text-slate-600 font-mono">SEC-01</code>)
          </span>
        </div>
      </footer>
    </>
  );
}
