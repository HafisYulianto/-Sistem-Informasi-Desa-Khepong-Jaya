'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, CheckCircle2, PieChart } from 'lucide-react';
import { saveAPBDes, deleteAPBDes } from '@/lib/actions/mutations';
import { APBDesRecord } from '@/lib/types/database';

interface APBDesManagerProps {
  initialRecords: APBDesRecord[];
}

export default function APBDesManager({ initialRecords }: APBDesManagerProps) {
  const [records, setRecords] = useState<APBDesRecord[]>(initialRecords);
  const [editingItem, setEditingItem] = useState<APBDesRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startNewItem = () => {
    const newItem: APBDesRecord = {
      id: `apb_${Date.now()}`,
      fiscal_year: 2026,
      category: 'belanja',
      subcategory: 'Bidang Pembangunan',
      activity_name: 'Kegiatan Anggaran Baru',
      budgeted_amount: 100000000,
      realized_amount: 0,
      notes: 'Rencana TA 2026',
      created_at: new Date().toISOString(),
    };
    setEditingItem(newItem);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    setStatusMsg(null);

    const res = await saveAPBDes(editingItem);
    if (res.success) {
      setStatusMsg('Data APBDes berhasil disimpan dan kalkulasi persentase langsung terupdate!');
      const idx = records.findIndex((r) => r.id === editingItem.id);
      if (idx >= 0) {
        const copy = [...records];
        copy[idx] = editingItem;
        setRecords(copy);
      } else {
        setRecords([editingItem, ...records]);
      }
      setEditingItem(null);
    } else {
      setStatusMsg(`Gagal: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pos anggaran ini?')) return;
    await deleteAPBDes(id);
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Transparansi APBDes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Input pos anggaran, realisasi penggunaan dana desa, dan catatan akuntabilitas.
          </p>
        </div>
        <button
          onClick={startNewItem}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos APBDes</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Editor Modal */}
      {editingItem && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-8 space-y-4 animate-fadeIn">
          <h2 className="text-lg font-black text-slate-800">
            Formulir Pos Anggaran APBDes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Anggaran</label>
              <input
                type="number"
                value={editingItem.fiscal_year}
                onChange={(e) => setEditingItem({ ...editingItem, fiscal_year: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 uppercase font-bold text-primary"
              >
                <option value="pendapatan">Pendapatan</option>
                <option value="belanja">Belanja</option>
                <option value="pembiayaan">Pembiayaan</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sub Kategori / Bidang</label>
              <input
                type="text"
                value={editingItem.subcategory}
                onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
                placeholder="Contoh: Bidang Pembangunan"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan Rinci *</label>
              <input
                type="text"
                value={editingItem.activity_name}
                onChange={(e) => setEditingItem({ ...editingItem, activity_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal Pagu / Anggaran (Rp) *</label>
              <input
                type="number"
                value={editingItem.budgeted_amount}
                onChange={(e) => setEditingItem({ ...editingItem, budgeted_amount: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal Realisasi (Rp) *</label>
              <input
                type="number"
                value={editingItem.realized_amount}
                onChange={(e) => setEditingItem({ ...editingItem, realized_amount: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Catatan / Progres</label>
              <input
                type="text"
                value={editingItem.notes || ''}
                onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Data APBDes'}
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Kegiatan</th>
              <th className="px-6 py-4 text-right">Anggaran</th>
              <th className="px-6 py-4 text-right">Realisasi</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70">
                <td className="px-6 py-4">
                  <span className="font-extrabold uppercase text-[10px] text-primary block">
                    {r.category}
                  </span>
                  <span className="text-slate-400 text-[11px]">{r.subcategory}</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">
                  {r.activity_name}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-600">
                  Rp {Number(r.budgeted_amount).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                  Rp {Number(r.realized_amount).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => setEditingItem(r)}
                      className="p-1.5 text-primary hover:bg-primary-light rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
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
    </div>
  );
}
