'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ShieldAlert } from 'lucide-react';
import { SiteIdentity, SiteNavigation } from '@/lib/types/database';

interface NavbarProps {
  identity: SiteIdentity;
  navigation: SiteNavigation;
}

export default function Navbar({ identity, navigation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top emergency / quick contact bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{identity.village_name}</span>
            <span>•</span>
            <span className="hidden sm:inline">Kec. {identity.subdistrict}, Kab. {identity.district}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/pengaduan" className="flex items-center space-x-1 hover:underline text-accent-light font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Aspirasi & Pengaduan Warga</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform bg-white">
              <Image
                src={identity.logo_url}
                alt={identity.village_name}
                fill
                className="object-contain p-0.5"
                sizes="48px"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-800 leading-none group-hover:text-primary transition-colors">
                {identity.village_name}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {identity.tagline}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.menus
              .sort((a, b) => a.order - b.order)
              .map((menu) => {
                const hasChildren = menu.children && menu.children.length > 0;
                const isActive = pathname === menu.href;

                if (hasChildren) {
                  return (
                    <div key={menu.id} className="relative group">
                      <button
                        className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-primary rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span>{menu.title}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-slate-400 group-hover:text-primary" />
                      </button>
                      <div className="absolute left-0 top-full pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2">
                          {menu.children!.map((sub) => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                                pathname === sub.href
                                  ? 'text-primary bg-primary-light/50 font-semibold'
                                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                              }`}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={menu.id}
                    href={menu.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-light/60 font-bold'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    {menu.title}
                  </Link>
                );
              })}

            <Link
              href="/admin"
              className="ml-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Admin Portal
            </Link>
          </nav>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {navigation.menus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0;
              const isDropdownActive = activeDropdown === menu.id;

              if (hasChildren) {
                return (
                  <div key={menu.id} className="py-1">
                    <button
                      onClick={() => toggleDropdown(menu.id)}
                      className="w-full flex justify-between items-center px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <span>{menu.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isDropdownActive ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isDropdownActive && (
                      <div className="pl-4 mt-1 space-y-1 border-l-2 border-primary-light ml-3">
                        {menu.children!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-primary rounded-md"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={menu.id}
                  href={menu.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    pathname === menu.href
                      ? 'text-primary bg-primary-light/60 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {menu.title}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-sm"
              >
                Masuk ke Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
