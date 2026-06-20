import React, { useState } from "react";
import { Jabatan, UnitKerja, UserRole, AppSettings } from "../types";
import { PrintDashboard } from "./PrintDashboard";
import { 
  Building2, 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  MousePointerClick,
  BarChart4,
  PieChart as PieChartIcon,
  Scaling,
  ArrowRightLeft,
  Search
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

// Beautiful custom tooltip for Recharts bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-850 text-white p-3 shadow-md rounded-sm text-[11px] font-sans space-y-1.5 min-w-[200px]">
        <p className="font-extrabold border-b border-slate-800 pb-1.5 text-slate-200 uppercase tracking-wide truncate max-w-[240px]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px]">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-mono font-black text-white">
              {entry.value} Orang
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for Pie/Donut Chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-800 text-white p-3 shadow-md rounded-sm text-[11px] font-sans space-y-1.5 min-w-[180px]">
        <p className="font-bold border-b border-slate-800 pb-1 text-slate-200 uppercase tracking-wide truncate">{data.name}</p>
        <div className="flex justify-between items-center gap-4 py-0.5">
          <span className="text-slate-400 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: data.fill }} />
            Kebutuhan:
          </span>
          <span className="font-mono font-black text-blue-400">
            {data.value} Formasi
          </span>
        </div>
        <div className="flex justify-between items-center gap-4 py-0.5">
          <span className="text-slate-400 font-bold uppercase text-[9px]">Proporsi:</span>
          <span className="font-mono font-black text-emerald-400">
            {data.percent ? `${(data.percent * 100).toFixed(1)}%` : ""}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Colors for the pie/donut slices
const COLOR_PALETTE = [
  "#2563eb", // Blue 600
  "#0ea5e9", // Sky 500
  "#10b981", // Emerald 500
  "#8b5cf6", // Violet 500
  "#f59e0b", // Amber 500
  "#ec4899", // Pink 500
  "#14b8a6", // Teal 500
  "#f97316"  // Orange 500
];

const MONTHLY_TENDENSI_DATA = [
  { month: "Jul 25", "Cerai Gugat": 58, "Cerai Talak": 22, "Isbat Nikah": 12, "Waris": 2, "Ekonomi Syariah": 1, "Dispensasi Kawin": 8, "Total Perkara": 103 },
  { month: "Agt 25", "Cerai Gugat": 62, "Cerai Talak": 24, "Isbat Nikah": 10, "Waris": 3, "Ekonomi Syariah": 1, "Dispensasi Kawin": 7, "Total Perkara": 107 },
  { month: "Sep 25", "Cerai Gugat": 55, "Cerai Talak": 20, "Isbat Nikah": 15, "Waris": 2, "Ekonomi Syariah": 0, "Dispensasi Kawin": 9, "Total Perkara": 101 },
  { month: "Okt 25", "Cerai Gugat": 60, "Cerai Talak": 21, "Isbat Nikah": 11, "Waris": 1, "Ekonomi Syariah": 2, "Dispensasi Kawin": 6, "Total Perkara": 101 },
  { month: "Nov 25", "Cerai Gugat": 64, "Cerai Talak": 26, "Isbat Nikah": 14, "Waris": 4, "Ekonomi Syariah": 1, "Dispensasi Kawin": 5, "Total Perkara": 114 },
  { month: "Des 25", "Cerai Gugat": 50, "Cerai Talak": 18, "Isbat Nikah": 8,  "Waris": 2, "Ekonomi Syariah": 1, "Dispensasi Kawin": 12, "Total Perkara": 91 },
  { month: "Jan 26", "Cerai Gugat": 72, "Cerai Talak": 28, "Isbat Nikah": 18, "Waris": 3, "Ekonomi Syariah": 2, "Dispensasi Kawin": 10, "Total Perkara": 133 },
  { month: "Feb 26", "Cerai Gugat": 68, "Cerai Talak": 25, "Isbat Nikah": 13, "Waris": 2, "Ekonomi Syariah": 1, "Dispensasi Kawin": 8, "Total Perkara": 117 },
  { month: "Mar 26", "Cerai Gugat": 59, "Cerai Talak": 23, "Isbat Nikah": 16, "Waris": 1, "Ekonomi Syariah": 1, "Dispensasi Kawin": 7, "Total Perkara": 107 },
  { month: "Apr 26", "Cerai Gugat": 65, "Cerai Talak": 22, "Isbat Nikah": 12, "Waris": 3, "Ekonomi Syariah": 2, "Dispensasi Kawin": 9, "Total Perkara": 113 },
  { month: "Mei 26", "Cerai Gugat": 74, "Cerai Talak": 30, "Isbat Nikah": 19, "Waris": 4, "Ekonomi Syariah": 3, "Dispensasi Kawin": 11, "Total Perkara": 141 },
  { month: "Jun 26", "Cerai Gugat": 70, "Cerai Talak": 27, "Isbat Nikah": 15, "Waris": 2, "Ekonomi Syariah": 1, "Dispensasi Kawin": 8, "Total Perkara": 123 },
];

const CASE_TYPES_METRICS = [
  { 
    key: "all", 
    label: "Semua Rumpun Perkara", 
    impactedJabatan: "Panitera Pengganti, Jurusita, Analis Perkara Peradilan",
    color: "#2563eb",
    desc: "Mencakup seluruh perkara di peradilan agama beban tugas kepaniteraan secara makro."
  },
  { 
    key: "Cerai Gugat", 
    label: "Cerai Gugat", 
    impactedJabatan: "Jurusita (Panggilan Tergugat), Panitera Pengganti (Risalah Sidang / BAS)",
    color: "#ec4899",
    desc: "Volume tertinggi di pengadilan agama, mendominasi frekuensi perjalanan Jurusita untuk summons & pendaftaran sidang Panitera Pengganti."
  },
  { 
    key: "Cerai Talak", 
    label: "Cerai Talak", 
    impactedJabatan: "Jurusita (Pemberitahuan Panggilan), Panitera Pengganti (Sidang Ikrar Talak)",
    color: "#f43f5e",
    desc: "Memiliki proses tambahan sidang pembacaan ikrar talak, memicu beban kerja ganda bagi Panitera Pengganti."
  },
  { 
    key: "Isbat Nikah", 
    label: "Isbat Nikah", 
    impactedJabatan: "Panitera Pengganti (Sidang Tunggal / Verifikasi Bukti)",
    color: "#8b5cf6",
    desc: "Merupakan perkara volunter yang sering diselesaikan lewat sidang terpadu keliling, membutuhkan mobilisasi administrasi khusus."
  },
  { 
    key: "Waris", 
    label: "Kewarisan / Waris", 
    impactedJabatan: "Analis Perkara Peradilan (Telaah Yuridis), Panitera Pengganti (Sidang Descente / Pemeriksaan Lapangan)",
    color: "#10b981",
    desc: "Kasus tingkat kompleksitas yudisial sangat tinggi, memerlukan telaah bukti tertulis ekstensif dari Analis Perkara sebelum sidang descente."
  },
  { 
    key: "Ekonomi Syariah", 
    label: "Ekonomi Syariah", 
    impactedJabatan: "Analis Perkara Peradilan (Konsep Resume & Kajian Akad), Panitera (Supervisi Mediasi)",
    color: "#f59e0b",
    desc: "Perkara bernilai nominal besar dan berlandaskan sengketa korporat/perbankan syariah, membutuhkan beban telaahan kritis substantif."
  },
  { 
    key: "Dispensasi Kawin", 
    label: "Dispensasi Kawin", 
    impactedJabatan: "Panitera Pengganti (Pemeriksaan Cepat / Ringkas)",
    color: "#14b8a6",
    desc: "Wajib disidangkan segera dengan tenggat waktu singkat, menuntut prioritas penyusunan berkas perkara secara kilat."
  }
];

interface DashboardTabProps {
  unitKerja: UnitKerja[];
  jabatan: Jabatan[];
  wke: number;
  setActiveTab: (tab: string) => void;
  setSelectedJabatanIdForAbk?: (id: string) => void;
  userRole: UserRole;
  settings: AppSettings;
}

export default function DashboardTab({ 
  unitKerja, 
  jabatan, 
  wke, 
  setActiveTab,
  setSelectedJabatanIdForAbk,
  userRole,
  settings
}: DashboardTabProps) {

  const [activeChartPerspective, setActiveChartPerspective] = useState<"comparison" | "donut" | "gap">("comparison");
  const [selectedCaseTypeTrend, setSelectedCaseTypeTrend] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const handleExportCleanPDF = async () => {
    setIsPrinting(true);
    // Give time to render the print component
    setTimeout(async () => {
      const element = document.getElementById('printable-dashboard');
      if (!element) {
        setIsPrinting(false);
        return;
      }

      // Temporarily remove hidden and print:block classes to capture
      element.classList.remove('hidden');
      element.classList.remove('print:block');
      
      const canvas = await html2canvas(element, { scale: 2 });
      
      // Restore classes
      element.classList.add('hidden');
      element.classList.add('print:block');
      setIsPrinting(false);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ringkasan_Analisis_Beban_Kerja_${settings.namaInstansi.replace(/\s+/g, '_')}.pdf`);
    }, 100);
  };


  // Calculations
  const totalUnits = unitKerja.length;
  const totalJabatan = jabatan.length;
  
  const totalPegawaiRiil = jabatan.reduce((sum, j) => sum + Number(j.pegawaiRiil || 0), 0);
  
  // Calculate total ASN needed across all positions based on ABK
  const totalKebutuhan = jabatan.reduce((sum, j) => {
    const jobNeeded = j.uraianTugas.reduce((tSum, task) => {
      return tSum + ((task.waktuPenyelesaian * task.bebanKerja) / wke);
    }, 0);
    return sum + jobNeeded;
  }, 0);

  // Calculate total workload (Required Capacity) and Total Available Capacity
  const totalWorkloadHours = jabatan.reduce((sum, j) => 
    sum + j.uraianTugas.reduce((tSum, task) => tSum + (task.waktuPenyelesaian * task.bebanKerja), 0), 0
  );
  const totalAvailableCapacity = totalPegawaiRiil * wke;

  const workloadChartData = [
    { name: "Kapasitas Tersedia", value: totalAvailableCapacity, fill: "#10b981" }, // Emerald 500
    { name: "Beban Kerja", value: totalWorkloadHours, fill: "#f43f5e" } // Rose 500
  ];

  // Round Kebutuhan for individual jobs and sum up, representing the integer ASN formations (Formasi Bulat)
  const totalFormasiBulat = jabatan.reduce((sum, j) => {
    const jobNeeded = j.uraianTugas.reduce((tSum, task) => {
      return tSum + ((task.waktuPenyelesaian * task.bebanKerja) / wke);
    }, 0);
    return sum + Math.round(jobNeeded || 1); // standard rounding, minimum of 1 if there's workload
  }, 0);

  const selisihTotal = totalPegawaiRiil - totalFormasiBulat;

  // Working unit statistics table
  const unitStats = unitKerja.map(unit => {
    const unitJabatans = jabatan.filter(j => j.unitKerjaId === unit.id);
    const jCount = unitJabatans.length;
    const realCount = unitJabatans.reduce((sum, j) => sum + Number(j.pegawaiRiil || 0), 0);
    const needCountDecimal = unitJabatans.reduce((sum, j) => {
      const jobNeeded = j.uraianTugas.reduce((tSum, t) => tSum + ((t.waktuPenyelesaian * t.bebanKerja) / wke), 0);
      return sum + jobNeeded;
    }, 0);
    const needCountRound = unitJabatans.reduce((sum, j) => {
      const jobNeeded = j.uraianTugas.reduce((tSum, t) => tSum + ((t.waktuPenyelesaian * t.bebanKerja) / wke), 0);
      return sum + Math.round(jobNeeded || 1);
    }, 0);

    return {
      ...unit,
      jCount,
      realCount,
      needCountDecimal,
      needCountRound,
      diff: realCount - needCountRound
    };
  });

  return (
    <div id="dashboard-tab-container" className="space-y-8 animate-fadeIn text-slate-900">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-slate-900 text-white rounded-lg p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-605/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-slate-850 border border-slate-700 text-blue-400 rounded-sm text-[10px] font-bold tracking-widest uppercase">
              Sesuai PermenPAN-RB No. 1 Tahun 2020
            </span>
            <span className="px-3 py-1 bg-blue-900/40 border border-blue-800/80 text-blue-300 rounded-sm text-[10px] font-bold tracking-widest uppercase font-mono">
              SK SEKMA NO. 415/SEK/SK/V/2019
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-white">
            Sistem Informasi Analisis Jabatan &amp; Beban Kerja ASN
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            Permudah penghitungan formasi ASN, penyusunan peta jabatan, dan analisis beban kerja 
            di lingkungan Mahkamah Agung RI secara akurat, terstruktur, dan otomatis sesuai standar nasional serta ketetapan Sekretariat Mahkamah Agung.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => setActiveTab("anjab")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-sm transition-all shadow-md uppercase tracking-wider"
            >
              Mulai Analisis Jabatan
            </button>
            <button 
              onClick={() => setActiveTab("recap")}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs rounded-sm transition-all uppercase tracking-wider"
            >
              Lihat Rekap Formasi
            </button>
            <button 
              onClick={handleExportCleanPDF}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm transition-all shadow-md uppercase tracking-wider flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              {isPrinting ? "Menyiapkan..." : "Export Summary (PDF)"}
            </button>
          </div>
        </div>
      </div>

      <PrintDashboard 
        unitKerja={unitKerja}
        jabatan={jabatan}
        wke={wke}
        settings={settings}
      />

      <div className="flex bg-white border border-slate-200 rounded-lg p-2 items-center shadow-sm">
        <Search className="w-5 h-5 text-slate-400 mx-3" />
        <input
          type="text"
          placeholder="Cari Jabatan atau Unit Kerja..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm outline-none px-2 py-2"
        />
      </div>

      {/* Metric Cards Grid - Styled as border-l-4 with solid geometric panels */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Total Unit Kerja */}
        <div className="border-l-4 border-slate-700 bg-white p-5 shadow-sm border border-slate-200/80 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Unit Kerja</p>
              <h3 className="text-3xl font-black font-sans text-slate-800 mt-1">{totalUnits}</h3>
            </div>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-sm">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Total bidang/sekretariat
          </div>
        </div>

        {/* Total Jabatan */}
        <div className="border-l-4 border-blue-600 bg-white p-5 shadow-sm border border-slate-200/80 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Formasi Jabatan</p>
              <h3 className="text-3xl font-black font-sans text-slate-800 mt-1">{totalJabatan}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-sm">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
            Materi Jabatan Dinas
          </div>
        </div>

        {/* Pegawai Riil */}
        <div className="border-l-4 border-amber-500 bg-white p-5 shadow-sm border border-slate-200/80 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Pegawai Riil (Bezetting)</p>
              <h3 className="text-3xl font-black font-sans text-slate-800 mt-1">{totalPegawaiRiil} <span className="text-xs font-normal text-slate-500">Orang</span></h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-amber-600 font-bold uppercase tracking-wider">
            Pegawai Aktif Saat Ini
          </div>
        </div>

        {/* Kebutuhan Pegawai */}
        <div className="border-l-4 border-emerald-500 bg-white p-5 shadow-sm border border-slate-200/80 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Kebutuhan ASN (Kalkulasi)</p>
              <h3 className="text-3xl font-black font-sans text-slate-800 mt-1">
                {totalKebutuhan.toFixed(1)} 
                <span className="text-xs font-normal text-slate-500 ml-1">({totalFormasiBulat} Bulat)</span>
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[11px] font-bold">
            {selisihTotal < 0 ? (
              <span className="text-red-650 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100 flex items-center gap-1 w-max">
                <AlertTriangle className="w-3 h-3" /> Kurang {Math.abs(selisihTotal)} Pegawai
              </span>
            ) : selisihTotal > 0 ? (
              <span className="text-amber-655 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-100 flex items-center gap-1 w-max">
                <AlertTriangle className="w-3 h-3" /> Lebih {selisihTotal} Pegawai
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 flex items-center gap-1 w-max">
                <CheckCircle className="w-3 h-3" /> SDM Ideal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Charts & Regulation Formulas */}
      <div id="visuals-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Chart - SDM Per Unit Kerja with Interactive Modes */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 lg:col-span-2 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3.5 gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">
                Visualisasi Distribusi &amp; Analisis Beban Kerja
              </h3>
              <p className="text-slate-500 text-xs">Distribusi pegawai riil dan usulan formasi per unit kerja</p>
            </div>
            
            {/* Perspective Selector Toggles */}
            {unitStats.length > 0 && (
              <div className="flex bg-slate-50 border border-slate-200/80 p-0.5 rounded-sm shrink-0">
                <button
                  onClick={() => setActiveChartPerspective("comparison")}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1 ${
                    activeChartPerspective === "comparison"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Komparasi Bezetting vs Kebutuhan"
                >
                  <BarChart4 className="w-3.5 h-3.5" />
                  Komparasi
                </button>
                <button
                  onClick={() => setActiveChartPerspective("donut")}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1 ${
                    activeChartPerspective === "donut"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Proporsi Usulan Formasi"
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  Proporsi
                </button>
                <button
                  onClick={() => setActiveChartPerspective("gap")}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1 ${
                    activeChartPerspective === "gap"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Kesenjangan SDM (Surplus/Defisit)"
                >
                  <Scaling className="w-3.5 h-3.5" />
                  Kesenjangan
                </button>
              </div>
            )}
          </div>

          {unitStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-450 border border-dashed rounded-lg bg-slate-50">
              <Building2 className="w-10 h-10 stroke-1 mb-2 text-slate-350" />
              <p className="text-xs font-semibold text-slate-600">Belum ada Unit Kerja terdaftar.</p>
              <p className="text-[10px] text-slate-400 mt-1">Tambahkan unit kerja terlebih dahulu untuk melihat grafik analisis.</p>
            </div>
          ) : (
            <div className="pt-2">
              {/* Perspective 1: SIDE BY SIDE COMPARATIVE BAR CHART */}
              {activeChartPerspective === "comparison" && (
                <div id="recharts-comparison-view" className="space-y-4">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={unitStats}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="nama" 
                          tickFormatter={(val) => val.length > 15 ? val.substring(0, 13) + "..." : val}
                          tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                          stroke="#cbd5e1"
                        />
                        <YAxis 
                          tick={{ fontSize: 9, fill: "#64748b" }} 
                          stroke="#cbd5e1"
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Legend 
                          verticalAlign="top" 
                          height={36} 
                          iconType="square"
                          iconSize={10}
                          wrapperStyle={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}
                        />
                        <Bar dataKey="realCount" name="Pegawai Riil (Bezetting)" fill="#64748b" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="needCountRound" name="Kebutuhan Formasi ASN" fill="#2563eb" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                    * Grafik di atas membandingkan jumlah pegawai saat ini (Bezetting) dengan jumlah usulan formasi ideal hasil konversi rumus beban kerja (PermenPAN-RB No. 1 Tahun 2020) per unit kerja.
                  </p>
                </div>
              )}

              {/* Perspective 2: DONUT CHART PROPORTION */}
              {activeChartPerspective === "donut" && (
                <div id="recharts-proportion-view" className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <div className="h-64 col-span-1 md:col-span-2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={unitStats}
                          dataKey="needCountRound"
                          nameKey="nama"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {unitStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total Indicator */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Total Usulan</span>
                      <span className="text-2xl font-black font-sans text-slate-800 leading-tight my-0.5">{totalFormasiBulat}</span>
                      <span className="text-[9px] text-slate-500 font-semibold leading-none">Formasi</span>
                    </div>
                  </div>

                  {/* Custom Donut Legend Panel */}
                  <div className="col-span-1 md:col-span-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block border-b pb-1">
                      Proporsi Formasi Per Unit Kerja
                    </span>
                    <div className="divide-y divide-slate-100">
                      {unitStats.map((u, index) => {
                        const percent = totalFormasiBulat > 0 ? (u.needCountRound / totalFormasiBulat) * 100 : 0;
                        return (
                          <div key={u.id} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate max-w-[180px]">
                              <span 
                                className="w-2.5 h-2.5 rounded-xs shrink-0 block" 
                                style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
                              />
                              <span className="font-bold text-slate-700 truncate">{u.nama}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 font-mono">
                              <span className="font-bold text-slate-805">{u.needCountRound} Kursi</span>
                              <span className="text-slate-400 font-bold text-[10px] w-12 text-right">{percent.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Perspective 3: SDS GAP / DEVIASI ANALYSIS */}
              {activeChartPerspective === "gap" && (
                <div id="recharts-gap-view" className="space-y-4">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={unitStats}
                        margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="nama" 
                          tickFormatter={(val) => val.length > 15 ? val.substring(0, 13) + "..." : val}
                          tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                          stroke="#cbd5e1"
                        />
                        <YAxis 
                          tick={{ fontSize: 9, fill: "#64748b" }} 
                          stroke="#cbd5e1"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Legend 
                          verticalAlign="top" 
                          height={30} 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase" }}
                        />
                        <Bar 
                          dataKey="diff" 
                          name="Selisih Kebutuhan (Bezetting - ABK)" 
                          radius={[2, 2, 0, 0]}
                        >
                          {unitStats.map((entry, index) => {
                            const isDeficit = entry.diff < 0;
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={isDeficit ? "#f43f5e" : entry.diff > 0 ? "#10b981" : "#cbd5e1"} 
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend guide for deficit vs surplus */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-sm">
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
                        <span>Surplus Pegawai</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span>
                        <span>Defisit / Kurang SDM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></span>
                        <span>Ideal / Seimbang</span>
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-slate-400 italic">
                      * Nilai positif (&gt;0) menunjukkan kelebihan sdm, nilai negatif (&lt;0) menunjukkan kekurangan sdm.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Regulation details */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-805 border-b pb-3">
              <FileText className="w-4.5 h-4.5 text-slate-700" />
              <h4 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight">Prinsip &amp; Rumus ABK</h4>
            </div>
            
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Berdasarkan <strong>PermenPAN-RB No. 1 Tahun 2020</strong> Bab II serta <strong>SK Sekretaris Mahkamah Agung (SEKMA) Nomor 415/SEK/SK/V/2019</strong>, 
                perhitungan analisis jabatan dan analisis beban kerja ditujukan untuk mengukur kapasitas kerja 
                guna menentukan rekomendasi jumlah formasi ASN yang seimbang dan representatif di lingkungan Mahkamah Agung RI.
              </p>

              <div className="bg-white border border-slate-200 p-3 rounded-sm space-y-2">
                <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide">Rumus Kebutuhan Pegawai</h5>
                <div className="bg-slate-50 py-2 px-3 rounded-sm text-center border border-slate-100 font-mono text-xs font-black text-slate-800">
                  Kebutuhan = (WP × Vol) ÷ WKE
                </div>
                <ul className="space-y-0.5 text-[10px] list-none pl-1 text-slate-500 font-semibold">
                  <li>• <strong className="text-slate-650">WP:</strong> Waktu Penyelesaian (Menit)</li>
                  <li>• <strong className="text-slate-650">Vol:</strong> Volume / Beban Kerja (Setahun)</li>
                  <li>• <strong className="text-slate-650">WKE:</strong> Waktu Kerja Efektif (Setahun)</li>
                </ul>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <h5 className="font-bold text-slate-850 uppercase text-[10px]">Waktu Kerja Efektif (WKE)</h5>
                <p className="text-slate-500">
                  WKE standar adalah <strong className="text-slate-700">75.000 menit/tahun</strong> untuk instansi 5 hari (equivalent 1.250 jam/tahun). 
                  Anda dapat mengubah data WKE ini di menu 
                  <button 
                    onClick={() => setActiveTab("settings")} 
                    className="font-bold text-blue-600 hover:underline mx-1 focus:outline-none"
                  >
                    Pengaturan
                  </button> 
                  jika menggunakan 6 hari kerja (90.000 menit/tahun).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workload vs Capacity Comparison Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
          <h4 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight border-b pb-3">
            Analisis Kapasitas vs Beban Kerja (Menit)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 9, fill: "#64748b" }} stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 italic leading-relaxed">
            * Perbandingan total menit kerja yang tersedia (Kapasitas: Pegawai × WKE) dengan total beban kerja seluruh tugas (Menit).
          </p>
        </div>
      </div>

      {/* CASE TRENDS ANALYTICS FOR HR JUSTIFICATION */}
      <div id="case-trends-section" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-100 gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tren Peningkatan / Penurunan Jumlah Perkara (12 Bulan Terakhir)
            </h3>
            <p className="text-xs text-slate-500">
              Analisis fluktuasi register perkara masuk per jenis guna membantu menjustifikasi beban kerja fungsional tertentu (Kepaniteraan/Jurusita).
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 font-sans">Jenis Perkara:</span>
            <select
              value={selectedCaseTypeTrend}
              onChange={(e) => setSelectedCaseTypeTrend(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-sm font-sans font-bold text-slate-700 p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {CASE_TYPES_METRICS.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Case metrics insight & link to specific functional position */}
          <div className="space-y-4">
            {(() => {
              const currentMetric = CASE_TYPES_METRICS.find(m => m.key === selectedCaseTypeTrend) || CASE_TYPES_METRICS[0];
              // Calculate average & peak values for selected
              const values = MONTHLY_TENDENSI_DATA.map(d => selectedCaseTypeTrend === "all" ? d["Total Perkara"] : d[selectedCaseTypeTrend as keyof typeof d] as number);
              const totalVal = values.reduce((sum, v) => sum + v, 0);
              const avgVal = parseFloat((totalVal / values.length).toFixed(1));
              const peakVal = Math.max(...values);
              const peakMonth = MONTHLY_TENDENSI_DATA.find(d => (selectedCaseTypeTrend === "all" ? d["Total Perkara"] : d[selectedCaseTypeTrend as keyof typeof d] as number) === peakVal)?.month || "";

              return (
                <div className="space-y-4">
                  {/* Insight box */}
                  <div className="bg-slate-50 border border-slate-200/85 p-4 rounded-sm space-y-3">
                    <span 
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-xs inline-block"
                      style={{ backgroundColor: `${currentMetric.color}15`, color: currentMetric.color }}
                    >
                      {currentMetric.label}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                      {currentMetric.desc}
                    </p>
                    <div className="border-t pt-2.5 mt-2.5 border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jabatan Terdampak Utama:</span>
                      <strong className="text-[11px] text-blue-800 font-extrabold block leading-snug">
                        {currentMetric.impactedJabatan}
                      </strong>
                    </div>
                  </div>

                  {/* Quantitative Stats panel */}
                  <div className="divide-y border border-slate-200 rounded-sm overflow-hidden font-sans">
                    <div className="p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Total Akumulasi</span>
                      <strong className="font-mono text-slate-800 text-xs font-black">{totalVal} Perkara</strong>
                    </div>
                    <div className="p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Rata-rata Bulanan</span>
                      <strong className="font-mono text-slate-800 text-xs font-black">{avgVal} / Bln</strong>
                    </div>
                    <div className="p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Beban Terpuncak</span>
                      <strong className="font-mono text-red-600 text-xs font-black">
                        {peakVal} <span className="text-[9px] text-slate-400 font-bold font-sans uppercase">({peakMonth})</span>
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Column: Line chart visualization (covers 3 grid columns) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-80 md:h-96 w-full bg-slate-50/10 border border-slate-200 p-4 pt-6 rounded-sm min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TENDENSI_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "#475569", fontSize: 10, fontWeight: "bold" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: "#475569", fontSize: 10 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "2px", border: "none", color: "#fff", fontSize: "11px", fontFamily: "sans-serif" }}
                    itemStyle={{ color: "#fff" }}
                    labelClassName="font-extrabold pb-1 border-b border-slate-800 mb-1 text-slate-350"
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "10px", fontWeight: "bold", fontFamily: "sans-serif" }}
                  />
                  {selectedCaseTypeTrend === "all" ? (
                    // When "all" is selected, render active lines for the key category types
                    CASE_TYPES_METRICS.filter(m => m.key !== "all").map((m) => (
                      <Line 
                        key={m.key}
                        type="monotone"
                        dataKey={m.key}
                        name={m.label}
                        stroke={m.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))
                  ) : (
                    // Otherwise, render a single highly detailed thick projection line
                    <Line 
                      type="monotone"
                      dataKey={selectedCaseTypeTrend}
                      name={CASE_TYPES_METRICS.find(m => m.key === selectedCaseTypeTrend)?.label || ""}
                      stroke={CASE_TYPES_METRICS.find(m => m.key === selectedCaseTypeTrend)?.color || "#2563eb"}
                      strokeWidth={3.5}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  )}
                  {selectedCaseTypeTrend === "all" && (
                    <Line 
                      type="monotone"
                      dataKey="Total Perkara"
                      name="TOTAL KESELURUHAN"
                      stroke="#0f172a"
                      strokeWidth={3.5}
                      strokeDasharray="4 4"
                      dot={{ r: 1 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-sm flex items-start gap-2.5">
              <span className="p-1 bg-blue-50 text-blue-600 rounded-sm mt-0.5 shrink-0 block">
                <Briefcase className="w-3.5 h-3.5" />
              </span>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">
                <strong>Pendekatan Berbasis Data (HR Decisions):</strong> Visualisasi data perkara di atas membantu Tim SDM dan Kepegawaian dalam membuktikan fluktuasi real-time beban kerja nyata fungsional. Peningkatan perkara bulanan secara langsung mendongkrak waktu penyelesaian butir tugas (WP) fungsional, mempermudah pengawalan usulan formasi tambahan ke Mahkamah Agung RI secara meyakinkan dan presisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* High-workload Positions Alert list */}
      <div id="workload-overview" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">
          Status Beban Kerja &amp; Kebutuhan Formasi Per Jabatan
        </h3>
        
        {jabatan.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-450 border border-dashed rounded-lg bg-slate-50">
            Belum ada data jabatan terdaftar. Hubungkan unit organisasi kemudian tambahkan jabatan baru.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jabatan
              .filter(j => 
                j.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                unitKerja.find(u => u.id === j.unitKerjaId)?.nama.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(j => {
              const unit = unitKerja.find(u => u.id === j.unitKerjaId);
              const jobNeeded = j.uraianTugas.reduce((sum, t) => sum + ((t.waktuPenyelesaian * t.bebanKerja) / wke), 0);
              const roundedNeed = Math.round(jobNeeded || 1);
              const diff = j.pegawaiRiil - roundedNeed;
              
              let statusLabel = "";
              let statusClass = "";
              let iconElement = null;

              if (diff < 0) {
                statusLabel = `Kurang ${Math.abs(diff)} Pegawai`;
                statusClass = "bg-slate-50 border-red-300 text-red-750 border-l-4 border-l-red-500";
                iconElement = <AlertTriangle className="w-4 h-4 text-red-500" />;
              } else if (diff > 0) {
                statusLabel = `Kelebihan ${diff} Pegawai`;
                statusClass = "bg-slate-50 border-amber-300 text-amber-700 border-l-4 border-l-amber-500";
                iconElement = <AlertTriangle className="w-4 h-4 text-amber-500" />;
              } else {
                statusLabel = "SDM Sesuai Standard";
                statusClass = "bg-slate-50 border-emerald-350 text-emerald-850 border-l-4 border-l-emerald-500";
                iconElement = <CheckCircle className="w-4 h-4 text-emerald-500" />;
              }

              return (
                <div 
                  key={j.id} 
                  className={`border rounded-sm p-4 flex flex-col justify-between space-y-3 transition-colors ${statusClass}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-sans font-bold text-slate-800 text-xs md:text-sm leading-tight truncate max-w-[170px]" title={j.nama}>
                        {j.nama}
                      </h4>
                      <span className="text-[9px] bg-white px-1.5 py-0.5 rounded-sm border font-mono font-bold text-slate-500">
                        Kelas {j.kelasJabatan}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] truncate uppercase font-bold tracking-wider">
                      {unit ? unit.nama : "Tanpa Unit Kerja"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] border-y border-slate-205/60 py-2 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Bezetting (Riil)</span>
                      <span className="text-slate-700 font-bold">{j.pegawaiRiil} Orang</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Fisik ABK</span>
                      <span className="text-slate-705 font-bold">{jobNeeded.toFixed(2)} ({roundedNeed})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                      {iconElement}
                      <span>{statusLabel}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (setSelectedJabatanIdForAbk) {
                          setSelectedJabatanIdForAbk(j.id);
                        }
                        setActiveTab("abk");
                      }}
                      className="text-slate-700 hover:text-white bg-white hover:bg-slate-800 border border-slate-300 hover:border-slate-800 rounded-sm px-2.5 py-1 text-xs font-bold transition-all shadow-2xs"
                    >
                      Hitung ABK
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
