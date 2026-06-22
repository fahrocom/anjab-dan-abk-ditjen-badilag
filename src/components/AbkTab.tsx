import React, { useState } from "react";
import { Jabatan, UnitKerja, UraianTugas } from "../types";
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  HelpCircle, 
  Calculator, 
  AlertCircle,
  FileCheck2,
  ListVideo,
  X,
  Info,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Search
} from "lucide-react";

interface AbkTabProps {
  jabatanList: Jabatan[];
  unitKerjaList: UnitKerja[];
  wkeTahunan: number;
  onUpdateTasks: (jabatanId: string, tasks: UraianTugas[]) => void;
  selectedJabatanIdForAbk?: string;
  setSelectedJabatanIdForAbk?: (id: string | undefined) => void;
  userRole: "admin" | "editor" | "viewer";
}

export default function AbkTab({
  jabatanList,
  unitKerjaList,
  wkeTahunan,
  onUpdateTasks,
  selectedJabatanIdForAbk,
  setSelectedJabatanIdForAbk,
  userRole
}: AbkTabProps) {
  
  // Local active selection
  const activeJabId = selectedJabatanIdForAbk || (jabatanList.length > 0 ? jabatanList[0].id : "");
  
  const selectedJabatan = jabatanList.find(j => j.id === activeJabId);
  const selectedUnit = selectedJabatan ? unitKerjaList.find(u => u.id === selectedJabatan.unitKerjaId) : null;
  
  const [abkSearchQuery, setAbkSearchQuery] = useState("");
  
  // Inline/Form state for adding custom tasks
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newUraian, setNewUraian] = useState("");
  const [newHasilKerja, setNewHasilKerja] = useState("Dokumen");
  const [newWaktu, setNewWaktu] = useState(120); // default 2 hours (120 minutes)
  const [newBeban, setNewBeban] = useState(100); // default 100 times/items

  // Inline edit state for existing tasks
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editUraian, setEditUraian] = useState("");
  const [editHasilKerja, setEditHasilKerja] = useState("");
  const [editWaktu, setEditWaktu] = useState(120);
  const [editBeban, setEditBeban] = useState(100);

  const isReadOnly = userRole === 'viewer';

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !selectedJabatan || !newUraian.trim()) return;

    const newTask: UraianTugas = {
      id: `ut-${Date.now()}`,
      uraian: newUraian,
      hasilKerja: newHasilKerja,
      waktuPenyelesaian: Number(newWaktu || 60),
      bebanKerja: Number(newBeban || 10)
    };

    onUpdateTasks(selectedJabatan.id, [...selectedJabatan.uraianTugas, newTask]);
    
    // reset form
    setNewUraian("");
    setNewHasilKerja("Dokumen");
    setNewWaktu(120);
    setNewBeban(100);
    setIsAddingTask(false);
  };

  const handleStartEditTask = (task: UraianTugas) => {
    if (isReadOnly) return;
    setEditingTaskId(task.id);
    setEditUraian(task.uraian);
    setEditHasilKerja(task.hasilKerja);
    setEditWaktu(task.waktuPenyelesaian);
    setEditBeban(task.bebanKerja);
  };

  const handleSaveEditTask = (taskId: string) => {
    if (isReadOnly || !selectedJabatan || !editUraian.trim()) return;

    const updatedTasks = selectedJabatan.uraianTugas.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          uraian: editUraian,
          hasilKerja: editHasilKerja,
          waktuPenyelesaian: Number(editWaktu || 60),
          bebanKerja: Number(editBeban || 0)
        };
      }
      return t;
    });

    onUpdateTasks(selectedJabatan.id, updatedTasks);
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (isReadOnly || !selectedJabatan) return;
    const filteredTasks = selectedJabatan.uraianTugas.filter(t => t.id !== taskId);
    onUpdateTasks(selectedJabatan.id, filteredTasks);
  };

  // Calculations for active job position
  const totalWaktuBebanMenit = selectedJabatan ? selectedJabatan.uraianTugas.reduce((sum, t) => {
    return sum + (t.waktuPenyelesaian * t.bebanKerja);
  }, 0) : 0;

  const totalKebutuhanDesimal = selectedJabatan ? selectedJabatan.uraianTugas.reduce((sum, t) => {
    return sum + ((t.waktuPenyelesaian * t.bebanKerja) / wkeTahunan);
  }, 0) : 0;

  const totalKebutuhanBulat = Math.round(totalKebutuhanDesimal || (totalWaktuBebanMenit > 0 ? 1 : 0));
  
  const bezetting = selectedJabatan ? Number(selectedJabatan.pegawaiRiil || 0) : 0;
  const selisihFormasi = bezetting - totalKebutuhanBulat;

  return (
    <div id="abk-tab-container" className="space-y-6 animate-fadeIn text-slate-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200/80 shadow-sm border-l-4 border-l-slate-800">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
            <Calculator className="w-5 h-5 text-slate-700" /> Analisis Beban Kerja (ABK)
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Hitung beban kerja tahunan fungsional jabatan berdasarkan volume kerja, waktu penyelesaian, dan waktu kerja efektif Pemda.
          </p>
        </div>

        {/* Instansi/Department Dropdown selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pilih Jabatan:</span>
          <select
            value={activeJabId}
            onChange={(e) => {
              if (setSelectedJabatanIdForAbk) {
                setSelectedJabatanIdForAbk(e.target.value);
              }
            }}
            className="text-xs px-3 py-2 border border-slate-300 rounded-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {jabatanList.length === 0 && <option value="">Belum Ada Jabatan</option>}
            {jabatanList.map(j => (
              <option key={j.id} value={j.id}>{j.nama} - {unitKerjaList.find(u => u.id === j.unitKerjaId)?.nama || "Tanpa Unit"}</option>
            ))}
          </select>
        </div>
      </div>

      {/* NO DATA ALERTS */}
      {jabatanList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-16 text-center text-slate-400">
          <AlertCircle className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-300" />
          <p className="text-xs font-bold uppercase tracking-wider">Belum ada Analisis Jabatan terdaftar.</p>
          <p className="text-xs text-slate-400 mt-1">Silakan buat Jabatan di tab "Analisis Jabatan" terlebih dahulu.</p>
        </div>
      ) : !selectedJabatan ? (
        <div className="p-8 text-center bg-slate-50 text-slate-400 rounded-sm border border-slate-200 text-xs">Silakan pilih jabatan di atas untuk memulai analisis ABK.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: ACTIVE POSITION METRICS SUMMARY */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-sm p-5 border border-slate-800 shadow-md space-y-4">
              <div>
                <span className="px-2 py-0.5 bg-blue-900 border border-blue-700 rounded-sm text-[9px] uppercase font-mono font-bold tracking-wider text-blue-150">Peta Statistik Jabatan</span>
                <h3 className="font-sans font-black text-xs md:text-sm text-white mt-1.5 leading-tight uppercase tracking-wider">{selectedJabatan.nama}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedUnit ? selectedUnit.nama : "Tanpa Unit Kerja"}</p>
              </div>

              {/* Display primary computation stats */}
              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-450">Bezetting PNS:</span>
                  <span className="font-bold text-white">{bezetting} Pegawai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Total beban kerja:</span>
                  <span className="font-bold text-white">{totalWaktuBebanMenit.toLocaleString()} mnt/thn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">WKE:</span>
                  <span className="font-bold text-slate-300">{wkeTahunan.toLocaleString()} mnt</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-blue-400 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Desimal:</span>
                  <span className="font-bold text-blue-400">{totalKebutuhanDesimal.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">Formasi Bulat:</span>
                  <span className="font-bold text-emerald-400">{totalKebutuhanBulat} Orang</span>
                </div>
              </div>

              {/* Recruitment recommendation status banner change */}
              <div className={`p-3.5 rounded-sm border text-xs leading-normal font-sans ${
                selisihFormasi < 0 
                  ? "bg-red-950/40 border-red-900/60 text-red-300" 
                  : selisihFormasi > 0 
                  ? "bg-amber-950/40 border-amber-900/60 text-amber-300"
                  : "bg-emerald-950/40 border-emerald-900/60 text-emerald-300"
              }`}>
                {selisihFormasi < 0 ? (
                  <p>
                    <strong className="font-bold">KURANG ({Math.abs(selisihFormasi)}):</strong> Beban kerja melebihi kapasitas SDM yang sudah ada. Direkomendasikan menambah usulan formasi rekrutmen ASN / redistribusi pegawai internal.
                  </p>
                ) : selisihFormasi > 0 ? (
                  <p>
                    <strong className="font-bold">KELEBIHAN ({selisihFormasi}):</strong> Jumlah pegawai saat ini melebihi beban kerja fungsional riil. Disarankan menata ulang penyebaran tugas atau redistribusi ke jabatan lain.
                  </p>
                ) : (
                  <p>
                    <strong className="font-bold font-sans">IDEAL:</strong> Kapasitas beban kerja tahunan fungsional sudah ter-cover secara sempurna oleh pegawai riil saat ini. Pertahankan formasi SDM.
                  </p>
                )}
              </div>
            </div>

            {/* QUICK FORMULA INSIGHT CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 text-xs text-slate-500 space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <Sliders className="w-3.5 h-3.5 text-slate-500" /> Aturan Pembulatan
              </span>
              <p className="leading-relaxed text-[11px]">
                Sesuai kebiasaan BKN dan Kementerian PAN-RB, formasi riil adalah pembulatan terdekat dari hasil beban kerja keseluruhan fungsional jabatan. Nilai kerja total fungsional terkecil dijamin mendapatkan minimal 1 formasi di peta jabatan.
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR: URAIAN TUGAS & WORKLOADS METRIC GRAPH */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Action Bar with New Task Button */}
            <div className="bg-white border rounded-sm p-4 flex items-center justify-between shadow-xs border-l-4 border-l-blue-600">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-slate-700" />
                <h4 className="font-sans font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wider">Daftar Uraian Tugas Pokok Jabatan</h4>
              </div>
              {!isAddingTask && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  disabled={isReadOnly}
                  className={`px-3 py-1.5 border hover:border-slate-800 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 focus:outline-none cursor-pointer ${
                    isReadOnly ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "border-slate-300 text-slate-700 hover:text-slate-900 bg-slate-50"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Uraian Tugas
                </button>
              )}
            </div>

            {/* ADD NEW TASK FORM */}
            {isAddingTask && (
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 shadow-sm space-y-4 animate-slideDown">
                <div className="flex items-center justify-between border-b border-sidebar-200 pb-2">
                  <h5 className="font-black text-slate-800 text-xs uppercase tracking-widest">Tambah Tugas Pokok Baru</h5>
                  <button onClick={() => setIsAddingTask(false)} className="text-slate-400 hover:text-slate-750 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-widest text-[9px]">Uraian Butir Kegiatan (Tugas Pokok) <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Mulai dengan kata kerja, e.g. Melakukan verifikasi data usulan pangkat berkala..."
                      value={newUraian}
                      onChange={(e) => setNewUraian(e.target.value)}
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-widest text-[9px]">Satuan Hasil Kerja</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Dokumen, Laporan, Berkas, Kegiatan"
                      value={newHasilKerja}
                      onChange={(e) => setNewHasilKerja(e.target.value)}
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none bg-white font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-widest text-[9px]">WP (Menit/Thn) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newWaktu}
                      onChange={(e) => setNewWaktu(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block font-mono">1 jam = 60 menit</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-widest text-[9px]">Volume / Beban Setahun <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newBeban}
                      onChange={(e) => setNewBeban(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block font-mono">Total usulan 1 tahun</span>
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-4 py-2 border rounded-sm hover:bg-slate-100 font-bold uppercase tracking-wider text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-bold uppercase tracking-wider text-xs cursor-pointer"
                    >
                      Simpan Tugas
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* URAIAN TUGAS LIST TABLE */}
            <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
              {selectedJabatan.uraianTugas.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                  <p>Belum ada rincian tugas pokok terdaftar.</p>
                  <p className="text-xs text-slate-400">Tambahkan uraian tugas pokok Anda fungsional menggunakan tombol "Tambah Uraian Tugas" kerja di atas.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse select-none">
                    <thead>
                      <tr className="border-b text-slate-500 font-mono text-[9px] uppercase tracking-widest bg-slate-50/50">
                        <th className="py-3 px-4 font-bold w-12 text-center">No</th>
                        <th className="py-3 px-4 font-bold max-w-sm">Butir Kegiatan / Uraian Tugas Pokok</th>
                        <th className="py-3 px-4 font-bold">Satuan Hasil</th>
                        <th className="py-3 px-4 font-bold w-24 text-center">WP (Mnt)</th>
                        <th className="py-3 px-4 font-bold w-24 text-center">Vol (1 Thn)</th>
                        <th className="py-3 px-4 font-bold w-24 text-center">Keb. Pegawai</th>
                        <th className="py-3 px-4 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-150 text-slate-900">
                      {selectedJabatan.uraianTugas.map((task, idx) => {
                        const isEditingThis = editingTaskId === task.id;
                        const taskKebutuhan = (task.waktuPenyelesaian * task.bebanKerja) / wkeTahunan;

                        return (
                          <tr key={task.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-4 font-mono text-center text-slate-400 font-bold">{idx + 1}</td>
                            
                            {/* COLLUMN 2: Uraian Tugas */}
                            <td className="py-3 px-4 font-medium text-slate-850">
                              {isEditingThis ? (
                                <textarea
                                  value={editUraian}
                                  onChange={(e) => setEditUraian(e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border rounded-sm text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                                />
                              ) : (
                                <span className="font-normal block max-w-sm leading-snug">{task.uraian}</span>
                              )}
                            </td>

                            {/* COLLUMN 3: Satuan Hasil */}
                            <td className="py-3 px-4 font-bold text-slate-600">
                              {isEditingThis ? (
                                <input
                                  type="text"
                                  value={editHasilKerja}
                                  onChange={(e) => setEditHasilKerja(e.target.value)}
                                  className="w-full p-1.5 border rounded-sm text-xs bg-white font-bold"
                                />
                              ) : (
                                <span>{task.hasilKerja}</span>
                              )}
                            </td>

                            {/* COLLUMN 4: Waktu Penyelesaian (WP) */}
                            <td className="py-3 px-4 text-center">
                              {isEditingThis ? (
                                <input
                                  type="number"
                                  value={editWaktu}
                                  min="1"
                                  onChange={(e) => setEditWaktu(Number(e.target.value))}
                                  className="w-16 p-1.5 border rounded-sm text-xs text-center font-mono font-bold bg-white"
                                />
                              ) : (
                                <span className="font-mono text-slate-600 font-bold">{task.waktuPenyelesaian}</span>
                              )}
                            </td>

                            {/* COLLUMN 5: Volume Beban (Vol) */}
                            <td className="py-3 px-4 text-center">
                              {isEditingThis ? (
                                <input
                                  type="number"
                                  value={editBeban}
                                  min="0"
                                  onChange={(e) => setEditBeban(Number(e.target.value))}
                                  className="w-16 p-1.5 border rounded-sm text-xs text-center font-mono font-bold bg-white"
                                />
                              ) : (
                                <span className="font-mono text-slate-650 font-semibold">{task.bebanKerja}</span>
                              )}
                            </td>

                            {/* COLLUMN 6: Kebutuhan Pegawai */}
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-805 bg-slate-50/40">
                              {taskKebutuhan.toFixed(3)}
                            </td>

                            {/* COLLUMN 7: Actions */}
                            <td className="py-3 px-4 text-right">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSaveEditTask(task.id)}
                                    className="p-1.5 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-sm border border-emerald-100 bg-white shadow-xs cursor-pointer"
                                    title="Simpan Perubahan"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-sm border bg-white cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEditTask(task)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-sm border bg-white cursor-pointer"
                                    title="Edit Tugas"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm("Apakah Anda yakin ingin menghapus butir kegiatan uraian tugas pokok ini?")) {
                                        handleDeleteTask(task.id);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-sm border border-red-100 bg-white cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ABK METRIC INSTRUCTION WARNINGS */}
            <div className="bg-blue-50 border border-blue-200 text-slate-700 rounded-sm p-5 flex gap-3 text-xs leading-relaxed animate-fadeIn shadow-xs">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="space-y-1">
                <strong className="text-blue-900 block font-bold font-sans">Kiat Akurasi ABK (PermenPAN-RB):</strong>
                <p>
                  Volume Kerja tahunan (Vol) harus mewakili frekuensi pengerjaan riil dalam kurun waktu 1 tahun, bukan perkiraan acak. 
                  Waktu Penyelesaian (WP) harus dimasukkan dalam satuan <strong className="text-blue-900 font-bold">MENIT</strong>. 
                  Misalnya menyusun rilis pers rata-rata memakan waktu 1,5 jam, maka ketik <strong className="text-blue-900 font-bold">90</strong>.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* High-workload Positions Alert list */}
      {jabatanList.length > 0 && (
        <div id="workload-overview" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4 mt-8 text-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-805 uppercase tracking-tight">
                Status Beban Kerja &amp; Kebutuhan Formasi Per Jabatan
              </h3>
              <p className="text-slate-400 text-[11px] font-semibold mt-0.5">
                Gunakan daftar berikut untuk beralih menghitung dan menyusun rincian uraian tugas butir kegiatan jabatan.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center bg-slate-50 border border-slate-250 p-1.5 rounded-sm text-xs leading-none max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 mx-2 font-black" />
              <input
                type="text"
                placeholder="Cari Jabatan / Bidang..."
                value={abkSearchQuery}
                onChange={(e) => setAbkSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none py-1 px-1 font-semibold placeholder-slate-400 text-slate-700"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jabatanList
              .filter(j => 
                j.nama.toLowerCase().includes(abkSearchQuery.toLowerCase()) || 
                unitKerjaList.find(u => u.id === j.unitKerjaId)?.nama.toLowerCase().includes(abkSearchQuery.toLowerCase())
              )
              .map(j => {
              const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
              const jobNeeded = j.uraianTugas.reduce((sum, t) => sum + ((t.waktuPenyelesaian * t.bebanKerja) / wkeTahunan), 0);
              const roundedNeed = Math.round(jobNeeded || 1);
              const diff = j.pegawaiRiil - roundedNeed;
              const isCurrent = j.id === activeJabId;
              
              let statusLabel = "";
              let statusClass = "";
              let iconElement = null;

              if (diff < 0) {
                statusLabel = `Kurang ${Math.abs(diff)} Pegawai`;
                statusClass = "border-red-300 text-red-750 border-l-4 border-l-red-500 bg-slate-50";
                iconElement = <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
              } else if (diff > 0) {
                statusLabel = `Kelebihan ${diff} Pegawai`;
                statusClass = "border-amber-300 text-amber-700 border-l-4 border-l-amber-500 bg-slate-50";
                iconElement = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
              } else {
                statusLabel = "SDM Sesuai Standard";
                statusClass = "border-emerald-350 text-emerald-850 border-l-4 border-l-emerald-500 bg-slate-50";
                iconElement = <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
              }

              return (
                <div 
                  key={j.id} 
                  className={`border rounded-sm p-4 flex flex-col justify-between space-y-3 transition-all duration-200 ${
                    isCurrent 
                      ? "ring-2 ring-blue-600 border-blue-600 scale-[1.01] shadow-md bg-blue-50/10" 
                      : `${statusClass} hover:border-slate-450 hover:shadow-2xs`
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <h4 className="font-sans font-bold text-slate-800 text-xs md:text-sm leading-tight truncate" title={j.nama}>
                          {j.nama}
                        </h4>
                        {isCurrent && (
                          <span className="shrink-0 bg-blue-600 text-white text-[8px] font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold select-none">
                            Diedit
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] bg-white px-1.5 py-0.5 rounded-sm border font-mono font-bold text-slate-500 shrink-0">
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
                      <span className="text-slate-705 font-bold">{j.pegawaiRiil} Orang</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Fisik ABK</span>
                      <span className="text-slate-705 font-bold">{jobNeeded.toFixed(2)} ({roundedNeed})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider min-w-0">
                      {iconElement}
                      <span className="truncate">{statusLabel}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (setSelectedJabatanIdForAbk) {
                          setSelectedJabatanIdForAbk(j.id);
                        }
                        const container = document.getElementById("abk-tab-container");
                        if (container) {
                          container.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={`px-2.5 py-1 text-xs font-bold transition-all shadow-2xs rounded-sm cursor-pointer shrink-0 ${
                        isCurrent
                          ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                          : "text-slate-705 hover:text-white bg-white hover:bg-slate-805 border border-slate-300 hover:border-slate-805"
                      }`}
                    >
                      {isCurrent ? "Ubah Tugas" : "Hitung ABK"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
