import React, { useState } from "react";
import { Jabatan, UnitKerja } from "../types";
import { 
  BookOpen, 
  Settings, 
  HelpCircle, 
  FileText, 
  Plus, 
  Check, 
  Copy, 
  Briefcase, 
  Info, 
  Clock, 
  Download,
  Flame,
  CheckCircle,
  FileCode,
  AlertCircle
} from "lucide-react";

interface TemplateTabProps {
  unitKerjaList: UnitKerja[];
  onAddJabatan: (jab: Omit<Jabatan, "id">) => void;
}

interface TemplateData {
  nama: string;
  iktisar: string;
  kelasJabatan: number;
  pegawaiRiil: number;
  kualifikasi: {
    pendidikanMinimal: string;
    jurusan: string[];
    pelatihan: string;
    pengalaman: string;
  };
  syaratJabatan: {
    pangkatGolongan: string;
    bakatKerja: string[];
    temperamenKerja: string[];
    minatKerja: string[];
    upayaFisik: string[];
    kondisiFisik: string;
  };
  uraianTugas: {
    uraian: string;
    hasilKerja: string;
    waktuPenyelesaian: number;
    bebanKerja: number;
  }[];
}

export default function TemplateTab({ unitKerjaList, onAddJabatan }: TemplateTabProps) {
  const [subTab, setSubTab] = useState<"pedoman" | "templates">("templates");
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState<number>(0);
  const [targetUnitId, setTargetUnitId] = useState<string>(unitKerjaList[0]?.id || "");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedTextIdx, setCopiedTextIdx] = useState<number | null>(null);

  // Official Templates for Tenaga Teknis Kepaniteraan Mahkamah Agung RI 
  const kepaniteraanTemplates: TemplateData[] = [
    {
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
      syaratJabatan: {
        pangkatGolongan: "Pembina, IV/a",
        bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
        temperamenKerja: ["D (Direction, Control, Planning)", "V (Variety of Duties)", "M (Measurable Criteria)"],
        minatKerja: ["Konvensional", "Sosial"],
        upayaFisik: ["Duduk", "Berbicara", "Melihat"],
        kondisiFisik: "Sehat jasmani dan rohani, berwibawa, ketelitian tinggi."
      },
      uraianTugas: [
        {
          uraian: "Mengatur, mengoordinasikan, dan memantau status pendaftaran berkas gugatan dan permohonan melalui sistem e-Court",
          hasilKerja: "Laporan Analisis Data",
          waktuPenyelesaian: 90,
          bebanKerja: 52
        },
        {
          uraian: "Melakukan verifikasi, otentikasi data, dan menandatangani dokumen Akta Cerai yang telah diterbitkan",
          hasilKerja: "Dokumen Hukum",
          waktuPenyelesaian: 15,
          bebanKerja: 1200
        },
        {
          uraian: "Melakukan supervisi, pengawasan fungsional, dan evaluasi kinerja harian Panitera Pengganti dan Jurusita",
          hasilKerja: "Laporan Hasil Evaluasi",
          waktuPenyelesaian: 45,
          bebanKerja: 250
        },
        {
          uraian: "Memeriksa dan menyetujui pelaporan keuangan biaya perkara (LIPA-7) secara periodik bulanan",
          hasilKerja: "Dokumen Laporan Keuangan",
          waktuPenyelesaian: 120,
          bebanKerja: 12
        },
        {
          uraian: "Memimpin pelaksanaan eksekusi putusan yang sudah berkekuatan hukum tetap (Inkracht)",
          hasilKerja: "Laporan Eksekusi",
          waktuPenyelesaian: 360,
          bebanKerja: 20
        }
      ]
    },
    {
      nama: "Panitera Pengganti",
      iktisar: "Mendampingi Hakim dalam mengikuti jalannya persidangan perkara, mencatat segala kejadian di sidang secara cermat, menyusun Berita Acara Sidang (BAS) resmi yang berkekuatan hukum, serta menginput data mutasi perkara ke dalam SIPP.",
      kelasJabatan: 8,
      pegawaiRiil: 5,
      kualifikasi: {
        pendidikanMinimal: "S1 (Strata-1) Hukum / Syariah",
        jurusan: ["Ilmu Hukum", "Hukum Islam", "Ahwal Syakhshiyah", "Muamalah"],
        pelatihan: "Diklat Fungsional Panitera Pengganti, Bimtek Pengisian BAS Elektronik dan SIPP Mahkamah Agung",
        pengalaman: "Minimal 1 tahun magang di pengadilan atau bertugas di unit administrasi perkara"
      },
      syaratJabatan: {
        pangkatGolongan: "Penata Muda, III/a",
        bakatKerja: ["Q (Ketelitian)", "V (Verbal)", "K (Koordinasi Motorik)"],
        temperamenKerja: ["R (Repetitive and Continuous)", "S (Performing Under Stress)"],
        minatKerja: ["Konvensional", "Investigatif"],
        upayaFisik: ["Duduk", "Melihat", "Bekerja dengan jari"],
        kondisiFisik: "Sehat jasmani dan rohani, tahan mengetik cepat dengan akurasi tinggi."
      },
      uraianTugas: [
        {
          uraian: "Mengikuti dan mendampingi Majelis Hakim dalam jalannya persidangan perkara perdata agama (Nikah, Rujuk, Waris, dsb)",
          hasilKerja: "Catatan Sidang",
          waktuPenyelesaian: 180,
          bebanKerja: 1100
        },
        {
          uraian: "Menulis dan merumuskan Berita Acara Sidang (BAS) pasca persidangan secara sistematis dan autentik",
          hasilKerja: "Dokumen BAS",
          waktuPenyelesaian: 120,
          bebanKerja: 1100
        },
        {
          uraian: "Memutakhirkan (input) kalender persidangan, amar putusan, dan riwayat perkara ke dalam database Aplikasi SIPP",
          hasilKerja: "Data Entri Sistem",
          waktuPenyelesaian: 15,
          bebanKerja: 1100
        },
        {
          uraian: "Melakukan minutasi berkas perkara pasca putusan dibacakan untuk disiapkan sebagai arsip inkracht",
          hasilKerja: "Berkas Minutasi",
          waktuPenyelesaian: 90,
          bebanKerja: 350
        }
      ]
    },
    {
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
      syaratJabatan: {
        pangkatGolongan: "Pengatur, II/c",
        bakatKerja: ["V (Verbal)", "G (Inteligensia)", "E (Koordinasi Mata-Tangan-Kaki)"],
        temperamenKerja: ["P (People/Social Contact)", "S (Performing Under Stress)", "R (Repetitive and Continuous)"],
        minatKerja: ["Realistik", "Sosial"],
        upayaFisik: ["Berjalan", "Duduk", "Mengendarai"],
        kondisiFisik: "Sehat jasmani dan rohani, tangguh di lapangan, memiliki SIM aktif."
      },
      uraianTugas: [
        {
          uraian: "Menyampaikan relaas (surat panggilan sidang) resmi ke domisili tempat tinggal para pihak berperkara",
          hasilKerja: "Dokumen Relaas Panggilan",
          waktuPenyelesaian: 150,
          bebanKerja: 650
        },
        {
          uraian: "Menyampaikan surat pemberitahuan resmi isi putusan pengadilan kepada pihak yang absens / tidak hadir sidang",
          hasilKerja: "Dokumen Pemberitahuan",
          waktuPenyelesaian: 150,
          bebanKerja: 180
        },
        {
          uraian: "Melaksanakan pemeriksaan objek sengketa di lapangan (Descente) dan eksekusi sita jaminan bersama Majelis Hakim",
          hasilKerja: "Laporan Hasil Pemeriksaan",
          waktuPenyelesaian: 360,
          bebanKerja: 24
        },
        {
          uraian: "Menyusun draf dokumen Berita Acara Sita Jaminan atau Berita Acara Sita Eksekusi secara legal formal",
          hasilKerja: "Dokumen Berita Acara",
          waktuPenyelesaian: 120,
          bebanKerja: 20
        }
      ]
    },
    {
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
      syaratJabatan: {
        pangkatGolongan: "Penata Muda, III/a",
        bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
        temperamenKerja: ["T (Set of Limits/Tolerance)", "M (Measurable Criteria)"],
        minatKerja: ["Investigatif", "Konvensional"],
        upayaFisik: ["Duduk", "Melihat", "Membaca"],
        kondisiFisik: "Sehat jasmani dan rohani, daya konsentrasi tinggi, objektif."
      },
      uraianTugas: [
        {
          uraian: "Mempelajari dan menganalisis syarat formal substantif dokumen gugatan/permohonan perdata agama",
          hasilKerja: "Berkas",
          waktuPenyelesaian: 90,
          bebanKerja: 550
        },
        {
          uraian: "Menyusun draf resume perkara, analisis hukum terdahulu, dan ringkasan kronologis pokok sengketa",
          hasilKerja: "Naskah",
          waktuPenyelesaian: 180,
          bebanKerja: 550
        },
        {
          uraian: "Mengklasifikasikan, mencatat, dan mengarsip yurisprudensi putusan perkara perdata agama penting MA-RI",
          hasilKerja: "Laporan",
          waktuPenyelesaian: 240,
          bebanKerja: 12
        },
        {
          uraian: "Menelaah dan mengonsep surat tanggapan perihal memori banding, memori kasasi, atau peninjauan kembali (PK) pihak beperkara",
          hasilKerja: "Dokumen",
          waktuPenyelesaian: 300,
          bebanKerja: 45
        }
      ]
    },
    {
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
      syaratJabatan: {
        pangkatGolongan: "Penata, III/c",
        bakatKerja: ["G (Inteligensia)", "V (Verbal)", "Q (Ketelitian)"],
        temperamenKerja: ["D (Direction, Control, Planning)", "P (People/Social Contact)", "M (Measurable Criteria)"],
        minatKerja: ["Konvensional", "Sosial"],
        upayaFisik: ["Duduk", "Berbicara", "Melihat"],
        kondisiFisik: "Sehat jasmani dan rohani, analitis, rapi, dan komunikatif."
      },
      uraianTugas: [
        {
          uraian: "Menghimpun, menyelisik ketelitian, dan menyusun laporan statistika perkara pengadilan perdata agama berkala (bulanan/tahunan)",
          hasilKerja: "Laporan",
          waktuPenyelesaian: 360,
          bebanKerja: 12
        },
        {
          uraian: "Mengoordinasikan klasifikasi penataan arsip berkas perkara perdata agama yang telah berkekuatan hukum tetap (inkracht)",
          hasilKerja: "Kegiatan",
          waktuPenyelesaian: 120,
          bebanKerja: 52
        },
        {
          uraian: "Mengunggah data statistik perkara e-Kinerja nasional ke portal e-Reporting Direktorat Jenderal Mahkamah Agung",
          hasilKerja: "Laporan",
          waktuPenyelesaian: 90,
          bebanKerja: 12
        },
        {
          uraian: "Menerbitkan surat keterangan kualifikasi formal hukum substantif (surat pengesahan, izin cerai ASN, data perkara)",
          hasilKerja: "Surat",
          waktuPenyelesaian: 30,
          bebanKerja: 950
        },
        {
          uraian: "Menyusun draf Buku Laporan Tahunan Keadaan Teknis Perkara Direktorat Jenderal Peradilan Agama RI",
          hasilKerja: "Aplikasi",
          waktuPenyelesaian: 480,
          bebanKerja: 1
        }
      ]
    },
    {
      nama: "Jurusita Pengganti",
      iktisar: "Melaksanakan tugas kejurusitaan di bawah koordinasi Jurusita Utama, membantu memanggil para pihak dalam pemeriksaan sengketa di persidangan, serta membantu menyampaikan pengumuman resmi dan penyerahan surat hukum acara di lapangan.",
      kelasJabatan: 6,
      pegawaiRiil: 1,
      kualifikasi: {
        pendidikanMinimal: "SLTA / D3 (Diploma-III) Semua Jurusan",
        jurusan: ["Administrasi", "Ilmu Sosial", "Hukum", "Umum"],
        pelatihan: "Bimtek Administrasi Peradilan / Kejurusitaan Tingkat Dasar",
        pengalaman: "Minimal 2 tahun menjabat di lingkungan administrasi kepaniteraan"
      },
      syaratJabatan: {
        pangkatGolongan: "Pengatur Muda, II/a",
        bakatKerja: ["V (Verbal)", "Q (Ketelitian)"],
        temperamenKerja: ["R (Repetitive and Continuous)", "P (People/Social Contact)"],
        minatKerja: ["Realistik", "Sosial"],
        upayaFisik: ["Berjalan", "Duduk", "Mengendarai"],
        kondisiFisik: "Sehat jasmani dan rohani, berorientasi pelayanan publik yang tulus."
      },
      uraianTugas: [
        {
          uraian: "Menyerahkan relaas panggilan resmi kepada penggugat/tergugat atas perintah hakim di luar wilayah darurat khusus",
          hasilKerja: "Surat",
          waktuPenyelesaian: 120,
          bebanKerja: 350
        },
        {
          uraian: "Menyampaikan pengumuman atau panggilan resmi koran/radio bagi tergugat/termohon yang tidak diketahui domisilinya",
          hasilKerja: "Surat",
          waktuPenyelesaian: 60,
          bebanKerja: 24
        },
        {
          uraian: "Melaksanakan pengelolaan tertib register pembukuan administrasi pemanggilan sengketa dalam sistem SIPP",
          hasilKerja: "Laporan",
          waktuPenyelesaian: 20,
          bebanKerja: 350
        }
      ]
    }
  ];

  const handleApplyTemplate = (template: TemplateData) => {
    if (!targetUnitId) {
      alert("⚠️ Harap pilih Unit Kerja tujuan terlebih dahulu!");
      return;
    }

    // Convert template to actual Jabatan properties
    const toAdd: Omit<Jabatan, "id"> = {
      unitKerjaId: targetUnitId,
      nama: template.nama,
      iktisar: template.iktisar,
      kelasJabatan: template.kelasJabatan,
      pegawaiRiil: template.pegawaiRiil,
      kualifikasi: template.kualifikasi,
      syaratJabatan: template.syaratJabatan,
      uraianTugas: template.uraianTugas.map((task, uidx) => ({
        id: `ut-temp-${Date.now()}-${uidx}`,
        uraian: task.uraian,
        hasilKerja: task.hasilKerja,
        waktuPenyelesaian: task.waktuPenyelesaian,
        bebanKerja: task.bebanKerja
      }))
    };

    onAddJabatan(toAdd);
    setSuccessMsg(`✅ Template jabatan "${template.nama}" berhasil diterapkan ke database utama! Silakan cek tab ANALISIS JABATAN.`);
    setTimeout(() => setSuccessMsg(null), 7000);
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTextIdx(idx);
    setTimeout(() => setCopiedTextIdx(null), 2000);
  };

  const currentTemplate = kepaniteraanTemplates[selectedTemplateIdx];

  return (
    <div id="template-tab-container" className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* Upper Controller Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
            <BookOpen className="w-5 h-5 text-blue-600" /> Template &amp; Pedoman PermenPAN-RB 1/2020
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Eksplorasi pedoman penyusunan ANJAB-ABK resmi, salin butir tugas, atau terapkan langsung draf template tenaga teknis kepaniteraan peradilan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab("templates")}
            className={`px-3 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider border cursor-pointer transition-all ${
              subTab === "templates" 
                ? "bg-blue-600 text-white border-blue-600 shadow-xs" 
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
            }`}
          >
            Template Jabatan
          </button>
          <button
            onClick={() => setSubTab("pedoman")}
            className={`px-3 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider border cursor-pointer transition-all ${
              subTab === "pedoman" 
                ? "bg-blue-600 text-white border-blue-600 shadow-xs" 
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
            }`}
          >
            Pedoman Regulasi
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SUBTAB 1: TEMPLATE INTERACTIVE VIEWER */}
      {subTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left: Interactive List */}
          <div className="bg-white border rounded-sm p-4 space-y-3 shadow-sm lg:col-span-1 border-l-4 border-l-slate-800">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2 mb-3">Daftar Jabatan Teknis</h3>
            <div className="space-y-1.5">
              {kepaniteraanTemplates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplateIdx(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wide border transition-all text-slate-800 flex items-center justify-between cursor-pointer ${
                    selectedTemplateIdx === idx 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-slate-50/50 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <span className="truncate">{t.nama}</span>
                  <Briefcase className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${selectedTemplateIdx === idx ? "text-blue-400" : "text-slate-400"}`} />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 space-y-3">
              <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest pl-2 block">
                Unit Kerja Tujuan Apply:
              </label>
              <select
                value={targetUnitId}
                onChange={(e) => setTargetUnitId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              >
                {unitKerjaList.length === 0 ? (
                  <option value="">-- Tidak ada Unit Kerja --</option>
                ) : (
                  unitKerjaList.map(u => (
                    <option key={u.id} value={u.id}>{u.nama}</option>
                  ))
                )}
              </select>
              <button
                onClick={() => handleApplyTemplate(currentTemplate)}
                disabled={unitKerjaList.length === 0}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Terapkan ke ANJAB Utama
              </button>
              {unitKerjaList.length === 0 && (
                <p className="text-[9px] text-red-550 italic leading-snug">
                  * Tambahkan Unit Kerja di menu UNIT KERJA terlebih dahulu sebelum meng-apply template ini.
                </p>
              )}
            </div>
          </div>

          {/* Right: Template Details */}
          <div className="bg-white border rounded-sm p-6 lg:col-span-3 shadow-sm space-y-6">
            
            {/* Header / Info */}
            <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-605 font-mono font-bold text-[9px] uppercase tracking-wider rounded-sm border border-slate-205">
                  Template Jabatan Fungsional
                </span>
                <h3 className="text-xl font-black font-sans text-slate-800 uppercase tracking-tight">
                  {currentTemplate.nama}
                </h3>
                <p className="text-slate-550 text-xs italic leading-relaxed">
                  &ldquo;{currentTemplate.iktisar}&rdquo;
                </p>
              </div>

              <div className="shrink-0 text-right space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Syarat Kelas Jabatan</span>
                <span className="inline-block px-3 py-1.5 bg-slate-900 text-white font-mono font-black text-xs rounded-sm uppercase tracking-widest leading-none">
                  Kelas {currentTemplate.kelasJabatan}
                </span>
              </div>
            </div>

            {/* Grid 1: Kualifikasi & Syarat Jabatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 border rounded-sm">
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-550 uppercase tracking-widest flex items-center gap-1 border-b pb-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" /> Kualifikasi Jabatan
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Pendidikan Minimal</span>
                    <span className="text-slate-800 font-semibold">{currentTemplate.kualifikasi.pendidikanMinimal}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Rumpun Jurusan</span>
                    <span className="text-slate-800 font-semibold">{currentTemplate.kualifikasi.jurusan.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Pelatihan Pokok</span>
                    <span className="text-slate-800 leading-relaxed font-sans">{currentTemplate.kualifikasi.pelatihan}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Pengalaman Kerja</span>
                    <span className="text-slate-800 leading-relaxed font-sans">{currentTemplate.kualifikasi.pengalaman}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-550 uppercase tracking-widest flex items-center gap-1 border-b pb-1">
                  <Settings className="w-3.5 h-3.5 text-slate-500" /> Syarat Fisik &amp; Bakat (PermenPAN 1/2020)
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Pangkat / Golongan Ruang</span>
                    <span className="text-slate-800 font-semibold">{currentTemplate.syaratJabatan.pangkatGolongan}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Bakat Kerja</span>
                    <span className="text-slate-805 text-[11px] font-mono leading-none bg-white py-0.5 px-1 rounded-sm border border-slate-150 inline-block">
                      {currentTemplate.syaratJabatan.bakatKerja.join(" | ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Temperamen Kerja</span>
                    <span className="text-slate-805 text-[10px] font-semibold">
                      {currentTemplate.syaratJabatan.temperamenKerja.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-bold text-[9px] uppercase">Upaya &amp; Kondisi Fisik</span>
                    <span className="text-slate-830 block leading-relaxed">{currentTemplate.syaratJabatan.kondisiFisik}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Butir Uraian Tugas & ABK Metrik */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-[10px] font-extrabold text-slate-550 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" /> Uraian Tugas Pokok &amp; Standard Norma Waktu (WP)
                </h4>
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">PermenPAN-RB No 1/2020 lampiran 2</span>
              </div>

              <div className="border rounded-sm overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-mono uppercase tracking-widest border-b text-slate-550">
                      <th className="py-2.5 px-4 font-bold">Uraian Tugas Pokok</th>
                      <th className="py-2.5 px-3 font-bold text-center w-24">Hasil Kerja</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Norma Waktu (WP)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Vol / Thn (Beban)</th>
                      <th className="py-2.5 px-2 text-center w-12">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {currentTemplate.uraianTugas.map((task, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-800 leading-normal font-sans">
                          {task.uraian}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 font-medium">
                          <span className="px-2 py-0.5 bg-slate-100 border rounded-sm text-[10px]">
                            {task.hasilKerja}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                          {task.waktuPenyelesaian} Menit
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500">
                          {task.bebanKerja}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleCopyText(task.uraian, idx)}
                            className="p-1 hover:bg-slate-100 rounded-sm text-slate-400 hover:text-slate-800 cursor-pointer transition-colors"
                            title="Salin uraian tugas ini"
                          >
                            {copiedTextIdx === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Template Action Banner */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-900 block uppercase tracking-wide">Terapkan Langsung Ke Database Instansi?</span>
                <p className="text-blue-700 font-normal leading-normal">
                  Menekan tombol apply akan secara utuh memindahkan deskripsi kualifikasi, syarat fisik yudisial, serta standard butir tugas ABK ke daftar formasi jabatan utama Anda.
                </p>
              </div>
              <button
                disabled={unitKerjaList.length === 0}
                onClick={() => handleApplyTemplate(currentTemplate)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-350 text-white rounded-sm font-bold uppercase tracking-wider text-[10px] shrink-0 shadow-xs cursor-pointer"
              >
                Pindahkan Ke SIM ANJAB ABK
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: PEDOMAN PEMBUATAN ANJAB-ABK */}
      {subTab === "pedoman" && (
        <div className="bg-white border rounded-sm p-6 md:p-8 space-y-6 shadow-sm">
          
          <div className="space-y-2 border-b-2 border-slate-900 pb-3">
            <h3 className="text-xl font-black font-sans uppercase tracking-tight text-slate-800">
              PANDUAN PENYUSUNAN ANJAB &amp; ABK SESUAI PERMENPAN-RB NO. 1 TAHUN 2020
            </h3>
            <p className="text-slate-500 text-xs">
              Materi ringkas tahapan teknis, penghitungan Waktu Kerja Efektif, dan pengolahan formasi organisasi pemerintah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Tahapan Teknis */}
            <div className="md:col-span-2 space-y-5">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b pb-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  4 Tahapan Pokok Penyusunan
                </h4>
                <ul className="space-y-3.5">
                  <li className="flex gap-3">
                    <span className="text-xs font-black text-blue-600 font-mono shrink-0">I.</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 block uppercase font-bold tracking-tight">Tahap Persiapan</strong>
                      <p className="text-xs text-slate-500 leading-normal">
                        Perencanaan pembentukan tim pelaksana, sosialisasi pengisian instrumen, penyiapan surat instruksi kerja, dan pengenalan regulasi kepada seluruh pemangku kepentingan unit kerja.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xs font-black text-blue-600 font-mono shrink-0">II.</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 block uppercase font-bold tracking-tight">Tahap Pengumpulan Data</strong>
                      <p className="text-xs text-slate-500 leading-normal">
                        Penyebaran Formulir Penggalian Data (Formulir Informasi Jabatan) untuk diisi oleh setiap pegawai fungsional, wawancara kerja, pengamatan fisik deskriptif di lapangan, atau rekayasa data historis.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xs font-black text-blue-600 font-mono shrink-0">III.</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 block uppercase font-bold tracking-tight">Tahap Pengolahan &amp; Analisis</strong>
                      <p className="text-xs text-slate-500 leading-normal">
                        Penyusunan ikhtisar jabatan, pendeskripsian kualifikasi formal minimal, serta analisis beban kerja dengan membagi akumulasi perkalian Waktu Penyelesaian (WP) x Volume Kerja (Vol) terhadap Konstanta Waktu Kerja Efektif (WKE).
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-xs font-black text-blue-600 font-mono shrink-0">IV.</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs text-slate-800 block uppercase font-bold tracking-tight">Tahap Verifikasi &amp; Penyajian Laporan</strong>
                      <p className="text-xs text-slate-500 leading-normal">
                        Validasi data hasil analisis oleh pejabat pembina kepegawaian, verifikasi keandalan data yudisial, serta penyusunan Dokumen Resmi Lampiran ANJAB &amp; ABK untuk ekspor PDF/Cetak pengajuan formasi resmi.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 border p-4 space-y-3 rounded-sm">
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  💡 Tips Pembuatan Uraian Tugas bagi Tim Analis:
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
                  <li>Gunakan kata kerja aktif yang menggambarkan aksi terukur (misal: "Mengatur", "Menganalisis", "Menghimpun", "Memeriksa"). Jangan gunakan kata kerja abstrak.</li>
                  <li>Tentukan Satuan Hasil yang logis (Dokumen, Berkas, Relaas, Surat, Kegiatan, Laporan, dsb) untuk menentukan formula beban kerja tahunan.</li>
                  <li>Waktu Penyelesaian (Norma Waktu / WP) wajib diestimasi dalam satuan <strong>Menit</strong>. Jika pengerjaan memerlukan 3 jam, konversikan menjadi 180 menit.</li>
                  <li>Volume Kerja (Vol) harus mewakili frekuensi pengerjaan riil dalam satuan <strong>1 Tahun Takwin</strong>.</li>
                </ul>
              </div>

            </div>

            {/* Box 2: WKE Calculation */}
            <div className="space-y-5">
              
              <div className="bg-slate-900 text-white p-5 rounded-sm space-y-4 border border-slate-800 shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-350 leading-none">Standard Angka WKE</h4>
                </div>

                <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    Waktu Kerja Efektif (WKE) diturunkan dari jam kerja formal dikurangi faktor kelonggaran (allowance factor) sebesar 30% untuk keperluan fisiologis manusia pendonor tenaga.
                  </p>

                  <div className="space-y-2.5 border-t border-slate-800 pt-2.5 font-mono text-slate-400 text-[10.5px]">
                    <div className="flex justify-between">
                      <span>Hari Kerja Setahun</span>
                      <span className="text-white font-bold">240 Hari</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jam Kerja Formal / Minggu</span>
                      <span className="text-white font-bold">37,5 Jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kelonggaran (30%)</span>
                      <span className="text-white font-bold">375 Jam/Thn</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jam Efektif Setahun</span>
                      <span className="text-blue-400 font-bold">1.250 Jam</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Konstanta WKE Resmi (Menit)</span>
                    <div className="text-2xl font-black text-amber-400 font-sans tracking-tight mt-0.5">
                      75.000 Menit
                    </div>
                    <span className="text-[9px] text-slate-500 italic leading-none block">*(Setara 1.250 jam x 60 menit)</span>
                  </div>
                </div>
              </div>

              <div className="border p-4 rounded-sm space-y-3 text-xs text-slate-650">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-widest">Kontak &amp; Landasan Hukum</span>
                <p className="leading-relaxed">
                  Sesuai ketentuan pasal 4 Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 1 Tahun 2020 tentang Pedoman Analisis Jabatan dan Analisis Beban Kerja, setiap instansi wajib melakukan pembaharuan ANJAB-ABK secara periodik demi tertib formasi kepegawaian daerah.
                </p>
                <div className="text-[10px] font-mono select-all bg-slate-50 p-2 rounded-sm border inline-block leading-normal">
                  Kementerian PAN-RB RI @ 2020
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
