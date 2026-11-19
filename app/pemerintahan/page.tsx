import Image from 'next/image';
import { Award, UserCheck } from 'lucide-react';
import { getVillageOfficials } from '@/lib/data/api';

export const metadata = {
  title: 'Struktur Organisasi & Perangkat Desa',
  description: 'Pemerintahan Desa Khepong Jaya dan jajaran aparatur pelayan masyarakat.',
};

export default async function PemerintahanPage() {
  const officials = await getVillageOfficials();

  // Find Kepala Desa for top spotlight
  const kades = officials.find((o) => o.position.toLowerCase().includes('kepala desa'));
  const otherOfficials = officials.filter((o) => o.id !== kades?.id);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Tata Kelola Desa
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight mt-1">
            Pemerintah Desa Khepong Jaya
          </h1>
          <p className="text-slate-500 mt-3 text-sm sm:text-base">
            Jajaran aparatur desa yang berdedikasi melayani kepentingan warga secara profesional, transparan, dan amanah.
          </p>
        </div>

        {/* Kepala Desa Spotlight */}
        {kades && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-2 bg-primary" />
            <div className="relative w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white mb-5 group-hover:scale-105 transition-transform">
              <Image
                src={kades.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                alt={kades.name}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-extrabold rounded-full mb-2">
              {kades.position}
            </span>
            <h2 className="text-xl font-black text-slate-800">
              {kades.name}
            </h2>
            {kades.nip && (
              <p className="text-xs text-slate-400 mt-1">
                NIP/NIAP: {kades.nip}
              </p>
            )}
            <p className="text-xs font-medium text-slate-500 mt-1">
              Masa Jabatan: {kades.period || '2021 - 2027'}
            </p>
          </div>
        )}

        {/* Other Officials Grid */}
        <div>
          <h3 className="text-center text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-8">
            Perangkat & Pelaksana Teknis Desa
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {otherOfficials.map((officer) => (
              <div
                key={officer.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="relative w-36 h-48 mx-auto rounded-2xl overflow-hidden shadow border-2 border-slate-100 mb-4">
                  <Image
                    src={officer.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'}
                    alt={officer.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full mb-1.5">
                  {officer.position}
                </span>
                <h4 className="font-extrabold text-slate-800 text-base">
                  {officer.name}
                </h4>
                {officer.nip && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    NIP: {officer.nip}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  Periode: {officer.period || '2021 - 2027'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
