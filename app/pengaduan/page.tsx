import { createClient } from '@/lib/supabase/server';
import ComplaintSection from '@/components/complaints/ComplaintSection';
import { PublicComplaint } from '@/lib/types/database';

export const metadata = {
  title: 'Layanan Pengaduan & Aspirasi Warga',
  description: 'Saluran resmi penyampaian aspirasi, saran, dan pengaduan warga Desa Khepong Jaya.',
};

export default async function PengaduanPage() {
  let complaints: PublicComplaint[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('public_complaints')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      complaints = data;
    }
  } catch {
    // Fallback complaints
  }

  if (complaints.length === 0) {
    complaints = [
      {
        id: 'c1',
        citizen_name: 'Supratman',
        citizen_nik: '1703051208850001',
        citizen_phone: '081399887766',
        citizen_email: null,
        title: 'Lampu Penerangan Jalan di RT 03 Padam',
        description: 'Mohon perbaikan lampu jalan umum di pertigaan RT 03 Dusun I sudah seminggu padam sehingga malam hari sangat gelap dan membahayakan pengendara motor.',
        photo_proof_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
        status: 'selesai',
        official_response: 'Terima kasih atas laporannya Bapak Supratman. Tim operasional desa bersama PLN telah melakukan penggantian bohlam dan kabel panel pada hari Rabu, 18 November 2026. Lampu saat ini sudah berfungsi normal kembali.',
        is_public: true,
        created_at: '2026-11-17T08:00:00Z',
        updated_at: '2026-11-18T10:00:00Z',
      },
      {
        id: 'c2',
        citizen_name: 'Indra Wijaya',
        citizen_nik: '1703052104920002',
        citizen_phone: '082233445566',
        citizen_email: null,
        title: 'Permohonan Pembersihan Sampah Saluran Air Dusun II',
        description: 'Terdapat penumpukan ranting pohon dan sampah plastik di gorong-gorong jembatan kecil Dusun II yang menyebabkan air meluap saat hujan deras.',
        photo_proof_url: null,
        status: 'diproses',
        official_response: 'Laporan telah diterima. Petugas kebersihan dan karang taruna telah dijadwalkan turun melakukan pengangkatan sampah pada agenda Jumat Bersih pekan ini.',
        is_public: true,
        created_at: '2026-11-18T11:20:00Z',
        updated_at: '2026-11-18T14:00:00Z',
      },
    ];
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Keterbukaan Pelayanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
            Layanan Aspirasi & Pengaduan Warga Desa
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Saluran langsung warga Desa Khepong Jaya untuk menyampaikan saran pembangunan, pengaduan fasilitas umum, dan aspirasi kemasyarakatan.
          </p>
        </div>

        {/* Complaint Component */}
        <ComplaintSection initialComplaints={complaints} />
      </div>
    </div>
  );
}
