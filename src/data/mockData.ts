import { UnitKerja, Jabatan, AppSettings } from "../types";

export const defaultSettings: AppSettings = {
  wkeTahunan: 75000, // 1250 Jam Kerja Efektif per tahun (75.000 menit) sesuai PermenPAN-RB No 1 Tahun 2020
  namaInstansi: "Ditjen Badan Peradilan Agama Mahkamah Agung RI",
  alamat: "Gedung Sekretariat Mahkamah Agung RI, Jl. Jend. Ahmad Yani Kav. 58, Cempaka Putih, Jakarta Pusat",
};

export const mockUnitKerja: UnitKerja[] = [
  {
    id: "unit-badilag-1",
    nama: "Direktorat Pembinaan Tenaga Teknis Peradilan Agama",
    kode: "DIRBINTEN-PA",
    kepalaNama: "Dr. H. Candra Boyero, S.H., M.H.",
    kepalaNip: "19750318 199903 1 002"
  },
  {
    id: "unit-badilag-2",
    nama: "Kepaniteraan Muda Perkara Gugatan & Permohonan",
    kode: "PANMU-PERKARA",
    kepalaNama: "Dra. Hj. Siti Zulaikha, S.H., M.H.",
    kepalaNip: "19701205 199603 2 001"
  },
  {
    id: "unit-badilag-3",
    nama: "Kepaniteraan Muda Hukum & Dokumentasi Peradilan",
    kode: "PANMU-HUKUM",
    kepalaNama: "H. Ahmad Zaenal, S.Ag., M.S.I.",
    kepalaNip: "19780410 200501 1 003"
  }
];

export const mockJabatan: Jabatan[] = [
  {
    id: "jab-badilag-1",
    unitKerjaId: "unit-badilag-2",
    nama: "Panitera (Registrar)",
    iktisar: "Memimpin, mengorganisir, dan bertanggung jawab penuh atas seluruh kelancaran administrasi perkara, jalannya persidangan, pembuatan akta hukum, pelaporan statistik perkara, serta pembinaan dan pengawasan tugas-tugas fungsional kepaniteraan di lingkungan peradilan agama pembinaan Ditjen Badilag.",
    kelasJabatan: 11,
    pegawaiRiil: 1,
    kualifikasi: {
      pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
      jurusan: ["Ilmu Hukum", "Hukum Syariah", "Hukum Islam", "Ahwal Syakhshiyah"],
      pelatihan: "Sertifikasi Kompetensi Panitera, Diklat Manajemen Peradilan Modern, Bimtek SIPP Tingkat Lanjut",
      pengalaman: "Minimal 5 tahun menjabat sebagai Panitera Muda atau Panitera Pengganti Senior"
    },
    uraianTugas: [
      {
        id: "ut-badilag-1-1",
        uraian: "Mengatur, mengoordinasikan, dan memantau status pendaftaran berkas gugatan dan permohonan melalui sistem e-Court",
        hasilKerja: "Laporan",
        waktuPenyelesaian: 90,
        bebanKerja: 52 // Mingguan
      },
      {
        id: "ut-badilag-1-2",
        uraian: "Melakukan verifikasi, otentikasi data, dan menandatangani dokumen Akta Cerai yang telah diterbitkan",
        hasilKerja: "Dokumen",
        waktuPenyelesaian: 15,
        bebanKerja: 1200
      },
      {
        id: "ut-badilag-1-3",
        uraian: "Melakukan supervisi, pengawasan fungsional, dan evaluasi kinerja harian Panitera Pengganti dan Jurusita",
        hasilKerja: "Kegiatan",
        waktuPenyelesaian: 45,
        bebanKerja: 250 // Harian hari kerja
      },
      {
        id: "ut-badilag-1-4",
        uraian: "Memeriksa dan menyetujui pelaporan keuangan biaya perkara (LIPA-7) secara periodik bulanan",
        hasilKerja: "Berkas",
        waktuPenyelesaian: 120,
        bebanKerja: 12
      },
      {
        id: "ut-badilag-1-5",
        uraian: "Memimpin pelaksanaan eksekusi putusan yang sudah berkekuatan hukum tetap (Inkracht Van Gewijsde)",
        hasilKerja: "Kegiatan",
        waktuPenyelesaian: 360,
        bebanKerja: 20
      }
    ],
    syaratJabatan: {
      pangkatGolongan: "Pembina, IV/a",
      bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
      temperamenKerja: ["D (Direction, Control, Planning)", "V (Variety of Duties)", "M (Measurable Criteria)"],
      minatKerja: ["Konvensional", "Sosial"],
      upayaFisik: ["Duduk", "Berbicara", "Melihat"],
      kondisiFisik: "Sehat jasmani dan rohani, berwibawa, ketelitian tinggi."
    }
  },
  {
    id: "jab-badilag-2",
    unitKerjaId: "unit-badilag-2",
    nama: "Panitera Pengganti",
    iktisar: "Mendampingi Hakim dalam mengikuti jalannya persidangan perkara, mencatat segala kejadian di sidang secara cermat, menyusun Berita Acara Sidang (BAS) resmi yang berkekuatan hukum, serta menginput data mutasi perkara ke dalam Sistem Informasi Penelusuran Perkara (SIPP).",
    kelasJabatan: 8,
    pegawaiRiil: 5,
    kualifikasi: {
      pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
      jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah", "Muamalah"],
      pelatihan: "Diklat Fungsional Panitera Pengganti, Bimtek Pengisian BAS Elektronik dan SIPP Mahkamah Agung",
      pengalaman: "Minimal 1 tahun magang di pengadilan atau bertugas di unit administrasi perkara"
    },
    uraianTugas: [
      {
        id: "ut-badilag-2-1",
        uraian: "Mengikuti dan mendampingi Majelis Hakim dalam jalannya persidangan perkara perdata agama (Nikah, Rujuk, Waris, dsb)",
        hasilKerja: "Kegiatan",
        waktuPenyelesaian: 180,
        bebanKerja: 1100
      },
      {
        id: "ut-badilag-2-2",
        uraian: "Menulis dan merumuskan Berita Acara Sidang (BAS) pasca persidangan secara sistematis dan autentik",
        hasilKerja: "Berkas",
        waktuPenyelesaian: 120,
        bebanKerja: 1100
      },
      {
        id: "ut-badilag-2-3",
        uraian: "Memutakhirkan (input) kalender persidangan, amar putusan, dan riwayat perkara ke dalam database Aplikasi SIPP",
        hasilKerja: "Laporan",
        waktuPenyelesaian: 15,
        bebanKerja: 1100
      },
      {
        id: "ut-badilag-2-4",
        uraian: "Melakukan minutasi berkas perkara pasca putusan dibacakan untuk disiapkan sebagai arsip inkracht",
        hasilKerja: "Berkas",
        waktuPenyelesaian: 90,
        bebanKerja: 350
      }
    ],
    syaratJabatan: {
      pangkatGolongan: "Penata Muda, III/a",
      bakatKerja: ["Q (Ketelitian)", "V (Verbal)", "K (Koordinasi Motorik)"],
      temperamenKerja: ["R (Repetitive and Continuous)", "S (Performing Under Stress)"],
      minatKerja: ["Konvensional", "Investigatif"],
      upayaFisik: ["Duduk", "Melihat", "Bekerja dengan jari"],
      kondisiFisik: "Sehat jasmani dan rohani, tahan mengetik cepat dengan akurasi tinggi."
    }
  },
  {
    id: "jab-badilag-3",
    unitKerjaId: "unit-badilag-2",
    nama: "Jurusita",
    iktisar: "Melaksanakan kejurusitaan berupa penyampaian surat panggilan sidang (Relaas) resmi, menyampaikan pemberitahuan putusan, pencatatan penyitaan objek sengketa, serta membantu pelaksanaan eksekusi putusan di lapangan secara tegas dan sesuai hukum acara.",
    kelasJabatan: 7,
    pegawaiRiil: 2,
    kualifikasi: {
      pendidikanMinimal: "D3 (Diploma-III) / S1",
      jurusan: ["Ilmu Hukum", "Hukum Islam", "Administrasi Publik"],
      pelatihan: "Diklat Jabatan Fungsional Jurusita Peradilan, Diklat Teknik Penyitaan dan Sita Jaminan Lapangan",
      pengalaman: "Minimal 2 tahun bertugas sebagai Jurusita Pengganti"
    },
    uraianTugas: [
      {
        id: "ut-badilag-3-1",
        uraian: "Menyampaikan relaas (surat panggilan sidang) resmi ke domisili tempat tinggal para pihak berperkara",
        hasilKerja: "Surat",
        waktuPenyelesaian: 150, // Perjalanan luar kantor
        bebanKerja: 650
      },
      {
        id: "ut-badilag-3-2",
        uraian: "Menyampaikan surat pemberitahuan resmi isi putusan pengadilan kepada pihak yang absens / tidak hadir sidang",
        hasilKerja: "Surat",
        waktuPenyelesaian: 150,
        bebanKerja: 180
      },
      {
        id: "ut-badilag-3-3",
        uraian: "Melaksanakan pemeriksaan objek sengketa di lapangan (Descente) dan eksekusi sita jaminan bersama Majelis Hakim",
        hasilKerja: "Kegiatan",
        waktuPenyelesaian: 360,
        bebanKerja: 24
      },
      {
        id: "ut-badilag-3-4",
        uraian: "Menyusun draf dokumen Berita Acara Sita Jaminan atau Berita Acara Sita Eksekusi secara legal formal",
        hasilKerja: "Dokumen",
        waktuPenyelesaian: 180,
        bebanKerja: 24
      }
    ],
    syaratJabatan: {
      pangkatGolongan: "Pengatur, II/c",
      bakatKerja: ["V (Verbal)", "G (Inteligensia)", "E (Koordinasi Mata-Tangan-Kaki)"],
      temperamenKerja: ["P (People/Social Contact)", "S (Performing Under Stress)", "R (Repetitive and Continuous)"],
      minatKerja: ["Realistik", "Sosial"],
      upayaFisik: ["Berjalan", "Duduk", "Mengendarai"],
      kondisiFisik: "Sehat jasmani dan rohani, tangguh di lapangan, memiliki SIM aktif."
    }
  },
  {
    id: "jab-badilag-4",
    unitKerjaId: "unit-badilag-3",
    nama: "Analis Perkara Peradilan",
    iktisar: "Melakukan penelaahan berkas perkara penuntutan/gugatan yuridis, menyusun bahan analisis hukum perdata agama (syariah), merinci resume perkara, mengklasifikasi yurisprudensi penting, serta memfasilitasi penyiapan pertimbangan hukum fungsional Majelis Hakim.",
    kelasJabatan: 7,
    pegawaiRiil: 3,
    kualifikasi: {
      pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
      jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah", "Muamalah Jinayat"],
      pelatihan: "Diklat Legal Drafting, Kebijakan Hukum Yudisial, Workshop Kajian Hukum Ekonomi Syariah Badilag",
      pengalaman: "Minimal 1 tahun bekerja di unit hukum atau penelitian yudisial"
    },
    uraianTugas: [
      {
        id: "ut-badilag-4-1",
        uraian: "Mempelajari dan menganalisis syarat formal substantif dokumen gugatan/permohonan perdata agama",
        hasilKerja: "Berkas",
        waktuPenyelesaian: 90,
        bebanKerja: 550
      },
      {
        id: "ut-badilag-4-2",
        uraian: "Menyusun draf resume perkara, analisis hukum terdahulu, dan ringkasan kronologis pokok sengketa",
        hasilKerja: "Naskah",
        waktuPenyelesaian: 180,
        bebanKerja: 550
      },
      {
        id: "ut-badilag-4-3",
        uraian: "Mengklasifikasikan, mencatat, dan mengarsip yurisprudensi putusan perkara perdata agama penting MA-RI",
        hasilKerja: "Laporan",
        waktuPenyelesaian: 240,
        bebanKerja: 12
      },
      {
        id: "ut-badilag-4-4",
        uraian: "Menelaah dan mengonsep surat tanggapan perihal memori banding, memori kasasi, atau peninjauan kembali (PK) pihak beperkara",
        hasilKerja: "Dokumen",
        waktuPenyelesaian: 300,
        bebanKerja: 45
      }
    ],
    syaratJabatan: {
      pangkatGolongan: "Penata Muda, III/a",
      bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
      temperamenKerja: ["T (Set of Limits/Tolerance)", "M (Measurable Criteria)"],
      minatKerja: ["Investigatif", "Konvensional"],
      upayaFisik: ["Duduk", "Melihat", "Membaca"],
      kondisiFisik: "Sehat jasmani dan rohani, daya konsentrasi tinggi, objektif."
    }
  },
  {
    id: "jab-badilag-5",
    unitKerjaId: "unit-badilag-3",
    nama: "Panitera Muda Hukum",
    iktisar: "Memimpin, melaksanakan, dan mengevaluasi kegiatan pengumpulan, pengolahan, dan penyajian data statistik perkara perorangan nasional (LIPA-1 s.d LIPA-24), pengelolaan arsip hukum berkas perkara inkracht, penyuluhan hukum, serta publikasi laporan tahunan Ditjen Badilag.",
    kelasJabatan: 9,
    pegawaiRiil: 1,
    kualifikasi: {
      pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
      jurusan: ["Ilmu Hukum", "Hukum Islam", "Manajemen Hukum", "Sistem Informasi Hukum"],
      pelatihan: "Diklat Fungsional Panitera Muda, Pelatihan Sistem Kearsipan Nasional Digital, Diklat Statistik Kehakiman",
      pengalaman: "Minimal 3 tahun bertugas sebagai Panitera Pengganti Senior"
    },
    uraianTugas: [
      {
        id: "ut-badilag-5-1",
        uraian: "Menghimpun, menyelisik ketelitian, dan menyusun laporan statistika perkara pengadilan perdata agama berkala (bulanan/tahunan)",
        hasilKerja: "Laporan",
        waktuPenyelesaian: 360,
        bebanKerja: 12
      },
      {
        id: "ut-badilag-5-2",
        uraian: "Mengoordinasikan klasifikasi penataan arsip berkas perkara perdata agama yang telah berkekuatan hukum tetap (inkracht)",
        hasilKerja: "Kegiatan",
        waktuPenyelesaian: 120,
        bebanKerja: 52 // Mingguan
      },
      {
        id: "ut-badilag-5-3",
        uraian: "Mengunggah data statistik perkara e-Kinerja nasional ke portal e-Reporting Direktorat Jenderal Mahkamah Agung",
        hasilKerja: "Laporan",
        waktuPenyelesaian: 90,
        bebanKerja: 12
      },
      {
        id: "ut-badilag-5-4",
        uraian: "Menerbitkan surat keterangan kualifikasi formal hukum substantif (surat pengesahan, izin cerai ASN, data perkara)",
        hasilKerja: "Surat",
        waktuPenyelesaian: 30,
        bebanKerja: 950
      },
      {
        id: "ut-badilag-5-5",
        uraian: "Menyusun draf Buku Laporan Tahunan Keadaan Teknis Perkara Direktorat Jenderal Peradilan Agama RI",
        hasilKerja: "Aplikasi",
        waktuPenyelesaian: 480,
        bebanKerja: 1
      }
    ],
    syaratJabatan: {
      pangkatGolongan: "Penata, III/c",
      bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
      temperamenKerja: ["D (Direction, Control, Planning)", "P (People/Social Contact)", "M (Measurable Criteria)"],
      minatKerja: ["Konvensional", "Sosial"],
      upayaFisik: ["Duduk", "Berbicara", "Melihat"],
      kondisiFisik: "Sehat jasmani dan rohani, analitis, rapi, dan komunikatif."
    }
  }
];

export const mockJenisPerkara = [
  {
    id: "jp-1",
    kode: "Pdt.G.01",
    nama: "Cerai Gugat",
    bobotWaktuMenit: 180,
    keterangan: "Gugatan perceraian yang diajukan oleh pihak Istri"
  },
  {
    id: "jp-2",
    kode: "Pdt.G.02",
    nama: "Cerai Talak",
    bobotWaktuMenit: 180,
    keterangan: "Permohonan ikrar talak yang diajukan oleh pihak Suami"
  },
  {
    id: "jp-3",
    kode: "Pdt.G.03",
    nama: "Isbat Nikah",
    bobotWaktuMenit: 120,
    keterangan: "Permohonan pengesahan pernikahan secara syariat Islam dan hukum negara"
  },
  {
    id: "jp-4",
    kode: "Pdt.G.04",
    nama: "Kewarisan / Waris",
    bobotWaktuMenit: 240,
    keterangan: "Sengketa pembagian harta warisan ahli waris beragama Islam"
  },
  {
    id: "jp-5",
    kode: "Pdt.G.05",
    nama: "Ekonomi Syariah",
    bobotWaktuMenit: 300,
    keterangan: "Sengketa akad perbankan syariah, asuransi, atau pegadaian syariah"
  },
  {
    id: "jp-6",
    kode: "Pdt.P.01",
    nama: "Dispensasi Kawin",
    bobotWaktuMenit: 90,
    keterangan: "Permohonan izin menikah bagi calon mempelai di bawah batas usia minimal negara"
  }
];

export const mockDataPerkara = [
  {
    id: "dp-1",
    jenisPerkaraId: "jp-1",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 650,
    jumlahDiputus: 620
  },
  {
    id: "dp-2",
    jenisPerkaraId: "jp-2",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 250,
    jumlahDiputus: 230
  },
  {
    id: "dp-3",
    jenisPerkaraId: "jp-3",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 120,
    jumlahDiputus: 120
  },
  {
    id: "dp-4",
    jenisPerkaraId: "jp-4",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 24,
    jumlahDiputus: 20
  },
  {
    id: "dp-5",
    jenisPerkaraId: "jp-5",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 12,
    jumlahDiputus: 8
  },
  {
    id: "dp-6",
    jenisPerkaraId: "jp-6",
    tahun: 2025,
    bulan: "Semua Bulan (Tahunan)",
    jumlahDiterima: 80,
    jumlahDiputus: 80
  }
];
