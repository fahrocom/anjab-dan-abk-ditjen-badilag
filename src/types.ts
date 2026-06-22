export type UserRole = "admin" | "editor" | "viewer";

export interface UserRecord {
  uid: string;
  email: string;
  role: UserRole;
}

export interface UnitKerja {
  id: string;
  nama: string;
  kode?: string;
  kepalaNama?: string;
  kepalaNip?: string;
}

export interface Kualifikasi {
  pendidikanMinimal: string;
  jurusan: string[];
  pelatihan: string;
  pengalaman: string;
}

export interface UraianTugas {
  id: string;
  uraian: string;
  hasilKerja: string; // Satuan hasil e.g., Dokumen, Laporan, Kegiatan, Berkas
  waktuPenyelesaian: number; // WP dlm menit
  bebanKerja: number; // Target Hasil dlm 1 tahun (Vol)
}

export interface SyaratJabatan {
  pangkatGolongan: string;
  bakatKerja: string[];
  temperamenKerja: string[];
  minatKerja: string[];
  upayaFisik: string[];
  kondisiFisik: string;
}

export interface Jabatan {
  id: string;
  unitKerjaId: string;
  nama: string;
  iktisar: string;
  kelasJabatan: number;
  pegawaiRiil: number; // Jumlah pegawai riil (bezetting) saat ini
  kualifikasi: Kualifikasi;
  uraianTugas: UraianTugas[];
  syaratJabatan: SyaratJabatan;
  tanggungJawab?: string[];
  wewenang?: string[];
  perangkatKerja?: string[];
}

export interface AppSettings {
  wkeTahunan: number; // Waktu Kerja Efektif per tahun dlm menit (Default: 75000)
  namaInstansi: string; // Nama instansi pemerintah, e.g. "Dinas Komunikasi dan Informatika Provinsi Jawa Tengah"
  logoInstansi?: string; // Base64 or URL
  alamat?: string;
  kelasPengadilan?: "IA" | "IB" | "II" | "Banding" | "Pusat";
  teamMembers?: UserRecord[];
}

export interface JenisPerkara {
  id: string;
  kode: string;
  nama: string;
  bobotWaktuMenit: number;
  keterangan: string;
}

export interface DataPerkara {
  id: string;
  jenisPerkaraId: string;
  tahun: number;
  bulan: string;
  jumlahDiterima: number;
  jumlahDiputus: number;
}

export interface MockTemplates {
  id: string;
  nama: string;
  iktisar: string;
  kualifikasi: Kualifikasi;
  uraianTugas: Omit<UraianTugas, "id">[];
  syaratJabatan: SyaratJabatan;
}
