import {
  SiteIdentity,
  SiteTheme,
  SiteNavigation,
  SiteFooter,
  HomepageSection,
  VillageOfficial,
  Post,
  APBDesRecord,
  UMKMProduct,
  GalleryAlbum,
  PublicComplaint,
  PageRecord,
} from '@/lib/types/database';

export const fallbackIdentity: SiteIdentity = {
  village_name: 'Desa Khepong Jaya',
  subdistrict: 'Padang Cermin',
  district: 'Pesawaran',
  province: 'Lampung',
  tagline: 'Maju, Mandiri, Berbudaya, dan Sejahtera',
  logo_url: '/logo.png',
  favicon_url: '/logo.png',
  meta_title: 'Portal Resmi Desa Khepong Jaya - Transparan & Melayani',
  meta_description: 'Website resmi Desa Khepong Jaya menyajikan informasi pemerintahan, transparansi APBDes, produk UMKM, layanan aspirasi warga, dan berita desa.',
};

export const fallbackTheme: SiteTheme = {
  primary_color: '#15803d',
  primary_hover: '#166534',
  primary_light: '#dcfce7',
  primary_foreground: '#ffffff',
  accent_color: '#f59e0b',
  accent_hover: '#d97706',
  accent_light: '#fef3c7',
  accent_foreground: '#ffffff',
  font_family: 'Inter',
};

export const fallbackNavigation: SiteNavigation = {
  menus: [
    { id: 'm1', title: 'Beranda', href: '/', order: 1 },
    {
      id: 'm2',
      title: 'Profil Desa',
      href: '#',
      order: 2,
      children: [
        { id: 'm2_1', title: 'Visi & Misi', href: '/visi-misi', order: 1 },
        { id: 'm2_2', title: 'Sejarah Desa', href: '/sejarah', order: 2 },
        { id: 'm2_3', title: 'Pemerintah Desa', href: '/pemerintahan', order: 3 },
      ],
    },
    { id: 'm3', title: 'Berita & Pengumuman', href: '/berita', order: 3 },
    { id: 'm4', title: 'Transparansi APBDes', href: '/apbdes', order: 4 },
    { id: 'm5', title: 'Potensi & UMKM', href: '/umkm', order: 5 },
    { id: 'm6', title: 'Galeri', href: '/galeri', order: 6 },
    { id: 'm7', title: 'Pengaduan Warga', href: '/pengaduan', order: 7 },
  ],
};

export const fallbackFooter: SiteFooter = {
  about_text: 'Website resmi Pemerintahan Desa Khepong Jaya yang dikembangkan sebagai sarana transparansi publik, publikasi potensi desa, dan pelayanan prima kepada seluruh warga masyarakat.',
  office_address: 'Jl. Raya Lintas Desa No. 12, Khepong Jaya, Kec. Padang Jaya, Kab. Bengkulu Utara',
  whatsapp: '081234567890',
  email: 'halo@khepongjaya.desa.id',
  maps_embed: 'https://maps.google.com/maps?q=Padang+Jaya+Bengkulu+Utara&t=&z=13&ie=UTF8&iwloc=&output=embed',
  social_media: {
    facebook: 'https://facebook.com/desakhepongjaya',
    instagram: 'https://instagram.com/desakhepongjaya',
    youtube: 'https://youtube.com/@desakhepongjaya',
  },
};

export const fallbackSections: HomepageSection[] = [
  {
    id: 's1',
    section_type: 'hero_slider',
    title: 'Selamat Datang di Portal Desa Khepong Jaya',
    subtitle: 'Mewujudkan Desa yang Maju, Transparan, Berdaya Saing, dan Berkelanjutan',
    content: {
      slides: [
        {
          title: 'Khepong Jaya Menuju Desa Digital',
          subtitle: 'Akses informasi pemerintahan, anggaran desa, dan layanan publik secara mudah dari mana saja.',
          bg_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
          cta_text: 'Layanan Pengaduan',
          cta_link: '/pengaduan',
        },
        {
          title: 'Transparansi Dana Desa & APBDes',
          subtitle: 'Keterbukaan informasi realisasi anggaran desa untuk kemakmuran seluruh warga.',
          bg_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80',
          cta_text: 'Lihat Anggaran',
          cta_link: '/apbdes',
        },
      ],
    },
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's2',
    section_type: 'greeting_kades',
    title: 'Sambutan Kepala Desa',
    subtitle: 'Pemerintah Desa Khepong Jaya',
    content: {
      kades_name: 'H. Bambang Irawan, S.Pd.',
      kades_position: 'Kepala Desa Khepong Jaya',
      kades_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      greeting_text: 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal web resmi Desa Khepong Jaya. Website ini kami bangun sebagai wujud keterbukaan informasi publik dan sarana memajukan potensi desa kita tercinta secara gotong royong.',
    },
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's3',
    section_type: 'statistics',
    title: 'Infografis & Statistik Desa',
    subtitle: 'Data Terkini Kependudukan & Wilayah',
    content: {
      stats: [
        { label: 'Jumlah Penduduk', value: '2.845', unit: 'Jiwa', icon: 'Users' },
        { label: 'Kepala Keluarga', value: '782', unit: 'KK', icon: 'Home' },
        { label: 'Luas Wilayah', value: '1.420', unit: 'Hektar', icon: 'MapPin' },
        { label: 'Kelompok UMKM', value: '45', unit: 'Usaha Aktif', icon: 'ShoppingBag' },
      ],
    },
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fallbackOfficials: VillageOfficial[] = [
  {
    id: 'o1',
    name: 'H. Bambang Irawan, S.Pd.',
    nip: '19740512 200212 1 002',
    position: 'Kepala Desa',
    period: '2021 - 2027',
    photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'o2',
    name: 'Ahmad Fauzi, S.Kom.',
    nip: '19880315 201101 1 004',
    position: 'Sekretaris Desa',
    period: '2021 - 2027',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'o3',
    name: 'Siti Rahmawati, S.E.',
    nip: '19920720 201503 2 001',
    position: 'Kaur Keuangan',
    period: '2021 - 2027',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'o4',
    name: 'Rudi Hermawan',
    nip: '19851110 201001 1 003',
    position: 'Kaur Perencanaan',
    period: '2021 - 2027',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'o5',
    name: 'Dewi Lestari',
    nip: '19950402 201902 2 003',
    position: 'Kasi Pelayanan & Kesejahteraan',
    period: '2021 - 2027',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    order_index: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const fallbackPosts: Post[] = [
  {
    id: 'p1',
    title: 'Pemerintah Desa Khepong Jaya Resmikan Saluran Irigasi Tersier Dusun II',
    slug: 'resmikan-saluran-irigasi-tersier-dusun-ii',
    category_id: 'c1',
    category_name: 'Pembangunan',
    thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    content: '<p>Pemerintah Desa Khepong Jaya hari ini meresmikan pembangunan saluran irigasi tersier sepanjang 650 meter di Dusun II. Pembangunan ini dibiayai menggunakan alokasi Dana Desa (DD) Tahun Anggaran 2026 guna mendukung ketahanan pangan warga dan memperlancar pasokan air ke areal persawahan seluas 40 hektar.</p><p>Kepala Desa Khepong Jaya menyampaikan bahwa keberadaan irigasi ini diharapkan mampu meningkatkan frekuensi panen petani dari dua kali menjadi tiga kali dalam setahun.</p>',
    gallery_urls: [],
    status: 'published',
    published_at: '2026-11-18T09:00:00Z',
    views_count: 142,
    created_at: '2026-11-18T09:00:00Z',
  },
  {
    id: 'p2',
    title: 'Pelatihan Digitalisasi Produk UMKM Olahan Kopi Khepong Jaya',
    slug: 'pelatihan-digitalisasi-produk-umkm-kopi',
    category_id: 'c2',
    category_name: 'Kegiatan Warga',
    thumbnail_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    content: '<p>Sebanyak 35 pelaku UMKM dan pemuda desa mengikuti lokakarya digitalisasi pemasaran produk olahan kopi robusta lokal. Pelatihan mencakup fotografi produk dengan ponsel cerdas, strategi penjualan di media sosial, serta pemanfaatan katalog website desa untuk pemesanan via WhatsApp.</p>',
    gallery_urls: [],
    status: 'published',
    published_at: '2026-11-16T14:30:00Z',
    views_count: 95,
    created_at: '2026-11-16T14:30:00Z',
  },
  {
    id: 'p3',
    title: 'Pengumuman Jadwal Penyaluran Bantuan Langsung Tunai (BLT-DD) Triwulan I',
    slug: 'pengumuman-penyaluran-blt-dd-triwulan-i',
    category_id: 'c3',
    category_name: 'Pengumuman',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    content: '<p>Diberitahukan kepada seluruh Keluarga Penerima Manfaat (KPM) Desa Khepong Jaya, bahwa penyaluran Bantuan Langsung Tunai Dana Desa (BLT-DD) Periode Triwulan I Tahun Anggaran 2026 akan dilaksanakan pada hari Senin depan di Aula Balai Desa pukul 08.30 WIB dengan membawa fotokopi KTP dan KK.</p>',
    gallery_urls: [],
    status: 'published',
    published_at: '2026-11-14T10:00:00Z',
    views_count: 360,
    created_at: '2026-11-14T10:00:00Z',
  },
];

export const fallbackAPBDes: APBDesRecord[] = [
  { id: 'a1', fiscal_year: 2026, category: 'pendapatan', subcategory: 'Dana Transfer', activity_name: 'Dana Desa (DD) APBN', budgeted_amount: 850000000, realized_amount: 425000000, notes: 'Tahap I telah dicairkan', created_at: new Date().toISOString() },
  { id: 'a2', fiscal_year: 2026, category: 'pendapatan', subcategory: 'Dana Transfer', activity_name: 'Alokasi Dana Desa (ADD) APBD Kab', budgeted_amount: 320000000, realized_amount: 160000000, notes: 'Sesuai pagu berjalan', created_at: new Date().toISOString() },
  { id: 'a3', fiscal_year: 2026, category: 'pendapatan', subcategory: 'Pendapatan Asli Desa', activity_name: 'Bagi Hasil Usaha BUMDes', budgeted_amount: 45000000, realized_amount: 30000000, notes: 'Dividen unit perdagangan', created_at: new Date().toISOString() },
  { id: 'a4', fiscal_year: 2026, category: 'belanja', subcategory: 'Bidang Pembangunan', activity_name: 'Pembangunan Irigasi Tersier Dusun II', budgeted_amount: 185000000, realized_amount: 185000000, notes: 'Selesai 100%', created_at: new Date().toISOString() },
  { id: 'a5', fiscal_year: 2026, category: 'belanja', subcategory: 'Bidang Pembangunan', activity_name: 'Pengerasan Jalan Usaha Tani RT 04', budgeted_amount: 120000000, realized_amount: 80000000, notes: 'Progres 70%', created_at: new Date().toISOString() },
  { id: 'a6', fiscal_year: 2026, category: 'belanja', subcategory: 'Bidang Penyelenggaraan', activity_name: 'Penghasilan Tetap & Tunjangan Aparatur', budgeted_amount: 280000000, realized_amount: 140000000, notes: 'Semester I berjalan', created_at: new Date().toISOString() },
  { id: 'a7', fiscal_year: 2026, category: 'belanja', subcategory: 'Bidang Pemberdayaan', activity_name: 'Pelatihan UMKM & Kelompok Tani', budgeted_amount: 45000000, realized_amount: 25000000, notes: 'Telah terlaksana sesi I', created_at: new Date().toISOString() },
  { id: 'a8', fiscal_year: 2026, category: 'pembiayaan', subcategory: 'Penerimaan Pembiayaan', activity_name: 'SiLPA Tahun Anggaran Sebelumnya', budgeted_amount: 65000000, realized_amount: 65000000, notes: 'Tercatat dalam kas desa', created_at: new Date().toISOString() },
];

export const fallbackUMKM: UMKMProduct[] = [
  {
    id: 'u1',
    name: 'Kopi Robusta Asli Khepong (Petik Merah)',
    category: 'Makanan & Minuman',
    description: 'Bubuk kopi murni 100% dari perkebunan lereng Khepong Jaya. Diproses secara natural dengan roasting medium-dark untuk aroma cokelat dan rasa tebal khas.',
    price: 35000,
    owner_name: 'Ibu Maryam',
    whatsapp_number: '6281234567890',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Keripik Singkong Renyah Bumbu Balado',
    category: 'Camilan Olahan',
    description: 'Keripik renyah dari singkong pilihan hasil tani warga dengan bumbu racikan rempah pedas manis alami tanpa pengawet buatan.',
    price: 15000,
    owner_name: 'Pak Dedi Kurnia',
    whatsapp_number: '6282198765432',
    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Anyaman Bambu & Keranjang Tradisional',
    category: 'Kerajinan Tangan',
    description: 'Kerajinan tangan anyaman bambu tahan lama untuk hiasan ruang tamu, tempat belanja ramah lingkungan, dan wadah serbaguna.',
    price: 45000,
    owner_name: 'Ibu Ratna',
    whatsapp_number: '6285211223344',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const fallbackGallery: GalleryAlbum[] = [
  {
    id: 'g1',
    title: 'Musyawarah Rencana Pembangunan Desa (Musrenbangdes)',
    description: 'Dokumentasi musyawarah tahunan penetapan rencana kerja pemerintah desa.',
    cover_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    items: [
      { id: 'gi1', album_id: 'g1', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', caption: 'Pembukaan Musrenbangdes di Balai Desa', order_index: 1, created_at: new Date().toISOString() },
      { id: 'gi2', album_id: 'g1', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', caption: 'Pemaparan rancangan kegiatan anggaran', order_index: 2, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'g2',
    title: 'Gotong Royong Kebersihan Lingkungan Desa',
    description: 'Kegiatan kerja bakti rutin warga membersihkan saluran air dan jalan protokol.',
    cover_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    items: [
      { id: 'gi3', album_id: 'g2', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80', caption: 'Warga bersama aparatur desa membersihkan area lapangan', order_index: 1, created_at: new Date().toISOString() },
    ],
  },
];

export const fallbackPages: PageRecord[] = [
  {
    id: 'pg1',
    title: 'Visi & Misi Desa',
    slug: 'visi-misi',
    seo_description: 'Visi dan Misi Pembangunan Desa Khepong Jaya',
    seo_keywords: 'visi, misi, khepong jaya',
    status: 'published',
    blocks: [
      {
        type: 'rich_text',
        content: '<h2>VISI DESA KHEPONG JAYA</h2><p><strong>"Terwujudnya Desa Khepong Jaya yang Maju, Transparan, Beriman, Mandiri, dan Sejahtera Berbasis Pertanian dan Kewirausahaan Desa."</strong></p><h2>MISI DESA KHEPONG JAYA</h2><ol><li>Meningkatkan tata kelola pemerintahan desa yang bersih, transparan, dan berorientasi pada pelayanan masyarakat secara digital.</li><li>Mendorong produktivitas sektor pertanian, perkebunan, dan peternakan dengan teknologi tepat guna.</li><li>Memperkuat ekonomi warga melalui pemberdayaan Badan Usaha Milik Desa (BUMDes) dan UMKM lokal.</li><li>Membangun dan memelihara infrastruktur dasar desa yang merata dan berkelanjutan.</li><li>Meningkatkan kualitas sumber daya manusia desa melalui pembinaan keagamaan, olahraga, dan kepemudaan.</li></ol>',
      },
      {
        type: 'split_content',
        title: 'Komitmen Pelayanan Prima',
        text: 'Pemerintah Desa Khepong Jaya senantiasa menempatkan kebutuhan warga sebagai prioritas utama. Seluruh proses perizinan, administrasi surat menyurat, dan alokasi dana bantuan diselenggarakan secara transparan tanpa pungutan liar.',
        image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
        image_position: 'right',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pg2',
    title: 'Sejarah Desa',
    slug: 'sejarah',
    seo_description: 'Sejarah Berdirinya Desa Khepong Jaya',
    seo_keywords: 'sejarah, asal usul, khepong jaya',
    status: 'published',
    blocks: [
      {
        type: 'rich_text',
        content: '<h2>Sejarah Singkat Desa Khepong Jaya</h2><p>Desa Khepong Jaya berawal dari permukiman agraris rintisan pada dekade 1970-an yang dipelopori oleh para perintis pembuka lahan perkebunan. Nama <em>Khepong</em> diambil dari pohon pelindung lokal yang melambangkan kerukunan dan tempat bernaung, sedangkan <em>Jaya</em> mencerminkan doa bersama agar seluruh warga selalu meraih kejayaan dan kemakmuran.</p><p>Seiring berjalannya waktu dan dimekarkannya wilayah, Desa Khepong Jaya resmi berdiri secara administratif sebagai desa mandiri dengan komoditas unggulan kopi, kelapa sawit, dan aneka hasil bumi unggulan.</p>',
      },
      {
        type: 'image_banner',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
        caption: 'Pemandangan bentang alam perbukitan Desa Khepong Jaya',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
