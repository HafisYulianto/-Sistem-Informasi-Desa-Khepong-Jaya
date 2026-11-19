import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug, getSiteIdentity } from '@/lib/data/api';
import BlockRenderer from '@/components/blocks/BlockRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  const identity = await getSiteIdentity();

  if (!page) {
    return {
      title: 'Halaman Tidak Ditemukan',
    };
  }

  return {
    title: `${page.title} | ${identity.village_name}`,
    description: page.seo_description || `Halaman ${page.title} - ${identity.village_name}`,
    keywords: page.seo_keywords?.split(',') || [],
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // Reserved paths shouldn't be handled by dynamic page builder if matched here
  const reservedSlugs = ['admin', 'login', 'berita', 'apbdes', 'umkm', 'galeri', 'pengaduan', 'pemerintahan'];
  if (reservedSlugs.includes(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Halaman Resmi Desa
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight mt-2">
            {page.title}
          </h1>
          {page.seo_description && (
            <p className="text-slate-500 mt-3 text-base sm:text-lg">
              {page.seo_description}
            </p>
          )}
        </div>

        {/* Dynamic Blocks Stack */}
        <BlockRenderer blocks={page.blocks} />
      </div>
    </div>
  );
}
