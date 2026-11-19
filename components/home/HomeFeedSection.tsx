import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, ShoppingBag, PieChart, ShieldCheck } from 'lucide-react';
import { Post, UMKMProduct } from '@/lib/types/database';

interface HomeFeedSectionProps {
  posts: Post[];
  umkm: UMKMProduct[];
}

export default function HomeFeedSection({ posts, umkm }: HomeFeedSectionProps) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. LATEST NEWS */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Kabar Terkini
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Berita & Informasi Desa
              </h2>
            </div>
            <Link
              href="/berita"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-primary hover:text-primary-hover group"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {post.thumbnail_url ? (
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      Foto Berita
                    </div>
                  )}
                  {post.category_name && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 rounded-full shadow-sm">
                      {post.category_name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/berita/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/berita/${post.slug}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 2. CALLOUT BANNER APBDES TRANSPARANSI */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold">
              <PieChart className="w-3.5 h-3.5" />
              <span>Keterbukaan Anggaran Desa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Transparansi APBDes Tahun Anggaran 2026
            </h2>
            <p className="text-slate-200 text-base leading-relaxed">
              Pemerintah Desa Khepong Jaya membuka secara transparan seluruh rincian pos Pendapatan, Belanja Pembangunan, dan Pembiayaan demi akuntabilitas pengelolaan dana desa.
            </p>
            <div className="pt-2">
              <Link
                href="/apbdes"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-accent hover:bg-accent-hover text-slate-900 font-extrabold text-sm rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <span>Buka Rincian & Grafik APBDes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. FEATURED UMKM */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Produk Lokal Unggulan
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Potensi & UMKM Warga Desa
              </h2>
            </div>
            <Link
              href="/umkm"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-primary hover:text-primary-hover group"
            >
              <span>Jelajahi Katalog UMKM</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {umkm.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      Foto Produk
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Pemilik: {item.owner_name}</p>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Harga</span>
                      <span className="font-extrabold text-primary text-base">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${item.whatsapp_number.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(item.owner_name)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(item.name)}%20di%20Website%20Desa%20Khepong%20Jaya.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Pesan via WA</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
