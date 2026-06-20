import React from 'react';
import { Jabatan, UnitKerja, AppSettings } from '../types';

interface PrintRecapProps {
  jabatanList: Jabatan[];
  unitKerjaList: UnitKerja[];
  settings: AppSettings;
  wke: number;
}

export function PrintRecap({ jabatanList, unitKerjaList, settings, wke }: PrintRecapProps) {
  return (
    <div id="printable-recap" className="hidden print:block p-8 bg-white text-black font-serif text-sm">
      <div className="text-center mb-6">
        <h2 className="font-bold text-lg leading-tight">REKAPITULASI ANALISIS JABATAN DAN BEBAN KERJA ASN</h2>
        <p className="font-bold">{settings.namaInstansi}</p>
      </div>
      
      <table className="w-full border-collapse border border-black mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2">No</th>
            <th className="border border-black p-2">Unit Kerja</th>
            <th className="border border-black p-2">Nama Jabatan</th>
            <th className="border border-black p-2">Kelas</th>
            <th className="border border-black p-2">Pegawai Riil</th>
            <th className="border border-black p-2">Kebutuhan Formasi</th>
          </tr>
        </thead>
        <tbody>
          {jabatanList.map((j, index) => {
             const unit = unitKerjaList.find(u => u.id === j.unitKerjaId);
             const totalBeban = j.uraianTugas.reduce((tSum, t) => tSum + (t.waktuPenyelesaian * t.bebanKerja), 0);
             const kebutuhan = Math.round((totalBeban / wke) || (j.uraianTugas.length > 0 ? 1 : 0));
             return (
              <tr key={j.id}>
                <td className="border border-black p-2 text-center">{index + 1}</td>
                <td className="border border-black p-2">{unit?.nama || '-'}</td>
                <td className="border border-black p-2">{j.nama}</td>
                <td className="border border-black p-2 text-center">{j.kelasJabatan}</td>
                <td className="border border-black p-2 text-center">{j.pegawaiRiil}</td>
                <td className="border border-black p-2 text-center">{kebutuhan}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-10 flex justify-end">
        <div className="text-center">
          <p>Kepala Instansi,</p>
          <br /><br /><br /><br />
          <p className="font-bold">{settings.namaInstansi || '...'}</p>
        </div>
      </div>
    </div>
  );
}
