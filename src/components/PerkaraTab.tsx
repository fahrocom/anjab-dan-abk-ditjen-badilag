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
  Sparkle
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
}

export default function PerkaraTab({
  jenisPerkaraList,
  dataPerkaraList,
  onAddJenisPerkara,
  onUpdateJenisPerkara,
  onDeleteJenisPerkara,
  onAddDataPerkara,
  onUpdateDataPerkara,
  onDeleteDataPerkara
}: PerkaraTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"data" | "jenis" | "simulasi">("data");
  
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
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
          <button
            onClick={() => setActiveSubTab("simulasi")}
            className={`px-3 py-1.5 rounded-sm font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
              activeSubTab === "simulasi" 
                ? "bg-white text-slate-900 shadow-2xs font-black border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Simulasi Dampak ABK
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
                <button
                  onClick={() => setShowDataForm(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Entri Laporan Perkara
                </button>
              )}
            </div>

            {dataPerkaraList.length === 0 ? (
              <div className="py-12 border border-dashed rounded-lg bg-slate-50 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 stroke-1 text-slate-350" />
                <p className="text-xs font-bold uppercase tracking-wide">Belum Ada Data Register Perkara</p>
                <button
                  onClick={() => setShowDataForm(true)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Klik untuk menambahkan register baru
                </button>
              </div>
            ) : (
              <div className="border rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-mono text-slate-550 border-b uppercase tracking-widest">
                      <th className="py-2.5 px-4 font-bold">Jenis Perkara</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Kode Hukum</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Tahun</th>
                      <th className="py-2.5 px-3 font-bold text-center w-40">Periode</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36 text-blue-700">Diterima (Masuk)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36 text-emerald-700">Diputus (Selesai)</th>
                      <th className="py-2.5 px-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {dataPerkaraList.map((dp, idx) => {
                      const matchedJp = jenisPerkaraList.find(j => j.id === dp.jenisPerkaraId);
                      return (
                        <tr key={dp.id || idx} className="hover:bg-slate-50/40">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Input Jenis Perkara */}
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

            {/* List Table Klasifikasi Perkara */}
            <div className="bg-white border rounded-sm p-5 shadow-sm lg:col-span-2 space-y-4">
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
                      <th className="py-2.5 px-2 text-center w-20">Aksi</th>
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

      {/* SUBTAB 3: ABK WORKLOAD IMPACT SIMULATOR */}
      {activeSubTab === "simulasi" && (
        <div className="bg-white border rounded-sm p-6 space-y-6 shadow-sm animate-fadeIn">
          
          <div className="border-b pb-3.5 space-y-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600 animate-pulse" /> Simulasi Otomatisasi Beban Kerja ABK Peradilan
            </h3>
            <p className="text-slate-500 text-xs">
              Mekanisme matematis mengonversi register perkara tahunan menjadi beban kerja (Vol) riil bagi fungsional Kepaniteraan (berdasarkan data statistik perkara yang diisi di tab pertama).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Simulation Sidebar Rules */}
            <div className="bg-slate-50 border p-4 rounded-sm space-y-4">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-widest border-b pb-1">
                Korelasi Rumusan Kerja
              </span>

              <div className="space-y-3.5 text-xs text-slate-650 font-sans leading-relaxed">
                <div>
                  <strong className="text-slate-800 block uppercase font-bold text-[10px] mb-1">1. Panitera Pengganti (Majelis)</strong>
                  <p className="text-[11px] text-slate-500">
                    Beban kerja "Mengikuti Sidang &amp; BAS" diestimasi berkorelasi langsung dengan akumulasi seluruh perkara diterima dikali standard persidangan rata-rata (e.g. 1 register perkara diestimasi membutuhkan 3,2 kali agenda sidang).
                  </p>
                </div>
                
                <div>
                  <strong className="text-slate-800 block uppercase font-bold text-[10px] mb-1">2. Jurusita Lapangan (Relaas)</strong>
                  <p className="text-[11px] text-slate-500">
                    Beban kerja "Memanggil para Pihak" berkorelasi dengan total perkara dikali 2 pihak (Penggugat &amp; Tergugat) dikali frekuensi pemanggilan resmi (rata-rata 2 panggilan per pihak per perkara).
                  </p>
                </div>

                <div>
                  <strong className="text-slate-800 block uppercase font-bold text-[10px] mb-1">3. Panitera Utama (E-Court &amp; Akta)</strong>
                  <p className="text-[11px] text-slate-500">
                    Menandatangani "Akta Cerai" didasarkan langsung dari akumulasi perkara Cerai Gugat &amp; Cerai Talak yang diputus/diselesaikan.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-sm border border-blue-200 text-[10px] text-blue-800 font-sans leading-relaxed">
                <span className="font-bold uppercase tracking-wide block mb-1">⚡ Catatan Penting</span>
                Data di kanan disimulasikan dari entri data statistik riil Anda pada tab pertama. Dengan menyinkronkan data perkara, hitungan beban kerja ANJAB-ABK Anda menjadi lebih akurat sesuai PermenPAN-RB No. 1 Tahun 2020!
              </div>
            </div>

            {/* Calculations Output Table */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-widest pl-1">
                Output Hasil Simulasi Kegiatan &amp; Beban Kerja Fungsional (Tahun Aktif)
              </span>

              <div className="border rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-[9px] font-mono border-b uppercase tracking-widest">
                      <th className="py-2.5 px-4 font-bold">Jabatan Fungsional</th>
                      <th className="py-2.5 px-4 font-bold">Uraian Butir Tugas Pokok</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36">Asal Volume Kasus</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Norma Waktu (WP)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Vol Kerja (ABK)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    
                    {/* Row 1: PP */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-800" rowspan="2">
                        Panitera Pengganti
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 leading-normal">
                        Mendampingi Majelis Hakim mengikuti jalannya persidangan perkara perdata agama (Nikah, Waris, Gugat, dsb).
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-bold bg-slate-50/50">
                        Total {totalDiterimaSum} Diterima <br /> <span className="text-[9px] text-slate-400 font-normal">x 1.7 Sidang</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-655">
                        180 Menit
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/10">
                        {Math.round(totalDiterimaSum * 1.7)} Kali
                      </td>
                    </tr>
                    
                    {/* Row 2: PP */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-medium text-slate-700 border-l leading-normal">
                        Menyusun dan merumuskan berita acara sidang (BAS) resmi pasca sidang.
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-bold bg-slate-50/50">
                        Total {totalDiterimaSum} Diterima <br /> <span className="text-[9px] text-slate-400 font-normal">x 1.7 BAS</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-655">
                        120 Menit
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/10">
                        {Math.round(totalDiterimaSum * 1.7)} Berkas
                      </td>
                    </tr>

                    {/* Row 3: Jurusita */}
                    <tr className="hover:bg-slate-50/50 border-t-2">
                      <td className="py-3.5 px-4 font-bold text-slate-800" rowspan="2">
                        Jurusita
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 leading-normal">
                        Menyampaikan relaas (surat panggilan sidang) resmi ke domisili tempat tinggal para pihak berperkara.
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-bold bg-slate-50/50">
                        Total {totalDiterimaSum} Diterima <br /> <span className="text-[9px] text-slate-400 font-normal">x 1 Panggilan</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-655">
                        150 Menit
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/10">
                        {Math.round(totalDiterimaSum)} Relaas
                      </td>
                    </tr>

                    {/* Row 4: Jurusita */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-medium text-slate-700 border-l leading-normal">
                        Menyampaikan surat pemberitahuan resmi isi putusan pengadilan kepada pihak yang absen.
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-bold bg-slate-50/50">
                        Total {totalDiputusSum} Diputus <br /> <span className="text-[9px] text-slate-400 font-normal">x 0.2 Pemberitahuan</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-655">
                        150 Menit
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/10">
                        {Math.round(totalDiputusSum * 0.2)} Surat
                      </td>
                    </tr>

                    {/* Row 5: Panitera */}
                    <tr className="hover:bg-slate-50/50 border-t-2">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        Panitera (Registrar)
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 leading-normal">
                        Melakukan verifikasi, otentikasi data, dan menandatangani dokumen Akta Cerai yang telah diterbitkan.
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-bold bg-slate-50/50">
                        Cerai Gugat + Talak <br /> <span className="text-[9px] text-slate-400 font-normal">({
                          dataPerkaraList.filter(d => d.jenisPerkaraId === "jp-1" || d.jenisPerkaraId === "jp-2")
                            .reduce((sum, d) => sum + d.jumlahDiputus, 0)
                        } Kasus)</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-655">
                        15 Menit
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-blue-600 bg-blue-50/10">
                        {
                          dataPerkaraList.filter(d => d.jenisPerkaraId === "jp-1" || d.jenisPerkaraId === "jp-2")
                            .reduce((sum, d) => sum + d.jumlahDiputus, 0)
                        } Akta
                      </td>
                    </tr>

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
