import React, { useState } from "react";
import { AppSettings } from "../types";
import { 
  Settings, 
  Save, 
  HelpCircle, 
  RotateCcw, 
  Upload, 
  Download, 
  Building2, 
  Clock, 
  Trash2,
  CheckCircle,
  FileCode,
  Award
} from "lucide-react";

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetToMock: () => void;
  onWipeData: () => void;
  onImportBackup: (importedJson: string) => boolean;
  onExportBackup: () => void;
}

export default function SettingsTab({
  settings,
  onUpdateSettings,
  onResetToMock,
  onWipeData,
  onImportBackup,
  onExportBackup
}: SettingsTabProps) {
  
  // Local states
  const [wke, setWke] = useState(settings.wkeTahunan);
  const [namaInstansi, setNamaInstansi] = useState(settings.namaInstansi);
  const [alamat, setAlamat] = useState(settings.alamat || "");
  const [kelasPengadilan, setKelasPengadilan] = useState<"IA Khusus" | "IA" | "IB" | "II" | "Banding" | "Pusat">(settings.kelasPengadilan || "IA");
  const [isSaved, setIsSaved] = useState(false);
  
  const [importMode, setImportMode] = useState<"file" | "text">("file");
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      wkeTahunan: Number(wke),
      namaInstansi: namaInstansi,
      alamat: alamat || undefined,
      kelasPengadilan: kelasPengadilan
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const processFile = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setImportStatus({ type: "error", message: "Gagal: Berkas cadangan instansi harus memiliki format berkas berekstensi .json" });
      setUploadedFileName(null);
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      setImportStatus({ type: null, message: "" });
    };
    reader.onerror = () => {
      setImportStatus({ type: "error", message: "Gagal membaca data berkas unggahan." });
      setUploadedFileName(null);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setImportStatus({ type: "error", message: "Belum ada muatan data cadangan terdeteksi. Silakan unggah berkas atau tempel baris JSON terlebih dahulu." });
      return;
    }

    const success = onImportBackup(importText);
    if (success) {
      setImportStatus({ type: "success", message: "Database instansi berhasil dikembalikan dan disinkronkan secara sempurna!" });
      setImportText("");
      setUploadedFileName(null);
    } else {
      setImportStatus({ type: "error", message: "Struktur berkas backup tidak valid. Periksa integritas format skema JSON ANJAB-ABK." });
    }
  };

  return (
    <div id="settings-tab-container" className="space-y-6 animate-fadeIn text-slate-800">
      
      {/* 1. APP SETTINGS DETAILS */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 md:p-6 bg-slate-50 border-b flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-slate-700" />
          <h3 className="font-sans font-bold text-slate-800 text-sm md:text-base">Konfigurasi Pengaturan Instansi</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WKE constant setting */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Waktu Kerja Efektif (WKE) Tahunan <span className="text-red-550">*</span>
              </label>
              <input
                type="number"
                required
                min="1000"
                value={wke}
                onChange={(e) => setWke(Number(e.target.value))}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono bg-white"
              />
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                💡 Konstanta PermenPAN 1/2020: <strong>75.000 menit/tahun</strong> untuk instansi 5 hari kerja (equivalent 1.250 jam). 
                Gunakan <strong>90.000 menit/tahun</strong> jika instansi mengadopsi 6 hari kerja (equivalent 1.500 jam).
              </p>
            </div>

            {/* Instansi Profil */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Nama Instansi Pemerintah <span className="text-red-550">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Pengadilan Agama Surabaya Kelas IA"
                value={namaInstansi}
                onChange={(e) => setNamaInstansi(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none bg-white font-semibold"
              />
            </div>

            {/* Kelas Pengadilan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-500" /> Kelas Pengadilan / Tingkat Satker <span className="text-red-550">*</span>
              </label>
              <select
                value={kelasPengadilan}
                onChange={(e) => setKelasPengadilan(e.target.value as any)}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none bg-white font-semibold"
              >
                <option value="IA Khusus">Pengadilan Agama Kelas IA Khusus</option>
                <option value="IA">Pengadilan Agama Kelas IA</option>
                <option value="IB">Pengadilan Agama Kelas IB</option>
                <option value="II">Pengadilan Agama Kelas II</option>
                <option value="Banding">Pengadilan Tinggi Agama (Banding)</option>
                <option value="Pusat">Direktorat Jenderal Peradilan Agama (Pusat)</option>
              </select>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">Alamat Instansi Lengkap</label>
              <input
                type="text"
                placeholder="Jl. Pemuda No. 127 Kompleks Balaikota, Kota Semarang, Jawa Tengah"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none bg-white font-sans"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4" /> Pengaturan berhasil disimpan secara permanen!
              </span>
            ) : (
              <span></span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>

      {/* 2. DATA IMPORT & EXPORT (PORTABILITY PORT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export / Wipe data box */}
        <div className="bg-white border rounded-xl p-5 md:p-6 space-y-5 shadow-sm">
          <div className="space-y-1">
            <h4 className="font-sans font-bold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
              <Download className="w-5 h-5 text-slate-700" /> Ekspor &amp; Manajemen Database
            </h4>
            <p className="text-slate-500 text-xs">
              Buat cadangan database ANJAB-ABK instansi secara mandiri. File json dapat diimpor kembali kapan saja jika browser dibersihkan.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onExportBackup}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 font-bold text-xs rounded-lg border flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-600" /> Ekspor Cadangan Institusi (.json)
            </button>

            <div className="border-t pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  if (confirm("⚠️ PERINGATAN VITAL: Menekan tombol ini akan me-load ulang database contoh instansi (Sekretariat, Programmer, Humas) dan menghapus perubahan kustom Anda. Lanjutkan restorasi data contoh?")) {
                    onResetToMock();
                    alert("Database instansi Anda berhasil direstorasi ke bentuk data contoh bawaan!");
                  }
                }}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-150 text-slate-700 hover:text-slate-800 border font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-500" /> Muat Ulang Data Contoh Pemerintah
              </button>

              <button
                onClick={() => {
                  if (confirm("🚨 PERINGATAN HANCURKAN: Tindakan ini TIDAK BISA dibatalkan. Seluruh Unit Kerja, Jabatan, dan perhitungan beban kerja ABK instansi akan TERHAPUS BERSIH. Anda harus menyusunnya dari awal. Lanjutkan hapus permanen?")) {
                    onWipeData();
                  }
                }}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 hover:text-red-850 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Kosongkan Seluruh Database Instansi
              </button>
            </div>
          </div>
        </div>

        {/* Import backup data box */}
        <div id="import-backup-box" className="bg-white border rounded-xl p-5 md:p-6 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h4 className="font-sans font-bold text-slate-800 text-sm md:text-base flex items-center gap-1.5 font-sans">
              <Upload className="w-5 h-5 text-slate-700 font-sans" /> Impor Database Cadangan
            </h4>
            <p className="text-slate-500 text-xs text-justify">
              Pulihkan rancangan peta jabatan & beban kerja instansi Anda dengan mengunggah sertifikat berkas cadangan berekstensi .json atau menempel data string secara manual.
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setImportMode("file");
                setImportStatus({ type: null, message: "" });
              }}
              className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 text-center ${
                importMode === "file" 
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Unggah Berkas (.json)
            </button>
            <button
              type="button"
              onClick={() => {
                setImportMode("text");
                setImportStatus({ type: null, message: "" });
              }}
              className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 text-center ${
                importMode === "text" 
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Tempel Teks JSON
            </button>
          </div>

          <div className="space-y-3">
            {importMode === "file" ? (
              /* Drag and Drop Zone + Input File */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/50" 
                    : uploadedFileName 
                      ? "border-emerald-350 bg-emerald-50/20" 
                      : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  id="backup-file-input"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="backup-file-input" className="cursor-pointer block space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-3xs">
                    {uploadedFileName ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 animate-scaleIn" />
                    ) : (
                      <Upload className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs">
                    {uploadedFileName ? (
                      <p className="font-mono text-slate-800 font-bold break-all">
                        {uploadedFileName}
                      </p>
                    ) : (
                      <p className="font-sans text-slate-600 font-medium">
                        <span className="text-blue-600 font-bold hover:underline">Klik untuk memilih berkas</span> atau seret & jatuhkan berkas di sini
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                      Hanya mendukung format ekspor resmi ANJAB-ABK (*.json)
                    </span>
                  </div>
                </label>
              </div>
            ) : (
              /* Textarea code paste */
              <textarea
                rows={5}
                placeholder='Tempel (Paste) teks kode backup di sini, e.g. {"settings": ..., "unitKerja": [...] }'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono shadow-inner text-slate-700 placeholder-slate-400"
              />
            )}

            {importStatus.type && (
              <p className={`text-xs p-2.5 rounded font-semibold border ${
                importStatus.type === "success" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {importStatus.message}
              </p>
            )}

            <button
              type="button"
              onClick={handleImport}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <FileCode className="w-4 h-4" /> Impor dan Sinkronisasi Sekarang
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
