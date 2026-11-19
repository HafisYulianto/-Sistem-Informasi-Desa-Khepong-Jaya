import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { SiteIdentity, SiteFooter } from '@/lib/types/database';

interface FooterProps {
  identity: SiteIdentity;
  footer: SiteFooter;
}

export default function Footer({ identity, footer }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Identity & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-white/10 p-0.5">
                <Image
                  src={identity.logo_url}
                  alt={identity.village_name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {identity.village_name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {footer.about_text}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {footer.social_media.facebook && (
                <a
                  href={footer.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {footer.social_media.instagram && (
                <a
                  href={footer.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {footer.social_media.youtube && (
                <a
                  href={footer.social_media.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-3">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/visi-misi" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Visi & Misi</span>
                </Link>
              </li>
              <li>
                <Link href="/sejarah" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Sejarah Desa</span>
                </Link>
              </li>
              <li>
                <Link href="/pemerintahan" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Struktur Pemerintahan</span>
                </Link>
              </li>
              <li>
                <Link href="/apbdes" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Transparansi APBDes</span>
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Potensi & UMKM Desa</span>
                </Link>
              </li>
              <li>
                <Link href="/pengaduan" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>› Layanan Aspirasi Warga</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Office */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-3">
              Kantor Desa
            </h3>
            <div className="flex items-start space-x-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{footer.office_address}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <a
                href={`https://wa.me/${footer.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>WhatsApp: {footer.whatsapp}</span>
                <ExternalLink className="w-3 h-3 ml-1 text-slate-500" />
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                {footer.email}
              </a>
            </div>
          </div>

          {/* Map Embed */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-3">
              Lokasi Kantor
            </h3>
            <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <iframe
                title="Peta Lokasi Desa"
                src={footer.maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {identity.village_name}. Seluruh Hak Cipta Dilindungi.</p>
          <p className="mt-2 sm:mt-0">Sistem Informasi Desa Modern (Next.js & Supabase)</p>
        </div>
      </div>
    </footer>
  );
}
