import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ServiceRecord } from '@/types/service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Dummy Data (Realistis sesuai SKPL Modul 2 & TC-01)
export const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 1,
    no_servis: 'SRV-2026-001',
    nama_pelanggan: 'Budi Santoso',
    nama_barang: 'Laptop ASUS ROG G513',
    status: 'Diproses',
    biaya_akhir: 0,
  },
  {
    id: 2,
    no_servis: 'SRV-2026-002',
    nama_pelanggan: 'Siti Aminah',
    nama_barang: 'Printer Epson L3110',
    status: 'Selesai',
    biaya_akhir: 150000,
  },
  {
    id: 3,
    no_servis: 'SRV-2026-003',
    nama_pelanggan: 'Rian Pratama',
    nama_barang: 'Monitor LG 24MK600',
    status: 'Diterima',
    biaya_akhir: 0,
  },
];

const LOCAL_STORAGE_KEY = 'servicetrack_services_data';

export const getLocalServices = (): ServiceRecord[] => {
  if (typeof window === 'undefined') return INITIAL_SERVICES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SERVICES;
  }
};

export const saveLocalServices = (services: ServiceRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
};

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export const generateNoServis = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  return `SRV-${year}-${rand}`;
};
