import React, { useState } from "react";
import { Jabatan, UnitKerja } from "../types";
import { Plus, Trash2, Edit3, Building2, Search, X, Check, Download } from "lucide-react";


interface UnitKerjaTabProps {
  unitKerjaList: UnitKerja[];
  jabatanList?: Jabatan[];
  onAddUnit: (unit: Omit<UnitKerja, "id">) => void;
  onUpdateUnit: (id: string, unit: Partial<UnitKerja>) => void;
  onDeleteUnit: (id: string) => void;
  userRole?: "admin" | "editor" | "viewer";
}

export default function UnitKerjaTab({
  unitKerjaList,
  jabatanList = [],
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  userRole = "viewer"
}: UnitKerjaTabProps) {
  const isReadOnly = userRole === 'viewer';
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  // Form states
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kepalaNama, setKepalaNama] = useState("");
  const [kepalaNip, setKepalaNip] = useState("");

  const filteredList = unitKerjaList.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.kode && item.kode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelectAllUnits = () => {
    if (selectedUnitIds.length === filteredList.length) {
      setSelectedUnitIds([]);
    } else {
      setSelectedUnitIds(filteredList.map(item => item.id));
    }
  };

  const toggleSelectUnit = (id: string) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter(item => item !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };
  
  const handleExportCSV = () => {
    const header = ["Kode Unit", "Nama Unit", "Kepala Unit", "NIP Kepala"];
    const rows = filteredList.map(unit => [
      unit.kode || "",
      unit.nama,
      unit.kepalaNama || "",
      unit.kepalaNip || ""
    ]);
    const csvContent = [header, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data_unit_kerja.csv";
    link.click();
  };

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

  const handleBulkDeleteUnits = () => {
    selectedUnitIds.forEach(id => onDeleteUnit(id));
    setSelectedUnitIds([]);
  };

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
          <div className="flex gap-2 self-start sm:self-auto items-center">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-800 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Ekspor CSV
            </button>
            {isReadOnly ? (
              <span className="px-3 py-2 bg-slate-100 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider border border-slate-200 rounded-sm leading-none select-none">
                Mode Peninjau (Hanya Baca)
              </span>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Unit Kerja
              </button>
            )}
          </div>
        )}
      </div>

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
        <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between relative">
          <div className="flex items-center gap-2 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-8" />
            <input
              type="text"
              placeholder="Cari unit kerja berdasarkan nama atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2 border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {selectedUnitIds.length > 0 && (
            <button
              onClick={handleBulkDeleteUnits}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-2xs whitespace-nowrap ml-4"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus {selectedUnitIds.length} Terpilih
            </button>
          )}
        </div>

        {/* Units table representation */}
        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada unit kerja ditemukan. Silakan tambahkan unit baru.
          </div>
        ) : (
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-mono text-[9px] bg-slate-50/50">
                  {!isReadOnly && <th className="py-3 px-6 w-10 text-center"><input type="checkbox" checked={selectedUnitIds.length > 0 && selectedUnitIds.length === filteredList.length} onChange={toggleSelectAllUnits} /></th>}
                  <th className="py-3 px-6 font-bold">Kode Unit</th>
                  <th className="py-3 px-6 font-bold">Nama Unit Kerja</th>
                  <th className="py-3 px-6 font-bold">Kepala Unit (Penandatangan)</th>
                  {!isReadOnly && <th className="py-3 px-6 font-bold text-class text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredList.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                    {!isReadOnly && <td className="py-3.5 px-6 text-center"><input type="checkbox" checked={selectedUnitIds.includes(unit.id)} onChange={() => toggleSelectUnit(unit.id)} /></td>}
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
                    {!isReadOnly && (
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
                    )}
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
