import { createClient } from '@/lib/supabase/server';
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
import {
  fallbackIdentity,
  fallbackTheme,
  fallbackNavigation,
  fallbackFooter,
  fallbackSections,
  fallbackOfficials,
  fallbackPosts,
  fallbackAPBDes,
  fallbackUMKM,
  fallbackGallery,
  fallbackPages,
} from '@/lib/data/mock-fallback';

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) {
      return fallback;
    }
    return data.value as T;
  } catch {
    return fallback;
  }
}

export async function getSiteIdentity(): Promise<SiteIdentity> {
  return getSiteSetting<SiteIdentity>('identity', fallbackIdentity);
}

export async function getSiteTheme(): Promise<SiteTheme> {
  return getSiteSetting<SiteTheme>('theme', fallbackTheme);
}

export async function getSiteNavigation(): Promise<SiteNavigation> {
  return getSiteSetting<SiteNavigation>('navigation', fallbackNavigation);
}

export async function getSiteFooter(): Promise<SiteFooter> {
  return getSiteSetting<SiteFooter>('footer', fallbackFooter);
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackSections;
    }
    return data as HomepageSection[];
  } catch {
    return fallbackSections;
  }
}

export async function getVillageOfficials(): Promise<VillageOfficial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('village_officials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackOfficials;
    }
    return data as VillageOfficial[];
  } catch {
    return fallbackOfficials;
  }
}

export async function getPosts(limit = 10, categorySlug?: string): Promise<Post[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('posts')
      .select('*, categories(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return fallbackPosts;
    }

    return data.map((item: any) => ({
      ...item,
      category_name: item.categories?.name || 'Umum',
    })) as Post[];
  } catch {
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      return fallbackPosts.find((p) => p.slug === slug) || null;
    }
    return {
      ...data,
      category_name: data.categories?.name || 'Umum',
    } as Post;
  } catch {
    return fallbackPosts.find((p) => p.slug === slug) || null;
  }
}

export async function getAPBDesRecords(year = 2026): Promise<APBDesRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('apbdes_records')
      .select('*')
      .eq('fiscal_year', year)
      .order('category', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackAPBDes;
    }
    return data as APBDesRecord[];
  } catch {
    return fallbackAPBDes;
  }
}

export async function getUMKMProducts(): Promise<UMKMProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('umkm_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackUMKM;
    }
    return data as UMKMProduct[];
  } catch {
    return fallbackUMKM;
  }
}

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('*, gallery_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackGallery;
    }
    return data as GalleryAlbum[];
  } catch {
    return fallbackGallery;
  }
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      return fallbackPages.find((p) => p.slug === slug) || null;
    }
    return data as PageRecord;
  } catch {
    return fallbackPages.find((p) => p.slug === slug) || null;
  }
}
