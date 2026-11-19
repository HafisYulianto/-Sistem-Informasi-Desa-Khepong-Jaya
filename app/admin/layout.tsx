'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Layers,
  FileCode,
  Newspaper,
  PieChart,
  ShoppingBag,
  Users,
  MessageSquare,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Pengaturan & Tema', href: '/admin/settings', icon: Settings },
    { label: 'Homepage Builder', href: '/admin/homepage', icon: Layers },
    { label: 'Page Builder (Dinamis)', href: '/admin/pages', icon: FileCode },
    { label: 'Berita & Artikel', href: '/admin/berita', icon: Newspaper },
    { label: 'Transparansi APBDes', href: '/admin/apbdes', icon: PieChart },
    { label: 'Potensi & UMKM', href: '/admin/umkm', icon: ShoppingBag },
    { label: 'Perangkat Desa', href: '/admin/aparatur', icon: Users },
    { label: 'Aspirasi Warga', href: '/admin/pengaduan', icon: MessageSquare },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">Admin Khepong Jaya</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow">
                KJ
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-none">
                  Admin Panel
                </h2>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-1">
                  Khepong Jaya 100% Dinamis
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Lihat Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
