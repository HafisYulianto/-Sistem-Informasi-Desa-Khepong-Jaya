import Image from 'next/image';
import { Quote } from 'lucide-react';

interface GreetingKadesProps {
  content: {
    kades_name?: string;
    kades_position?: string;
    kades_photo?: string;
    greeting_text?: string;
  };
}

export default function GreetingKades({ content }: GreetingKadesProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Foto Kades */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-200/60">
                <Image
                  src={content.kades_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80'}
                  alt={content.kades_name || 'Kepala Desa'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mt-5">
                {content.kades_name || 'H. Bambang Irawan, S.Pd.'}
              </h3>
              <p className="text-sm font-semibold text-primary mt-0.5">
                {content.kades_position || 'Kepala Desa Khepong Jaya'}
              </p>
            </div>

            {/* Greeting Text */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-light text-primary font-bold text-xs uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                <span>Pesan Kepala Desa</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-snug">
                Bersama Membangun Desa yang Lebih Maju dan Mandiri
              </h2>
              <div className="text-slate-600 text-base sm:text-lg leading-relaxed space-y-4 font-normal">
                <p>
                  {content.greeting_text ||
                    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal web resmi Desa Khepong Jaya. Website ini kami bangun sebagai wujud keterbukaan informasi publik dan sarana memajukan potensi desa kita tercinta secara gotong royong.'}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Pemerintahan Desa Khepong Jaya</span>
                <span>Transparan • Akuntabel • Melayani</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
