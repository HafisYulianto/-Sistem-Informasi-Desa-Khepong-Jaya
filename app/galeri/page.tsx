import Image from 'next/image';
import { Camera, Video } from 'lucide-react';
import { getGalleryAlbums } from '@/lib/data/api';

export const metadata = {
  title: 'Galeri Foto & Video Kegiatan',
  description: 'Dokumentasi visual kegiatan pemerintahan, gotong royong, dan pembangunan Desa Khepong Jaya.',
};

export default async function GaleriPage() {
  const albums = await getGalleryAlbums();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Dokumentasi Desa
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
            Galeri Kegiatan & Potret Desa
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Kumpulan momen gotong royong, musyawarah desa, pembangunan infrastruktur, dan seni budaya warga.
          </p>
        </div>

        {/* Albums Stack */}
        <div className="space-y-16">
          {albums.map((album) => (
            <div key={album.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-2">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Album Dokumentasi</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="text-slate-600 text-sm mt-1 max-w-3xl">
                    {album.description}
                  </p>
                )}
              </div>

              {/* Photos in Album */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(album.items && album.items.length > 0 ? album.items : [{ media_url: album.cover_url, caption: album.title }]).map((item: any, idx: number) => (
                  <div key={idx} className="group rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                    <div className="relative h-56 w-full overflow-hidden">
                      {item.media_url ? (
                        <Image
                          src={item.media_url}
                          alt={item.caption || 'Foto Dokumentasi'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Camera className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    {item.caption && (
                      <div className="p-4 bg-white text-xs text-slate-600 font-medium">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
