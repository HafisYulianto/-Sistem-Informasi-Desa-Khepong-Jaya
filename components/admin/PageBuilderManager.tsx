'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { savePage, deletePage } from '@/lib/actions/mutations';
import { PageRecord, PageBlock } from '@/lib/types/database';

interface PageBuilderManagerProps {
  initialPages: PageRecord[];
}

export default function PageBuilderManager({ initialPages }: PageBuilderManagerProps) {
  const [pages, setPages] = useState<PageRecord[]>(initialPages);
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startNewPage = () => {
    const newPage: PageRecord = {
      id: `pg_${Date.now()}`,
      title: 'Halaman Baru',
      slug: `halaman-baru-${Date.now().toString().slice(-4)}`,
      seo_description: 'Deskripsi halaman',
      seo_keywords: 'desa, khepong jaya',
      status: 'published',
      blocks: [
        {
          type: 'rich_text',
          content: '<h2>Judul Bagian</h2><p>Tuliskan teks informasi di sini...</p>',
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingPage(newPage);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    setStatusMsg(null);

    const res = await savePage({
      id: editingPage.id,
      title: editingPage.title,
      slug: editingPage.slug,
      seo_description: editingPage.seo_description || '',
      seo_keywords: editingPage.seo_keywords || '',
      status: editingPage.status,
      blocks: editingPage.blocks,
    });

    if (res.success) {
      setStatusMsg(`Halaman /${editingPage.slug} berhasil disimpan dan langsung dapat diakses!`);
      const existingIdx = pages.findIndex((p) => p.id === editingPage.id);
      if (existingIdx >= 0) {
        const copy = [...pages];
        copy[existingIdx] = editingPage;
        setPages(copy);
      } else {
        setPages([editingPage, ...pages]);
      }
      setEditingPage(null);
    } else {
      setStatusMsg(`Gagal menyimpan: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleDeletePage = async (id: string, slug: string) => {
    if (!confirm(`Hapus halaman /${slug}?`)) return;
    await deletePage(id, slug);
    setPages(pages.filter((p) => p.id !== id));
  };

  // Modular block manipulation
  const addBlock = (type: PageBlock['type']) => {
    if (!editingPage) return;
    let newBlock: PageBlock;
    if (type === 'rich_text') {
      newBlock = { type: 'rich_text', content: '<h2>Sub Judul</h2><p>Paragraf baru...</p>' };
    } else if (type === 'image_banner') {
      newBlock = {
        type: 'image_banner',
        image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
        caption: 'Keterangan gambar',
      };
    } else if (type === 'split_content') {
      newBlock = {
        type: 'split_content',
        title: 'Judul Seksi Berdampingan',
        text: 'Penjelasan lengkap seksi...',
        image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
        image_position: 'right',
      };
    } else if (type === 'document_download') {
      newBlock = {
        type: 'document_download',
        document_name: 'Perdes Dokumen Resmi.pdf',
        document_url: 'https://example.com/dokumen.pdf',
        file_size: '2.4 MB',
      };
    } else {
      newBlock = {
        type: 'embed',
        embed_type: 'youtube',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      };
    }

    setEditingPage({
      ...editingPage,
      blocks: [...editingPage.blocks, newBlock],
    });
  };

  const removeBlock = (index: number) => {
    if (!editingPage) return;
    const copy = [...editingPage.blocks];
    copy.splice(index, 1);
    setEditingPage({ ...editingPage, blocks: copy });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Pembuat Halaman Dinamis (Page Builder)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Buat halaman baru tanpa batas (misal: /karang-taruna, /bumdes, /pariwisata) yang otomatis live lewat rute catch-all /[slug].
          </p>
        </div>
        <button
          onClick={startNewPage}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Halaman Baru</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Editor Modal / Section */}
      {editingPage && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 className="text-xl font-black text-slate-800">
              Editor Halaman: {editingPage.title}
            </h2>
            <button
              onClick={() => setEditingPage(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Tutup Editor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Halaman *</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slug URL (misal: visi-misi) *</label>
              <input
                type="text"
                value={editingPage.slug}
                onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Meta SEO</label>
              <input
                type="text"
                value={editingPage.seo_description || ''}
                onChange={(e) => setEditingPage({ ...editingPage, seo_description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Stacking Blocks */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Tumpukan Blok Konten (Modular Blocks)
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addBlock('rich_text')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                >
                  + Rich Text
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('image_banner')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                >
                  + Banner Foto
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('split_content')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                >
                  + Split Teks/Foto
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('document_download')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                >
                  + Unduh Berkas
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editingPage.blocks.map((block, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold text-primary uppercase">
                      Blok {idx + 1}: {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      Hapus Blok
                    </button>
                  </div>

                  {block.type === 'rich_text' && (
                    <textarea
                      rows={4}
                      value={block.content || ''}
                      onChange={(e) => {
                        const copy = [...editingPage.blocks];
                        copy[idx].content = e.target.value;
                        setEditingPage({ ...editingPage, blocks: copy });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      placeholder="Tuliskan format HTML atau teks di sini..."
                    />
                  )}

                  {block.type === 'image_banner' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={block.image_url || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].image_url = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="URL Gambar"
                      />
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].caption = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="Keterangan Caption"
                      />
                    </div>
                  )}

                  {block.type === 'split_content' && (
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].title = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="Judul Konten"
                      />
                      <textarea
                        rows={2}
                        value={block.text || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].text = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="Teks Paragraf..."
                      />
                    </div>
                  )}

                  {block.type === 'document_download' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={block.document_name || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].document_name = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="Nama Dokumen"
                      />
                      <input
                        type="text"
                        value={block.document_url || ''}
                        onChange={(e) => {
                          const copy = [...editingPage.blocks];
                          copy[idx].document_url = e.target.value;
                          setEditingPage({ ...editingPage, blocks: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200"
                        placeholder="URL Unduhan Berkas"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleSavePage}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan Halaman'}
            </button>
            <button
              onClick={() => setEditingPage(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {pages.map((p) => (
            <div key={p.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/60 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-800 text-base">
                    {p.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase">
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono mt-1">
                  <span>/{p.slug}</span>
                  <span>•</span>
                  <span>{p.blocks.length} Blok Konten</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`/${p.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Lihat URL</span>
                </a>
                <button
                  onClick={() => setEditingPage(p)}
                  className="px-3 py-1.5 bg-primary-light text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Blok</span>
                </button>
                <button
                  onClick={() => handleDeletePage(p.id, p.slug)}
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
