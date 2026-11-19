import Link from 'next/link';
import {
  FileText,
  Newspaper,
  ShoppingBag,
  MessageSquare,
  Users,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getPosts, getUMKMProducts, getVillageOfficials, getAPBDesRecords } from '@/lib/data/api';

export default async function AdminDashboardPage() {
  const [posts, umkm, officials, apbdes] = await Promise.all([
    getPosts(100),
    getUMKMProducts(),
    getVillageOfficials(),
    getAPBDesRecords(2026),
  ]);

  const cards = [
    { title: 'Berita & Artikel', count: posts.length, href: '/admin/berita', icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
    { title: 'Produk UMKM', count: umkm.length, href: '/admin/umkm', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
    { title: 'Perangkat Desa', count: officials.length, href: '/admin/aparatur', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Item APBDes 2026', count: apbdes.length, href: '/admin/apbdes', icon: PieChart, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Informasi Desa Khepong Jaya v1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Selamat Datang di Panel Pengelola
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Seluruh data, halaman dinamis, struktur menu navigasi, dan tampilan publik 100% dinamis dan tersinkronisasi instan melalui On-Demand Revalidation.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={c.href}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-800">
                  {c.count}
                </span>
                <span className="text-xs font-bold text-primary group-hover:underline flex items-center space-x-1">
                  <span>Kelola</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-black text-slate-800">
          Tindakan Cepat (Quick Shortcuts)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/settings"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all block"
          >
            <h3 className="font-bold text-slate-800 text-sm">Ubah Warna Tema & Font</h3>
            <p className="text-xs text-slate-500 mt-1">Kustomisasi CSS variables Primary & Accent.</p>
          </Link>

          <Link
            href="/admin/pages"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all block"
          >
            <h3 className="font-bold text-slate-800 text-sm">Buat Halaman Dinamis Baru</h3>
            <p className="text-xs text-slate-500 mt-1">Gunakan modular block editor untuk URL baru.</p>
          </Link>

          <Link
            href="/admin/pengaduan"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all block"
          >
            <h3 className="font-bold text-slate-800 text-sm">Tanggapi Aspirasi Warga</h3>
            <p className="text-xs text-slate-500 mt-1">Perbarui status laporan dan beri jawaban resmi.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
