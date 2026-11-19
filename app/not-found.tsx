import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-3xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            404 - Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Halaman atau dokumen desa yang Anda tuju belum diterbitkan atau telah dipindahkan oleh pengelola website.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
