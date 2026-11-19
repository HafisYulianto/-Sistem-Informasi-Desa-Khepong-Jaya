import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { getPosts } from '@/lib/data/api';

export const metadata = {
  title: 'Berita & Informasi Terkini',
  description: 'Warta berita, pengumuman, dan agenda kegiatan resmi Desa Khepong Jaya.',
};

export default async function BeritaPage() {
  const posts = await getPosts(30);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Kabar Desa
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
            Berita & Pengumuman Resmi
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Informasi seputar pembangunan, kegiatan warga, dan kebijakan pemerintahan desa.
          </p>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
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
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.views_count} dibaca</span>
                    </span>
                  </div>
                  <h2 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/berita/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
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
    </div>
  );
}
