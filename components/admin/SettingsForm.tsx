'use client';

import { useState } from 'react';
import { Save, CheckCircle2, Palette, Globe, Menu, Shield } from 'lucide-react';
import { saveSiteSettings } from '@/lib/actions/mutations';
import { SiteIdentity, SiteTheme, SiteNavigation, SiteFooter } from '@/lib/types/database';

interface SettingsFormProps {
  initialIdentity: SiteIdentity;
  initialTheme: SiteTheme;
  initialNavigation: SiteNavigation;
  initialFooter: SiteFooter;
}

export default function SettingsForm({
  initialIdentity,
  initialTheme,
  initialNavigation,
  initialFooter,
}: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<'identity' | 'theme' | 'navigation' | 'footer'>('identity');
  const [identity, setIdentity] = useState(initialIdentity);
  const [theme, setTheme] = useState(initialTheme);
  const [navigation, setNavigation] = useState(initialNavigation);
  const [footer, setFooter] = useState(initialFooter);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = async (key: string, data: any) => {
    setIsSaving(true);
    setStatusMessage(null);
    const res = await saveSiteSettings(key, data);
    if (res.success) {
      setStatusMessage(`Pengaturan ${key} berhasil disimpan dan cache web langsung diperbarui.`);
    } else {
      setStatusMessage(`Gagal menyimpan: ${res.error}`);
    }
    setIsSaving(false);
  };

  // Navigation CRUD helpers
  const addMenuItem = () => {
    const newItem = {
      id: `menu_${Date.now()}`,
      title: 'Menu Baru',
      href: '/halaman-baru',
      order: navigation.menus.length + 1,
    };
    setNavigation({ ...navigation, menus: [...navigation.menus, newItem] });
  };

  const removeMenuItem = (index: number) => {
    const updated = [...navigation.menus];
    updated.splice(index, 1);
    setNavigation({ ...navigation, menus: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Pengaturan Umum & Kustomisasi Tema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola identitas, warna CSS tema, struktur menu, dan footer website desa.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'identity', label: 'Identitas & SEO Desa', icon: Globe },
          { key: 'theme', label: 'Warna Tema & Font (CSS)', icon: Palette },
          { key: 'navigation', label: 'Menu Navigasi Header', icon: Menu },
          { key: 'footer', label: 'Footer & Kontak Kantor', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: IDENTITAS */}
      {activeTab === 'identity' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Desa</label>
              <input
                type="text"
                value={identity.village_name}
                onChange={(e) => setIdentity({ ...identity, village_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={identity.subdistrict}
                onChange={(e) => setIdentity({ ...identity, subdistrict: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten</label>
              <input
                type="text"
                value={identity.district}
                onChange={(e) => setIdentity({ ...identity, district: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={identity.province}
                onChange={(e) => setIdentity({ ...identity, province: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Slogan / Tagline Desa</label>
              <input
                type="text"
                value={identity.tagline}
                onChange={(e) => setIdentity({ ...identity, tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Logo Desa (Supabase Storage)</label>
              <input
                type="text"
                value={identity.logo_url}
                onChange={(e) => setIdentity({ ...identity, logo_url: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Meta Title (SEO)</label>
              <input
                type="text"
                value={identity.meta_title || ''}
                onChange={(e) => setIdentity({ ...identity, meta_title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave('identity', identity)}
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Identitas Desa'}</span>
          </button>
        </div>
      )}

      {/* TAB 2: THEME CUSTOMIZER */}
      {activeTab === 'theme' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Warna Utama (Primary Color)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.primary_color}
                  onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 p-1 bg-slate-100"
                />
                <input
                  type="text"
                  value={theme.primary_color}
                  onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                  className="w-36 px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Warna Aksen (Accent Color)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.accent_color}
                  onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 p-1 bg-slate-100"
                />
                <input
                  type="text"
                  value={theme.accent_color}
                  onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                  className="w-36 px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gaya Font Dasar</label>
              <select
                value={theme.font_family}
                onChange={(e) => setTheme({ ...theme, font_family: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
              >
                <option value="Inter">Inter (Modern & Clean)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleSave('theme', theme)}
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Terapkan Tema Baru'}</span>
          </button>
        </div>
      )}

      {/* TAB 3: NAVIGATION BUILDER */}
      {activeTab === 'navigation' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-2">
            <h3 className="font-extrabold text-slate-800 text-sm">Daftar Menu Navigasi Header</h3>
            <button
              onClick={addMenuItem}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              + Tambah Menu
            </button>
          </div>

          <div className="space-y-3">
            {navigation.menus.map((menu, idx) => (
              <div
                key={menu.id || idx}
                className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <input
                  type="text"
                  value={menu.title}
                  onChange={(e) => {
                    const updated = [...navigation.menus];
                    updated[idx].title = e.target.value;
                    setNavigation({ ...navigation, menus: updated });
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                  placeholder="Judul Menu"
                />
                <input
                  type="text"
                  value={menu.href}
                  onChange={(e) => {
                    const updated = [...navigation.menus];
                    updated[idx].href = e.target.value;
                    setNavigation({ ...navigation, menus: updated });
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  placeholder="/url"
                />
                <button
                  onClick={() => removeMenuItem(idx)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSave('navigation', navigation)}
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Struktur Menu'}</span>
          </button>
        </div>
      )}

      {/* TAB 4: FOOTER & CONTACT */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Deskripsi Footer</label>
              <textarea
                rows={3}
                value={footer.about_text}
                onChange={(e) => setFooter({ ...footer, about_text: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 resize-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Kantor Desa</label>
              <input
                type="text"
                value={footer.office_address}
                onChange={(e) => setFooter({ ...footer, office_address: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Pelayanan</label>
                <input
                  type="text"
                  value={footer.whatsapp}
                  onChange={(e) => setFooter({ ...footer, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi Desa</label>
                <input
                  type="email"
                  value={footer.email}
                  onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Google Maps Embed</label>
              <input
                type="text"
                value={footer.maps_embed}
                onChange={(e) => setFooter({ ...footer, maps_embed: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave('footer', footer)}
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi Footer'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
