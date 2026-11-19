import Image from 'next/image';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { PageBlock } from '@/lib/types/database';

interface BlockRendererProps {
  blocks: PageBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        Halaman ini belum memiliki konten blok.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'rich_text':
            return (
              <div
                key={index}
                className="prose-desa text-slate-700 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm"
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            );

          case 'image_banner':
            return (
              <figure key={index} className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                {block.image_url && (
                  <div className="relative w-full h-[360px] sm:h-[480px]">
                    <Image
                      src={block.image_url}
                      alt={block.caption || 'Banner Foto'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </div>
                )}
                {block.caption && (
                  <figcaption className="p-4 text-center text-sm text-slate-500 italic bg-slate-50 border-t border-slate-100">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'split_content':
            const isImageLeft = block.image_position === 'left';
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={isImageLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
                    {block.title && (
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                        {block.title}
                      </h3>
                    )}
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                      {block.text}
                    </p>
                  </div>
                  {block.image_url && (
                    <div className={`relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-sm ${isImageLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}>
                      <Image
                        src={block.image_url}
                        alt={block.title || 'Foto Konten'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
              </div>
            );

          case 'document_download':
            return (
              <div
                key={index}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {block.document_name || 'Lampiran Dokumen Resmi'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {block.file_size ? `Ukuran berkas: ${block.file_size} • ` : ''}Format PDF / Dokumen Resmi Desa
                    </p>
                  </div>
                </div>
                {block.document_url && (
                  <a
                    href={block.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-all shadow hover:shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas</span>
                  </a>
                )}
              </div>
            );

          case 'embed':
            return (
              <div key={index} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white p-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={block.embed_url}
                    title="Embedded Content"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
