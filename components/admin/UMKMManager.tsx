'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit3, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { saveUMKM, deleteUMKM } from '@/lib/actions/mutations';
import { UMKMProduct } from '@/lib/types/database';

interface UMKMManagerProps {
  initialProducts: UMKMProduct[];
}

export default function UMKMManager({ initialProducts }: UMKMManagerProps) {
  const [products, setProducts] = useState<UMKMProduct[]>(initialProducts);
  const [editingItem, setEditingItem] = useState<UMKMProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startNewItem = () => {
    const newItem: UMKMProduct = {
      id: `umkm_${Date.now()}`,
      name: 'Produk UMKM Baru',
      category: 'Makanan & Minuman',
      description: 'Deskripsi produk unggulan desa...',
      price: 25000,
      owner_name: 'Warga Khepong Jaya',
      whatsapp_number: '6281234567890',
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'],
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setEditingItem(newItem);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    setStatusMsg(null);

    const res = await saveUMKM(editingItem);
    if (res.success) {
      setStatusMsg('Produk UMKM berhasil disimpan dan katalog publik langsung terupdate!');
      const idx = products.findIndex((p) => p.id === editingItem.id);
      if (idx >= 0) {
        const copy = [...products];
        copy[idx] = editingItem;
        setProducts(copy);
      } else {
        setProducts([editingItem, ...products]);
      }
      setEditingItem(null);
    } else {
      setStatusMsg(`Gagal: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk UMKM ini?')) return;
    await deleteUMKM(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Produk & Potensi UMKM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola etalase usaha warga, harga, nomor WhatsApp pemesanan langsung, dan foto produk.
          </p>
        </div>
        <button
          onClick={startNewItem}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk UMKM</span>
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
            Formulir Produk UMKM: {editingItem.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Produk / Wisata *</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori</label>
              <input
                type="text"
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
                placeholder="Makanan, Kerajinan, Pertanian..."
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Pemilik / Pelaku Usaha *</label>
              <input
                type="text"
                value={editingItem.owner_name}
                onChange={(e) => setEditingItem({ ...editingItem, owner_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp (Awali 62) *</label>
              <input
                type="text"
                value={editingItem.whatsapp_number}
                onChange={(e) => setEditingItem({ ...editingItem, whatsapp_number: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga Produk (Rp) *</label>
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">URL Foto Produk</label>
              <input
                type="text"
                value={editingItem.images[0] || ''}
                onChange={(e) => setEditingItem({ ...editingItem, images: [e.target.value] })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap Produk</label>
              <textarea
                rows={3}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 resize-none text-xs"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Produk UMKM'}
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

      {/* Grid of UMKM Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                {item.images && item.images.length > 0 && (
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="33vw" />
                )}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 text-[10px] font-bold rounded-full">
                  {item.category}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-base line-clamp-1">{item.name}</h3>
              <p className="text-xs text-slate-500">Pemilik: <strong>{item.owner_name}</strong></p>
              <p className="text-xs font-black text-primary">Rp {Number(item.price).toLocaleString('id-ID')}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setEditingItem(item)}
                className="px-3 py-1.5 bg-primary-light text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
