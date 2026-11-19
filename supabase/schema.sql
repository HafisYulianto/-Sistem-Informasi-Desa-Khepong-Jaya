-- ========================================================
-- SISTEM INFORMASI DESA KHEPONG JAYA
-- MASTER DATABASE SCHEMA & SEED DATA (SUPABASE POSTGRESQL)
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on Supabase auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Operator Desa'),
        COALESCE(new.raw_user_meta_data->>'role', 'editor')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. GLOBAL SETTINGS & THEME (JSONB STORE)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOMEPAGE BUILDER (SECTIONS)
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type TEXT NOT NULL CHECK (section_type IN ('hero_slider', 'greeting_kades', 'statistics', 'custom_section', 'latest_news', 'apbdes_summary', 'featured_umkm', 'official_carousel')),
    title TEXT,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DYNAMIC PAGES BUILDER (CATCH-ALL /[SLUG])
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    seo_description TEXT,
    seo_keywords TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERANGKAT & STRUKTUR ORGANISASI
CREATE TABLE IF NOT EXISTS public.village_officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    nip TEXT,
    position TEXT NOT NULL,
    period TEXT DEFAULT '2021 - 2027',
    photo_url TEXT,
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. KATEGORI & BERITA/ARTIKEL/PENGUMUMAN
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    content TEXT NOT NULL,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRANSPARANSI ANGGARAN (APBDES)
CREATE TABLE IF NOT EXISTS public.apbdes_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiscal_year INT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pendapatan', 'belanja', 'pembiayaan')),
    subcategory TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    budgeted_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    realized_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POTENSI & PRODUK UMKM DESA
CREATE TABLE IF NOT EXISTS public.umkm_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    owner_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GALERI FOTO & VIDEO KEGIATAN
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    caption TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LAYANAN PENGADUAN & ASPIRASI WARGA
CREATE TABLE IF NOT EXISTS public.public_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_name TEXT NOT NULL,
    citizen_nik TEXT,
    citizen_phone TEXT,
    citizen_email TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'diproses', 'selesai')),
    official_response TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- STORAGE BUCKET CONFIGURATION (desa-media)
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('desa-media', 'desa-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Public Read
CREATE POLICY "Public media access" ON storage.objects
FOR SELECT USING (bucket_id = 'desa-media');

-- Storage Policy: Authenticated Upload/Edit/Delete
CREATE POLICY "Authenticated user media upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'desa-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated user media update" ON storage.objects
FOR UPDATE USING (bucket_id = 'desa-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated user media delete" ON storage.objects
FOR DELETE USING (bucket_id = 'desa-media' AND auth.role() = 'authenticated');

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apbdes_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_complaints ENABLE ROW LEVEL SECURITY;

-- Helper check function for admin/editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can read basic profile, user can read/update own
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Site Settings: Public SELECT, Admin FULL
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL USING (public.is_admin_or_editor());

-- Homepage Sections: Public SELECT active, Admin FULL
CREATE POLICY "Public read active homepage sections" ON public.homepage_sections FOR SELECT USING (is_active = true OR public.is_admin_or_editor());
CREATE POLICY "Admin manage homepage sections" ON public.homepage_sections FOR ALL USING (public.is_admin_or_editor());

-- Pages: Public SELECT published, Admin FULL
CREATE POLICY "Public read published pages" ON public.pages FOR SELECT USING (status = 'published' OR public.is_admin_or_editor());
CREATE POLICY "Admin manage pages" ON public.pages FOR ALL USING (public.is_admin_or_editor());

-- Village Officials: Public SELECT active, Admin FULL
CREATE POLICY "Public read active officials" ON public.village_officials FOR SELECT USING (is_active = true OR public.is_admin_or_editor());
CREATE POLICY "Admin manage officials" ON public.village_officials FOR ALL USING (public.is_admin_or_editor());

-- Categories: Public SELECT, Admin FULL
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (public.is_admin_or_editor());

-- Posts: Public SELECT published, Admin FULL
CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (status = 'published' OR public.is_admin_or_editor());
CREATE POLICY "Admin manage posts" ON public.posts FOR ALL USING (public.is_admin_or_editor());

-- APBDes: Public SELECT, Admin FULL
CREATE POLICY "Public read apbdes" ON public.apbdes_records FOR SELECT USING (true);
CREATE POLICY "Admin manage apbdes" ON public.apbdes_records FOR ALL USING (public.is_admin_or_editor());

-- UMKM Products: Public SELECT active, Admin FULL
CREATE POLICY "Public read active umkm" ON public.umkm_products FOR SELECT USING (is_active = true OR public.is_admin_or_editor());
CREATE POLICY "Admin manage umkm" ON public.umkm_products FOR ALL USING (public.is_admin_or_editor());

-- Gallery: Public SELECT, Admin FULL
CREATE POLICY "Public read gallery albums" ON public.gallery_albums FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery albums" ON public.gallery_albums FOR ALL USING (public.is_admin_or_editor());
CREATE POLICY "Public read gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery items" ON public.gallery_items FOR ALL USING (public.is_admin_or_editor());

-- Public Complaints: Public INSERT, Public SELECT if is_public, Admin FULL
CREATE POLICY "Public insert complaint" ON public.public_complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read public complaints" ON public.public_complaints FOR SELECT USING (is_public = true OR public.is_admin_or_editor());
CREATE POLICY "Admin manage complaints" ON public.public_complaints FOR ALL USING (public.is_admin_or_editor());


-- ========================================================
-- SEED DATA (DESA KHEPONG JAYA INITIAL CONTENT)
-- ========================================================

-- A. SITE SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES
(
    'identity',
    '{
        "village_name": "Desa Khepong Jaya",
        "subdistrict": "Padang Cermin",
        "district": "Pesawaran",
        "province": "Lampung",
        "tagline": "Maju, Mandiri, Berbudaya, dan Sejahtera",
        "logo_url": "/logo.png",
        "favicon_url": "/logo.png",
        "meta_title": "Portal Resmi Desa Khepong Jaya - Transparan & Melayani",
        "meta_description": "Website resmi Desa Khepong Jaya, menyajikan informasi pemerintahan, transparansi APBDes, potensi UMKM, layanan warga, dan berita terkini."
    }'::jsonb
),
(
    'theme',
    '{
        "primary_color": "#15803d",
        "primary_hover": "#166534",
        "primary_light": "#dcfce7",
        "primary_foreground": "#ffffff",
        "accent_color": "#f59e0b",
        "accent_hover": "#d97706",
        "accent_light": "#fef3c7",
        "accent_foreground": "#ffffff",
        "font_family": "Inter"
    }'::jsonb
),
(
    'navigation',
    '{
        "menus": [
            { "id": "m1", "title": "Beranda", "href": "/", "order": 1 },
            { 
                "id": "m2", 
                "title": "Profil Desa", 
                "href": "#", 
                "order": 2,
                "children": [
                    { "id": "m2_1", "title": "Visi & Misi", "href": "/visi-misi" },
                    { "id": "m2_2", "title": "Sejarah Desa", "href": "/sejarah" },
                    { "id": "m2_3", "title": "Pemerintah Desa", "href": "/pemerintahan" }
                ]
            },
            { "id": "m3", "title": "Berita & Agenda", "href": "/berita", "order": 3 },
            { "id": "m4", "title": "Transparansi APBDes", "href": "/apbdes", "order": 4 },
            { "id": "m5", "title": "Potensi & UMKM", "href": "/umkm", "order": 5 },
            { "id": "m6", "title": "Galeri", "href": "/galeri", "order": 6 },
            { "id": "m7", "title": "Pengaduan Warga", "href": "/pengaduan", "order": 7 }
        ]
    }'::jsonb
),
(
    'footer',
    '{
        "about_text": "Website resmi Pemerintahan Desa Khepong Jaya yang dikembangkan sebagai wujud transparansi publik dan pelayanan prima kepada seluruh warga masyarakat.",
        "office_address": "Jl. Raya Lintas Desa No. 12, Khepong Jaya, Kec. Padang Jaya, Kab. Bengkulu Utara",
        "whatsapp": "081234567890",
        "email": "halo@khepongjaya.desa.id",
        "maps_embed": "https://maps.google.com/maps?q=Padang+Jaya+Bengkulu+Utara&t=&z=13&ie=UTF8&iwloc=&output=embed",
        "social_media": {
            "facebook": "https://facebook.com/desakhepongjaya",
            "instagram": "https://instagram.com/desakhepongjaya",
            "youtube": "https://youtube.com/@desakhepongjaya"
        }
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- B. HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (section_type, title, subtitle, content, order_index, is_active)
VALUES
(
    'hero_slider',
    'Selamat Datang di Portal Desa Khepong Jaya',
    'Mewujudkan Desa yang Maju, Transparan, Berdaya Saing, dan Berkelanjutan',
    '{
        "slides": [
            {
                "title": "Khepong Jaya Menuju Desa Digital",
                "subtitle": "Akses informasi pemerintahan, anggaran desa, dan layanan publik secara mudah dari mana saja.",
                "bg_image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80",
                "cta_text": "Layanan Pengaduan",
                "cta_link": "/pengaduan"
            },
            {
                "title": "Transparansi Dana Desa & APBDes",
                "subtitle": "Keterbukaan informasi realisasi anggaran desa untuk kemakmuran seluruh warga.",
                "bg_image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80",
                "cta_text": "Lihat Anggaran",
                "cta_link": "/apbdes"
            }
        ]
    }'::jsonb,
    1,
    true
),
(
    'greeting_kades',
    'Sambutan Kepala Desa',
    'Pemerintah Desa Khepong Jaya',
    '{
        "kades_name": "H. Bambang Irawan, S.Pd.",
        "kades_position": "Kepala Desa Khepong Jaya",
        "kades_photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        "greeting_text": "Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal web resmi Desa Khepong Jaya. Website ini kami bangun sebagai jembatan komunikasi dan keterbukaan informasi publik antara pemerintah desa dengan seluruh elemen masyarakat desa, perantau, maupun khalayak umum. Mari kita bersama-sama mewujudkan Desa Khepong Jaya yang mandiri, berkeadilan, dan sejahtera."
    }'::jsonb,
    2,
    true
),
(
    'statistics',
    'Infografis & Statistik Desa',
    'Data Terkini Penduduk & Wilayah Khepong Jaya',
    '{
        "stats": [
            { "label": "Jumlah Penduduk", "value": "2.845", "unit": "Jiwa", "icon": "Users" },
            { "label": "Kepala Keluarga", "value": "782", "unit": "KK", "icon": "Home" },
            { "label": "Luas Wilayah", "value": "1.420", "unit": "Hektar", "icon": "MapPin" },
            { "label": "Kelompok UMKM", "value": "45", "unit": "Usaha Aktif", "icon": "ShoppingBag" }
        ]
    }'::jsonb,
    3,
    true
);

-- C. SAMPLE DYNAMIC PAGES
INSERT INTO public.pages (title, slug, seo_description, status, blocks)
VALUES
(
    'Visi & Misi Desa',
    'visi-misi',
    'Visi dan Misi Pembangunan Desa Khepong Jaya 2021-2027',
    'published',
    '[
        {
            "type": "rich_text",
            "content": "<h2>VISI DESA KHEPONG JAYA</h2><p><strong>\"Terwujudnya Desa Khepong Jaya yang Maju, Transparan, Beriman, Mandiri, dan Sejahtera Berbasis Pertanian dan Kewirausahaan Desa.\"</strong></p><h2>MISI DESA KHEPONG JAYA</h2><ol><li>Meningkatkan tata kelola pemerintahan desa yang bersih, transparan, dan berorientasi pada pelayanan masyarakat secara digital.</li><li>Mendorong produktivitas sektor pertanian, perkebunan, dan peternakan dengan teknologi tepat guna.</li><li>Memperkuat ekonomi warga melalui pemberdayaan Badan Usaha Milik Desa (BUMDes) dan UMKM lokal.</li><li>Membangun dan memelihara infrastruktur dasar desa yang merata dan berkelanjutan.</li><li>Meningkatkan kualitas sumber daya manusia desa melalui pembinaan keagamaan, olahraga, dan kepemudaan.</li></ol>"
        },
        {
            "type": "split_content",
            "title": "Komitmen Pelayanan Prima",
            "text": "Pemerintah Desa Khepong Jaya senantiasa menempatkan kebutuhan warga sebagai prioritas utama. Seluruh proses perizinan, administrasi surat menyurat, dan alokasi dana bantuan diselenggarakan secara transparan tanpa pungutan liar.",
            "image_url": "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80",
            "image_position": "right"
        }
    ]'::jsonb
),
(
    'Sejarah Desa',
    'sejarah',
    'Sejarah Berdirinya Desa Khepong Jaya',
    'published',
    '[
        {
            "type": "rich_text",
            "content": "<h2>Sejarah Singkat Desa Khepong Jaya</h2><p>Desa Khepong Jaya berawal dari permukiman agraris rintisan pada dekade 1970-an yang dipelopori oleh para perintis pembuka lahan perkebunan. Nama <em>Khepong</em> diambil dari pohon pelindung lokal yang melambangkan kerukunan dan tempat bernaung, sedangkan <em>Jaya</em> mencerminkan doa bersama agar seluruh warga selalu meraih kejayaan dan kemakmuran.</p><p>Seiring berjalannya waktu dan dimekarkannya wilayah, Desa Khepong Jaya resmi berdiri secara administratif sebagai desa mandiri dengan komoditas unggulan kopi, kelapa sawit, dan aneka hasil bumi unggulan.</p>"
        },
        {
            "type": "image_banner",
            "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
            "caption": "Pemandangan bentang alam perbukitan Desa Khepong Jaya"
        }
    ]'::jsonb
);

-- D. PERANGKAT DESA
INSERT INTO public.village_officials (name, nip, position, period, photo_url, order_index, is_active)
VALUES
('H. Bambang Irawan, S.Pd.', '19740512 200212 1 002', 'Kepala Desa', '2021 - 2027', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', 1, true),
('Ahmad Fauzi, S.Kom.', '19880315 201101 1 004', 'Sekretaris Desa', '2021 - 2027', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', 2, true),
('Siti Rahmawati, S.E.', '19920720 201503 2 001', 'Kaur Keuangan', '2021 - 2027', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 3, true),
('Rudi Hermawan', '19851110 201001 1 003', 'Kaur Perencanaan', '2021 - 2027', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 4, true),
('Dewi Lestari', '19950402 201902 2 003', 'Kasi Pelayanan & Kesejahteraan', '2021 - 2027', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 5, true);

-- E. KATEGORI & BERITA
INSERT INTO public.categories (name, slug)
VALUES
('Pemerintahan', 'pemerintahan'),
('Pembangunan', 'pembangunan'),
('Kegiatan Warga', 'kegiatan-warga'),
('Pengumuman', 'pengumuman');

INSERT INTO public.posts (title, slug, category_id, thumbnail_url, content, status, published_at, views_count)
VALUES
(
    'Pemerintah Desa Khepong Jaya Resmikan Saluran Irigasi Tersier Dusun II',
    'resmikan-saluran-irigasi-tersier-dusun-ii',
    (SELECT id FROM public.categories WHERE slug = 'pembangunan' LIMIT 1),
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    '<p>Pemerintah Desa Khepong Jaya hari ini meresmikan pembangunan saluran irigasi tersier sepanjang 650 meter di Dusun II. Pembangunan ini dibiayai menggunakan alokasi Dana Desa (DD) Tahun Anggaran 2026 guna mendukung ketahanan pangan warga dan memperlancar pasokan air ke areal persawahan seluas 40 hektar.</p><p>Kepala Desa Khepong Jaya menyampaikan bahwa keberadaan irigasi ini diharapkan mampu meningkatkan frekuensi panen petani dari dua kali menjadi tiga kali dalam setahun.</p>',
    'published',
    NOW(),
    124
),
(
    'Pelatihan Digitalisasi Produk UMKM Olahan Kopi Khepong Jaya',
    'pelatihan-digitalisasi-produk-umkm-kopi',
    (SELECT id FROM public.categories WHERE slug = 'kegiatan-warga' LIMIT 1),
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    '<p>Sebanyak 35 pelaku UMKM dan pemuda desa mengikuti lokakarya digitalisasi pemasaran produk olahan kopi robusta lokal. Pelatihan mencakup fotografi produk dengan ponsel cerdas, strategi penjualan di media sosial, serta pemanfaatan katalog website desa untuk pemesanan via WhatsApp.</p>',
    'published',
    NOW() - INTERVAL '2 days',
    89
),
(
    'Pengumuman Jadwal Penyaluran Bantuan Langsung Tunai (BLT-DD) Triwulan I',
    'pengumuman-penyaluran-blt-dd-triwulan-i',
    (SELECT id FROM public.categories WHERE slug = 'pengumuman' LIMIT 1),
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    '<p>Diberitahukan kepada seluruh Keluarga Penerima Manfaat (KPM) Desa Khepong Jaya, bahwa penyaluran Bantuan Langsung Tunai Dana Desa (BLT-DD) Periode Triwulan I Tahun Anggaran 2026 akan dilaksanakan pada hari Senin depan di Aula Balai Desa pukul 08.30 WIB dengan membawa fotokopi KTP dan KK.</p>',
    'published',
    NOW() - INTERVAL '5 days',
    342
);

-- F. ANGGARAN APBDES 2026
INSERT INTO public.apbdes_records (fiscal_year, category, subcategory, activity_name, budgeted_amount, realized_amount, notes)
VALUES
(2026, 'pendapatan', 'Dana Transfer', 'Dana Desa (DD) APBN', 850000000, 425000000, 'Tahap I telah dicairkan'),
(2026, 'pendapatan', 'Dana Transfer', 'Alokasi Dana Desa (ADD) APBD Kab', 320000000, 160000000, 'Sesuai pagu tahun berjalan'),
(2026, 'pendapatan', 'Pendapatan Asli Desa', 'Bagi Hasil Usaha BUMDes', 45000000, 30000000, 'Dividen unit perdagangan & sewa'),
(2026, 'belanja', 'Bidang Pembangunan', 'Pembangunan Irigasi Tersier Dusun II', 185000000, 185000000, 'Selesai 100%'),
(2026, 'belanja', 'Bidang Pembangunan', 'Pengerasan Jalan Usaha Tani RT 04', 120000000, 80000000, 'Progres 70%'),
(2026, 'belanja', 'Bidang Penyelenggaraan', 'Penghasilan Tetap & Tunjangan Aparatur', 280000000, 140000000, 'Semester I berjalan'),
(2026, 'belanja', 'Bidang Pemberdayaan', 'Pelatihan UMKM & Kelompok Tani', 45000000, 25000000, 'Telah terlaksana sesi I'),
(2026, 'pembiayaan', 'Penerimaan Pembiayaan', 'SiLPA Tahun Anggaran Sebelumnya', 65000000, 65000000, 'Tercatat dalam kas desa');

-- G. PRODUK UMKM DESA
INSERT INTO public.umkm_products (name, category, description, price, owner_name, whatsapp_number, images, is_active)
VALUES
(
    'Kopi Robusta Asli Khepong (Petik Merah)',
    'Makanan & Minuman',
    'Bubuk kopi murni 100% dari perkebunan lereng Khepong Jaya. Diproses secara natural dengan roasting medium-dark untuk aroma cokelat dan rasa tebal khas.',
    35000,
    'Ibu Maryam',
    '6281234567890',
    '["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"]'::jsonb,
    true
),
(
    'Keripik Singkong Renyah Bumbu Balado',
    'Camilan Olahan',
    'Keripik renyah dari singkong pilihan hasil tani warga dengan bumbu racikan rempah pedas manis alami tanpa pengawet buatan.',
    15000,
    'Pak Dedi Kurnia',
    '6282198765432',
    '["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80"]'::jsonb,
    true
),
(
    'Anyaman Bambu & Keranjang Tradisional',
    'Kerajinan Tangan',
    'Kerajinan tangan anyaman bambu tahan lama untuk hiasan ruang tamu, tempat belanja ramah lingkungan, dan wadah serbaguna.',
    45000,
    'Ibu Ratna',
    '6285211223344',
    '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"]'::jsonb,
    true
);

-- H. GALERI KEGIATAN
INSERT INTO public.gallery_albums (id, title, description, cover_url)
VALUES
('b7d94f72-d5cb-43ee-8ec7-a0e4420e6c51', 'Musyawarah Rencana Pembangunan Desa (Musrenbangdes)', 'Dokumentasi musyawarah tahunan penetapan rencana kerja pemerintah desa.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'),
('e3fa1e91-c49b-466d-a78b-3e58dc18063a', 'Gotong Royong Kebersihan Lingkungan Desa', 'Kegiatan kerja bakti rutin warga membersihkan saluran air dan jalan protokol.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80');

INSERT INTO public.gallery_items (album_id, media_type, media_url, caption, order_index)
VALUES
('b7d94f72-d5cb-43ee-8ec7-a0e4420e6c51', 'image', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', 'Suasana pembukaan Musrenbangdes di Balai Desa', 1),
('b7d94f72-d5cb-43ee-8ec7-a0e4420e6c51', 'image', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', 'Pemaparan rancangan kegiatan anggaran oleh Sekdes', 2),
('e3fa1e91-c49b-466d-a78b-3e58dc18063a', 'image', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80', 'Warga bersama aparatur desa membersihkan area lapangan', 1);

-- I. CONTOH PENGADUAN WARGA
INSERT INTO public.public_complaints (citizen_name, citizen_nik, citizen_phone, title, description, status, official_response, is_public)
VALUES
(
    'Supratman',
    '1703051208850001',
    '081399887766',
    'Lampu Penerangan Jalan di RT 03 Padam',
    'Mohon perbaikan lampu jalan umum di pertigaan RT 03 Dusun I sudah seminggu padam sehingga malam hari sangat gelap dan membahayakan pengendara motor.',
    'selesai',
    'Terima kasih atas laporannya Bapak Supratman. Tim operasional desa bersama PLN telah melakukan penggantian bohlam dan kabel panel pada hari Rabu, 18 November 2026. Lampu saat ini sudah berfungsi normal kembali.',
    true
),
(
    'Indra Wijaya',
    '1703052104920002',
    '082233445566',
    'Permohonan Pembersihan Sampah Saluran Air Dusun II',
    'Terdapat penumpukan ranting pohon dan sampah plastik di gorong-gorong jembatan kecil Dusun II yang menyebabkan air meluap saat hujan deras.',
    'diproses',
    'Laporan telah diterima. Petugas kebersihan dan karang taruna telah dijadwalkan turun melakukan pengangkatan sampah pada agenda Jumat Bersih pekan ini.',
    true
);
