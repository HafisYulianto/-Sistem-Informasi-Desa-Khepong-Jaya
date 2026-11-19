'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { APBDesRecord } from '@/lib/types/database';

interface APBDesViewProps {
  records: APBDesRecord[];
}

export default function APBDesView({ records }: APBDesViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pendapatan' | 'belanja' | 'pembiayaan'>('all');

  // Calculate totals
  const totalPendapatanAnggaran = records
    .filter((r) => r.category === 'pendapatan')
    .reduce((acc, curr) => acc + Number(curr.budgeted_amount), 0);
  const totalPendapatanRealisasi = records
    .filter((r) => r.category === 'pendapatan')
    .reduce((acc, curr) => acc + Number(curr.realized_amount), 0);

  const totalBelanjaAnggaran = records
    .filter((r) => r.category === 'belanja')
    .reduce((acc, curr) => acc + Number(curr.budgeted_amount), 0);
  const totalBelanjaRealisasi = records
    .filter((r) => r.category === 'belanja')
    .reduce((acc, curr) => acc + Number(curr.realized_amount), 0);

  const totalPembiayaanAnggaran = records
    .filter((r) => r.category === 'pembiayaan')
    .reduce((acc, curr) => acc + Number(curr.budgeted_amount), 0);
  const totalPembiayaanRealisasi = records
    .filter((r) => r.category === 'pembiayaan')
    .reduce((acc, curr) => acc + Number(curr.realized_amount), 0);

  const calcPercentage = (realized: number, budgeted: number) => {
    if (!budgeted || budgeted === 0) return 0;
    return Math.min(100, Math.round((realized / budgeted) * 100));
  };

  const filteredRecords =
    activeTab === 'all'
      ? records
      : records.filter((r) => r.category === activeTab);

  return (
    <div className="space-y-12">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pendapatan Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Pendapatan Desa
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800">
            Rp {totalPendapatanRealisasi.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dari target: Rp {totalPendapatanAnggaran.toLocaleString('id-ID')}
          </p>

          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Realisasi</span>
              <span>{calcPercentage(totalPendapatanRealisasi, totalPendapatanAnggaran)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${calcPercentage(totalPendapatanRealisasi, totalPendapatanAnggaran)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Belanja Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
              Belanja & Pembangunan
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800">
            Rp {totalBelanjaRealisasi.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dari alokasi: Rp {totalBelanjaAnggaran.toLocaleString('id-ID')}
          </p>

          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Terserap</span>
              <span>{calcPercentage(totalBelanjaRealisasi, totalBelanjaAnggaran)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                style={{ width: `${calcPercentage(totalBelanjaRealisasi, totalBelanjaAnggaran)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pembiayaan Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Pembiayaan Desa (SiLPA)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800">
            Rp {totalPembiayaanRealisasi.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dari target: Rp {totalPembiayaanAnggaran.toLocaleString('id-ID')}
          </p>

          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Realisasi</span>
              <span>{calcPercentage(totalPembiayaanRealisasi, totalPembiayaanAnggaran)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${calcPercentage(totalPembiayaanRealisasi, totalPembiayaanAnggaran)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { key: 'all', label: 'Seluruh Transaksi' },
          { key: 'pendapatan', label: 'Pendapatan Desa' },
          { key: 'belanja', label: 'Belanja & Kegiatan' },
          { key: 'pembiayaan', label: 'Pembiayaan' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-extrabold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Kategori & Sub-Kategori</th>
                <th className="px-6 py-4">Rincian Kegiatan</th>
                <th className="px-6 py-4 text-right">Anggaran (Pagu)</th>
                <th className="px-6 py-4 text-right">Realisasi</th>
                <th className="px-6 py-4 text-center">Persentase</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item) => {
                const percent = calcPercentage(Number(item.realized_amount), Number(item.budgeted_amount));
                const categoryBadge =
                  item.category === 'pendapatan'
                    ? 'bg-emerald-50 text-emerald-700'
                    : item.category === 'belanja'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-amber-50 text-amber-700';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${categoryBadge} mb-1`}>
                        {item.category}
                      </span>
                      <div className="font-semibold text-slate-700 text-xs">
                        {item.subcategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.activity_name}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">
                      Rp {Number(item.budgeted_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                      Rp {Number(item.realized_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-extrabold text-slate-800">
                        {percent >= 100 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{percent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
