import React, { useState } from "react";
import { Jabatan, UnitKerja } from "../types";
import { Plus, Trash2, Edit3, Building2, Search, X, Check, BarChart3, Users, Briefcase, Award, Globe, HelpCircle } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { CourtPreset } from "../data/religionCourtsPresets";

interface UnitKerjaTabProps {
  unitKerjaList: UnitKerja[];
  jabatanList?: Jabatan[];
  onAddUnit: (unit: Omit<UnitKerja, "id">) => void;
  onUpdateUnit: (id: string, unit: Partial<UnitKerja>) => void;
  onDeleteUnit: (id: string) => void;
  onLoadPreset?: (preset: CourtPreset) => void;
}

export default function UnitKerjaTab({
  unitKerjaList,
  jabatanList = [],
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  onLoadPreset
}: UnitKerjaTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Form states
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kepalaNama, setKepalaNama] = useState("");
  const [kepalaNip, setKepalaNip] = useState("");

  const filteredList = unitKerjaList.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.kode && item.kode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setNama("");
    setKode("");
    setKepalaNama("");
    setKepalaNip("");
    setIsEditing(null);
    setIsAdding(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onAddUnit({
      nama,
      kode: kode || undefined,
      kepalaNama: kepalaNama || undefined,
      kepalaNip: kepalaNip || undefined
    });
    resetForm();
  };

  const handleStartEdit = (unit: UnitKerja) => {
    setIsEditing(unit.id);
    setIsAdding(false);
    setNama(unit.nama);
    setKode(unit.kode || "");
    setKepalaNama(unit.kepalaNama || "");
    setKepalaNip(unit.kepalaNip || "");
  };

  const handleUpdate = (id: string) => {
    if (!nama.trim()) return;
    onUpdateUnit(id, {
      nama,
      kode: kode || undefined,
      kepalaNama: kepalaNama || undefined,
      kepalaNip: kepalaNip || undefined
    });
    resetForm();
  };

  // Calculations for unit kerja bezetting vs defined jabatan
  const calculatedData = unitKerjaList.map(unit => {
    const unitPositions = jabatanList.filter(j => j.unitKerjaId === unit.id);
    const totalPegawai = unitPositions.reduce((sum, j) => sum + (j.pegawaiRiil || 0), 0);
    const totalJabatan = unitPositions.length;
    return {
      name: unit.nama,
      shortName: unit.kode || (unit.nama.length > 20 ? unit.nama.substring(0, 18) + "..." : unit.nama),
      "Jumlah Pegawai": totalPegawai,
      "Jumlah Jabatan": totalJabatan
    };
  });

  const totalRegisteredPegawai = jabatanList.reduce((sum, j) => sum + (j.pegawaiRiil || 0), 0);
  const totalRegisteredJabatan = jabatanList.length;

  return (
    <div id="unit-kerja-tab-container" className="space-y-6 animate-fadeIn text-slate-900">
      {/* Header section with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200/80 shadow-sm border-l-4 border-l-slate-800">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 uppercase tracking-tight">
            <Building2 className="w-5 h-5 text-slate-700" /> Pengelolaan Unit Kerja
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Daftarkan bidang, bagian, sekretariat atau seksi instansi yang akan dianalisis formasi ASN-nya.
          </p>
        </div>
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Unit Kerja
          </button>
        )}
      </div>


      {/* Visual Analytics Block: Bezetting vs Available Positions Chart */}
      {unitKerjaList.length > 0 && (
        <div id="unit-kerja-analytics-card" className="bg-white border rounded-sm p-5 md:p-6 shadow-2xs space-y-5 flex-1">
          <div className="flex items-center justify-between border-b pb-3.5 border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="font-sans font-extrabold text-xs md:text-sm uppercase tracking-wider text-slate-800">
                  Analisis Kapasitas &amp; Formasi per Unit Kerja
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Perbandingan beban pegawai bezetting (terisi) vs jumlah nomenklatur jabatan terdaftar
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-[10px] px-2.5 py-1 font-bold border rounded-sm bg-slate-50 text-slate-600 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              {showAnalytics ? "Sembunyikan Grafik" : "Tampilkan Grafik"}
            </button>
          </div>

          {showAnalytics && (
            <div className="space-y-6">
              {/* Miniature Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-200/50 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans">Total Unit Kerja</span>
                    <strong className="text-xl font-mono text-slate-800 font-black">{unitKerjaList.length}</strong>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-200/50 flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-sm">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans">Total Jenis Jabatan</span>
                    <strong className="text-xl font-mono text-slate-800 font-black">{totalRegisteredJabatan}</strong>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-200/50 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block font-sans">Total Pegawai Terdata</span>
                    <strong className="text-xl font-mono text-slate-800 font-black">{totalRegisteredPegawai}</strong>
                  </div>
                </div>
              </div>

              {/* Responsive Bar Chart using Recharts */}
              <div className="w-full h-72 md:h-80 bg-slate-50/10 rounded-sm border border-slate-250/30 p-3 pt-6 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calculatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortName" 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 705 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 705 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '2px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'sans-serif' }}
                      itemStyle={{ color: '#fff' }}
                      labelClassName="font-extrabold pb-1 border-b border-slate-800 mb-1 text-slate-300"
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="rect"
                      iconSize={10}
                      wrapperStyle={{ fontSize: '11px', fontWeight: 700 }}
                    />
                    <Bar 
                      dataKey="Jumlah Pegawai" 
                      name="Jumlah Pegawai (Riil / Bezetting)" 
                      fill="#3b82f6" 
                      radius={[2, 2, 0, 0]} 
                    />
                    <Bar 
                      dataKey="Jumlah Jabatan" 
                      name="Nomenklatur Jabatan Terdaftar" 
                      fill="#6366f1" 
                      radius={[2, 2, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Unit Form block */}
      {(isAdding || isEditing !== null) && (
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 md:p-6 space-y-4 shadow-sm animate-slideDown">
          <div className="flex items-center justify-between border-b border-slate-200/65 pb-3">
            <h3 className="font-sans font-black text-slate-800 text-xs md:text-sm uppercase tracking-wider">
              {isEditing ? "Edit Detail Unit Kerja" : "Form Tambah Unit Kerja Baru"}
            </h3>
            <button 
              onClick={resetForm}
              className="px-2.5 py-1 text-[10px] uppercase font-bold bg-white text-slate-500 hover:text-slate-800 border rounded-sm hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Batal
            </button>
          </div>

          <form onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdate(isEditing); } : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Kode Unit Kerja (Optional)</label>
              <input
                type="text"
                placeholder="Nomenklatur kode, misal: SEKR-01"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Nama Unit Kerja <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Nama Dinas atau Bidang, misal: Sekretariat Daerah"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Nama Kepala Unit / Penandatangan Dokumen</label>
              <input
                type="text"
                placeholder="Nama Lengkap beserta gelar, misal: Drs. Budi Utomo, M.Si."
                value={kepalaNama}
                onChange={(e) => setKepalaNama(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">NIP Kepala Unit Kerja</label>
              <input
                type="text"
                placeholder="NIP Kepala, misal: 19800512 200501 1 008"
                value={kepalaNip}
                onChange={(e) => setKepalaNip(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div className="md:col-span-2 pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 rounded-sm text-slate-600 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> {isEditing ? "Simpan Perubahan" : "Simpan Unit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table container */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        {/* Table Search tool */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-8" />
          <input
            type="text"
            placeholder="Cari unit kerja berdasarkan nama atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Units table representation */}
        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada unit kerja ditemukan. Silakan tambahkan unit baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-mono text-[9px] bg-slate-50/50">
                  <th className="py-3 px-6 font-bold">Kode Unit</th>
                  <th className="py-3 px-6 font-bold">Nama Unit Kerja</th>
                  <th className="py-3 px-6 font-bold">Kepala Unit (Penandatangan)</th>
                  <th className="py-3 px-6 font-bold text-class text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredList.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-500">
                      {unit.kode || <span className="text-slate-300 italic">BELUM DISUN</span>}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      {unit.nama}
                    </td>
                    <td className="py-3.5 px-6">
                      {unit.kepalaNama ? (
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-700">{unit.kepalaNama}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-semibold">NIP. {unit.kepalaNip || "-"}</p>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">Belum diisi</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(unit)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-sm border border-slate-200 bg-white cursor-pointer"
                          title="Ubah Unit Kerja"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus unit kerja "${unit.nama}"? Menghapus unit ini tidak akan otomatis menghapus Jabatannya, namun relasinya akan kosong.`)) {
                              onDeleteUnit(unit.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-sm border border-red-100 hover:border-red-200 bg-white cursor-pointer"
                          title="Hapus Unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
