'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { saveHomepageSection } from '@/lib/actions/mutations';

export default function AdminHomepageSectionPage() {
  const [heroTitle, setHeroTitle] = useState('Selamat Datang di Portal Desa Khepong Jaya');
  const [heroSubtitle, setHeroSubtitle] = useState('Mewujudkan Desa yang Maju, Transparan, Berdaya Saing, dan Berkelanjutan');
  const [kadesName, setKadesName] = useState('H. Bambang Irawan, S.Pd.');
  const [kadesGreeting, setKadesGreeting] = useState(
    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal web resmi Desa Khepong Jaya. Website ini kami bangun sebagai wujud keterbukaan informasi publik dan sarana memajukan potensi desa kita tercinta secara gotong royong.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedMsg(false);

    // Save hero section
    await saveHomepageSection({
      section_type: 'hero_slider',
      title: heroTitle,
      subtitle: heroSubtitle,
      content: {
        slides: [
          {
            title: heroTitle,
            subtitle: heroSubtitle,
            bg_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
            cta_text: 'Layanan Pengaduan',
            cta_link: '/pengaduan',
          },
        ],
      },
      order_index: 1,
      is_active: true,
    });

    // Save greeting kades
    await saveHomepageSection({
      section_type: 'greeting_kades',
      title: 'Sambutan Kepala Desa',
      subtitle: 'Pemerintah Desa Khepong Jaya',
      content: {
        kades_name: kadesName,
        kades_position: 'Kepala Desa Khepong Jaya',
        kades_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
        greeting_text: kadesGreeting,
      },
      order_index: 2,
      is_active: true,
    });

    setIsSaving(false);
    setSavedMsg(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Homepage Builder (Seksi Beranda Utama)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Atur teks banner selamat datang dan sambutan resmi kepala desa di halaman depan.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Seksi beranda berhasil diperbarui dan revalidasi cache telah dijalankan!</span>
        </div>
      )}

      {/* Hero Banner Section Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-extrabold text-slate-800">1. Hero Slider Utama</h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Utama Banner</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Sub Judul Banner</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Sambutan Kades Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-extrabold text-slate-800">2. Sambutan Kepala Desa</h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kepala Desa Lengkap Beserta Gelar</label>
            <input
              type="text"
              value={kadesName}
              onChange={(e) => setKadesName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Teks Sambutan Resmi (Rich Text)</label>
            <textarea
              rows={5}
              value={kadesGreeting}
              onChange={(e) => setKadesGreeting(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 resize-none text-xs leading-relaxed"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{isSaving ? 'Menyimpan...' : 'Simpan Seluruh Seksi Beranda'}</span>
      </button>
    </div>
  );
}
