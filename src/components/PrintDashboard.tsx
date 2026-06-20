import React from 'react';
import { UnitKerja, Jabatan, AppSettings } from '../types';

interface PrintDashboardProps {
  unitKerja: UnitKerja[];
  jabatan: Jabatan[];
  wke: number;
  settings: AppSettings;
}

export function PrintDashboard({ unitKerja, jabatan, wke, settings }: PrintDashboardProps) {
  const totalUnits = unitKerja.length;
  const totalJabatan = jabatan.length;
  const totalPegawaiRiil = jabatan.reduce((sum, j) => sum + Number(j.pegawaiRiil || 0), 0);
  
  const totalFormasiBulat = jabatan.reduce((sum, j) => {
    const jobNeeded = j.uraianTugas.reduce((tSum, task) => {
      return tSum + ((task.waktuPenyelesaian * task.bebanKerja) / wke);
    }, 0);
    return sum + Math.round(jobNeeded || 1);
  }, 0);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div id="printable-dashboard" className="hidden print:block p-8 bg-white text-black font-serif text-sm">
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h2 className="font-bold text-lg leading-tight uppercase">RINGKASAN ANALISIS JABATAN DAN BEBAN KERJA</h2>
        <p className="font-bold text-base mt-1">{settings.namaInstansi}</p>
        <p className="text-xs mt-1">Per Tanggal: {currentDate}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold text-md mb-4 border-b border-black pb-1">I. Ringkasan Statistik</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="p-2 font-bold w-1/2 border border-gray-300">Total Unit Kerja</td>
              <td className="p-2 border border-gray-300">{totalUnits}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold w-1/2 border border-gray-300">Total Jabatan</td>
              <td className="p-2 border border-gray-300">{totalJabatan}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold w-1/2 border border-gray-300">Total Pegawai Riil</td>
              <td className="p-2 border border-gray-300">{totalPegawaiRiil} Orang</td>
            </tr>
            <tr>
              <td className="p-2 font-bold w-1/2 border border-gray-300">Kebutuhan Formasi (Bulat)</td>
              <td className="p-2 border border-gray-300">{totalFormasiBulat} Formasi</td>
            </tr>
          </tbody>
        </table>
      </div>

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
