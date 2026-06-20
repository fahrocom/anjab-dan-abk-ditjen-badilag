import React, { useState } from "react";
import { Jabatan, UnitKerja, Kualifikasi, SyaratJabatan, UraianTugas } from "../types";
import { 
  Briefcase, 
  Sparkles, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  CheckCircle, 
  X, 
  FileText, 
  ChevronRight,
  Info,
  Copy
} from "lucide-react";

interface AnjabTabProps {
  jabatanList: Jabatan[];
  unitKerjaList: UnitKerja[];
  onAddJabatan: (jabatan: Omit<Jabatan, "id">) => void;
  onUpdateJabatan: (id: string, jabatan: Partial<Jabatan>) => void;
  onDeleteJabatan: (id: string) => void;
}

const BAKAT_OPTIONS = [
  { code: "G", label: "Inteligenisya (Kemampuan umum memahami dasar)" },
  { code: "V", label: "Bakat Verbal (Memahami bahasa & komunikasi)" },
  { code: "N", label: "Bakat Numerik (Menghitung secara cepat & tepat)" },
  { code: "S", label: "Bakat Pandang Ruang (Membayangkan bentuk visual)" },
  { code: "P", label: "Penerapan Bentuk (Mendeteksi detail gambar/grafik)" },
  { code: "Q", label: "Ketelitian (Meneliti penulisan atau angka-angka)" },
  { code: "K", label: "Koordinasi Motorik (Keselarasan gerakan tubuh)" },
  { code: "F", label: "Kecekatan Jari (Keterampilan jari menjahit/coding)" },
  { code: "M", label: "Kecekatan Tangan (Keterampilan tangan menggenggam dll)" }
];

const TEMPERAMEN_OPTIONS = [
  { code: "D", label: "DCP (Direction, Control, Planning) - Merencanakan & Memimpin" },
  { code: "F", label: "FIF (Feeling, Idea, Fact) - Menafsirkan berdasarkan ekspresi" },
  { code: "I", label: "INFLU (Influencing) - Mempengeruhi orang lain" },
  { code: "J", label: "JC (Sensory/Judgmental) - Mengambil keputusan sosiologis" },
  { code: "M", label: "MVC (Measurable/Verifiable) - Mengambil keputusan data terukur" },
  { code: "P", label: "DEPL (Dealing with People) - Berinteraksi dgn publik / tim" },
  { code: "R", label: "REPCON (Repetitive/Continuous) - Tugas berulang-ulang" },
  { code: "S", label: "PUS (Under Stress) - Bekerja di situasi darurat/stres" },
  { code: "T", label: "STS (Limits/Tolerance) - Bekerja berdasar batas ketetapan ketat" }
];

const MINAT_OPTIONS = [
  { code: "Realistik", label: "Realistik (Aktivitas alat/instrumental/fisik)" },
  { code: "Investigatif", label: "Investigatif (Kajian ilmiah, analisis, riset)" },
  { code: "Artistik", label: "Artistik (Desain, kreativitas, seni, visual)" },
  { code: "Sosial", label: "Sosial (Pelayanan publik, koordinasi, edukasi)" },
  { code: "Kewirausahaan", label: "Kewirausahaan (Negosiasi, kepemimpinan)" },
  { code: "Konvensional", label: "Konvensional (Administrasi, verifikasi, kearsipan)" }
];

const UPAYA_FISIK_OPTIONS = [
  "Duduk", "Berdiri", "Berjalan", "Bicara", "Melihat", "Mendengar", 
  "Mengangkat", "Membawa", "Bekerja dengan jari", "Menjangkau", "Membungkuk"
];

export default function AnjabTab({
  jabatanList,
  unitKerjaList,
  onAddJabatan,
  onUpdateJabatan,
  onDeleteJabatan
}: AnjabTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnitFilter, setSelectedUnitFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form states
  const [unitKerjaId, setUnitKerjaId] = useState("");
  const [nama, setNama] = useState("");
  const [iktisar, setIktisar] = useState("");
  const [kelasJabatan, setKelasJabatan] = useState(7);
  const [pegawaiRiil, setPegawaiRiil] = useState(0);

  // Kualifikasi states
  const [pendidikanMinimal, setPendidikanMinimal] = useState("S1 (Strata-1)");
  const [jurusanInput, setJurusanInput] = useState("");
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [pelatihan, setPelatihan] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  
  // Uraian Tugas states
  const [uraianList, setUraianList] = useState<Omit<UraianTugas, "id">[]>([]);
  const [newUraian, setNewUraian] = useState("");
  const [newHasilKerja, setNewHasilKerja] = useState("Dokumen");
  const [newWaktu, setNewWaktu] = useState(120);

  // Syarat Jabatan states
  const [pangkatGolongan, setPangkatGolongan] = useState("Penata Muda - III/a");
  const [bakatKerja, setBakatKerja] = useState<string[]>([]);
  const [temperamenKerja, setTemperamenKerja] = useState<string[]>([]);
  const [minatKerja, setMinatKerja] = useState<string[]>([]);
  const [upayaFisik, setUpayaFisik] = useState<string[]>([]);
  const [kondisiFisik, setKondisiFisik] = useState("Sehat Jasmani dan Rohani");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Filter positions list based on user selection
  const filteredJabatans = jabatanList.filter(j => {
    const matchesSearch = j.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.iktisar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnitFilter === "all" || j.unitKerjaId === selectedUnitFilter;
    return matchesSearch && matchesUnit;
  });

  const handleAddJurusan = () => {
    if (jurusanInput.trim() && !jurusanList.includes(jurusanInput.trim())) {
      setJurusanList([...jurusanList, jurusanInput.trim()]);
      setJurusanInput("");
    }
  };

  const handleRemoveJurusan = (index: number) => {
    setJurusanList(jurusanList.filter((_, i) => i !== index));
  };

  const handleAddUraian = () => {
    if (newUraian.trim()) {
      setUraianList([...uraianList, { uraian: newUraian, hasilKerja: newHasilKerja, waktuPenyelesaian: newWaktu, bebanKerja: 0 }]);
      setNewUraian("");
      setNewHasilKerja("Dokumen");
      setNewWaktu(120);
    }
  };

  const handleRemoveUraian = (index: number) => {
    setUraianList(uraianList.filter((_, i) => i !== index));
  };

  const toggleMultiselect = (array: string[], setArray: (arr: string[]) => void, val: string) => {
    if (array.includes(val)) {
      setArray(array.filter(item => item !== val));
    } else {
      setArray([...array, val]);
    }
  };

  // Trigger Gemini API for Auto-generating complete Jabatan Info
  const handleAiAutoFill = async () => {
    if (!nama.trim()) {
      setAiError("Tulis 'Nama Jabatan' terlebih dahulu sebelum memanggil asisten AI.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    try {
      const selectedUnit = unitKerjaList.find(u => u.id === unitKerjaId);
      const res = await fetch("/api/generate-anjab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaJabatan: nama,
          unitKerja: selectedUnit ? selectedUnit.nama : "Instansi Pemerintah"
        })
      });

      if (!res.ok) {
        throw new Error("Koneksi server gagal memproses AI. Kemungkinan API key tidak terdaftar.");
      }

      const data = await res.json();

      if (data.isPlaceholder) {
        // Fallback simulated generator in case API key is missing
        simulateLocalAiGenerate();
        return;
      }

      // Fill form with AI output
      setIktisar(data.iktisar || "");
      setKelasJabatan(Number(data.kelasJabatan || 7));
      
      if (data.kualifikasi) {
        setPendidikanMinimal(data.kualifikasi.pendidikanMinimal || "S1 (Strata-1)");
        setJurusanList(data.kualifikasi.jurusan || []);
        setPelatihan(data.kualifikasi.pelatihan || "");
        setPengalaman(data.kualifikasi.pengalaman || "");
      }

      if (data.syaratJabatan) {
        setPangkatGolongan(data.syaratJabatan.pangkatGolongan || "Penata Muda - III/a");
        setBakatKerja(data.syaratJabatan.bakatKerja || []);
        setTemperamenKerja(data.syaratJabatan.temperamenKerja || []);
        setMinatKerja(data.syaratJabatan.minatKerja || []);
        setUpayaFisik(data.syaratJabatan.upayaFisik || []);
        setKondisiFisik(data.syaratJabatan.kondisiFisik || "Sehat Jasmani dan Rohani");
      }

      // Store generated tasks inside a custom window variable to fetch during saving
      if (data.uraianTugas) {
        (window as any)._tempoAiTasks = data.uraianTugas;
      }

    } catch (err: any) {
      console.warn("AI Generation failed:", err);
      // Fallback in case there is no API key or connection error
      simulateLocalAiGenerate();
    } finally {
      setAiLoading(false);
    }
  };

  const simulateLocalAiGenerate = () => {
    // Generate simulated realistic standards for Indonesian ASN
    const sampleIktisar = `Melaksanakan penataan administrasi fungsional, pengelolaan berkas operasional, koordinasi koordinatif, dan penyusunan berkas pelaporan bidang "${nama}" agar siklus kerja dinas berjalan efektif dan tertib regulasi.`;
    setIktisar(sampleIktisar);
    setKelasJabatan(7);
    setPendidikanMinimal("S1 (Strata-1)");
    setJurusanList(["Administrasi", `Manajemen ${nama}`, "Ilmu Komunikasi", "Teknik Informatika"]);
    setPelatihan(`Sertifikasi Keahlian ${nama}, Bimtek Pelayanan Teknis`);
    setPengalaman("Minimal 1 tahun bekerja di bagian administrasi pemerintahan");
    setPangkatGolongan("Penata Muda - III/a");
    
    // Choose some defaults
    setBakatKerja(["G", "V", "Q"]);
    setTemperamenKerja(["R", "T"]);
    setMinatKerja(["Konvensional", "Sosial"]);
    setUpayaFisik(["Duduk", "Melihat", "Bicara"]);
    setKondisiFisik("Sehat jasmani dan rohani secara penuh, ketahanan duduk tinggi.");

    // Set mockup duties
    (window as any)._tempoAiTasks = [
      { uraian: `Mengumpulkan bahan koordinasi dan pengelolaan terkait ${nama}`, hasilKerja: "Dokumen", waktuPenyelesaian: 90 },
      { uraian: `Menyusun konsep surat dinas, nota dinas, fungsional pelaporan instansi terkait ${nama}`, hasilKerja: "Naskah", waktuPenyelesaian: 120 },
      { uraian: `Melaksanakan verifikasi kesesuaian data operasional harian terkait ${nama}`, hasilKerja: "Berkas", waktuPenyelesaian: 45 },
      { uraian: `Menyusun laporan evaluasi kinerja unit bulanan`, hasilKerja: "Laporan", waktuPenyelesaian: 180 }
    ];
  };

  const handleOpenForm = (id: string | null) => {
    if (!unitKerjaId && unitKerjaList.length > 0) {
      setUnitKerjaId(unitKerjaList[0].id);
    }

    if (id) {
      const j = jabatanList.find(x => x.id === id);
      if (j) {
        setCurrentEditId(j.id);
        setUnitKerjaId(j.unitKerjaId);
        setNama(j.nama);
        setIktisar(j.iktisar);
        setKelasJabatan(j.kelasJabatan);
        setPegawaiRiil(j.pegawaiRiil);
        setPendidikanMinimal(j.kualifikasi.pendidikanMinimal);
        setJurusanList(j.kualifikasi.jurusan);
        setPelatihan(j.kualifikasi.pelatihan);
        setPengalaman(j.kualifikasi.pengalaman);
        setUraianList(j.uraianTugas);
        setPangkatGolongan(j.syaratJabatan.pangkatGolongan);
        setBakatKerja(j.syaratJabatan.bakatKerja);
        setTemperamenKerja(j.syaratJabatan.temperamenKerja);
        setMinatKerja(j.syaratJabatan.minatKerja);
        setUpayaFisik(j.syaratJabatan.upayaFisik);
        setKondisiFisik(j.syaratJabatan.kondisiFisik);
      }
    } else {
      setCurrentEditId(null);
      setNama("");
      setIktisar("");
      setKelasJabatan(7);
      setPegawaiRiil(0);
      setPendidikanMinimal("S1 (Strata-1)");
      setJurusanList([]);
      setUraianList([]);
      setPelatihan("");
      setPengalaman("");
      setPangkatGolongan("Penata Muda - III/a");
      setBakatKerja([]);
      setTemperamenKerja([]);
      setMinatKerja([]);
      setUpayaFisik(["Duduk", "Melihat"]);
      setKondisiFisik("Sehat Jasmani dan Rohani");
    }
    setIsFormOpen(true);
    setAiError("");
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentEditId(null);
    delete (window as any)._tempoAiTasks;
  };

  const handleDuplicateJabatan = (j: Jabatan) => {
    const newJabatan: Omit<Jabatan, "id"> = {
      unitKerjaId: j.unitKerjaId,
      nama: `Salin - ${j.nama}`,
      iktisar: j.iktisar,
      kelasJabatan: j.kelasJabatan,
      pegawaiRiil: j.pegawaiRiil,
      kualifikasi: { ...j.kualifikasi, jurusan: [...j.kualifikasi.jurusan] },
      syaratJabatan: { 
        ...j.syaratJabatan, 
        bakatKerja: [...j.syaratJabatan.bakatKerja],
        temperamenKerja: [...j.syaratJabatan.temperamenKerja],
        minatKerja: [...j.syaratJabatan.minatKerja],
        upayaFisik: [...j.syaratJabatan.upayaFisik]
      },
      uraianTugas: j.uraianTugas.map((t) => ({
        ...t,
        id: `ut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    onAddJabatan(newJabatan);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !unitKerjaId) return;

    // Compile values
    const kualifikasi: Kualifikasi = {
      pendidikanMinimal,
      jurusan: jurusanList,
      pelatihan,
      pengalaman
    };

    const syaratJabatan: SyaratJabatan = {
      pangkatGolongan,
      bakatKerja,
      temperamenKerja,
      minatKerja,
      upayaFisik,
      kondisiFisik
    };

    // Prepare tasks: combine existing list or new AI-tasks
    const aiTasks: UraianTugas[] = ((window as any)._tempoAiTasks || []).map((t: any, idx: number) => ({
      id: `ut-ai-${Date.now()}-${idx}`,
      uraian: t.uraian,
      hasilKerja: t.hasilKerja || "Dokumen",
      waktuPenyelesaian: Number(t.waktuPenyelesaian || 120),
      bebanKerja: 0
    }));

    const finalUraianTasks: UraianTugas[] = uraianList.length > 0
      ? uraianList.map((t, idx) => ({ ...t, id: `ut-${Date.now()}-${idx}` }))
      : aiTasks;

    if (currentEditId) {
      onUpdateJabatan(currentEditId, {
        unitKerjaId,
        nama,
        iktisar,
        kelasJabatan: Number(kelasJabatan),
        pegawaiRiil: Number(pegawaiRiil),
        kualifikasi,
        syaratJabatan,
        uraianTugas: finalUraianTasks
      });
    } else {
      onAddJabatan({
        unitKerjaId,
        nama,
        iktisar,
        kelasJabatan: Number(kelasJabatan),
        pegawaiRiil: Number(pegawaiRiil),
        kualifikasi,
        syaratJabatan,
        uraianTugas: finalUraianTasks
      });
    }

    handleCloseForm();
  };

  return (
    <div id="anjab-tab-container" className="space-y-6 animate-fadeIn text-slate-900">
      {/* Master Action Header card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200/80 shadow-sm border-l-4 border-l-slate-800">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
            <Briefcase className="w-5 h-5 text-slate-700" /> Analisis Jabatan (ANJAB)
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Tentukan nomenklatur jabatan fungsional, struktural, atau pelaksana berserta ikhtisar, kualifikasi, dan syarat pendukung.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => handleOpenForm(null)}
            disabled={unitKerjaList.length === 0}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto cursor-pointer ${
              unitKerjaList.length === 0 
                ? "bg-slate-100 border text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            title={unitKerjaList.length === 0 ? "Tambahkan Unit Kerja Terlebih Dahulu" : "Buat Jabatan Baru"}
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Jabatan
          </button>
        )}
      </div>

      {/* Warning if no unit kerja exists */}
      {unitKerjaList.length === 0 && (
        <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-sm p-4 flex gap-3 items-start text-xs leading-relaxed shadow-sm">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <strong className="font-bold">Peringatan Instansi:</strong> Anda belum mendaftarkan Unit Kerja sama sekali. 
            Silakan buka tab <strong>"Unit Kerja"</strong> terlebih dahulu untuk mendaftarkan Bidang/Divisi 
            sebelum melanjutkan proses Analisis Jabatan (ANJAB).
          </div>
        </div>
      )}

      {/* ANJAB FORM CONTAINER (MODAL-LIKE PANEL) */}
      {isFormOpen && (
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-lg animate-slideDown">
          <div className="p-5 md:p-6 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 border border-slate-650 bg-slate-900 text-slate-400 rounded-sm font-bold tracking-wider">PermenPAN 1/2020 FORM-01</span>
              <h3 className="font-sans font-black text-sm md:text-base text-white uppercase tracking-wider">
                {currentEditId ? `Edit Analisis Jabatan: ${nama}` : "Drafting Analisis Jabatan Baru"}
              </h3>
            </div>
            <button 
              onClick={handleCloseForm}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-sm flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 divide-y divide-slate-100 text-slate-800">
            {/* SECTION: Uraian Tugas (NEW) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-205">
                <ChevronRight className="w-4 h-4 text-blue-600" /> Metode Kerja & Uraian Tugas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-6">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Uraian Tugas</label>
                  <input type="text" value={newUraian} onChange={e => setNewUraian(e.target.value)} className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm" placeholder="e.g. Menyusun laporan keuangan..." />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Satuan Hasil</label>
                  <input type="text" value={newHasilKerja} onChange={e => setNewHasilKerja(e.target.value)} className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Waktu (menit)</label>
                  <input type="number" value={newWaktu} onChange={e => setNewWaktu(Number(e.target.value))} className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm" />
                </div>
              </div>
              <table className="w-full text-xs mt-2 border border-slate-200">
                <thead className="bg-slate-50 text-slate-500">
                  <tr><th className="p-2 border-r">Uraian</th><th className="p-2 border-r">Hasil</th><th className="p-2 border-r">Waktu</th><th className="p-2">Aksi</th></tr>
                </thead>
                <tbody className="divide-y">
                  {uraianList.map((t, i) => (
                    <tr key={i}>
                      <td className="p-2 border-r">{t.uraian}</td>
                      <td className="p-2 border-r">{t.hasilKerja}</td>
                      <td className="p-2 border-r">{t.waktuPenyelesaian}</td>
                      <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => handleRemoveUraian(i)}>Hapus</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECTION 1: Identitas Jabatan & AI Copilot */}
            <div className="space-y-5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-205">
                <ChevronRight className="w-4 h-4 text-blue-600" /> A. Identitas Primer Jabatan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Nama Nomenklatur Jabatan <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama resmi jabatan, e.g. Pranata Komputer Ahli Pertama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAiAutoFill}
                      disabled={aiLoading}
                      className="px-4 py-2 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white disabled:text-slate-450 font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      title="Otomatis kumpulkan data menggunakan AI Generatif Gemini"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                      {aiLoading ? "MEMPROSES..." : "BUAT VIA AI"}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Unit Kerja Organisasi <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={unitKerjaId}
                    onChange={(e) => setUnitKerjaId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  >
                    {unitKerjaList.map(u => (
                      <option key={u.id} value={u.id}>{u.nama} ({u.kode || "N/A"})</option>
                    ))}
                  </select>
                </div>
              </div>

              {aiError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-sm border border-red-200 font-bold">
                  {aiError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Kelas Jabatan (Grade)</label>
                  <input
                    type="number"
                    min="1"
                    max="17"
                    value={kelasJabatan}
                    onChange={(e) => setKelasJabatan(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block">Kelas 5 s.d 15 sesuai tanggung jawab</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Jumlah Riil Saat Ini (Bezetting) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={pegawaiRiil}
                    onChange={(e) => setPegawaiRiil(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block font-semibold">Pegawai bekerja saat ini</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Ikhtisar Jabatan (Ringkasan Tugas)</label>
                <textarea
                  rows={3}
                  placeholder="Isi uraian singkat tugas jabatan yang merangkum keseluruhan fungsi pelayanan jabatan..."
                  value={iktisar}
                  onChange={(e) => setIktisar(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white font-sans text-slate-700"
                />
              </div>
            </div>

            {/* SECTION 2: Kualifikasi Jabatan */}
            <div className="space-y-5 pt-6">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <ChevronRight className="w-4 h-4 text-blue-600" /> B. Kualifikasi Jabatan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pendidikan Minimal</label>
                  <select
                    value={pendidikanMinimal}
                    onChange={(e) => setPendidikanMinimal(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  >
                    <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                    <option value="D3 (Diploma-III)">D3 (Diploma-III)</option>
                    <option value="D4 (Diploma-IV)">D4 (Diploma-IV)</option>
                    <option value="S1 (Strata-1)">S1 (Strata-1)</option>
                    <option value="S2 (Strata-2)">S2 (Strata-2)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Daftar Jurusan Pendidikan Relevan</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add jurusan, e.g. Teknik Informatika"
                      value={jurusanInput}
                      onChange={(e) => setJurusanInput(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddJurusan(); } }}
                      className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddJurusan}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer border border-slate-300"
                    >
                      Tambah
                    </button>
                  </div>
                  {/* Jurusan Tags rendered list */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {jurusanList.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Belum mendefinisikan jurusan khusus</span>
                    ) : (
                      jurusanList.map((j, idx) => (
                        <span key={idx} className="bg-blue-50 border border-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-sm flex items-center gap-1 font-bold">
                          {j}
                          <button type="button" onClick={() => handleRemoveJurusan(idx)} className="text-blue-500 hover:text-blue-950 font-bold hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">×</button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Sertifikasi &amp; Pendidikan Pelatihan (Diklat)</label>
                  <input
                    type="text"
                    placeholder="Sertifikasi khusus, misal: Diklat fungsional humas, sertifikat jaringan Cisco"
                    value={pelatihan}
                    onChange={(e) => setPelatihan(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pengalaman Kerja</label>
                  <input
                    type="text"
                    placeholder="Contoh: Minimal 2 tahun di bidang pengolahan data publik"
                    value={pengalaman}
                    onChange={(e) => setPengalaman(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Persyaratan Jabatan */}
            <div className="space-y-6 pt-6">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <ChevronRight className="w-4 h-4 text-blue-600" /> C. Persyaratan Jabatan (PermenPAN)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pangkat / Golongan Ruang Minimal</label>
                  <input
                    type="text"
                    placeholder="Misal: Penata Muda - III/a"
                    value={pangkatGolongan}
                    onChange={(e) => setPangkatGolongan(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Syarat Kondisi Fisik Khusus</label>
                  <input
                    type="text"
                    placeholder="Misal: Sehat fisik & mental secara mutlak"
                    value={kondisiFisik}
                    onChange={(e) => setKondisiFisik(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white"
                  />
                </div>
              </div>

              {/* Multi-Checkbox grids for Bakat, Temperamen, Minat, Upaya */}
              <div className="space-y-5 text-slate-900">
                {/* Bakat Kerja */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-sm border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Bakat Kerja (Pilih 2-4 yang Relevan)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {BAKAT_OPTIONS.map(b => (
                      <label key={b.code} className="flex items-start gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer p-1 rounded-sm hover:bg-white select-none">
                        <input
                           type="checkbox"
                           checked={bakatKerja.includes(b.code)}
                           onChange={() => toggleMultiselect(bakatKerja, setBakatKerja, b.code)}
                           className="mt-0.5 cursor-pointer accent-blue-600"
                        />
                        <span><strong className="text-slate-800 font-mono font-bold">[{b.code}]</strong> {b.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Temperamen Kerja */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-sm border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Temperamen Kerja (Sifat Bawaan Tugas)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TEMPERAMEN_OPTIONS.map(t => (
                      <label key={t.code} className="flex items-start gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer p-1 rounded-sm hover:bg-white select-none">
                        <input
                           type="checkbox"
                           checked={temperamenKerja.includes(t.code)}
                           onChange={() => toggleMultiselect(temperamenKerja, setTemperamenKerja, t.code)}
                           className="mt-0.5 cursor-pointer accent-blue-600"
                        />
                        <span><strong className="text-slate-800 font-mono font-bold">[{t.code}]</strong> {t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minat Kerja */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-sm border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Minat Kerja (Kecenderungan Minat)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {MINAT_OPTIONS.map(m => (
                      <label key={m.code} className="flex items-start gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer p-1 rounded-sm hover:bg-white select-none">
                        <input
                           type="checkbox"
                           checked={minatKerja.includes(m.code)}
                           onChange={() => toggleMultiselect(minatKerja, setMinatKerja, m.code)}
                           className="mt-0.5 cursor-pointer accent-blue-600"
                        />
                        <span>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upaya Fisik */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-sm border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Upaya Fisik Dominan</span>
                  <div className="flex flex-wrap gap-2">
                    {UPAYA_FISIK_OPTIONS.map(f => (
                      <label key={f} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer px-2.5 py-1 rounded-sm border border-slate-200 bg-white select-none hover:border-slate-400">
                        <input
                          type="checkbox"
                          checked={upayaFisik.includes(f)}
                          onChange={() => toggleMultiselect(upayaFisik, setUpayaFisik, f)}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTION BUTTONS */}
            <div className="pt-6 border-t md:col-span-2 flex justify-between items-center gap-3 bg-slate-55 p-4 -mx-6 md:-mx-8">
              <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                <Info className="w-3.5 h-3.5 text-slate-350" />
                <span>*(Window) Uraian tugas akan ditarik otomatis dari model cerdas jika menggunakan asisten AI.</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-slate-300 rounded-sm text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Tutup Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> {currentEditId ? "SIMPAN" : "TAMBAH JABATAN"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & MASTER TABLE CONTAINER */}
      {!isFormOpen && (
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-slate-50/50 border-b flex flex-col md:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari analisis jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-sm bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sector Unit filter dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wide shrink-0">Filter Unit:</span>
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="w-full md:w-56 text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Unit Kerja</option>
                {unitKerjaList.map(u => (
                  <option key={u.id} value={u.id}>{u.nama}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Master Table of Positions */}
          {filteredJabatans.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              <p>Tidak ada Jabatans yang terdaftar atau cocok dengan pencarian.</p>
              <button 
                onClick={() => handleOpenForm(null)}
                disabled={unitKerjaList.length === 0}
                className="mt-3 text-blue-600 hover:underline text-xs font-bold uppercase tracking-wide focus:outline-none cursor-pointer"
              >
                Tambahkan Jabatan Pertama Anda
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-mono text-[9px] bg-slate-50/50">
                    <th className="py-3 px-6 font-bold">Unit Kerja</th>
                    <th className="py-3 px-6 font-bold">Nama Jabatan</th>
                    <th className="py-3 px-6 font-bold">Kelas</th>
                    <th className="py-3 px-6 font-bold">Pendidikan Min</th>
                    <th className="py-3 px-6 font-bold">Bezetting (Riil)</th>
                    <th className="py-3 px-6 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-900">
                  {filteredJabatans.map(j => {
                    const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
                    return (
                      <tr key={j.id} className="hover:bg-slate-50/30 transition-all font-sans">
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-700 text-xs block">{unit ? unit.nama : "Belum dihubungkan"}</span>
                          {unit && <span className="text-[10px] text-slate-400 font-mono font-medium">{unit.kode}</span>}
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <strong className="text-slate-800 font-bold text-xs block">{j.nama}</strong>
                          <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5" title={j.iktisar}>
                            {j.iktisar || <span className="text-slate-300 italic">Tidak ada ikhtisar</span>}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 bg-slate-100 rounded-sm text-slate-750 font-bold font-mono text-[10px] border border-slate-200">
                            GRADE {j.kelasJabatan}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-650">{j.kualifikasi?.pendidikanMinimal || "-"}</span>
                          {j.kualifikasi?.jurusan && j.kualifikasi.jurusan.length > 0 && (
                            <span className="text-[10px] text-slate-400 block max-w-[120px] truncate mt-0.5" title={j.kualifikasi.jurusan.join(", ")}>
                              {j.kualifikasi.jurusan.slice(0, 2).join(", ")}{j.kualifikasi.jurusan.length > 2 ? "..." : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-slate-705 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-sm">{j.pegawaiRiil} PNS</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDuplicateJabatan(j)}
                              className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-sm border border-emerald-100 bg-white shadow-xs cursor-pointer"
                              title="Duplikat Jabatan"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenForm(j.id)}
                              className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-700 rounded-sm border border-slate-200 bg-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                              title="Edit ANJAB"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Detail
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin menghapus jabatan "${j.nama}" beserta seluruh data analisis beban kerja (ABK) yang terkait?`)) {
                                  onDeleteJabatan(j.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-sm border border-red-100 bg-white shadow-xs cursor-pointer"
                              title="Hapus Jabatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
