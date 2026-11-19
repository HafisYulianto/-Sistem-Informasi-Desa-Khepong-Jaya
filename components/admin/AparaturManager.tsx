'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit3, CheckCircle2, User } from 'lucide-react';
import { saveOfficial, deleteOfficial } from '@/lib/actions/mutations';
import { VillageOfficial } from '@/lib/types/database';

interface AparaturManagerProps {
  initialOfficials: VillageOfficial[];
}

export default function AparaturManager({ initialOfficials }: AparaturManagerProps) {
  const [officials, setOfficials] = useState<VillageOfficial[]>(initialOfficials);
  const [editingItem, setEditingItem] = useState<VillageOfficial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startNewItem = () => {
    const newItem: VillageOfficial = {
      id: `off_${Date.now()}`,
      name: 'Nama Aparatur',
      nip: '',
      position: 'Kepala Dusun I',
      period: '2021 - 2027',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      order_index: officials.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setEditingItem(newItem);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    setStatusMsg(null);

    const res = await saveOfficial(editingItem);
    if (res.success) {
      setStatusMsg('Data perangkat desa berhasil disimpan dan susunan organisasi terupdate!');
      const idx = officials.findIndex((o) => o.id === editingItem.id);
      if (idx >= 0) {
        const copy = [...officials];
        copy[idx] = editingItem;
        setOfficials(copy);
      } else {
        setOfficials([...officials, editingItem]);
      }
      setEditingItem(null);
    } else {
      setStatusMsg(`Gagal: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus perangkat desa ini?')) return;
    await deleteOfficial(id);
    setOfficials(officials.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Perangkat Desa & Struktur Organisasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola nama pejabat desa, jabatan, nomor NIP/NIAP, masa bakti, dan foto resmi.
          </p>
        </div>
        <button
          onClick={startNewItem}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Perangkat Desa</span>
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
            Formulir Perangkat Desa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jabatan *</label>
              <input
                type="text"
                value={editingItem.position}
                onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
                placeholder="Sekretaris Desa, Kaur Keuangan..."
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP / NIAP</label>
              <input
                type="text"
                value={editingItem.nip || ''}
                onChange={(e) => setEditingItem({ ...editingItem, nip: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Masa Jabatan</label>
              <input
                type="text"
                value={editingItem.period || ''}
                onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
                placeholder="2021 - 2027"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">URL Foto Resmi</label>
              <input
                type="text"
                value={editingItem.photo_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, photo_url: e.target.value })}
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
              {isSaving ? 'Menyimpan...' : 'Simpan Data Perangkat'}
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

      {/* Grid of Officials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {officials.map((officer) => (
          <div key={officer.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center space-y-3 flex flex-col justify-between">
            <div>
              <div className="relative w-28 h-36 mx-auto rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-3">
                {officer.photo_url ? (
                  <Image src={officer.photo_url} alt={officer.name} fill className="object-cover" sizes="112px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full mb-1">
                {officer.position}
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">{officer.name}</h3>
              {officer.nip && <p className="text-[10px] text-slate-400 mt-0.5">NIP: {officer.nip}</p>}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center space-x-2">
              <button
                onClick={() => setEditingItem(officer)}
                className="px-3 py-1 bg-primary-light text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(officer.id)}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
