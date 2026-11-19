import { getAPBDesRecords } from '@/lib/data/api';
import APBDesView from '@/components/apbdes/APBDesView';

export const metadata = {
  title: 'Transparansi APBDes',
  description: 'Informasi keterbukaan Anggaran Pendapatan dan Belanja Desa (APBDes) Khepong Jaya.',
};

export default async function APBDesPage() {
  const records = await getAPBDesRecords(2026);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Akuntabilitas Publik
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
            Transparansi APBDes Tahun Anggaran 2026
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Keterbukaan informasi keuangan desa, alokasi dana transfer pusat, APBD Kabupaten, dan realisasi program pembangunan masyarakat.
          </p>
        </div>

        {/* View Component with dynamic calculations */}
        <APBDesView records={records} />
      </div>
    </div>
  );
}
