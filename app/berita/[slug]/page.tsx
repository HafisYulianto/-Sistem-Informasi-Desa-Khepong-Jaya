import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react';
import { getPostBySlug, getSiteIdentity } from '@/lib/data/api';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const identity = await getSiteIdentity();

  if (!post) {
    return { title: 'Berita Tidak Ditemukan' };
  }

  return {
    title: `${post.title} | ${identity.village_name}`,
    description: post.content.replace(/<[^>]*>?/gm, '').slice(0, 160),
    openGraph: {
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/berita"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Warta Berita</span>
          </Link>
        </div>

        {/* Post Header */}
        <div className="space-y-4">
          {post.category_name && (
            <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full">
              {post.category_name}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-slate-400 border-b border-slate-200 pb-6">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views_count} tayangan</span>
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.thumbnail_url && (
          <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-md">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose-desa text-slate-700 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Extra Gallery Photos if available */}
        {post.gallery_urls && post.gallery_urls.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="font-bold text-lg text-slate-800">
              Dokumentasi Foto Tambahan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {post.gallery_urls.map((imgUrl, i) => (
                <div key={i} className="relative h-44 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src={imgUrl}
                    alt={`Dokumentasi ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
