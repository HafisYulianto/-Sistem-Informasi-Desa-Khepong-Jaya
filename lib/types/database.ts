export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface SiteIdentity {
  village_name: string;
  subdistrict: string;
  district: string;
  province: string;
  tagline: string;
  logo_url: string;
  favicon_url?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface SiteTheme {
  primary_color: string;
  primary_hover: string;
  primary_light: string;
  primary_foreground: string;
  accent_color: string;
  accent_hover: string;
  accent_light: string;
  accent_foreground: string;
  font_family: string;
}

export interface MenuItem {
  id: string;
  title: string;
  href: string;
  order: number;
  children?: MenuItem[];
}

export interface SiteNavigation {
  menus: MenuItem[];
}

export interface SiteFooter {
  about_text: string;
  office_address: string;
  whatsapp: string;
  email: string;
  maps_embed: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface PageBlock {
  type: 'rich_text' | 'image_banner' | 'split_content' | 'document_download' | 'embed';
  content?: string;
  title?: string;
  text?: string;
  image_url?: string;
  image_position?: 'left' | 'right';
  caption?: string;
  document_name?: string;
  document_url?: string;
  file_size?: string;
  embed_type?: 'youtube' | 'gmaps';
  embed_url?: string;
}

export interface PageRecord {
  id: string;
  title: string;
  slug: string;
  seo_description: string | null;
  seo_keywords: string | null;
  status: 'draft' | 'published';
  blocks: PageBlock[];
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_type: 'hero_slider' | 'greeting_kades' | 'statistics' | 'custom_section' | 'latest_news' | 'apbdes_summary' | 'featured_umkm' | 'official_carousel';
  title: string | null;
  subtitle: string | null;
  content: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VillageOfficial {
  id: string;
  name: string;
  nip: string | null;
  position: string;
  period: string | null;
  photo_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category_name?: string;
  thumbnail_url: string | null;
  content: string;
  gallery_urls: string[];
  status: 'draft' | 'published';
  published_at: string;
  views_count: number;
  created_at: string;
}

export interface APBDesRecord {
  id: string;
  fiscal_year: number;
  category: 'pendapatan' | 'belanja' | 'pembiayaan';
  subcategory: string;
  activity_name: string;
  budgeted_amount: number;
  realized_amount: number;
  notes: string | null;
  created_at: string;
}

export interface UMKMProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  owner_name: string;
  whatsapp_number: string;
  images: string[];
  is_active: boolean;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  items?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  album_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  caption: string | null;
  order_index: number;
  created_at: string;
}

export interface PublicComplaint {
  id: string;
  citizen_name: string;
  citizen_nik: string | null;
  citizen_phone: string | null;
  citizen_email: string | null;
  title: string;
  description: string;
  photo_proof_url: string | null;
  status: 'menunggu' | 'diproses' | 'selesai';
  official_response: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'super_admin' | 'editor';
  avatar_url?: string;
}
