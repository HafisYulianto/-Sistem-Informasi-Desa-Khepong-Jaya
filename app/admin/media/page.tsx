'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Copy, Trash2, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { compressImageToWebP } from '@/lib/utils/compression';
import { createClient } from '@/lib/supabase/client';

export default function AdminMediaPage() {
  const [files, setFiles] = useState([
    {
      name: 'banner-desa-utama.webp',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
      size: '240 KB',
      created_at: '2026-11-18',
    },
    {
      name: 'foto-kades-resmi.webp',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      size: '112 KB',
      created_at: '2026-11-17',
    },
    {
      name: 'produk-kopi-robusta.webp',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      size: '95 KB',
      created_at: '2026-11-16',
    },
    {
      name: 'musrenbangdes-2026.webp',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      size: '185 KB',
      created_at: '2026-11-15',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      setIsUploading(true);

      try {
        // Step 1: Compress to WebP on client side (max 800KB)
        const compressedWebP = await compressImageToWebP(originalFile);

        // Step 2: Upload to Supabase Storage if configured
        const supabase = createClient();
        const filePath = `${Date.now()}-${compressedWebP.name}`;

        let publicUrl = URL.createObjectURL(compressedWebP);

        try {
          const { data, error } = await supabase.storage
            .from('desa-media')
            .upload(filePath, compressedWebP);

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from('desa-media')
              .getPublicUrl(filePath);
            publicUrl = urlData.publicUrl;
          }
        } catch {
          // If storage not configured, fallback to preview
        }

        const newFile = {
          name: compressedWebP.name,
          url: publicUrl,
          size: `${Math.round(compressedWebP.size / 1024)} KB`,
          created_at: new Date().toISOString().split('T')[0],
        };

        setFiles([newFile, ...files]);
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = (name: string) => {
    if (!confirm(`Hapus berkas ${name} dari storage?`)) return;
    setFiles(files.filter((f) => f.name !== name));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Supabase Media Library & Storage Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pusat pengelolaan file gambar dan dokumen bucket <code>desa-media</code> dengan kompresi otomatis WebP sisi klien.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary p-8 text-center transition-all bg-emerald-50/20 relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-slate-800 text-base">
            {isUploading ? 'Sedang Mengompresi ke WebP & Mengunggah...' : 'Klik atau Tarik Foto ke Sini'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm">
            Gambar otomatis dikonversi menjadi format WebP beresolusi optimal (&lt;800 KB) sebelum dikirim ke Supabase Storage.
          </p>
        </div>
      </div>

      {copiedUrl && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>URL Gambar berhasil disalin ke papan klip (clipboard)!</span>
        </div>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {files.map((file, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <Image src={file.url} alt={file.name} fill className="object-cover" sizes="25vw" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs mt-3 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {file.size} • {file.created_at}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => copyToClipboard(file.url)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Salin URL</span>
              </button>
              <button
                onClick={() => handleDelete(file.name)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl"
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
