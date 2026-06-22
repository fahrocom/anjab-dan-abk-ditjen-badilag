import React, { useState } from "react";
import { Jabatan, UnitKerja, AppSettings } from "../types";
import { PrintRecap } from "./PrintRecap";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { 
  FileText, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  User,
  ChevronLeft,
  X,
  FileCheck,
  Award,
  Calculator,
  TrendingUp,
  TrendingDown,
  Sparkles,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface RecapTabProps {
  jabatanList: Jabatan[];
  unitKerjaList: UnitKerja[];
  settings: AppSettings;
}

type PrintTarget = 
  | { type: "recap-all" }
  | { type: "anjab-single"; jabatan: Jabatan }
  | { type: "abk-single"; jabatan: Jabatan }
  | null;

export function getKelompokJabatan(j: Jabatan): "Struktural" | "Fungsional" | "Pelaksana" {
  const nameLower = j.nama.toLowerCase();
  
  // 1. STRUKTURAL
  if (
    nameLower.includes("kepala") ||
    nameLower.includes("kaur") ||
    nameLower.includes("kasubbag") ||
    nameLower.includes("kabag") ||
    nameLower.includes("panitera muda") ||
    nameLower.includes("sekretaris") ||
    nameLower.includes("direktur") ||
    nameLower.includes("ketua") ||
    nameLower.includes("pimpinan") ||
    nameLower === "panitera" ||
    nameLower.startsWith("panitera (") ||
    nameLower.includes("struktural")
  ) {
    return "Struktural";
  }
  
  // 2. FUNGSIONAL
  if (
    nameLower.includes("panitera pengganti") ||
    nameLower.includes("jurusita") ||
    nameLower.includes("pranata") ||
    nameLower.includes("arsiparis") ||
    nameLower.includes("perencana") ||
    nameLower.includes("pustakawan") ||
    nameLower.includes("assessor") ||
    nameLower.includes("statistisi") ||
    nameLower.includes("auditor") ||
    nameLower.includes("dokter") ||
    nameLower.includes("perawat") ||
    nameLower.includes("bidan") ||
    nameLower.includes("psikolog") ||
    nameLower.includes("fungsional") ||
    nameLower.includes("ahli") || 
    nameLower.includes("terampil") ||
    nameLower.includes("mahir") ||
    nameLower.includes("penyelia")
  ) {
    return "Fungsional";
  }
  
  // 3. PELAKSANA (Default)
  return "Pelaksana";
}

export default function RecapTab({
  jabatanList,
  unitKerjaList,
  settings
}: RecapTabProps) {
  
  const [selectedUnitFilter, setSelectedUnitFilter] = useState("all");
  const [selectedKelompokFilter, setSelectedKelompokFilter] = useState("all");
  const [printTarget, setPrintTarget] = useState<PrintTarget>(null);
  const [expandedJabId, setExpandedJabId] = useState<string | null>(null);

  // States for 5-Year Employee Needs Projection
  const [growthRate, setGrowthRate] = useState(3.5); // Default 3.5% workload growth per year
  const [attritionRate, setAttritionRate] = useState(2.0); // Default 2.0% attrition rate per year
  const [isProjectionExpanded, setIsProjectionExpanded] = useState(true);

  // WKE divisor
  const wke = settings.wkeTahunan;

  // Filter positions
  const filteredJabatans = jabatanList.filter(j => {
    const matchesUnit = selectedUnitFilter === "all" || j.unitKerjaId === selectedUnitFilter;
    const kelompok = getKelompokJabatan(j);
    const matchesKelompok = selectedKelompokFilter === "all" || kelompok.toLowerCase() === selectedKelompokFilter.toLowerCase();
    return matchesUnit && matchesKelompok;
  });

  // Calculate overall institutional aggregates
  const totalRiil = filteredJabatans.reduce((sum, j) => sum + Number(j.pegawaiRiil || 0), 0);
  
  const totalKebutuhanDecimal = filteredJabatans.reduce((sum, j) => {
    const jobNeeded = j.uraianTugas.reduce((tSum, t) => tSum + ((t.waktuPenyelesaian * t.bebanKerja) / wke), 0);
    return sum + jobNeeded;
  }, 0);

  const totalKebutuhanBulat = filteredJabatans.reduce((sum, j) => {
    const jobNeeded = j.uraianTugas.reduce((tSum, t) => tSum + ((t.waktuPenyelesaian * t.bebanKerja) / wke), 0);
    return sum + Math.round(jobNeeded || (j.uraianTugas.length > 0 ? 1 : 0));
  }, 0);

  const netSurplusDeficit = totalRiil - totalKebutuhanBulat;

  // 5-Year Employee Needs Projection calculation based on current workload trends
  const currentYear = new Date().getFullYear();
  const projectionData = Array.from({ length: 6 }, (_, t) => {
    const year = currentYear + t;
    const factor = Math.pow(1 + growthRate / 100, t);
    
    let tempRoundedSum = 0;
    let tempDecimalSum = 0;
    
    filteredJabatans.forEach(j => {
      const currentBeban = j.uraianTugas.reduce((tSum, t) => tSum + (t.waktuPenyelesaian * t.bebanKerja), 0);
      const projBeban = currentBeban * factor;
      const decimalVal = projBeban / wke;
      const roundedVal = Math.round(decimalVal || (j.uraianTugas.length > 0 ? 1 : 0));
      tempDecimalSum += decimalVal;
      tempRoundedSum += roundedVal;
    });

    const bezettingVal = Math.max(0, Math.round(totalRiil * Math.pow(1 - attritionRate / 100, t)));
    
    return {
      yearLabel: `T+${t} (${year})`,
      year,
      "Kebutuhan Formasi": tempRoundedSum,
      "Proyeksi Kebutuhan (Desimal)": parseFloat(tempDecimalSum.toFixed(1)),
      "Ketersediaan Pegawai (Bezetting)": bezettingVal,
      "Defisit/Kesenjangan": Math.max(0, tempRoundedSum - bezettingVal)
    };
  });

  // Find primary unit for general signing
  const primaryUnit = unitKerjaList.find(u => u.kode === "DIRBINTEN-PA") || unitKerjaList[0];
  const primaryKepalaNama = primaryUnit ? primaryUnit.kepalaNama : "Dr. H. Candra Boyero, S.H., M.H.";
  const primaryKepalaNip = primaryUnit ? primaryUnit.kepalaNip : "19750318 199903 1 002";
  const primaryKepalaJabatan = primaryUnit ? `Kepala ${primaryUnit.nama}` : "Direktur Pembinaan Tenaga Teknis Peradilan Agama";

  const getJobAbkMetrics = (j: Jabatan) => {
    const totalBeban = j.uraianTugas.reduce((tSum, t) => tSum + (t.waktuPenyelesaian * t.bebanKerja), 0);
    const jobNeeded = totalBeban / wke;
    const rounded = Math.round(jobNeeded || (j.uraianTugas.length > 0 ? 1 : 0));
    const diff = j.pegawaiRiil - rounded;
    
    let evalStatus = "Kelebihan";
    let evalClass = "text-amber-700 bg-amber-50/80 border-amber-200/60";
    let actionTip = "Redistribusi Internal / Penataan Tugas";

    if (diff < 0) {
      evalStatus = "Kekurangan";
      evalClass = "text-red-700 bg-red-50/80 border-red-200/60";
      actionTip = "Usulkan Rekrutmen CPNS / PPPK Berkala";
    } else if (diff === 0) {
      evalStatus = "Optimal";
      evalClass = "text-emerald-700 bg-emerald-50/80 border-emerald-250/50";
      actionTip = "Pertahankan Keadaan SDM";
    }

    return {
      totalBeban,
      decimal: jobNeeded,
      rounded,
      diff,
      evalStatus,
      evalClass,
      actionTip
    };
  };

  // EXPORT TO STANDARD EXCEL-FRIENDLY CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Title
    csvContent += `\"REKAPITULASI ANALISIS JABATAN DAN BEBAN KERJA ASN\"\r\n`;
    csvContent += `\"Instansi:\",\"${settings.namaInstansi}\"\r\n`;
    csvContent += `\"Waktu Kerja Efektif (WKE) Tahunan:\",\"${settings.wkeTahunan} Menit\"\r\n\r\n`;
    
    // Header
    csvContent += "\"No\",\"Unit Kerja\",\"Nomenklatur Jabatan\",\"Kelas\",\"Pegawai Riil (Bezetting)\",\"Hasil ABK (Desimal)\",\"Kebutuhan Standar (Bulat)\",\"Selisih Formasi\",\"Evaluasi Tindakan\"\r\n";
    
    filteredJabatans.forEach((j, index) => {
      const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
      const metrics = getJobAbkMetrics(j);
      
      const row = [
        index + 1,
        unit ? unit.nama : "Tanpa Unit",
        j.nama,
        j.kelasJabatan,
        j.pegawaiRiil,
        metrics.decimal.toFixed(3),
        metrics.rounded,
        metrics.diff,
        metrics.evalStatus
      ].map(val => `"${val}"`).join(",");
      
      csvContent += row + "\r\n";
    });
    
    // Footer sums
    csvContent += `\"\",\"TOTAL / SELISIH NETTO\",\"\",\"\",\"${totalRiil}\",\"${totalKebutuhanDecimal.toFixed(3)}\",\"${totalKebutuhanBulat}\",\"${netSurplusDeficit}\",\"${netSurplusDeficit < 0 ? 'Kekurangan Pegawai' : netSurplusDeficit > 0 ? 'Kelebihan Pegawai' : 'Sesuai'}\"\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Anjab_ABK_${settings.namaInstansi.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const data = filteredJabatans.map((j, index) => {
      const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
      const metrics = getJobAbkMetrics(j);
      return {
        "No": index + 1,
        "Unit Kerja": unit ? unit.nama : "Tanpa Unit",
        "Nomenklatur Jabatan": j.nama,
        "Kelas": j.kelasJabatan,
        "Pegawai Riil (Bezetting)": j.pegawaiRiil,
        "Hasil ABK (Desimal)": metrics.decimal.toFixed(3),
        "Kebutuhan Standar (Bulat)": metrics.rounded,
        "Selisih Formasi": metrics.diff,
        "Evaluasi Tindakan": metrics.evalStatus
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap ABK");
    
    XLSX.writeFile(workbook, `Rekap_Anjab_ABK_${settings.namaInstansi.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Official styling
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`LAPORAN ANALISIS JABATAN DAN BEBAN KERJA`, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${settings.namaInstansi.toUpperCase()}`, pageWidth / 2, 28, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(10, 32, pageWidth - 10, 32);
    
    const tableData = filteredJabatans.map((j, index) => {
        const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
        const metrics = getJobAbkMetrics(j);
        return [
            index + 1,
            unit ? unit.nama : "Tanpa Unit",
            j.nama,
            j.kelasJabatan,
            j.pegawaiRiil,
            metrics.decimal.toFixed(2),
            metrics.rounded,
            metrics.diff,
            metrics.evalStatus
        ];
    });

    (doc as any).autoTable({
        head: [['No', 'Unit', 'Jabatan', 'Kelas', 'Riil', 'ABK(Dec)', 'Kebutuhan', 'Selisih', 'Evaluasi']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 9, font: "helvetica" },
        headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
        theme: 'grid'
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString()}`, 10, finalY);

    doc.save(`Rekap_ANJAB_ABK_${settings.namaInstansi.replace(/\s+/g, '_')}_RESMI.pdf`);
  };

  // Helper trigger browser print dialog with page title override for high quality PDF file-naming
  const executePrint = () => {
    const originalTitle = document.title;
    
    // Choose appropriate PDF filename based on the current visible form
    let reportTitle = "Laporan_Kebutuhan_Formasi";
    if (printTarget) {
      if (printTarget.type === "recap-all") {
        reportTitle = `Rekapitulasi_Formasi_ASN_${settings.namaInstansi.replace(/\s+/g, '_')}`;
      } else if (printTarget.type === "anjab-single") {
        reportTitle = `Dokumen_ANJAB_${printTarget.jabatan.nama.replace(/\s+/g, '_')}`;
      } else if (printTarget.type === "abk-single") {
        reportTitle = `Analisis_Beban_Kerja_${printTarget.jabatan.nama.replace(/\s+/g, '_')}`;
      }
    }
    
    document.title = reportTitle;
    window.focus();
    window.print();
    
    // Restore the browser page title
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <>
      <div id="recap-tab-container" className="space-y-6 animate-fadeIn text-slate-900 print:hidden">
      
      {/* 1. VIEW CONTROLLER (DASHBOARD & TAB) */}
      {!printTarget ? (
        <>
          {/* Action Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200/80 shadow-sm border-l-4 border-l-slate-800">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
                <FileText className="w-5 h-5 text-slate-700" /> Rekapitulasi Formasi &amp; Cetak
              </h2>
              <p className="text-slate-500 text-xs md:text-sm">
                Lihat kompilasi menyeluruh pemetaan formasi instansi, ekspor ke file Excel (CSV), atau cetak lampiran resmi PermenPAN.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 md:pt-0">
              <button
                onClick={() => { window.print(); }}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-850 rounded-sm text-slate-700 hover:text-slate-900 bg-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-red-600" /> Cetak Laporan Resmi
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-850 rounded-sm text-slate-700 hover:text-slate-900 bg-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-sky-600" /> Ekspor PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-850 rounded-sm text-slate-700 hover:text-slate-900 bg-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Ekspor CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-850 rounded-sm text-slate-700 hover:text-slate-900 bg-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-700" /> Ekspor Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3.5 py-2 border border-slate-300 hover:border-slate-850 rounded-sm text-slate-700 hover:text-slate-900 bg-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-red-600" /> Cetak PDF Resmi
              </button>
              <button
                onClick={() => setPrintTarget({ type: "recap-all" })}
                className="px-3.5 py-2 border border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-800 bg-blue-50/50 rounded-sm font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Pratinjau Cetak
              </button>
              <button
                onClick={() => {
                  setPrintTarget({ type: "recap-all" });
                  setTimeout(() => {
                    executePrint();
                  }, 150);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-red-400" /> Cetak ke PDF
              </button>
            </div>
          </div>

          {/* Master Information Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 text-white p-5 rounded-sm border border-slate-850">
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Total Pegawai Riil (Bezetting)</span>
              <p className="text-2xl font-black font-sans text-white mt-1 uppercase">{totalRiil} Pegawai</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-6 pt-3 sm:pt-0">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Usulan Formasi Kebutuhan</span>
              <p className="text-2xl font-black font-sans text-blue-400 mt-1 uppercase">{totalKebutuhanBulat} Formasi</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-6 pt-3 sm:pt-0">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Keadan Netto Pegawai</span>
              <div className="mt-1 flex items-center gap-1.5">
                <p className={`text-2xl font-black font-sans ${netSurplusDeficit < 0 ? "text-red-400" : netSurplusDeficit > 0 ? "text-amber-400" : "text-emerald-450"}`}>
                  {netSurplusDeficit < 0 ? `-${Math.abs(netSurplusDeficit)}` : `+${netSurplusDeficit}`}
                </p>
                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider ${
                  netSurplusDeficit < 0 
                    ? "bg-red-950/40 text-red-300 border border-red-900/40" 
                    : netSurplusDeficit > 0 
                    ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                }`}>
                  {netSurplusDeficit < 0 ? "Kurang" : netSurplusDeficit > 0 ? "Kelebihan" : "Ideal"}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Formula Explanation Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 p-5 rounded-sm shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-600 rounded-xs text-white">
                <Calculator className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">
                Metodologi Perhitungan Kebutuhan Pegawai Otomatis (PermenPAN-RB No. 1 Tahun 2020)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center text-xs">
              <div className="lg:col-span-2 space-y-2.5">
                <p className="text-slate-600 leading-relaxed font-sans">
                  Sistem menganalisis seluruh butir kegiatan (uraian tugas) untuk setiap jabatan, mengalikan <strong>Waktu Penyelesaian (WP)</strong> dengan <strong>Beban Kerja (Volume Tahunan)</strong> untuk menghasilkan <strong>Total Beban Kerja (Menit/Tahun)</strong>. Hasil tersebut kemudian dibagi dengan konstanta <strong>Waktu Kerja Efektif (WKE)</strong> tahunan instansi Anda.
                </p>
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] font-mono text-slate-500 bg-white/75 px-3 py-2 border border-slate-200 rounded-sm">
                  <span className="font-bold text-blue-700 uppercase">Parameter Aktif:</span>
                  <span>WKE Tahunan = <strong className="text-slate-800">{wke.toLocaleString()} Menit</strong></span>
                  <span className="text-slate-350">|</span>
                  <span>Pembulatan: <strong className="text-slate-800">Sesuai aturan standard pembulatan matematis terdekat (min. 1 jika ada tugas)</strong></span>
                </div>
              </div>

              <div className="bg-white border border-blue-150 p-4 rounded-sm shadow-3xs flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono mb-2">Representasi Rumus</span>
                <div className="font-mono text-xs text-blue-900 font-bold space-y-1">
                  <div>Y = Total Beban Kerja (Menit)</div>
                  <div className="border-t border-slate-400 my-1 pt-1">WKE Tahunan ({wke.toLocaleString()})</div>
                </div>
                <div className="mt-3.5 text-[10px] text-slate-500 font-sans">
                  = <strong className="text-blue-700 font-bold">Kebutuhan Pegawai (Desimal)</strong>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic flex items-center gap-1">
              <span>💡</span> <strong>Petunjuk:</strong> Klik salah satu baris jabatan pada tabel di bawah untuk melihat rincian matematika perhitungan beban tugas fungsionalnya secara interaktif.
            </p>
          </div>

          {/* 5-Year Employee Needs & Gap Projection */}
          <div id="five-year-projection-card" className="bg-white border rounded-sm p-5 md:p-6 shadow-2xs print:hidden space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-slate-100 rounded-sm">
                  <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
                </span>
                <div>
                  <h3 className="font-sans font-extrabold text-xs md:text-sm uppercase tracking-wider text-slate-800">
                    Proyeksi Kebutuhan &amp; Kesenjangan Pegawai 5 Tahun ke Depan
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium font-sans">
                    Estimasi kebutuhan formasi ideal vs penyusutan ketersediaan pegawai (bezetting) akibat pensiun/pindah tugas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectionExpanded(!isProjectionExpanded)}
                className="text-[10px] px-2.5 py-1.5 font-bold border border-slate-200 rounded-sm bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isProjectionExpanded ? "Sembunyikan Proyeksi" : "Tampilkan Proyeksi"}
              </button>
            </div>

            {isProjectionExpanded && (
              <div className="space-y-6">
                {/* Sliders Control Section & Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column: Sliders control */}
                  <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-4 border border-slate-200/60 rounded-sm">
                    <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5 border-b pb-2.5 border-slate-200">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Pengaturan Asumsi Dinamis
                    </h4>

                    {/* Workload Growth Rate Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-600 font-bold font-sans">Laju Pertumbuhan Beban Kerja:</label>
                        <span className="font-mono font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-sm">
                          {growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`} / thn
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="15"
                        step="0.5"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <p className="text-[10px] text-slate-400 font-sans">
                        Tren pertambahan perkara, volume berkas perkara masuk, atau penambahan tugas pokok tahunan.
                      </p>
                    </div>

                    {/* Attrition Rate Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-600 font-bold font-sans">Tingkat Penyusutan Pegawai:</label>
                        <span className="font-mono font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-sm">
                          {attritionRate}% / thn
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={attritionRate}
                        onChange={(e) => setAttritionRate(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-650"
                      />
                      <p className="text-[10px] text-slate-400 font-sans">
                        Estimasi pegawai pensiun, mutasi keluar satuan kerja, atau pengunduran diri berkala.
                      </p>
                    </div>

                    {/* Scope Indicator */}
                    <div className="pt-2 text-[10px] text-slate-500 font-bold flex items-center gap-1.5 border-t border-slate-200/50 font-mono">
                      <span>✓ RUANG LINGKUP:</span>
                      <span className="text-blue-700 capitalize">
                        {selectedUnitFilter === "all" ? "Seluruh Organisasi" : "Unit Kerja Terfilter"}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Mini Bento cards summarizing Year 5 results */}
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* card 1: ideal headcount at year 5 */}
                    <div className="bg-blue-50/45 p-4 rounded-sm border border-blue-150 shadow-3xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-blue-800 font-black uppercase tracking-wider block font-sans">Kebutuhan Tahun Ke-5</span>
                        <p className="text-[10px] text-slate-500 mt-1 font-sans">Formasi kebutuhan ideal hasil konversi beban kerja dimasa depan.</p>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <strong className="text-2xl font-mono text-blue-700 font-black">
                          {projectionData[5]["Kebutuhan Formasi"]}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">Formasi</span>
                      </div>
                    </div>

                    {/* card 2: projected headcount with zero recrutement */}
                    <div className="bg-amber-50/45 p-4 rounded-sm border border-amber-205 shadow-3xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block font-sans">Ketersediaan Tahun Ke-5</span>
                        <p className="text-[10px] text-slate-500 mt-1 font-sans">Estimasi jumlah bezetting tersisa tanpa adanya draf rekrutmen baru.</p>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <strong className="text-2xl font-mono text-amber-700 font-black">
                          {projectionData[5]["Ketersediaan Pegawai (Bezetting)"]}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">Pegawai</span>
                      </div>
                    </div>

                    {/* card 3: Gap accumulation */}
                    <div className="bg-red-50/45 p-4 rounded-sm border border-red-150 shadow-3xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-red-800 font-black uppercase tracking-wider block font-sans">Defisit / Kesenjangan</span>
                        <p className="text-[10px] text-slate-505 mt-1 font-sans">Jumlah formasi kosong yang wajib diisi guna menjaga kontinuitas tugas.</p>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <strong className="text-2xl font-mono text-red-700 font-black">
                          {projectionData[5]["Defisit/Kesenjangan"]}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">Lowongan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Chart Visualization Section */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-center">
                  {/* Recharts LineChart */}
                  <div className="xl:col-span-3 w-full h-80 md:h-96 bg-slate-50/10 rounded-sm border border-slate-200 p-3 pt-6 min-h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="yearLabel" 
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                          axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <YAxis 
                          allowDecimals={false}
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                          axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '2px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'sans-serif' }}
                          itemStyle={{ color: '#fff' }}
                          labelClassName="font-extrabold pb-1 border-b border-slate-800 mb-1 text-slate-300 font-sans"
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36} 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: '11px', fontWeight: 700, fontFamily: 'sans-serif' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Kebutuhan Formasi" 
                          name="Kebutuhan Formasi Ideal" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 1 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Ketersediaan Pegawai (Bezetting)" 
                          name="Proyeksi Bezetting Pegawai" 
                          stroke="#f59e0b" 
                          strokeWidth={2.5}
                          strokeDasharray="5 5"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Defisit/Kesenjangan" 
                          name="Kesenjangan Formasi (Gap)" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Strategic HR Analysis/Interpretation Panel */}
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-900 text-slate-200 p-5 rounded-sm border border-slate-800 space-y-3.5 shadow-sm">
                      <h5 className="font-extrabold text-blue-400 tracking-wider uppercase text-[10px] flex items-center gap-1.5 font-sans">
                        <HelpCircle className="w-4 h-4 text-blue-450" /> Analisis Kebutuhan SDM
                      </h5>
                      <div className="space-y-3 leading-relaxed text-slate-300 font-sans">
                        <p className="text-justify">
                          Dengan asumsi pertumbuhan beban kerja tahunan sebesar <strong className="text-white font-mono">{growthRate}%</strong>, kebutuhan formasi ideal akan meningkat dari <strong className="text-white font-mono">{projectionData[0]["Kebutuhan Formasi"]}</strong> menjadi <strong className="text-white font-mono">{projectionData[5]["Kebutuhan Formasi"]}</strong> formasi pada tahun {currentYear + 5}.
                        </p>
                        <p className="text-justify">
                          Laju pensiun &amp; mutasi pegawai sebesar <strong className="text-white font-mono">{attritionRate}%</strong> setahun diproyeksikan mengurangi bezetting aktif dari <strong className="text-white font-mono">{totalRiil}</strong> ke <strong className="text-white font-mono">{projectionData[5]["Ketersediaan Pegawai (Bezetting)"]}</strong> personil.
                        </p>
                        <div className="pt-3 text-[10px] border-t border-slate-800">
                          {projectionData[5]["Defisit/Kesenjangan"] > 0 ? (
                            <span className="text-amber-350 font-bold block bg-amber-950/20 p-2.5 rounded-xs border border-amber-900/30">
                              ⚠️ KEPUTUSAN STRATEGIS: Disarankan mengusulkan formasi baru sebanyak {projectionData[5]["Defisit/Kesenjangan"]} pegawai ke Biro Kepegawaian MA-RI guna menjaga kestabilan penanganan perkara.
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold block bg-emerald-950/20 p-2.5 rounded-xs border border-emerald-900/30">
                              ✓ KEPUTUSAN STRATEGIS: Alokasi pegawai diproyeksikan tetap stabil tanpa ancaman defisit beban kerja yang signifikan.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-sm border shadow-2xs border-l-4 border-l-blue-600">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider font-mono">Penyaringan Master Matrix:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide font-sans">1. Unit Kerja:</span>
                <select
                  value={selectedUnitFilter}
                  onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-850"
                >
                  <option value="all">Semua Unit Kerja</option>
                  {unitKerjaList.map(u => (
                    <option key={u.id} value={u.id}>{u.nama}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide font-sans">2. Kelompok Jabatan:</span>
                <select
                  value={selectedKelompokFilter}
                  onChange={(e) => setSelectedKelompokFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-850"
                >
                  <option value="all">Semua Kelompok (Kolektif)</option>
                  <option value="struktural">Jabatan Struktural</option>
                  <option value="fungsional">Jabatan Fungsional</option>
                  <option value="pelaksana">Jabatan Pelaksana</option>
                </select>
              </div>
            </div>
          </div>

          {/* MASTER SPREADSHEET TABLE OF RECAPPING FORMATION */}
          <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
            {filteredJabatans.length === 0 ? (
              <div className="p-16 text-center text-slate-450 text-xs uppercase font-bold tracking-wider">
                Belum ada data formasi terdaftar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse select-none text-xs">
                  <thead>
                    <tr className="border-b text-slate-500 font-mono text-[9px] uppercase tracking-widest bg-slate-50/50">
                      <th className="py-3 px-5 font-bold">Unit Kerja</th>
                      <th className="py-3 px-5 font-bold">Nama Jabatan (Nomenklatur)</th>
                      <th className="py-3 px-5 font-bold w-12 text-center">Grade</th>
                      <th className="py-3 px-5 font-bold w-24 text-center">Riil (Bezetting)</th>
                      <th className="py-3 px-5 font-bold w-32 text-center">Total Beban (Menit/Thn)</th>
                      <th className="py-3 px-5 font-bold w-32 text-center text-blue-700 bg-blue-50/40">Kebutuhan (Desimal)</th>
                      <th className="py-3 px-5 font-bold w-28 text-center text-blue-700 bg-blue-50/60">Kebutuhan (Bulat)</th>
                      <th className="py-3 px-5 font-bold w-20 text-center">Selisih</th>
                      <th className="py-3 px-5 font-bold">Evaluasi Tindak Lanjut</th>
                      <th className="py-3 px-5 text-right w-52 font-bold">Aksi Dokumen Resmi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                    {filteredJabatans.map((j, idx) => {
                      const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
                      const metrics = getJobAbkMetrics(j);
                      const isExpanded = expandedJabId === j.id;

                      return (
                        <React.Fragment key={j.id}>
                          <tr 
                            onClick={() => setExpandedJabId(isExpanded ? null : j.id)}
                            className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                              isExpanded ? "bg-blue-50/30 hover:bg-blue-50/40" : ""
                            }`}
                          >
                            <td className="py-3.5 px-5 font-bold text-slate-600 truncate max-w-[120px]" title={unit?.nama}>
                              {unit ? unit.nama : "Tanpa Unit"}
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1.5 align-middle">
                                  <span className={`text-[9px] text-slate-400 font-mono transition-transform duration-200 ${isExpanded ? "rotate-90 text-blue-600" : ""}`}>
                                    ▶
                                  </span>
                                  <strong className="text-slate-850 text-xs block font-bold leading-tight">{j.nama}</strong>
                                </span>
                                <div className="pl-3.5 flex items-center">
                                  {(() => {
                                    const grp = getKelompokJabatan(j);
                                    let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                                    if (grp === "Struktural") badgeColor = "bg-purple-50 text-purple-700 border-purple-200/60";
                                    if (grp === "Fungsional") badgeColor = "bg-blue-50 text-blue-700 border-blue-200/60";
                                    if (grp === "Pelaksana") badgeColor = "bg-amber-50 text-amber-700 border-amber-200/60";
                                    return (
                                      <span className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-sans font-extrabold uppercase tracking-widest ${badgeColor}`}>
                                        {grp}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono font-bold text-slate-650 bg-slate-50/10">
                              {j.kelasJabatan}
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono text-slate-705">
                              {j.pegawaiRiil} Orang
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono text-slate-500 font-medium">
                              {metrics.totalBeban.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono font-semibold text-blue-700 bg-blue-50/10">
                              {metrics.decimal.toFixed(4)}
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono font-bold text-blue-900 bg-blue-50 font-bold">
                              {metrics.rounded} Orang
                            </td>
                            <td className={`py-3.5 px-5 text-center font-mono font-bold ${
                              metrics.diff < 0 ? "text-red-600" : metrics.diff > 0 ? "text-amber-600" : "text-emerald-700 font-bold"
                            }`}>
                              {metrics.diff < 0 ? metrics.diff : metrics.diff > 0 ? `+${metrics.diff}` : "0"}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-bold ${metrics.evalClass}`}>
                                {metrics.evalStatus}
                              </span>
                              <span className="text-[9px] text-slate-450 block mt-1 truncate max-w-[130px] font-bold uppercase tracking-wider">{metrics.actionTip}</span>
                            </td>
                            <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPrintTarget({ type: "anjab-single", jabatan: j })}
                                  className="px-2 py-1.5 border hover:border-slate-850 hover:bg-slate-50 rounded-sm text-[10px] font-bold text-slate-700 flex items-center gap-1 bg-white cursor-pointer"
                                  title="Cetak Surat ANJAB"
                                >
                                  <Award className="w-3 h-3 text-blue-600" /> Form ANJAB
                                </button>
                                <button
                                  onClick={() => setPrintTarget({ type: "abk-single", jabatan: j })}
                                  className="px-2 py-1.5 border hover:border-slate-850 hover:bg-slate-50 rounded-sm text-[10px] font-bold text-slate-700 flex items-center gap-1 bg-white cursor-pointer"
                                  title="Cetak Tabel ABK"
                                >
                                  <FileCheck className="w-3 h-3 text-emerald-600" /> Form ABK
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Step-by-Step Calculator details row */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50">
                              <td colSpan={10} className="p-5 border-l-4 border-l-blue-600">
                                <div className="space-y-4 text-xs">
                                  <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded-xs font-mono">
                                        FORMULA RUMUS
                                      </span>
                                      <h4 className="font-bold text-slate-800 uppercase tracking-tight">
                                        Rincian Alur Perhitungan Kebutuhan Pegawai: {j.nama}
                                      </h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                                      ID: {j.id}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                    {/* Task breakdown list inside expanded view */}
                                    <div className="md:col-span-7 space-y-2">
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                                        Butir Tugas Keadaan Riil (Dari Analisis Beban Kerja)
                                      </div>
                                      <div className="border rounded-sm max-h-48 overflow-y-auto bg-white">
                                        {j.uraianTugas.length === 0 ? (
                                          <div className="p-4 text-center text-slate-400 italic">
                                            Belum ada rincian tugas terdefinisi. Atur tugas pokok pada menu ABK terlebih dahulu.
                                          </div>
                                        ) : (
                                          <table className="w-full text-left text-[11px] border-collapse">
                                            <thead>
                                              <tr className="border-b bg-slate-50 text-slate-500 font-mono text-[9px] uppercase">
                                                <th className="p-2 w-8 text-center">No</th>
                                                <th className="p-2">Butir Kegiatan</th>
                                                <th className="p-2 text-center w-20">WP (Mnt)</th>
                                                <th className="p-2 text-center w-20">Volume</th>
                                                <th className="p-2 text-right w-24">Beban Kerja</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 font-sans">
                                              {j.uraianTugas.map((t, tIdx) => {
                                                const taskBeban = t.waktuPenyelesaian * t.bebanKerja;
                                                return (
                                                  <tr key={t.id} className="hover:bg-slate-50/50">
                                                    <td className="p-2 text-center text-slate-400">{tIdx + 1}</td>
                                                    <td className="p-2 font-medium text-slate-700 truncate max-w-[200px]" title={t.uraian}>
                                                      {t.uraian}
                                                    </td>
                                                    <td className="p-2 text-center font-mono">{t.waktuPenyelesaian}</td>
                                                    <td className="p-2 text-center font-mono">{t.bebanKerja}</td>
                                                    <td className="p-2 text-right font-mono font-bold text-slate-600">
                                                      {taskBeban.toLocaleString()} mnt
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        )}
                                      </div>
                                    </div>

                                    {/* Mathematical steps solver visually rendered */}
                                    <div className="md:col-span-5 bg-white border p-4 rounded-sm shadow-3xs space-y-3">
                                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono">
                                        Langkah Kalkulator Otomatis
                                      </div>
                                      
                                      <div className="space-y-2.5 leading-relaxed font-sans text-slate-700">
                                        <div className="flex justify-between items-start text-[11px] border-b pb-1.5">
                                          <span className="text-slate-500">1. Total Beban Kerja (Y)</span>
                                          <span className="font-mono font-bold text-slate-900">
                                            {metrics.totalBeban.toLocaleString()} Menit / Tahun
                                          </span>
                                        </div>

                                        <div className="flex justify-between items-start text-[11px] border-b pb-1.5">
                                          <span className="text-slate-500">2. Konstanta WKE</span>
                                          <span className="font-mono font-bold text-slate-900">
                                            {wke.toLocaleString()} Menit / Tahun
                                          </span>
                                        </div>

                                        {/* Division formula step */}
                                        <div className="bg-blue-50/50 p-2.5 rounded-sm border border-blue-100 font-mono text-[11px] space-y-1">
                                          <div className="text-slate-500 text-[10px] uppercase font-bold">
                                            3. Pembagian Formula (Y/WKE)
                                          </div>
                                          <div className="text-blue-900 font-bold flex justify-between">
                                            <span>
                                              {metrics.totalBeban.toLocaleString()} ÷ {wke.toLocaleString()} =
                                            </span>
                                            <span className="text-xs">{metrics.decimal.toFixed(4)} Orang</span>
                                          </div>
                                        </div>

                                        {/* Rounding info */}
                                        <div className="flex justify-between items-start text-[11px] border-b pb-1.5">
                                          <span className="text-slate-500">4. Pembulatan Standar</span>
                                          <span className="font-mono font-bold text-blue-800">
                                            Math.round({metrics.decimal.toFixed(4)}) = {metrics.rounded} Orang
                                          </span>
                                        </div>

                                        <div className="flex justify-between items-start text-[11px]">
                                          <span className="text-slate-500">5. Pegawai Riil vs Kebutuhan</span>
                                          <div className="text-right">
                                            <div className="font-mono font-bold">
                                              {j.pegawaiRiil} Orang vs {metrics.rounded} Orang
                                            </div>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs ${
                                              metrics.diff < 0 ? "bg-red-50 text-red-700 border border-red-100" : metrics.diff > 0 ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            }`}>
                                              Selisih: {metrics.diff > 0 ? `+${metrics.diff}` : metrics.diff} ({metrics.evalStatus})
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        
        /* 2. PRINT PREVIEW WINDOW & PRINT-SPECIFIC STYLING LAYOUT */
        <div className="bg-slate-50 p-4 md:p-8 rounded-sm border border-slate-300 shadow-sm space-y-6">
          
          {/* Top Panel to go back or print */}
          <div className="flex items-center justify-between bg-white p-4 rounded-sm border print:hidden select-none border-l-4 border-l-slate-850">
            <button
              onClick={() => setPrintTarget(null)}
              className="px-4 py-2 hover:bg-slate-105 rounded-sm text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 border cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Tabel Rekap
            </button>
            <div className="flex gap-2">
              <span className="text-[10px] text-slate-450 mr-2 flex items-center font-bold uppercase tracking-widest leading-none">
                💡 Tekan CTRL+P di browser jika print dialog tidak otomatis terbuka.
              </span>
              <button
                onClick={executePrint}
                className="px-5 py-2 bg-blue-650 hover:bg-blue-700 text-white rounded-sm font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Cetak Sekarang (PDF)
              </button>
            </div>
          </div>

          {/* OFFICIAL A4 REPORT CONTENT BOUNDARIES */}
          <div className="bg-white p-8 md:p-12 rounded-sm shadow-inner max-w-4xl mx-auto border font-serif text-[12px] leading-relaxed text-black print:p-0 print:border-0 print:shadow-none print:max-w-none">
            
            {/* A. TARGET 1: ALL RECAPPING MATRIX */}
            {printTarget.type === "recap-all" && (
              <div id="print-recap" className="space-y-6">
                <div className="text-center space-y-1.5 border-b-2 border-double border-black pb-4">
                  {settings.namaInstansi.toLowerCase().includes("mahkamah agung") || settings.namaInstansi.toLowerCase().includes("peradilan agama") ? (
                    <>
                      <h1 className="text-sm md:text-base font-bold uppercase tracking-wide">MAHKAMAH AGUNG REPUBLIK INDONESIA</h1>
                      <h2 className="text-sm md:text-base font-bold uppercase tracking-wider">DIREKTORAT JENDERAL BADAN PERADILAN AGAMA</h2>
                    </>
                  ) : (
                    <>
                      <h1 className="text-sm md:text-base font-bold uppercase tracking-wide">PEMERINTAH REPUBLIK INDONESIA</h1>
                      <h2 className="text-sm md:text-base font-bold uppercase tracking-wider">{settings.namaInstansi}</h2>
                    </>
                  )}
                  <p className="text-[10px] font-sans text-slate-600 font-normal">{settings.alamat || "Alamat Instansi Pemerintah"}</p>
                </div>

                <div className="text-center py-4 space-y-1">
                  <h3 className="text-sm font-bold uppercase underline">REKAPITULASI ANALISIS JABATAN DAN BEBAN KERJA (ABK) FORM</h3>
                  <p className="text-[10px] uppercase font-sans">BERDASARKAN PERMENPAN-RB NOMOR 1 TAHUN 2020</p>
                </div>

                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 text-center font-bold">
                      <th className="border border-black py-2 px-1 w-10">No</th>
                      <th className="border border-black py-2 px-2 text-left">Unit Kerja Organisasi</th>
                      <th className="border border-black py-2 px-2 text-left animate-fadeIn">Nama Jabatan ASN</th>
                      <th className="border border-black py-2 px-1 w-12">Kelas (Grade)</th>
                      <th className="border border-black py-2 px-1 w-20">Bezetting (Riil)</th>
                      <th className="border border-black py-2 px-1 w-20">Fisik ABK</th>
                      <th className="border border-black py-2 px-1 w-20">Kebutuhan Formasi</th>
                      <th className="border border-black py-2 px-1 w-16">Selisih</th>
                      <th className="border border-black py-2 px-2">Keterangan / Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJabatans.map((j, idx) => {
                      const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
                      const metrics = getJobAbkMetrics(j);
                      return (
                        <tr key={j.id} className="text-center font-sans">
                          <td className="border border-black py-2 px-1">{idx + 1}</td>
                          <td className="border border-black py-2 px-2 text-left font-bold">{unit ? unit.nama : "-"}</td>
                          <td className="border border-black py-2 px-2 text-left font-sans">{j.nama}</td>
                          <td className="border border-black py-2 px-1 font-mono font-bold">{j.kelasJabatan}</td>
                          <td className="border border-black py-2 px-1 font-mono">{j.pegawaiRiil}</td>
                          <td className="border border-black py-2 px-1 font-mono">{metrics.decimal.toFixed(2)}</td>
                          <td className="border border-black py-2 px-1 font-mono font-bold bg-slate-50">{metrics.rounded}</td>
                          <td className="border border-black py-2 px-1 font-mono font-bold">{metrics.diff > 0 ? `+${metrics.diff}` : metrics.diff}</td>
                          <td className="border border-black py-2 px-2 text-left text-[10px] font-sans">{metrics.evalStatus} - {metrics.actionTip}</td>
                        </tr>
                      );
                    })}
                    {/* Sum row */}
                    <tr className="font-bold bg-slate-100 text-center font-mono">
                      <td colSpan={4} className="border border-black py-2 px-2 text-right text-xs font-serif uppercase">Total Akumulatif:</td>
                      <td className="border border-black py-2 px-1">{totalRiil}</td>
                      <td className="border border-black py-2 px-1">{totalKebutuhanDecimal.toFixed(2)}</td>
                      <td className="border border-black py-2 px-1">{totalKebutuhanBulat}</td>
                      <td className="border border-black py-2 px-1">{netSurplusDeficit > 0 ? `+${netSurplusDeficit}` : netSurplusDeficit}</td>
                      <td className="border border-black py-2 px-2 text-left font-sans text-xs">
                        {netSurplusDeficit < 0 ? "Usulan Rekrutmen Formasi CPNS/PPPK Baru" : netSurplusDeficit > 0 ? "Kelebihan Pegawai (Redistribusi)" : "SDM Instansi Ideal"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* SIGNATURE AREA SECTION */}
                <div className="pt-8 flex justify-end">
                  <div className="w-80 text-center space-y-16">
                    <div>
                      <p className="font-sans">Jakarta, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                      <p className="font-bold uppercase text-[11px] font-sans mt-1">{primaryKepalaJabatan}</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-xs font-sans">{primaryKepalaNama}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-normal">NIP. {primaryKepalaNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. TARGET 2: SINGLE ANJAB RECP REPORT SHEET */}
            {printTarget.type === "anjab-single" && (
              <div id="print-anjab-single" className="space-y-6">
                
                {/* Header */}
                <div className="border border-black p-4 text-center font-sans space-y-1 relative">
                  <span className="absolute top-2 right-2 text-[9px] font-bold border border-black px-1 uppercase leading-none rounded">Formulir ANJAB - I</span>
                  <h1 className="text-xs md:text-sm font-bold uppercase">LAMPIRAN I REFORMASI BIROKRASI</h1>
                  <h2 className="text-xs md:text-sm font-bold uppercase leading-tight">DOKUMEN ANALISIS JABATAN (ANJAB) ASN</h2>
                </div>

                {/* Subtitle info and basic identifiers */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-4 font-sans font-bold">
                    <span className="col-span-1">1. Nama Jabatan</span>
                    <span className="col-span-3">: {printTarget.jabatan.nama}</span>
                  </div>
                  <div className="grid grid-cols-4 font-sans">
                    <span className="col-span-1 font-bold">2. Unit Kerja</span>
                    <span className="col-span-3">: {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.nama || "Tanpa Unit"}</span>
                  </div>
                  <div className="grid grid-cols-4 font-sans/50">
                    <span className="col-span-1 font-bold">3. Kelas Jabatan</span>
                    <span className="col-span-3">: Kelas (Grade) {printTarget.jabatan.kelasJabatan}</span>
                  </div>
                </div>

                {/* Detailed Sections following Regulation formats */}
                <div className="space-y-5">
                  
                  {/* Ikhtisar Section */}
                  <div className="space-y-1 p-2 bg-slate-50/50 rounded border border-black/10">
                    <h3 className="font-sans font-bold text-xs uppercase underline">4. Ikhtisar Jabatan (Job Summary)</h3>
                    <p className="font-sans text-slate-700 italic leading-relaxed text-xs">"{printTarget.jabatan.iktisar}"</p>
                  </div>

                  {/* Kualifikasi Section */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-xs uppercase underline">5. Kualifikasi Jabatan Minimal</h3>
                    <div className="grid grid-cols-4 pl-4 gap-y-1.5">
                      <span className="font-medium">a. Pendidikan</span>
                      <span className="col-span-3">: {printTarget.jabatan.kualifikasi?.pendidikanMinimal || "-"}</span>
                      
                      <span className="font-medium">b. Jurusan</span>
                      <span className="col-span-3">: {printTarget.jabatan.kualifikasi?.jurusan && printTarget.jabatan.kualifikasi.jurusan.length > 0 ? printTarget.jabatan.kualifikasi.jurusan.join(", ") : "-"}</span>
                      
                      <span className="font-medium">c. Pelatihan</span>
                      <span className="col-span-3">: {printTarget.jabatan.kualifikasi?.pelatihan || "-"}</span>
                      
                      <span className="font-medium">d. Pengalaman</span>
                      <span className="col-span-3">: {printTarget.jabatan.kualifikasi?.pengalaman || "-"}</span>
                    </div>
                  </div>

                  {/* Duties list section */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-xs uppercase underline">6. Tugas Pokok DanButir Kegiatan</h3>
                    <table className="w-full border border-black">
                      <thead>
                        <tr className="bg-slate-50 text-center font-bold">
                          <th className="border border-black py-1 px-1 w-8">No</th>
                          <th className="border border-black py-1 px-2 text-left">Uraian Butir Kegiatan Pokok</th>
                          <th className="border border-black py-1 px-2 w-28">Satuan Hasil</th>
                          <th className="border border-black py-1 px-1 w-20">WP (Menit)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printTarget.jabatan.uraianTugas.map((t, index) => (
                          <tr key={t.id} className="text-center">
                            <td className="border border-black py-1.5 px-1">{index + 1}</td>
                            <td className="border border-black py-1.5 px-2 text-left leading-normal">{t.uraian}</td>
                            <td className="border border-black py-1.5 px-2 text-center">{t.hasilKerja}</td>
                            <td className="border border-black py-1.5 px-1 font-mono">{t.waktuPenyelesaian}</td>
                          </tr>
                        ))}
                        {printTarget.jabatan.uraianTugas.length === 0 && (
                          <tr>
                            <td colSpan={4} className="border border-black py-3 text-center italic text-slate-400">Belum ada butir kegiatan teknis diatur dlm ABK.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Requirements detailed listing */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-xs uppercase underline">7. Syarat Jabatan (PermenPAN)</h3>
                    <div className="grid grid-cols-4 pl-4 gap-y-2">
                      <span className="font-medium">a. Pangkat/Gol</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.pangkatGolongan || "-"}</span>

                      <span className="font-medium">b. Bakat Kerja</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.bakatKerja && printTarget.jabatan.syaratJabatan.bakatKerja.length > 0 ? printTarget.jabatan.syaratJabatan.bakatKerja.join(", ") : "-"}</span>

                      <span className="font-medium">c. Temperamen</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.temperamenKerja && printTarget.jabatan.syaratJabatan.temperamenKerja.length > 0 ? printTarget.jabatan.syaratJabatan.temperamenKerja.join(", ") : "-"}</span>

                      <span className="font-medium">d. Minat Kerja</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.minatKerja && printTarget.jabatan.syaratJabatan.minatKerja.length > 0 ? printTarget.jabatan.syaratJabatan.minatKerja.join(", ") : "-"}</span>

                      <span className="font-medium">e. Upaya Fisik</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.upayaFisik && printTarget.jabatan.syaratJabatan.upayaFisik.length > 0 ? printTarget.jabatan.syaratJabatan.upayaFisik.join(", ") : "-"}</span>

                      <span className="font-medium">f. Kondisi Fisik</span>
                      <span className="col-span-3">: {printTarget.jabatan.syaratJabatan?.kondisiFisik || "-"}</span>
                    </div>
                  </div>

                </div>

                {/* Form signatures - pulling working unit kepala */}
                <div className="pt-10 flex justify-between">
                  <div className="w-64 text-center space-y-14 font-sans text-[11px]">
                    <p className="invisible">Batas Blanko</p>
                    <p className="font-bold underline leading-tight">Petugas Analis Jabatan</p>
                    <p className="text-[10px] text-slate-400 font-mono">NIP. __________________</p>
                  </div>

                  <div className="w-72 text-center space-y-14 font-sans text-[11px]">
                    <div>
                      <p>Jakarta, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                      <p className="font-semibold uppercase tracking-tight mt-1">Kepala Unit Organisasi</p>
                    </div>
                    <div>
                      <p className="font-bold underline leading-tight">
                        {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.kepalaNama || "Siti Rahmawati, S.Sos., M.A."}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        NIP. {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.kepalaNip || "19781102 200212 2 003"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* C. TARGET 3: INVIDIUAL ABK FORM REPORT */}
            {printTarget.type === "abk-single" && (
              <div id="print-abk-single" className="space-y-6">
                
                {/* Document Header block */}
                <div className="border border-black p-4 text-center font-sans space-y-1 relative">
                  <span className="absolute top-2 right-2 text-[9px] font-bold border border-black px-1 uppercase leading-none rounded">Formulir ABK - II</span>
                  <h1 className="text-xs md:text-sm font-bold uppercase">LAMPIRAN II REFORMASI BIROKRASI</h1>
                  <h2 className="text-xs md:text-sm font-bold uppercase leading-tight">FORMULIR PERHITUNGAN ANALISIS BEBAN KERJA (ABK) JABATAN</h2>
                </div>

                {/* Subtitle info and basic identifiers */}
                <div className="space-y-3 pl-1 text-xs font-sans">
                  <div className="grid grid-cols-4 font-bold">
                    <span>1. Nama Jabatan</span>
                    <span className="col-span-3">: {printTarget.jabatan.nama}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span>2. Unit Kerja</span>
                    <span className="col-span-3">: {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.nama || "Tanpa Unit"}</span>
                  </div>
                  <div className="grid grid-cols-4 font-mono">
                    <span>3. Konstanta WKE</span>
                    <span className="col-span-3">: {wke.toLocaleString()} Menit</span>
                  </div>
                </div>

                {/* ABK Calculation grid sheets */}
                <table className="w-full border border-black text-[11px] font-sans">
                  <thead>
                    <tr className="bg-slate-50 border border-black text-center font-bold font-sans">
                      <th className="border border-black py-2 px-1 w-10">No</th>
                      <th className="border border-black py-2 px-3 text-left">Uraian Butir Kegiatan Tugas Pokok</th>
                      <th className="border border-black py-2 px-2">Satuan Hasil</th>
                      <th className="border border-black py-2 px-1 w-20">WP (Menit / Hasil)</th>
                      <th className="border border-black py-2 px-1 w-20">Volume (1 Thn)</th>
                      <th className="border border-black py-2 px-1 w-24">Jumlah Beban Menit (WP × Vol)</th>
                      <th className="border border-black py-2 px-2 w-28">Kebutuhan Pegawai hasil (Beban ÷ WKE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printTarget.jabatan.uraianTugas.map((t, idx) => {
                      const totalBebanMenit = t.waktuPenyelesaian * t.bebanKerja;
                      const taskNeeded = totalBebanMenit / wke;

                      return (
                        <tr key={t.id} className="text-center font-sans tracking-tight">
                          <td className="border border-black py-2 px-1">{idx + 1}</td>
                          <td className="border border-black py-2 px-3 text-left leading-normal">{t.uraian}</td>
                          <td className="border border-black py-2 px-2 text-center">{t.hasilKerja}</td>
                          <td className="border border-black py-2 px-1 font-mono">{t.waktuPenyelesaian}</td>
                          <td className="border border-black py-2 px-1 font-mono">{t.bebanKerja}</td>
                          <td className="border border-black py-2 px-1 font-mono">{totalBebanMenit.toLocaleString()}</td>
                          <td className="border border-black py-2 px-2 font-mono font-bold text-xs">{taskNeeded.toFixed(3)}</td>
                        </tr>
                      );
                    })}

                    {/* Aggregate total rows */}
                    <tr className="font-bold bg-slate-100 text-center font-mono">
                      <td colSpan={5} className="border border-black py-2 px-3 text-right">JUMLAH BEBAN TOTAL JABATAN (MENIT):</td>
                      <td className="border border-black py-2 px-1">
                        {printTarget.jabatan.uraianTugas.reduce((sum, t) => sum + (t.waktuPenyelesaian * t.bebanKerja), 0).toLocaleString()}
                      </td>
                      <td className="border border-black py-2 px-2 text-xs">
                        {printTarget.jabatan.uraianTugas.reduce((sum, t) => sum + ((t.waktuPenyelesaian * t.bebanKerja)/wke), 0).toFixed(3)}
                      </td>
                    </tr>

                    <tr className="font-bold bg-slate-50 text-center font-mono">
                      <td colSpan={6} className="border border-black py-2.5 px-3 text-right">PEMBULATAN KEBUTUHAN FORMASI PEGAWAI (REKOMENDASI CPNS/PPPK):</td>
                      <td className="border border-black py-2.5 px-2 text-sm text-cyan-700 bg-cyan-50">
                        {Math.round(printTarget.jabatan.uraianTugas.reduce((sum, t) => sum + ((t.waktuPenyelesaian * t.bebanKerja)/wke), 0) || (printTarget.jabatan.uraianTugas.length > 0 ? 1 : 0))} PNS
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Signtures sheet pulls divisions supervisors */}
                <div className="pt-10 flex justify-between select-none">
                  <div className="w-64 text-center space-y-12 font-sans text-xs">
                    <p className="invisible">Blanko space</p>
                    <p className="font-bold underline leading-tight">Analis Kepegawaian Penyusun</p>
                    <p className="text-[10px] text-slate-400 font-mono">NIP. __________________</p>
                  </div>

                  <div className="w-72 text-center space-y-12 font-sans text-xs">
                    <div>
                      <p>Jakarta, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                      <p className="font-bold uppercase mt-1">Kepala Unit Kerja Organisasi</p>
                    </div>
                    <div>
                      <p className="font-bold underline leading-tight">
                        {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.kepalaNama || "Rindra Wardana, S.Kom., M.T."}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        NIP. {unitKerjaList.find(u => u.id === printTarget.jabatan.unitKerjaId)?.kepalaNip || "19800523 200501 1 012"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
    <PrintRecap jabatanList={filteredJabatans} unitKerjaList={unitKerjaList} settings={settings} wke={wke} />
    </>
  );
}
