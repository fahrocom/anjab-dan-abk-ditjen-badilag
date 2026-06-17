import { UnitKerja, Jabatan } from "../types";

export interface CourtPreset {
  id: string;
  name: string;
  description: string;
  instansiName: string;
  alamatInstansi: string;
  unitKerjaList: UnitKerja[];
  jabatanList: Jabatan[];
}

export const RELIGIOUS_COURTS_PRESETS: CourtPreset[] = [
  {
    id: "pa-kelas-ia",
    name: "Pengadilan Agama Kelas IA (Default Standard)",
    description: "Model satuan kerja tingkat pertama Kelas IA dengan beban perkara tinggi. Ideal untuk simulasi analisis kebutuhan Hakim, Panitera Pengganti, Jurusita, Analis, dan Kesekretariatan.",
    instansiName: "Pengadilan Agama Surabaya Kelas IA",
    alamatInstansi: "Jl. Ketintang Madya No. 3, Ketintang, Kec. Gayungan, Kota Surabaya, Jawa Timur",
    unitKerjaList: [
      {
        id: "pa1-unit-pimpinan",
        nama: "Pimpinan Pengadilan (Ketua, Wakil, & Hakim)",
        kode: "PIM-HAKIM",
        kepalaNama: "Drs. H. Ahmad Mulhin, M.H.",
        kepalaNip: "19680415 199303 1 001"
      },
      {
        id: "pa1-unit-gugat",
        nama: "Kepaniteraan Muda Gugatan",
        kode: "PANMU-GUGAT",
        kepalaNama: "H. Mochammad Syarif, S.H., M.H.",
        kepalaNip: "19710812 199703 1 002"
      },
      {
        id: "pa1-unit-mohon",
        nama: "Kepaniteraan Muda Permohonan",
        kode: "PANMU-MOHON",
        kepalaNama: "Hj. Mutmainnah, S.Ag., M.H.",
        kepalaNip: "19751102 200112 2 001"
      },
      {
        id: "pa1-unit-hukum",
        nama: "Kepaniteraan Muda Hukum & Pengolahan SIPP",
        kode: "PANMU-HUKUM",
        kepalaNama: "Rochmad, S.H.",
        kepalaNip: "19730521 199903 1 003"
      },
      {
        id: "pa1-unit-kepeg",
        nama: "Sub Bagian Kepegawaian, Organisasi, dan Tata Laksana",
        kode: "SUBBAG-KORTALA",
        kepalaNama: "Zulkifli, S.Kom.",
        kepalaNip: "19830214 200904 1 002"
      },
      {
        id: "pa1-unit-umum",
        nama: "Sub Bagian Umum dan Keuangan",
        kode: "SUBBAG-UMUM-KEU",
        kepalaNama: "Fatimah Batubara, S.E.",
        kepalaNip: "19800925 200501 2 004"
      },
      {
        id: "pa1-unit-ptip",
        nama: "Sub Bagian Perencanaan, TI, dan Pelaporan",
        kode: "SUBBAG-PTIP",
        kepalaNama: "Asep Sunandar, S.Si.",
        kepalaNip: "19870705 201101 1 001"
      }
    ],
    jabatanList: [
      {
        id: "pa1-jab-ketua",
        unitKerjaId: "pa1-unit-pimpinan",
        nama: "Ketua Pengadilan Agama (Hakim Utama)",
        iktisar: "Memimpin pelaksanaan tugas pokok pengadilan dalam memeriksa, mengadili, memutus, menyelesaikan perkara, serta mengawasi kelancaran seluruh proses peradilan dan administrasi kesekretariatan.",
        kelasJabatan: 12,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S2 (Strata-2) Hukum / Hukum Islam",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah", "Syariah"],
          pelatihan: "Sertifikasi Hakim Ekonomi Syariah, Sertifikasi Mediator, Diklat Kepemimpinan Tingkat III / PIM III",
          pengalaman: "Minimal 10 tahun sebagai Wakil Ketua Kelas IB atau Kelas IA"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Utama Muda, IV/c",
          bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
          temperamenKerja: ["D (Direction, Control, Planning)", "V (Variety)", "M (Measurable)"],
          minatKerja: ["Konvensional", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara", "Melihat"],
          kondisiFisik: "Sehat jasmani dan rohani, berwibawa tinggi."
        },
        uraianTugas: [
          {
            id: "pa1-ut-ketua-1",
            uraian: "Menetapkan kebijakan strategis peradilan, penetapan pembagian tugas tugas majelis hakim",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 12
          },
          {
            id: "pa1-ut-ketua-2",
            uraian: "Memimpin jalannya persidangan perkara perdata tingkat pertama selaku Ketua Majelis Hakim",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 150
          },
          {
            id: "pa1-ut-ketua-3",
            uraian: "Membaca berkas memori banding/kasasi serta mengevaluasi laporan kelancaran SIPP bulanan",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 90,
            bebanKerja: 52
          }
        ]
      },
      {
        id: "pa1-jab-wakil",
        unitKerjaId: "pa1-unit-pimpinan",
        nama: "Wakil Ketua Pengadilan Agama",
        iktisar: "Membantu Ketua dalam menetapkan arah kebijakan, mengoordinir pengawasan internal bidang teknis peradilan melalui fungsi Koordinator Pengawas (KORWAS), serta bertindak sebagai Hakim Ketua Majelis.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 (Hukum) / S2 Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah"],
          pelatihan: "Sertifikasi Mediator Mahkamah Agung, Diklat Pengawasan Internal Peradilan",
          pengalaman: "Minimal 5 tahun sebagai Hakim Senior di Kelas IA/IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Tingkat I, IV/b",
          bakatKerja: ["G (Inteligensia)", "V (Verbal)"],
          temperamenKerja: ["D (Direction)", "S (Stress)", "M (Measurable)"],
          minatKerja: ["Sosial", "Konvensional"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat jasmani dan rohani."
        },
        uraianTugas: [
          {
            id: "pa1-ut-wakil-1",
            uraian: "Melakukan pemeriksaan berkas perkara banding dan permohonan eksekusi",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 150,
            bebanKerja: 24
          },
          {
            id: "pa1-ut-wakil-2",
            uraian: "Melaksanakan tugas sebagai Hakim Ketua dalam sidang perkara permohonan atau gugatan",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 200
          },
          {
            id: "pa1-ut-wakil-3",
            uraian: "Mengoordinir dan menyusun laporan triwulanan hasil pengawasan hakim pengawas bidang (Hawasbid)",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 240,
            bebanKerja: 4
          }
        ]
      },
      {
        id: "pa1-jab-hakim",
        unitKerjaId: "pa1-unit-pimpinan",
        nama: "Hakim Tingkat Pertama",
        iktisar: "Melaksanakan wewenang peradilan secara independen dalam memeriksa, menyidangkan, meneliti pembuktian hukum, dan menjatuhkan putusan atas perkara sengketa rumah tangga, waris, hibah, wakaf, dan ekonomi syariah.",
        kelasJabatan: 10,
        pegawaiRiil: 12,
        kualifikasi: {
          pendidikanMinimal: "S1 (Strata-1) Syariah / Ilmu Hukum",
          jurusan: ["Syariah", "Ahwal Syakhshiyah", "Perbandingan Mazhab", "Ilmu Hukum"],
          pelatihan: "Pendidikan dan Pelatihan Calon Hakim (PPC), Sertifikasi Ekonomi Syariah, Bimtek SIPP",
          pengalaman: "Minimal 3 tahun menjabat sebagai Hakim Tingkat Pertama Kelas II"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["M", "S", "T"],
          minatKerja: ["Investigatif", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara", "Melihat"],
          kondisiFisik: "Sehat jasmani dan rohani."
        },
        uraianTugas: [
          {
            id: "pa1-ut-hakim-1",
            uraian: "Mendalami perkara sengketa keluarga, waris, atau ekonomi syariah di masa prapersidangan",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 60,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-hakim-2",
            uraian: "Menyidangkan perkara perdata khusus agama selaku Hakim Anggota maupun Hakim Ketua",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-hakim-3",
            uraian: "Merumuskan draf pertimbangan hukum dan naskah Putusan Akhir",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 150,
            bebanKerja: 450
          },
          {
            id: "pa1-ut-hakim-4",
            uraian: "Melakukan verifikasi berkas perkara untuk kepentingan minutasi dan arsip hukum",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 45,
            bebanKerja: 450
          }
        ]
      },
      {
        id: "pa1-jab-panitera",
        unitKerjaId: "pa1-unit-gugat",
        nama: "Panitera (Registrar)",
        iktisar: "Memimpin pelaksanaan tugas kepaniteraan, mengarahkan koordinasi panitera pengganti dan jurusita, serta mengesahkan pelaporan statistik perkara dan penandatanganan Akta Cerai.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Hukum Islam",
          jurusan: ["Ilmu Hukum", "Hukum Syariah", "Peradilan Agama"],
          pelatihan: "Sertifikasi Panitera, Pelatihan Keuangan Perkara SIPP, Manajemen Konflik Peradilan",
          pengalaman: "Minimal 3 tahun bertugas sebagai Panitera Muda di Kelas IA atau Panitera Kelas IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["D", "V", "M"],
          minatKerja: ["Konvensional", "Sosial"],
          upayaFisik: ["Duduk", "Melihat", "Menulis"],
          conditions: "Sehat jasmani rohani."
        } as any,
        uraianTugas: [
          {
            id: "pa1-ut-panitera-1",
            uraian: "Melakukan supervisi, bimbingan teknis dan koordinasi tugas Panitera Pengganti dan Jurusita",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 60,
            bebanKerja: 240
          },
          {
            id: "pa1-ut-panitera-2",
            uraian: "Menandatangani lembar otentifikasi Akta Cerai resmi yang diterbitkan pengadilan",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 10,
            bebanKerja: 1800
          },
          {
            id: "pa1-ut-panitera-3",
            uraian: "Memeriksa dan menandatangani Berita Acara Relaas Panggilan Sidang delegasi luar kota",
            hasilKerja: "Surat",
            waktuPenyelesaian: 15,
            bebanKerja: 900
          },
          {
            id: "pa1-ut-panitera-4",
            uraian: "Mengoordinasi pendaftaran eksekusi riil dan memimpin jalannya penyitaan",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 300,
            bebanKerja: 30
          }
        ]
      },
      {
        id: "pa1-jab-panmudgugat",
        unitKerjaId: "pa1-unit-gugat",
        nama: "Panitera Muda Gugatan",
        iktisar: "Mengoordinasikan pendaftaran perkara gugatan (eceran/e-Court), melaksanakan pembagian pemberitahuan biaya perkara panjar, penginputan nomor perkara gugatan ke SIPP.",
        kelasJabatan: 9,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Diklat Teknis Kepaniteraan Peradilan Agama, Pelatihan e-Court Tingkat Lanjut",
          pengalaman: "Minimal 3 tahun sebagai Panitera Pengganti Senior"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["Q", "V", "G"],
          temperamenKerja: ["R", "M", "S"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat jasmani dan rohani."
        },
        uraianTugas: [
          {
            id: "pa1-ut-panmudg-1",
            uraian: "Melakukan penelaahan berkas permohonan pendaftaran gugatan sengketa perkawinan / ekonomi syariah",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 20,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-panmudg-2",
            uraian: "Verifikasi administrasi pendaftaran gugatan melalui e-Court serta mencocokkan panjar biaya perkara",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 15,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-panmudg-3",
            uraian: "Menyusun draf pembagian berkas perkara e-Court kepada Majelis Hakim dan Panitera Pengganti",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 30,
            bebanKerja: 250
          }
        ]
      },
      {
        id: "pa1-jab-pp",
        unitKerjaId: "pa1-unit-gugat",
        nama: "Panitera Pengganti",
        iktisar: "Mendampingi Majelis Hakim menyidangkan sengketa perkara, mencatat risalah kejadian sidang, menyusun Berita Acara Sidang (BAS) autentik, serta mengunggah amar putusan di SIPP.",
        kelasJabatan: 8,
        pegawaiRiil: 8,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Syariah", "Peradilan Agama"],
          pelatihan: "Diklat Panitera Pengganti, Sertifikasi SIPP Mahkamah Agung",
          pengalaman: "Minimal 1 tahun magang kepaniteraan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["Q", "V", "K"],
          temperamenKerja: ["R", "S"],
          minatKerja: ["Konvensional", "Investigatif"],
          upayaFisik: ["Duduk", "Melihat", "Ketelitian Jari"],
          kondisiFisik: "Sehat jasmani rohani, ketahanan mengetik tinggi."
        },
        uraianTugas: [
          {
            id: "pa1-ut-pp-1",
            uraian: "Mendampingi Hakim dalam jalannya persidangan perkara perdata agama di ruang sidang",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-pp-2",
            uraian: "Menyusun draf tertulis Berita Acara Sidang (BAS) secara autentik pasca sidang selesai",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 150,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-pp-3",
            uraian: "Menginput kalender tunda sidang, panjar perkara tunda, dan sinkronisasi SIPP elektronik harian",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 15,
            bebanKerja: 1400
          },
          {
            id: "pa1-ut-pp-4",
            uraian: "Melakukan pemberkasan minutasi perkara inkracht untuk diserahkan ke Panitera Muda Hukum",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 90,
            bebanKerja: 450
          }
        ]
      },
      {
        id: "pa1-jab-jurusita",
        unitKerjaId: "pa1-unit-gugat",
        nama: "Jurusita Utama",
        iktisar: "Menyampaikan panggilan sidang (Relaas) resmi, pemberitahuan putusan, mencatat penyitaan objek sengketa, melakukan pemanggilan delegasi peradilan.",
        kelasJabatan: 7,
        pegawaiRiil: 3,
        kualifikasi: {
          pendidikanMinimal: "D3 / S1 Semua Jurusan",
          jurusan: ["Hukum", "Syariah", "Administrasi Publik", "Umum"],
          pelatihan: "Diklat Fungsional Jurusita, Diklat Penyitaan Lapangan",
          pengalaman: "Minimal 3 tahun sebagai Jurusita Pengganti"
        },
        syaratJabatan: {
          pangkatGolongan: "Pengatur, II/c",
          bakatKerja: ["V", "G", "E"],
          temperamenKerja: ["P", "S", "R"],
          minatKerja: ["Realistik", "Sosial"],
          upayaFisik: ["Berjalan", "Duduk", "Mengendarai"],
          kondisiFisik: "Prima, memiliki SIM C/A untuk perjalanan dinas luar."
        },
        uraianTugas: [
          {
            id: "pa1-ut-js-1",
            uraian: "Mengantarkan Surat Panggilan Sidang (Relaas) resmi ke alamat domisili pihak Termohon / Tergugat",
            hasilKerja: "Surat",
            waktuPenyelesaian: 180,
            bebanKerja: 900
          },
          {
            id: "pa1-ut-js-2",
            uraian: "Menyampaikan Surat Pemberitahuan Isi Putusan yang dijatuhkan di luar hadirnya pihak (verstek)",
            hasilKerja: "Surat",
            waktuPenyelesaian: 150,
            bebanKerja: 240
          },
          {
            id: "pa1-ut-js-3",
            uraian: "Melaksanakan sita jaminan di lokasi tanah objek sengketa bimbingan majelis hakim",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 360,
            bebanKerja: 24
          }
        ]
      },
      {
        id: "pa1-jab-jsp",
        unitKerjaId: "pa1-unit-gugat",
        nama: "Jurusita Pengganti",
        iktisar: "Membantu Jurusita menyampaikan Relaas pemanggilan, pengumuman hukum, menginput administrasi surat pemanggilan delegasi luar negeri/daerah ke SIPP.",
        kelasJabatan: 6,
        pegawaiRiil: 2,
        kualifikasi: {
          pendidikanMinimal: "SLTA Sederajat",
          jurusan: ["Umum", "Administrasi"],
          pelatihan: "Pelatihan Administrasi Kejurusitaan Dasar",
          pengalaman: "Minimal 2 tahun sebagai staf kepaniteraan"
        },
        syaratJabatan: {
          pangkatGolongan: "Pengatur Muda, II/a",
          bakatKerja: ["V", "Q"],
          temperamenKerja: ["R", "P"],
          minatKerja: ["Realistik", "Sosial"],
          upayaFisik: ["Berjalan", "Duduk", "Mengendarai"],
          kondisiFisik: "Sehat fisik."
        },
        uraianTugas: [
          {
            id: "pa1-ut-jsp-1",
            uraian: "Menyampaikan relaas panggilan sidang di zona daratan dekat kantor pengadilan",
            hasilKerja: "Surat",
            waktuPenyelesaian: 120,
            bebanKerja: 450
          },
          {
            id: "pa1-ut-jsp-2",
            uraian: "Mencatat nomor resi & bukti log surat panggilan resmi pos tercatat pihak luar kota",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 15,
            bebanKerja: 900
          }
        ]
      },
      {
        id: "pa1-jab-panmudmohon",
        unitKerjaId: "pa1-unit-mohon",
        nama: "Panitera Muda Permohonan",
        iktisar: "Mengoordinasi registrasi perkara permohonan (volunter), e-Court dispensasi kawin, wali adhal, isbat nikah, verifikasi berkas permohonan sebelum penetapan majelis.",
        kelasJabatan: 9,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Bimtek Administrasi Kepaniteraan Volunter, Workshop Perlindungan Perempuan & Anak",
          pengalaman: "Minimal 3 tahun menjabat sebagai PP Senior"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["Q", "V"],
          temperamenKerja: ["R", "M"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat jasmani."
        },
        uraianTugas: [
          {
            id: "pa1-ut-panmudm-1",
            uraian: "Menelaah dan menguji syarat administrasi berkas Permohonan Dispensasi Kawin & Isbat Nikah masukan e-Court",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 20,
            bebanKerja: 650
          },
          {
            id: "pa1-ut-panmudm-2",
            uraian: "Mengatur agenda persidangan tunggal perkara dispensasi kawin cepat dalam SIPP",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 15,
            bebanKerja: 650
          }
        ]
      },
      {
        id: "pa1-jab-panmudhukum",
        unitKerjaId: "pa1-unit-hukum",
        nama: "Panitera Muda Hukum",
        iktisar: "Mengelola statistik pengadilan (Aplikasi e-Reporting LIPA-1 s/d LIPA-24), pengelolaan arsip berkas minutasi, pengelolaan website dan sarana informasi publik hukum.",
        kelasJabatan: 9,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Sistem Informasi Hukum"],
          pelatihan: "Diklat Pelaporan Statistik Kehakiman e-Reporting, Standard Kearsipan Berkas Nasional",
          pengalaman: "Minimal 3 tahun sebagai PP Senior"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "Q", "V"],
          temperamenKerja: ["D", "P", "M"],
          minatKerja: ["Konvensional", "Investigatif"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pa1-ut-panmudh-1",
            uraian: "Menghimpun, menyelisik ketelitian data SIPP, dan menyusun laporan bulanan LIPA-1 s/d LIPA-24",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 360,
            bebanKerja: 12
          },
          {
            id: "pa1-ut-panmudh-2",
            uraian: "Melakukan otentifikasi verifikasi salinan putusan legalisir aslinya bagi pencari keadilan",
            hasilKerja: "Surat",
            waktuPenyelesaian: 15,
            bebanKerja: 1800
          },
          {
            id: "pa1-ut-panmudh-3",
            uraian: "Menerima, menyortir, mencatat, dan menata arsip perkara inkracht terminutasi ke Ruang Arsip Negara",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 45,
            bebanKerja: 450
          }
        ]
      },
      {
        id: "pa1-jab-analisperkara",
        unitKerjaId: "pa1-unit-hukum",
        nama: "Analis Perkara Peradilan (APP)",
        iktisar: "Melakukan analisis hukum sengketa yudisial, telaah yuridis memorandum hak asasi, merumuskan resume sengketa perdata ekonomi syariah, dan membantu analisis berkas eksekusi.",
        kelasJabatan: 7,
        pegawaiRiil: 2,
        kualifikasi: {
          pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah", "Muamalah"],
          pelatihan: "Pelatihan Legal Draftsmenship, Diklat Telaahan Yuridis Hakim",
          pengalaman: "Minimal 1 tahun sebagai Analis Hukum"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["T", "M"],
          minatKerja: ["Investigatif", "Konvensional"],
          upayaFisik: ["Duduk", "Melihat", "Membaca"],
          kondisiFisik: "Sehat jasmani dan rohani."
        },
        uraianTugas: [
          {
            id: "pa1-ut-app-1",
            uraian: "Menganalisis dan menelaah gugatan sengketa kepemilikan bernilai kompleks / hukum ekonomi syariah",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 180
          },
          {
            id: "pa1-ut-app-2",
            uraian: "Menyusun ringkasan resume perkara sengketa hukum keluarga guna mempermudah mediasi",
            hasilKerja: "Naskah",
            waktuPenyelesaian: 90,
            bebanKerja: 180
          },
          {
            id: "pa1-ut-app-3",
            uraian: "Menginventarisir dasar yurisprudensi Mahkamah Agung guna mempermudah penyusunan pertimbangan hukum",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 240,
            bebanKerja: 12
          }
        ]
      },
      {
        id: "pa1-jab-kasubbagkepeg",
        unitKerjaId: "pa1-unit-kepeg",
        nama: "Kasubbag Kepegawaian & Ortala",
        iktisar: "Mengatur, menyusun dan mengawasi administrasi urusan kepegawaian (SIMPEG MA-RI, e-Kinerja), usulan kenaikan pangkat (UKP), pensiun, serta penyusunan Dokumen ANJAB-ABK.",
        kelasJabatan: 8,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Semua Jurusan",
          jurusan: ["Administrasi Negara", "Manajemen SDM", "Ilmu Hukum", "Sistem Informasi"],
          pelatihan: "Diklat Teknis Kepegawaian BKN, Bimtek Analisis Jabatan (ANJAB) MenPAN-RB",
          pengalaman: "Minimal 2 tahun menjabat fungsional kepegawaian senior"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["D", "V", "P"],
          minatKerja: ["Sosial", "Konvensional"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pa1-ut-kasubbagk-1",
            uraian: "Menilai sasaran kinerja pegawai (SKP) dan mengajukan berkas usulan kenaikan pangkat / mutasi berkala",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 45,
            bebanKerja: 250
          },
          {
            id: "pa1-ut-kasubbagk-2",
            uraian: "Menyusun draf perencanaan formasi pegawai dan dokumen ANJAB-ABK via SI-ANJAB Elektronik",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 480,
            bebanKerja: 2
          },
          {
            id: "pa1-ut-kasubbagk-3",
            uraian: "Melaksanakan verifikasi rekapitulasi data absensi sidik jari pegawai harian",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 30,
            bebanKerja: 240
          }
        ]
      },
      {
        id: "pa1-jab-analissdm",
        unitKerjaId: "pa1-unit-kepeg",
        nama: "Analis SDM Aparatur",
        iktisar: "Melakukan analisis kompetensi pegawai, penyusunan draf uraian butir tugas fungsional, analisis beban kerja, fasilitasi diklat teknis fungsional.",
        kelasJabatan: 7,
        pegawaiRiil: 2,
        kualifikasi: {
          pendidikanMinimal: "S1 Administrasi Publik / SDM",
          jurusan: ["Administrasi Negara", "Manajemen SDM", "Psikologi", "Hukum"],
          pelatihan: "Bimtek Jabatan Fungsional Analis SDM Aparatur, Penggunaan Aplikasi SIASN",
          pengalaman: "Minimal 1 tahun tugas administrasi kepegawaian"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["M", "T"],
          minatKerja: ["Konvensional", "Sosial"],
          upayaFisik: ["Duduk", "Membaca"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pa1-ut-analiss-1",
            uraian: "Menyusun profil kompetensi jabatan pegawai di lingkungan satuan kerja peradilan",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 40
          },
          {
            id: "pa1-ut-analiss-2",
            uraian: "Menghimpun draf kebutuhan usulan pelatihan pengembangan kompetensi aparatur",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 90,
            bebanKerja: 12
          }
        ]
      },
      {
        id: "pa1-jab-kasubbagumum",
        unitKerjaId: "pa1-unit-umum",
        nama: "Kasubbag Umum dan Keuangan",
        iktisar: "Mengatur urusan rumah tangga dinas, pemeliharaan prasarana gedung kantor pengadilan, inventarisasi Barang Milik Negara (BMN), pengadaan, serta pengelolaan penyerapan DIPA Didelegasikan.",
        kelasJabatan: 8,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Keuangan / Administrasi",
          jurusan: ["Akuntansi", "Manajemen", "Ilmu Hukum", "Sosial Politik"],
          pelatihan: "Diklat KPA (Kuasa Pengguna Anggaran), Sertifikat Pengadaan Barang & Jasa Tingkat Dasar, Aplikasi SIMAN / SAKTI",
          pengalaman: "Minimal 2 tahun menjabat urusan administrasi aset / keuangan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "V", "N"],
          temperamenKerja: ["D", "V", "M"],
          minatKerja: ["Konvensional", "Realistik"],
          upayaFisik: ["Duduk", "Berjalan", "Melihat"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pa1-ut-umumk-1",
            uraian: "Mengatur dan menyetujui surat perintah jalan (SPJ) pengemudi dinas dan biaya BBM rutin kantor",
            hasilKerja: "Surat",
            waktuPenyelesaian: 15,
            bebanKerja: 240
          },
          {
            id: "pa1-ut-umumk-2",
            uraian: "Melakukan otorisasi rekosiliasi laporan Barang Milik Negara (BMN) triwulanan",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 180,
            bebanKerja: 4
          },
          {
            id: "pa1-ut-umumk-3",
            uraian: "Menyusun evaluasi kinerja keandalan sarana fisik (Gedung, Mobil Dinas, Listrik, Pendingin Ruangan)",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 12
          }
        ]
      },
      {
        id: "pa1-jab-kasubbagptip",
        unitKerjaId: "pa1-unit-ptip",
        nama: "Kasubbag Perencanaan, TI, & Pelaporan",
        iktisar: "Mengatur dan menyusun Rencana Kerja Anggaran Kementerian-Lembaga (RKA-KL), pengelolaan jaringan & infrastruktur TI instansi, penyusunan LKjIP, Renstra, dan Laporan Tahunan.",
        kelasJabatan: 8,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Ekonomi / TI / Teknik",
          jurusan: ["Ekonomi Pembangunan", "Akuntansi", "Teknik Informatika", "Manajemen Perencanaan"],
          pelatihan: "Diklat Perencanaan Anggaran Negara (SAKTI), Pelatihan Pelaporan Kinerja Instansi SAKIP, IT Governance",
          pengalaman: "Minimal 2 tahun fungsional perencanaan atau pengelola TI"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "N", "V"],
          temperamenKerja: ["D", "M", "T"],
          minatKerja: ["Konvensional", "Investigatif"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pa1-ut-ptip-1",
            uraian: "Mengonseptualisasikan Rencana Kerja Kerja Anggaran Klimatologi (RKA-KL) pagu indikatif dan pagu definitif",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 480,
            bebanKerja: 4
          },
          {
            id: "pa1-ut-ptip-2",
            uraian: "Melakukan penyusunan Laporan Kinerja Instansi Pemerintah (LKjIP) tahunan instansi",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 480,
            bebanKerja: 1
          },
          {
            id: "pa1-ut-ptip-3",
            uraian: "Menyusun draf monitoring realisasi anggaran (OM-SPAN) penyerapan DIPA 01 dan DIPA 04 bulanan",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 120,
            bebanKerja: 12
          }
        ]
      }
    ]
  },
  {
    id: "pta-bandiing",
    name: "Pengadilan Tinggi Agama (PTA) / Tingkat Banding",
    description: "Satuan kerja tingkat provinsi yang menangani urusan banding yudisial, pengawasan administrasi lingkungan peradilan wilayah hukum propinsi.",
    instansiName: "Pengadilan Tinggi Agama Surabaya",
    alamatInstansi: "Jl. Mayjen Sungkono No. 7, Kec. Dukuhpakis, Kota Surabaya, Jawa Timur",
    unitKerjaList: [
      {
        id: "pta-pimpinan",
        nama: "Pimpinan PTA & Hakim Tinggi",
        kode: "PTA-PIM",
        kepalaNama: "Dr. H. Bahruddin Muhammad, S.H., M.H.",
        kepalaNip: "19621210 198903 1 001"
      },
      {
        id: "pta-banding",
        nama: "Kepaniteraan Banding Yudisial",
        kode: "PTA-PAN-BANDING",
        kepalaNama: "Drs. H. Sudirman, S.H.",
        kepalaNip: "19660505 199103 1 002"
      },
      {
        id: "pta-sekretaris",
        nama: "Sekretariat Pengadilan Tinggi Agama",
        kode: "PTA-SEKRETARIAT",
        kepalaNama: "Nuryadi, S.H.",
        kepalaNip: "19700318 199603 1 005"
      }
    ],
    jabatanList: [
      {
        id: "pta-ht",
        unitKerjaId: "pta-pimpinan",
        nama: "Hakim Tinggi Pengadilan Banding",
        iktisar: "Memeriksa, meneliti pembuktian hukum, menyidangkan, dan menjatuhkan putusan terhadap sengketa tingkat pertama yang dimintakan banding perdata agama.",
        kelasJabatan: 11,
        pegawaiRiil: 6,
        kualifikasi: {
          pendidikanMinimal: "S2 Hukum / Hukum Islam / Syariah",
          jurusan: ["Ilmu Hukum", "Syariah", "Hukum Islam"],
          pelatihan: "Sertifikasi Hakim Tinggi Perdata Khusus, Lokakarya Hakim Agung",
          pengalaman: "Minimal 5 tahun sebagai Ketua Pengadilan Agama Kelas IA"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Utama Muda, IV/c",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["M", "T"],
          minatKerja: ["Investigatif", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pta-ut-ht1",
            uraian: "Menelaah dokumen pertimbangan hukum putusan tingkat pertama sengketa banding",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 400
          },
          {
            id: "pta-ut-ht2",
            uraian: "Memimpin pelaksanaan musyawarah ucapan putusan hakim tinggi tingkat banding",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 90,
            bebanKerja: 400
          },
          {
            id: "pta-ut-ht3",
            uraian: "Menandatangani draf resmi Salinan Putusan Banding",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 45,
            bebanKerja: 400
          }
        ]
      },
      {
        id: "pta-ppbanding",
        unitKerjaId: "pta-banding",
        nama: "Panitera Pengganti Tingkat Banding",
        iktisar: "Mendampingi Hakim Tinggi menyidangkan sengketa tingkat banding, menyusun Berita Acara Sidang banding, melakukan minutasi berkas banding SIPP.",
        kelasJabatan: 9,
        pegawaiRiil: 4,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Diklat PP Tingkat Banding Mahkamah Agung",
          pengalaman: "Minimal 3 tahun bertugas sebagai PP di PA Kelas IA"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["Q", "V"],
          temperamenKerja: ["R", "S"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat."
        },
        uraianTugas: [
          {
            id: "pta-ut-pp1",
            uraian: "Mengoreksi kelengkapan administrasi bundel A dan bundel B sengketa banding dari tingkat pertama",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 90,
            bebanKerja: 350
          },
          {
            id: "pta-ut-pp2",
            uraian: "Menginput amar putusan banding ke portal SIPP Tingkat Banding",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 15,
            bebanKerja: 350
          }
        ]
      }
    ]
  },
  {
    id: "ditjen-badilag-pusat",
    name: "Direktorat Jenderal Badan Peradilan Agama (Pusat Eselon I)",
    description: "Model unit kerja birokrasi pembinaan teknis, manajemen, dan pemetaan SDM peradilan agama tingkat nasional di lingkungan Mahkamah Agung RI.",
    instansiName: "Direktorat Jenderal Badan Peradilan Agama MA-RI",
    alamatInstansi: "Gedung Sekretariat Mahkamah Agung RI, Blok C Lt. 6, Cempaka Putih, Jakarta Pusat",
    unitKerjaList: [
      {
        id: "bdl-unit-direktorat",
        nama: "Direktorat Pembinaan Tenaga Teknis Peradilan Agama",
        kode: "DIT-BINTEN",
        kepalaNama: "Dr. H. Candra Boyero, S.H., M.H.",
        kepalaNip: "19750318 199903 1 002"
      },
      {
        id: "bdl-unit-sekretariat",
        nama: "Sekretariat Direktorat Jenderal",
        kode: "SEKRET-DJBU",
        kepalaNama: "Drs. H. Arief Hidayat, S.H., M.M.",
        kepalaNip: "19690112 199503 1 001"
      }
    ],
    jabatanList: [
      {
        id: "bdl-jab-dirjen",
        unitKerjaId: "bdl-unit-direktorat",
        nama: "Direktur Jenderal Badan Peradilan Agama (Badilag)",
        iktisar: "Merumuskan serta melaksanakan kebijakan teknis standardisasi administrasi peradilan agama nasional, pembinaan tenaga teknis hakim, kepaniteraan, urusan pranata syariah.",
        kelasJabatan: 16,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S3 (Doktor) Hukum / Hukum Islam",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Syariah"],
          pelatihan: "Diklat Pim Tingkat I, Sertifikat Kompetensi Eksekutif Peradilan Hukum MA-RI",
          pengalaman: "Minimal 3 tahun bertugas sebagai Ketua PTA atau Direktur Pembinaan Teknis"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Utama, IV/e",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["D", "J font"],
          minatKerja: ["Sosial"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Tangguh."
        } as any,
        uraianTugas: [
          {
            id: "bdl-ut-dirjen1",
            uraian: "Menandatangani regulasi ketetapan Surat Keputusan Dirjen perihal petunjuk teknis peradilan agama",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 24
          },
          {
            id: "bdl-ut-dirjen2",
            uraian: "Mengadakan rapat pimpinan nasional (RAPIMNAS) koordinasi kualitas SDM fungsional",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 240,
            bebanKerja: 12
          }
        ]
      }
    ]
  },
  {
    id: "pa-kelas-ia-khusus",
    name: "Pengadilan Agama Kelas IA Khusus",
    description: "Model satuan kerja Tingkat Pertama kelas IA Khusus. Memiliki volume perkara ekstrem (beban perkara tahunan di atas 5.000 perkara), jumlah Hakim besar, serta formasi Panitera Pengganti dan Jurusita yang masif.",
    instansiName: "Pengadilan Agama Jakarta Selatan Kelas IA Khusus",
    alamatInstansi: "Jl. Terusan Al-Busyro No. 1, Cilandak, Jakarta Selatan, DKI Jakarta",
    unitKerjaList: [
      {
        id: "pax-unit-pimpinan",
        nama: "Pimpinan Pengadilan & Kelompok Hakim Utama",
        kode: "PIM-HAKIM-X",
        kepalaNama: "Dr. H. Rusdianto, S.H., M.H.",
        kepalaNip: "19661214 199103 1 001"
      },
      {
        id: "pax-unit-gugat",
        nama: "Kepaniteraan Muda Gugatan",
        kode: "PANMU-GUGAT-X",
        kepalaNama: "H. Abdul Wahab, S.H., M.H.",
        kepalaNip: "19690812 199503 1 005"
      },
      {
        id: "pax-unit-mohon",
        nama: "Kepaniteraan Muda Permohonan",
        kode: "PANMU-MOHON-X",
        kepalaNama: "Hj. Ratna Sari, S.H., M.S.I.",
        kepalaNip: "19741005 200012 2 003"
      },
      {
        id: "pax-unit-hukum",
        nama: "Kepaniteraan Muda Hukum & Layanan e-Court",
        kode: "PANMU-HUKUM-X",
        kepalaNama: "Syamsuddin, S.H., M.H.",
        kepalaNip: "19720521 199803 1 004"
      },
      {
        id: "pax-unit-kepeg",
        nama: "Sub Bagian Kepegawaian, Organisasi, dan Tata Laksana",
        kode: "SUBBAG-KORTALA-X",
        kepalaNama: "Hendrik, S.Kom., M.M.",
        kepalaNip: "19820412 200801 1 002"
      },
      {
        id: "pax-unit-umum",
        nama: "Sub Bagian Umum dan Keuangan",
        kode: "SUBBAG-UMUM-X",
        kepalaNama: "Rini Astuti, S.E., M.Si.",
        kepalaNip: "19790915 200312 2 001"
      },
      {
        id: "pax-unit-ptip",
        nama: "Sub Bagian Perencanaan, TI, dan Pelaporan",
        kode: "SUBBAG-PTIP-X",
        kepalaNama: "Dian Pratama, S.Si.",
        kepalaNip: "19880110 201012 1 003"
      }
    ],
    jabatanList: [
      {
        id: "pax-jab-ketua",
        unitKerjaId: "pax-unit-pimpinan",
        nama: "Ketua Pengadilan Agama Kelas IA Khusus (Hakim Utama)",
        iktisar: "Memimpin pelaksanaan tugas teknis yustisial dan administrasi di Pengadilan Agama Kelas IA Khusus dengan beban perkara ekstrem, melakukan pengawasan melekat, serta memimpin sidang perkara penting.",
        kelasJabatan: 12,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S2 (Strata-2) Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Syariah"],
          pelatihan: "Sertifikasi Hakim Ekonomi Syariah, Diklat PIM III, Sertifikasi Hakim Mediator",
          pengalaman: "Minimal 3 tahun menjabat sebagai Wakil Ketua Kelas IA Khusus atau 5 tahun Ketua Kelas IA"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Utama Madya, IV/d",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["D", "V", "M"],
          minatKerja: ["Konvensional", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Prima"
        },
        uraianTugas: [
          {
            id: "pax-ut-ketua-1",
            uraian: "Menetapkan arah kebijakan strategis pelayanan pengadilan dan penuntasan akumulasi perkara",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 12
          },
          {
            id: "pax-ut-ketua-2",
            uraian: "Memimpin persidangan perkara perdata tingkat pertama dengan kategori sengketa kompleks",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 200
          }
        ]
      },
      {
        id: "pax-jab-wakil",
        unitKerjaId: "pax-unit-pimpinan",
        nama: "Wakil Ketua Pengadilan Agama Kelas IA Khusus",
        iktisar: "Membantu Ketua mengoordinasikan pengawasanHawasbid, memimpin jalannya manajemen kualitas mutu pengadilan (APM/ZI), serta menyidangkan perkara.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S2 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Sertifikasi Mediator, Sertifikasi Hakim Anak, Diklat Pengawasan",
          pengalaman: "Minimal 2 tahun menjabat sebagai Ketua Kelas IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Utama Muda, IV/c",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["D", "S", "M"],
          minatKerja: ["Sosial", "Konvensional"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-wakil-1",
            uraian: "Melakukan fungsi pengawasan internal rutin terhadap integritas aparatur peradilan",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 150,
            bebanKerja: 4
          },
          {
            id: "pax-ut-wakil-2",
            uraian: "Melaksanakan sidang yustisial penanganan gugatan waris/ekonomi syariah",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 180
          }
        ]
      },
      {
        id: "pax-jab-hakim",
        unitKerjaId: "pax-unit-pimpinan",
        nama: "Hakim Tingkat Pertama (Kelas IA Khusus)",
        iktisar: "Memeriksa, mengadili, dan memutus perkara gugatan/permohonan secara mandiri dan profesional dalam majelis hakim di lingkungan peradilan kelas IA Khusus.",
        kelasJabatan: 11,
        pegawaiRiil: 24,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Hukum Islam",
          jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah"],
          pelatihan: "DIKLAT Sertifikasi Hakim, Diklat SIPP, Bimtek Mediasi",
          pengalaman: "Anak tangga Hakim Kelas IA/IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Tingkat I, IV/b",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["M", "S", "T"],
          minatKerja: ["Investigatif", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-hakim-1",
            uraian: "Menyelenggarakan persidangan sengketa pendaftaran cerai gugat/talak",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 2400
          },
          {
            id: "pax-ut-hakim-2",
            uraian: "Menyusun draf kajian dan merumuskan Putusan/Penetapan Akhir",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 800
          }
        ]
      },
      {
        id: "pax-jab-panitera",
        unitKerjaId: "pax-unit-gugat",
        nama: "Panitera Kelas IA Khusus",
        iktisar: "Mengoordinasikan dan mengawasi administrasi kepaniteraan peradilan, merawat keterbacaan register perkara, dan menandatangani akta otentik.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Sertifikasi Panitera, Diklat SIPP Terpadu",
          pengalaman: "Anak tangga Panitera Kelas IA/IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Upaya Muda, IV/c",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["D", "V", "M"],
          minatKerja: ["Konvensional", "Management"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-panitera-1",
            uraian: "Melakukan pengawasan ketertiban register perkara fisik dan elektronik",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 60,
            bebanKerja: 250
          },
          {
            id: "pax-ut-panitera-2",
            uraian: "Menandatangani lembar legalisasi akta perceraian",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 10,
            bebanKerja: 3500
          }
        ]
      },
      {
        id: "pax-jab-panmud-gugat",
        unitKerjaId: "pax-unit-gugat",
        nama: "Panitera Muda Gugatan",
        iktisar: "Melakukan registrasi, verifikasi gugat e-Court, memantau panjar biaya perkara gugatan, serta menertibkan SIPP gugat.",
        kelasJabatan: 9,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Bimtek Administrasi Kepaniteraan",
          pengalaman: "Mantap fungsional kepaniteraan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "Q"],
          temperamenKerja: ["V", "S"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-pmg-1",
            uraian: "Menginput gugatan terdaftar ke sistem elektronik pengadilan SIPP",
            hasilKerja: "Laporan",
            waktuPenyelesaian: 30,
            bebanKerja: 4500
          }
        ]
      },
      {
        id: "pax-jab-panitera-pengganti",
        unitKerjaId: "pax-unit-gugat",
        nama: "Panitera Pengganti (Kelas IA Khusus)",
        iktisar: "Mendampingi Majelis Hakim bersidang, merekam jalannya persidangan, menyusun Berita Acara Sidang (BAS), serta melakukan minutasi berkas.",
        kelasJabatan: 9,
        pegawaiRiil: 20,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum / Syariah",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Diklat Calon Panitera Pengganti",
          pengalaman: "Pengalaman kepaniteraan yustisial"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda Tingkat I, III/b",
          bakatKerja: ["G", "V", "Q"],
          temperamenKerja: ["S", "T", "V"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Menulis", "Melihat"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-pp-1",
            uraian: "Menyusun Berita Acara Sidang (BAS) resmi yang berkekuatan yudisial",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 480
          },
          {
            id: "pax-ut-pp-2",
            uraian: "Melakukan unggah e-Doc berkas minutasi SIPP",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 20,
            bebanKerja: 480
          }
        ]
      },
      {
        id: "pax-jab-jurusita",
        unitKerjaId: "pax-unit-gugat",
        nama: "Jurusita",
        iktisar: "Melaksanakan pemanggilan sidang kejurusitaan, menyampaikan pengumuman/pemberitahuan putusan, melakukan sita jaminan, dan mengeksekusi lahan.",
        kelasJabatan: 7,
        pegawaiRiil: 12,
        kualifikasi: {
          pendidikanMinimal: "Diploma III atau SLTA Sederajat",
          jurusan: ["Sosial", "Hukum", "Umum"],
          pelatihan: "Diklat Kejurusitaan, Sertifikasi Jurusita MA-RI",
          pengalaman: "Bekerja di pengadilan minimal 5 tahun"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["V", "Q"],
          temperamenKerja: ["R", "S"],
          minatKerja: ["Sosial", "Konvensional"],
          upayaFisik: ["Berjalan", "Berbicara"],
          kondisiFisik: "Tangguh, fisik kuat luar lapangan."
        },
        uraianTugas: [
          {
            id: "pax-ut-js-1",
            uraian: "Menyampaikan relas surat panggilan sidang secara langsung atau berkoordinasi dengan kelurahan/kehutanan setempat",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 180,
            bebanKerja: 750
          }
        ]
      },
      {
        id: "pax-jab-sekretaris",
        unitKerjaId: "pax-unit-sekretaris",
        nama: "Sekretaris (Eselon III/b)",
        iktisar: "Memimpin pelaksanaan administrasi kesekretariatan, mengarahkan urusan kepegawaian, pengelolaan BMN, anggaran DIPA 01 dan 04, serta teknologi informasi.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1/S2 Administrasi / Ekonomi / Hukum",
          jurusan: ["Administrasi Negara", "Manajemen", "Ilmu Hukum"],
          pelatihan: "Diklat PIM III, Pelatihan Pengelola Keuangan Negara",
          pengalaman: "Menjabat Kabag atau Kasubbag minimal 3 tahun"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["D", "M"],
          minatKerja: ["Management", "Sosial"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pax-ut-sek-1",
            uraian: "Mengatur arah DIPA anggaran operasional pengadilan",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 12
          }
        ]
      }
    ]
  },
  {
    id: "pa-kelas-ib",
    name: "Pengadilan Agama Kelas IB",
    description: "Model satuan kerja Tingkat Pertama kelas IB dengan volume perkara sedang (beban perkara tahunan berkisar 1.500 - 3.000 perkara). Pola penataan jabatan ramping serta beban kerja proporsional.",
    instansiName: "Pengadilan Agama Pekanbaru Kelas IB",
    alamatInstansi: "Jl. Jend. Sudirman No. 192, Simpang Tiga, Kec. Bukit Raya, Kota Pekanbaru, Riau",
    unitKerjaList: [
      {
        id: "pab-unit-pimpinan",
        nama: "Pimpinan & Korps Hakim Pertama",
        kode: "PIM-HAKIM-B",
        kepalaNama: "H. Syaifuddin, S.H., M.H.",
        kepalaNip: "19700511 199603 1 002"
      },
      {
        id: "pab-unit-kepaniteraan",
        nama: "Kepaniteraan (Gugat, Mohon, Hukum)",
        kode: "KEPAN-B",
        kepalaNama: "M. Zaelani, S.H.",
        kepalaNip: "19750421 200212 1 001"
      },
      {
        id: "pab-unit-kesekretariatan",
        nama: "Kesekretariatan (Kepeg, Umum, PTIP)",
        kode: "SEKRET-B",
        kepalaNama: "Eko Setyawan, S.E.",
        kepalaNip: "19830530 200904 1 001"
      }
    ],
    jabatanList: [
      {
        id: "pab-jab-ketua",
        unitKerjaId: "pab-unit-pimpinan",
        nama: "Ketua Pengadilan Agama Kelas IB",
        iktisar: "Memimpin operasional pengadilan tingkat pertama kelas IB dan mensertifikasi tugas pelaksanaan eksekusi secara tertib.",
        kelasJabatan: 11,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Sertifikasi Mediator, Diklat PIM III",
          pengalaman: "Wakil Ketua Kelas IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina Tingkat I, IV/b",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["D", "M"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Berbicara"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pab-ut-ketua-1",
            uraian: "Menerbitkan lembar disposisi penentuan tugas pembagian perkara majelis",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 60,
            bebanKerja: 12
          }
        ]
      },
      {
        id: "pab-jab-hakim",
        unitKerjaId: "pab-unit-pimpinan",
        nama: "Hakim Tingkat Pertama (Kelas IB)",
        iktisar: "Menyidangkan sengketa rumah tangga dan mengadili warisan serta gugatan ekonomi syariah secara netral.",
        kelasJabatan: 10,
        pegawaiRiil: 8,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Diklat Mediator, Diklat Calon Hakim",
          pengalaman: "Judge di Kelas II"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["S", "M"],
          minatKerja: ["Investigatif"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pab-ut-hakim-1",
            uraian: "Melaksanakan persidangan sengketa perkawinan di kelas IB",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 1100
          }
        ]
      },
      {
        id: "pab-jab-panitera",
        unitKerjaId: "pab-unit-kepaniteraan",
        nama: "Panitera Kelas IB",
        iktisar: "Memimpin urusan penjaminan administrasi yudisial, mengurus register perkawa, dan menandatangani otentifikasi peradilan.",
        kelasJabatan: 10,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum"],
          pelatihan: "Sertifikasi Panitera",
          pengalaman: "Panmud Kelas IA"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "Q"],
          temperamenKerja: ["D", "V"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pab-ut-pan-1",
            uraian: "Menandatangani lembar pengesahan register berkas perceraian",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 10,
            bebanKerja: 1950
          }
        ]
      },
      {
        id: "pab-jab-panitera-pengganti",
        unitKerjaId: "pab-unit-kepaniteraan",
        nama: "Panitera Pengganti (Kelas IB)",
        iktisar: "Mendampingi Majelis Hakim, menyusun Berita Acara Sidang (BAS) Kelas IB, serta memasukkan berkas putusan ke SIPP.",
        kelasJabatan: 8,
        pegawaiRiil: 8,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum"],
          pelatihan: "Diklat CPP",
          pengalaman: "Fungsional di pengadilan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda Tingkat I, III/b",
          bakatKerja: ["G", "Q"],
          temperamenKerja: ["S"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk", "Melihat"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pab-ut-pp-1",
            uraian: "Menulis materi ringkasan Berita Acara Sidang (BAS)",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 280
          }
        ]
      },
      {
        id: "pab-jab-jurusita",
        unitKerjaId: "pab-unit-kepaniteraan",
        nama: "Jurusita Kelas IB",
        iktisar: "Menjalankan reli surat panggilan resmi pengadilan serta menyitadakan dokumen.",
        kelasJabatan: 6,
        pegawaiRiil: 4,
        kualifikasi: {
          pendidikanMinimal: "SLTA/D3",
          jurusan: ["Umum", "Hukum"],
          pelatihan: "Pelatihan Jurusita",
          pengalaman: "Staf pengadilan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["V"],
          temperamenKerja: ["R"],
          minatKerja: ["Sosial"],
          upayaFisik: ["Berjalan"],
          kondisiFisik: "Tangguh"
        },
        uraianTugas: [
          {
            id: "pab-ut-js-1",
            uraian: "Menyampaikan surat relas panggilan sidang cerai",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 150,
            bebanKerja: 620
          }
        ]
      }
    ]
  },
  {
    id: "pa-kelas-ii",
    name: "Pengadilan Agama Kelas II",
    description: "Model satuan kerja Tingkat Pertama kelas II (ukuran terkecil, biasanya berlokasi di ibukota kabupaten baru). Volume perkara rendah (di bawah 1.000 perkara per tahun), struktur organisasi ramping, multi-tasking.",
    instansiName: "Pengadilan Agama Badung Kelas II",
    alamatInstansi: "Jl. Bypass Ngurah Rai No. 84, Tuban, Kuta, Kabupaten Badung, Bali",
    unitKerjaList: [
      {
        id: "pa2-unit-pimpinan",
        nama: "Pimpinan & Korps Hakim Minimalis",
        kode: "PIM-HAKIM-II",
        kepalaNama: "Muhammad Yusuf, S.H.I., M.H.",
        kepalaNip: "19780612 200501 1 002"
      },
      {
        id: "pa2-unit-kepaniteraan",
        nama: "Struktur Kepaniteraan Terpadu",
        kode: "KEPAN-II",
        kepalaNama: "Dewi Aminah, S.H.",
        kepalaNip: "19800412 200604 2 001"
      },
      {
        id: "pa2-unit-kesekretariatan",
        nama: "Urusan Kesekretariatan Bersama",
        kode: "SEKRET-II",
        kepalaNama: "Budi Santoso, S.Sos.",
        kepalaNip: "19851025 201101 1 003"
      }
    ],
    jabatanList: [
      {
        id: "pa2-jab-ketua",
        unitKerjaId: "pa2-unit-pimpinan",
        nama: "Ketua Pengadilan Agama Kelas II",
        iktisar: "Memimpin pelaksanaan tugas pokok pengadilan kelas II, memimpin persidangan, merencanakan realisasi operasional.",
        kelasJabatan: 10,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum", "Hukum Islam"],
          pelatihan: "Sertifikasi Hakim, Bimtek SIPP",
          pengalaman: "Hakim Kelas IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Pembina, IV/a",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["D", "M"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pa2-ut-ketua-1",
            uraian: "Melakukan pengawasan internal terhadap program kerja draf tahunan",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 120,
            bebanKerja: 4
          }
        ]
      },
      {
        id: "pa2-jab-hakim",
        unitKerjaId: "pa2-unit-pimpinan",
        nama: "Hakim Anggota Kelas II",
        iktisar: "Menyelidiki bukti penanganan sengketa serta memutus perkara perceraian atau waris sengketa di kelas II.",
        kelasJabatan: 9,
        pegawaiRiil: 3,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum"],
          pelatihan: "Diklat Calon Hakim",
          pengalaman: "Analis calon hakim"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata, III/c",
          bakatKerja: ["G", "V"],
          temperamenKerja: ["S", "M"],
          minatKerja: ["Investigatif"],
          upayaFisik: ["Duduk"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pa2-ut-hakim-1",
            uraian: "Melaksanakan proses pemeriksaan dan pemutusan perkara sengketa",
            hasilKerja: "Kegiatan",
            waktuPenyelesaian: 180,
            bebanKerja: 450
          }
        ]
      },
      {
        id: "pa2-jab-panitera",
        unitKerjaId: "pa2-unit-kepaniteraan",
        nama: "Panitera Kelas II",
        iktisar: "Mengurus jalannya administrasi Register Perkara pengadilan Agama kelas II secara manual dan melalui instrumen SIPP.",
        kelasJabatan: 9,
        pegawaiRiil: 1,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum"],
          pelatihan: "Sertifikasi Panitera",
          pengalaman: "Panitera Pengganti Kelas IB"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Tingkat I, III/d",
          bakatKerja: ["G", "Q"],
          temperamenKerja: ["V"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pa2-ut-pan-1",
            uraian: "Melakukan otentifikasi dan validasi administrasi penetapan atau akta cerai",
            hasilKerja: "Dokumen",
            waktuPenyelesaian: 10,
            bebanKerja: 650
          }
        ]
      },
      {
        id: "pa2-jab-panitera-pengganti",
        unitKerjaId: "pa2-unit-kepaniteraan",
        nama: "Panitera Pengganti Kelas II",
        iktisar: "Membantu persidangan dan meminutasi berkas perkara pengadilan kelas II.",
        kelasJabatan: 7,
        pegawaiRiil: 3,
        kualifikasi: {
          pendidikanMinimal: "S1 Hukum",
          jurusan: ["Ilmu Hukum"],
          pelatihan: "Bimtek Kepaniteraan",
          pengalaman: "Staf pengadilan"
        },
        syaratJabatan: {
          pangkatGolongan: "Penata Muda, III/a",
          bakatKerja: ["G", "Q"],
          temperamenKerja: ["S"],
          minatKerja: ["Konvensional"],
          upayaFisik: ["Duduk"],
          kondisiFisik: "Sehat"
        },
        uraianTugas: [
          {
            id: "pa2-ut-pp-1",
            uraian: "Mencatat persidangan dan menyusun Berita Acara Sidang (BAS)",
            hasilKerja: "Berkas",
            waktuPenyelesaian: 120,
            bebanKerja: 190
          }
        ]
      }
    ]
  }
];

