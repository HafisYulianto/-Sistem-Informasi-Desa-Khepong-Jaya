'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit3, Newspaper, CheckCircle2 } from 'lucide-react';
import { savePost, deletePost } from '@/lib/actions/mutations';
import { Post } from '@/lib/types/database';

interface BeritaManagerProps {
  initialPosts: Post[];
}

export default function BeritaManager({ initialPosts }: BeritaManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startNewPost = () => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      title: 'Judul Warta Berita Baru',
      slug: `berita-desa-${Date.now().toString().slice(-4)}`,
      category_id: null,
      category_name: 'Pemerintahan',
      thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      content: '<p>Tuliskan isi berita resmi desa di sini...</p>',
      gallery_urls: [],
      status: 'published',
      published_at: new Date().toISOString(),
      views_count: 0,
      created_at: new Date().toISOString(),
    };
    setEditingPost(newPost);
  };

  const handleSave = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    setStatusMsg(null);

    const res = await savePost(editingPost);
    if (res.success) {
      setStatusMsg('Berita berhasil disimpan dan disinkronkan ke halaman publik!');
      const idx = posts.findIndex((p) => p.id === editingPost.id);
      if (idx >= 0) {
        const copy = [...posts];
        copy[idx] = editingPost;
        setPosts(copy);
      } else {
        setPosts([editingPost, ...posts]);
      }
      setEditingPost(null);
    } else {
      setStatusMsg(`Gagal menyimpan: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    await deletePost(id, slug);
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Berita & Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publikasikan artikel, dokumentasi pembangunan, dan maklumat resmi untuk warga.
          </p>
        </div>
        <button
          onClick={startNewPost}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Post Editor */}
      {editingPost && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-8 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-800">
              Formulir Berita: {editingPost.title}
            </h2>
            <button
              onClick={() => setEditingPost(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Berita *</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Slug URL *</label>
              <input
                type="text"
                value={editingPost.slug}
                onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={editingPost.category_name || 'Pemerintahan'}
                onChange={(e) => setEditingPost({ ...editingPost, category_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              >
                <option value="Pemerintahan">Pemerintahan</option>
                <option value="Pembangunan">Pembangunan</option>
                <option value="Kegiatan Warga">Kegiatan Warga</option>
                <option value="Pengumuman">Pengumuman</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">URL Foto Sampul (WebP / Storage)</label>
              <input
                type="text"
                value={editingPost.thumbnail_url || ''}
                onChange={(e) => setEditingPost({ ...editingPost, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">Isi Berita (HTML Rich Text) *</label>
            <textarea
              rows={8}
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan & Tayangkan Berita'}
            </button>
            <button
              onClick={() => setEditingPost(null)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {posts.map((post) => (
            <div key={post.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {post.thumbnail_url && (
                    <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                      {post.category_name || 'Umum'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-1 line-clamp-1">
                    {post.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1.5 bg-primary-light text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.slug)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
