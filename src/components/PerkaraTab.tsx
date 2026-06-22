import React, { useState } from "react";
import { JenisPerkara, DataPerkara } from "../types";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Scale, 
  FileText, 
  Calculator, 
  Info, 
  AlertCircle, 
  Check, 
  BarChart2, 
  FileSpreadsheet, 
  Calendar, 
  TrendingUp, 
  Award, 
  Sparkle,
  Download
} from "lucide-react";

interface PerkaraTabProps {
  jenisPerkaraList: JenisPerkara[];
  dataPerkaraList: DataPerkara[];
  onAddJenisPerkara: (jp: Omit<JenisPerkara, "id">) => void;
  onUpdateJenisPerkara: (id: string, jp: Partial<JenisPerkara>) => void;
  onDeleteJenisPerkara: (id: string) => void;
  onAddDataPerkara: (dp: Omit<DataPerkara, "id">) => void;
  onUpdateDataPerkara: (id: string, dp: Partial<DataPerkara>) => void;
  onDeleteDataPerkara: (id: string) => void;
  userRole?: "admin" | "editor" | "viewer";
}

export default function PerkaraTab({
  jenisPerkaraList,
  dataPerkaraList,
  onAddJenisPerkara,
  onUpdateJenisPerkara,
  onDeleteJenisPerkara,
  onAddDataPerkara,
  onUpdateDataPerkara,
  onDeleteDataPerkara,
  userRole = "viewer"
}: PerkaraTabProps) {
  const isReadOnly = userRole === "viewer";
  const [activeSubTab, setActiveSubTab] = useState<"data" | "jenis">("data");
  
  // States for adding/editing Jenis Perkara
  const [showJenisForm, setShowJenisForm] = useState(false);
  const [editingJenisId, setEditingJenisId] = useState<string | null>(null);
  const [jenisKode, setJenisKode] = useState("");
  const [jenisNama, setJenisNama] = useState("");
  const [jenisBobot, setJenisBobot] = useState(120);
  const [jenisKet, setJenisKet] = useState("");

  // States for adding/editing Data Perkara
  const [showDataForm, setShowDataForm] = useState(false);
  const [editingDataId, setEditingDataId] = useState<string | null>(null);
  const [dataJenisId, setDataJenisId] = useState("");
  const [dataTahun, setDataTahun] = useState(2025);
  const [dataBulan, setDataBulan] = useState("Semua Bulan (Tahunan)");
  const [dataDiterima, setDataDiterima] = useState(0);
  const [dataDiputus, setDataDiputus] = useState(0);

  // Success message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDataIds, setSelectedDataIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };
    
  const toggleSelectAllData = () => {
    if (selectedDataIds.length === dataPerkaraList.length) {
      setSelectedDataIds([]);
    } else {
      setSelectedDataIds(dataPerkaraList.map(item => item.id));
    }
  };

  const toggleSelectData = (id: string) => {
    if (selectedDataIds.includes(id)) {
      setSelectedDataIds(selectedDataIds.filter(item => item !== id));
    } else {
      setSelectedDataIds([...selectedDataIds, id]);
    }
  };
  
  const handleBulkDeleteData = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedDataIds.length} data statistik perkara yang dipilih?`)) {
      selectedDataIds.forEach(id => onDeleteDataPerkara(id));
      setSelectedDataIds([]);
      showToast(`❌ ${selectedDataIds.length} data perkara berhasil dihapus.`);
    }
  };

  // Submit Jenis Perkara
  const handleSubmitJenis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jenisKode || !jenisNama) {
      alert("Harap isi Kode dan Nama Jenis Perkara!");
      return;
    }

    if (editingJenisId) {
      onUpdateJenisPerkara(editingJenisId, {
        kode: jenisKode,
        nama: jenisNama,
        bobotWaktuMenit: Number(jenisBobot),
        keterangan: jenisKet
      });
      showToast(`✅ Berhasil memperbarui Jenis Perkara: ${jenisNama}`);
    } else {
      onAddJenisPerkara({
        kode: jenisKode,
        nama: jenisNama,
        bobotWaktuMenit: Number(jenisBobot),
        keterangan: jenisKet
      });
      showToast(`✅ Berhasil menambahkan Jenis Perkara baru: ${jenisNama}`);
    }

    // Reset forms
    setShowJenisForm(false);
    setEditingJenisId(null);
    setJenisKode("");
    setJenisNama("");
    setJenisBobot(120);
    setJenisKet("");
  };

  // Start edit Jenis Perkara
  const handleEditJenisClick = (jp: JenisPerkara) => {
    setEditingJenisId(jp.id);
    setJenisKode(jp.kode);
    setJenisNama(jp.nama);
    setJenisBobot(jp.bobotWaktuMenit);
    setJenisKet(jp.keterangan);
    setShowJenisForm(true);
  };

  // Submit Data Perkara
  const handleSubmitData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataJenisId) {
      alert("Harap pilih Jenis Perkara!");
      return;
    }

    const matchedJp = jenisPerkaraList.find(j => j.id === dataJenisId);
    const labelNama = matchedJp ? matchedJp.nama : "";

    if (editingDataId) {
      onUpdateDataPerkara(editingDataId, {
        jenisPerkaraId: dataJenisId,
        tahun: Number(dataTahun),
        bulan: dataBulan,
        jumlahDiterima: Number(dataDiterima),
        jumlahDiputus: Number(dataDiputus)
      });
      showToast(`✅ Berhasil memperbarui data perkara ${labelNama}`);
    } else {
      onAddDataPerkara({
        jenisPerkaraId: dataJenisId,
        tahun: Number(dataTahun),
        bulan: dataBulan,
        jumlahDiterima: Number(dataDiterima),
        jumlahDiputus: Number(dataDiputus)
      });
      showToast(`✅ Berhasil merekam data statistik perkara ${labelNama} baru`);
    }

    setShowDataForm(false);
    setEditingDataId(null);
    setDataJenisId("");
    setDataDiterima(0);
    setDataDiputus(0);
  };

  const handleEditDataClick = (dp: DataPerkara) => {
    setEditingDataId(dp.id);
    setDataJenisId(dp.jenisPerkaraId);
    setDataTahun(dp.tahun);
    setDataBulan(dp.bulan);
    setDataDiterima(dp.jumlahDiterima);
    setDataDiputus(dp.jumlahDiputus);
    setShowDataForm(true);
  };

  const handleExportDataCSV = () => {
    const header = ["Jenis Perkara", "Kode", "Tahun", "Periode", "Diterima", "Diputus"];
    const rows = dataPerkaraList.map(dp => {
      const matchedJp = jenisPerkaraList.find(j => j.id === dp.jenisPerkaraId);
      return [
        matchedJp ? matchedJp.nama : "Dihapus",
        matchedJp ? matchedJp.kode : "???",
        dp.tahun,
        dp.bulan,
        dp.jumlahDiterima,
        dp.jumlahDiputus
      ];
    });
    const csvContent = [header, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data_perkara_sipp.csv";
    link.click();
  };

  // Get total stats
  const totalDiterimaSum = dataPerkaraList.reduce((sum, d) => sum + d.jumlahDiterima, 0);
  const totalDiputusSum = dataPerkaraList.reduce((sum, d) => sum + d.jumlahDiputus, 0);

  // Grouped stats by Year
  const yearsWithData = Array.from(new Set(dataPerkaraList.map(d => d.tahun))).sort((a,b)=>b-a);

  return (
    <div id="perkara-tab-container" className="space-y-6 animate-fadeIn text-slate-900 font-sans">
      
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
            <Scale className="w-5 h-5 text-blue-600" /> Database Perkara &amp; Jenis Perkara
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Kelola klasifikasi hukum perkara, catat volume penerimaan sengketa tahunan, dan kalkulasi otomatis beban kerja tim fungsional peradilan.
          </p>
        </div>

        {/* Inner Tab Buttons */}
        <div className="flex bg-slate-100 p-0.5 rounded-sm border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab("data")}
            className={`px-3 py-1.5 rounded-sm font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
              activeSubTab === "data" 
                ? "bg-white text-slate-900 shadow-2xs font-black border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Statistik Perkara
          </button>
          <button
            onClick={() => setActiveSubTab("jenis")}
            className={`px-3 py-1.5 rounded-sm font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
              activeSubTab === "jenis" 
                ? "bg-white text-slate-900 shadow-2xs font-black border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Jenis &amp; Klasifikasi
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUBTAB 1: STATISTIK DATA PERKARA */}
      {activeSubTab === "data" && (
        <div className="space-y-6">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-sm p-4 text-slate-800 shadow-sm border-l-3 border-l-blue-600">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Perkara Diterima</span>
              <div className="text-3xl font-black font-sans text-slate-850 mt-1">{totalDiterimaSum} <span className="text-xs font-medium text-slate-450">Kasus</span></div>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Akumulasi seluruh register perkara
              </p>
            </div>
            
            <div className="bg-white border rounded-sm p-4 text-slate-800 shadow-sm border-l-3 border-l-emerald-600">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Perkara Diputus (Inkracht)</span>
              <div className="text-3xl font-black font-sans text-slate-850 mt-1">{totalDiputusSum} <span className="text-xs font-medium text-slate-450">Kasus</span></div>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                Tingkat penyelesaian: <span className="text-emerald-600 font-bold">{totalDiterimaSum > 0 ? ((totalDiputusSum / totalDiterimaSum) * 100).toFixed(1) : 0}%</span>
              </p>
            </div>

            <div className="bg-white border rounded-sm p-4 text-slate-800 shadow-sm border-l-3 border-l-amber-500 col-span-1 md:col-span-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Sistem Penelusuran Perkara (SIPP)</span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                Data register ini terintegrasi sebagai acuan volume dasar (Beban Kerja) dalam perumusan formasi jabatan kepaniteraan peradilan daerah.
              </p>
            </div>
          </div>

          {/* Form Create/Edit Data Perkara (Conditional) */}
          {showDataForm && (
            <form onSubmit={handleSubmitData} className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm space-y-4 animate-fadeIn">
              <div className="border-b pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-blue-600">
                  <FileSpreadsheet className="w-4 h-4" /> {editingDataId ? "Edit Catatan Statistik Perkara" : "Catat Statistik Perkara Baru"}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
                    Jenis Perkara *
                  </label>
                  <select
                    value={dataJenisId}
                    onChange={(e) => setDataJenisId(e.target.value)}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  >
                    <option value="">-- Pilih Klasifikasi --</option>
                    {jenisPerkaraList.map(j => (
                      <option key={j.id} value={j.id}>[{j.kode}] {j.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
                    Tahun Takwin / Anggaran *
                  </label>
                  <input
                    type="number"
                    value={dataTahun}
                    onChange={(e) => setDataTahun(Number(e.target.value))}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
                    Periode Pelaporan *
                  </label>
                  <select
                    value={dataBulan}
                    onChange={(e) => setDataBulan(e.target.value)}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Semua Bulan (Tahunan)">Semua Bulan (Tahunan)</option>
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
                    Jumlah Register Perkara Masuk / Diterima
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dataDiterima}
                    onChange={(e) => setDataDiterima(Number(e.target.value))}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
                    Jumlah Perkara Diputus / Diselesaikan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dataDiputus}
                    onChange={(e) => setDataDiputus(Number(e.target.value))}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-emerald-600"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {editingDataId ? "Update Data" : "Rekam Data"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDataForm(false);
                      setEditingDataId(null);
                    }}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Master Data Table */}
          <div className="bg-white border rounded-sm shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-3.5">
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-450" /> Register Statistik Mutasi Perkara
                </h3>
                <p className="text-[10px] text-slate-400">Draf volume perkara yang telah diimpor atau didaftarkan saat ini</p>
              </div>

              {!showDataForm && (
                <div className="flex items-center gap-2">
                  {!isReadOnly && selectedDataIds.length > 0 && (
                    <button
                      onClick={handleBulkDeleteData}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus {selectedDataIds.length} Terpilih
                    </button>
                  )}
                  <button
                    onClick={handleExportDataCSV}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-800 text-slate-700 rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" /> Ekspor CSV
                  </button>
                  {isReadOnly ? (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[9px] uppercase font-bold tracking-wider border rounded-sm select-none">
                      Mode Peninjau
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowDataForm(true)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Entri Laporan Perkara
                    </button>
                  )}
                </div>
              )}
            </div>

            {dataPerkaraList.length === 0 ? (
              <div className="py-12 border border-dashed rounded-lg bg-slate-50 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 stroke-1 text-slate-350" />
                <p className="text-xs font-bold uppercase tracking-wide">Belum Ada Data Register Perkara</p>
                {!isReadOnly && (
                  <button
                    onClick={() => setShowDataForm(true)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Klik untuk menambahkan register baru
                  </button>
                )}
              </div>
            ) : (
              <div className="border rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-mono text-slate-550 border-b uppercase tracking-widest">
                      {!isReadOnly && <th className="py-2.5 px-3 w-10 text-center"><input type="checkbox" checked={selectedDataIds.length === dataPerkaraList.length && dataPerkaraList.length > 0} onChange={toggleSelectAllData} /></th>}
                      <th className="py-2.5 px-4 font-bold">Jenis Perkara</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Kode Hukum</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Tahun</th>
                      <th className="py-2.5 px-3 font-bold text-center w-40">Periode</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36 text-blue-700">Diterima (Masuk)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36 text-emerald-700">Diputus (Selesai)</th>
                      {!isReadOnly && <th className="py-2.5 px-3 text-center w-24">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {dataPerkaraList.map((dp, idx) => {
                      const matchedJp = jenisPerkaraList.find(j => j.id === dp.jenisPerkaraId);
                      return (
                        <tr key={dp.id || idx} className="hover:bg-slate-50/40">
                          {!isReadOnly && <td className="py-3 px-3 text-center"><input type="checkbox" checked={selectedDataIds.includes(dp.id)} onChange={() => toggleSelectData(dp.id)} /></td>}
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {matchedJp ? matchedJp.nama : <span className="text-red-500 italic">Klasifikasi dihapus</span>}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 border rounded-xs font-bold text-slate-600 uppercase">
                              {matchedJp ? matchedJp.kode : "???"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                            {dp.tahun}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-500 font-medium">
                            {dp.bulan}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/20">
                            {dp.jumlahDiterima}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-black text-emerald-600 bg-emerald-50/20">
                            {dp.jumlahDiputus}
                          </td>
                          {!isReadOnly && (
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEditDataClick(dp)}
                                  className="p-1 hover:bg-slate-100 rounded-sm text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title="Edit catatan data"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm("Apakah Anda yakin ingin menghapus data statistik perkara ini?")) {
                                      onDeleteDataPerkara(dp.id);
                                      showToast("❌ Data perkara berhasil dibersihkan dari register.");
                                    }
                                  }}
                                  className="p-1 hover:bg-red-50 rounded-sm text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Hapus catatan data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUBTAB 2: DAFTAR JENIS PERKARA (KLASIFIKASI) */}
      {activeSubTab === "jenis" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Card Form & Table Grid */}
          <div className={`grid grid-cols-1 ${isReadOnly ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6`}>
            
            {/* Form Input Jenis Perkara */}
            {!isReadOnly && (
              <div className="bg-white border rounded-sm p-5 shadow-sm space-y-4">
              <div className="border-b pb-2 flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  {editingJenisId ? "Sunting Jenis Perkara" : "Registrasi Jenis Perkara"}
                </h3>
              </div>

              <form onSubmit={handleSubmitJenis} className="space-y-3.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">
                    Kode Register Hukum *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pdt.G.01 atau Pdt.P.03"
                    value={jenisKode}
                    onChange={(e) => setJenisKode(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">
                    Nama Kategori Perkara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Cerai Gugat"
                    value={jenisNama}
                    onChange={(e) => setJenisNama(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">
                    Bobot / Norma Waktu Sidang Utama (WP - Menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={jenisBobot}
                    onChange={(e) => setJenisBobot(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">
                    * Estimasi rata-rata waktu yang diperlukan tim majelis sidang per perkara dalam satuan menit. Min: 1 menit.
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">
                    Definisi / Deskripsi Penjelasan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis ringkasan penjelasan deskriptif..."
                    value={jenisKet}
                    onChange={(e) => setJenisKet(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium leading-relaxed"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-sm cursor-pointer shadow-2xs"
                  >
                    {editingJenisId ? "Konfirmasi Perubahan" : "Simpan Jenis Perkara"}
                  </button>
                  {editingJenisId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJenisId(null);
                        setJenisKode("");
                        setJenisNama("");
                        setJenisBobot(120);
                        setJenisKet("");
                      }}
                      className="px-3 py-2 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider rounded-sm cursor-pointer hover:bg-slate-50"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
            )}

            {/* List Table Klasifikasi Perkara */}
            <div className={`bg-white border rounded-sm p-5 shadow-sm ${isReadOnly ? "lg:col-span-3" : "lg:col-span-2"} space-y-4`}>
              <div className="border-b pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Katalog &amp; Master Jenis Perkara Peradilan Agama
                </h3>
              </div>

              <div className="border rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-mono text-slate-550 border-b uppercase tracking-widest">
                      <th className="py-2.5 px-3 font-bold text-center w-24">Kode</th>
                      <th className="py-2.5 px-4 font-bold">Nama Kategori Jenis</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36">Standar Norma (WP)</th>
                      <th className="py-2.5 px-4 font-bold">Deskripsi Penjelasan</th>
                      {!isReadOnly && <th className="py-2.5 px-2 text-center w-20">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {jenisPerkaraList.map((jp) => {
                      const countAssociated = dataPerkaraList.filter(d => d.jenisPerkaraId === jp.id).length;
                      return (
                        <tr key={jp.id} className="hover:bg-slate-50/40">
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 border border-blue-150 rounded-xs uppercase">
                              {jp.kode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {jp.nama}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                            {jp.bobotWaktuMenit} Menit
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px] leading-relaxed">
                            {jp.keterangan || <span className="text-slate-350 italic">Tidak ada keterangan</span>}
                          </td>
                          {!isReadOnly && (
                            <td className="py-3 px-2 text-center text-slate-400">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleEditJenisClick(jp)}
                                  className="p-1 hover:bg-slate-100 rounded-sm hover:text-slate-800 cursor-pointer"
                                  title="Edit jenis perkara"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (countAssociated > 0) {
                                      alert(`⚠️ Tidak dapat menghapus Jenis Perkara ini karena memiliki ${countAssociated} catatan data statistik aktif pada laporan mutasi!`);
                                      return;
                                    }
                                    if(confirm(`Yakin ingin menghapus klasifikasi "${jp.nama}"?`)) {
                                      onDeleteJenisPerkara(jp.id);
                                      showToast("❌ Klasifikasi perkara berhasil didelete dari catalog.");
                                    }
                                  }}
                                  className="p-1 hover:bg-red-50 rounded-sm hover:text-red-600 cursor-pointer"
                                  title="Delete dari catalog"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

            </div>
      )}

    </div>
  );
}
