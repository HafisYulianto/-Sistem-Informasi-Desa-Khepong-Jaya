'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveSiteSettings(key: string, value: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function savePage(pageData: {
  id?: string;
  title: string;
  slug: string;
  seo_description?: string;
  seo_keywords?: string;
  status: 'draft' | 'published';
  blocks: any[];
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('pages')
      .upsert({
        ...pageData,
        updated_at: new Date().toISOString(),
      });

    if (error) return { success: false, error: error.message };

    revalidatePath(`/${pageData.slug}`);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePage(id: string, slug: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('pages').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/${slug}`);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitComplaint(formData: {
  citizen_name: string;
  citizen_nik?: string;
  citizen_phone?: string;
  citizen_email?: string;
  title: string;
  description: string;
  photo_proof_url?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('public_complaints').insert({
      ...formData,
      status: 'menunggu',
      is_public: true,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/pengaduan');
    revalidatePath('/admin/pengaduan');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateComplaintStatus(
  id: string,
  status: 'menunggu' | 'diproses' | 'selesai',
  official_response?: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('public_complaints')
      .update({
        status,
        official_response,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/pengaduan');
    revalidatePath('/admin/pengaduan');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function savePost(post: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('posts').upsert({
      ...post,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/berita');
    if (post.slug) revalidatePath(`/berita/${post.slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePost(id: string, slug?: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/berita');
    if (slug) revalidatePath(`/berita/${slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveUMKM(umkm: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('umkm_products').upsert({
      ...umkm,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/umkm');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteUMKM(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('umkm_products').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/umkm');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveOfficial(official: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('village_officials').upsert({
      ...official,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/pemerintahan');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteOfficial(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('village_officials').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/pemerintahan');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveAPBDes(record: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('apbdes_records').upsert({
      ...record,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/apbdes');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAPBDes(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('apbdes_records').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/apbdes');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveHomepageSection(section: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('homepage_sections').upsert({
      ...section,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
