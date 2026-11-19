import Image from 'next/image';
import { ShoppingBag, MessageCircle, Store } from 'lucide-react';
import { getUMKMProducts } from '@/lib/data/api';

export const metadata = {
  title: 'Potensi & UMKM Desa',
  description: 'Katalog produk unggulan dan usaha mikro warga Desa Khepong Jaya.',
};

export default async function UMKMPage() {
  const products = await getUMKMProducts();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Ekonomi Kreatif & Kerakyatan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
            Potensi & Produk UMKM Desa Khepong Jaya
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Dukung pertumbuhan ekonomi lokal dengan membeli produk olahan, kerajinan, dan komoditas unggulan karya warga desa kami.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Store className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-4 left-4 px-3.5 py-1 bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-800 rounded-full shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h2 className="font-extrabold text-slate-800 text-xl leading-snug">
                    {item.name}
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <span>Pengrajin / Pemilik:</span>
                    <strong className="text-slate-700">{item.owner_name}</strong>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                      Harga Produk
                    </span>
                    <span className="text-xl font-black text-primary">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${item.whatsapp_number.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(item.owner_name)},%20saya%20tertarik%20dengan%20produk%20*${encodeURIComponent(item.name)}*%20yang%20tercantum%20di%20Website%20Resmi%20Desa%20Khepong%20Jaya.%20Apakah%20stok%20tersedia?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Pesan via WA</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
