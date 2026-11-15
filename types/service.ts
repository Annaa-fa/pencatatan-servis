export type ServiceStatus = 'Diterima' | 'Diperiksa' | 'Diproses' | 'Selesai' | 'Diambil';

export interface ServiceRecord {
  id: number;
  no_servis: string;
  nama_pelanggan: string;
  nama_barang: string;
  status: ServiceStatus;
  biaya_akhir: number;
  created_at?: string;
}

export type ServiceFormData = Omit<ServiceRecord, 'id' | 'created_at'>;
