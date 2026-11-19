import { createClient } from '@/lib/supabase/server';
import PageBuilderManager from '@/components/admin/PageBuilderManager';
import { fallbackPages } from '@/lib/data/mock-fallback';
import { PageRecord } from '@/lib/types/database';

export const metadata = {
  title: 'Page Builder Dinamis | Admin',
};

export default async function AdminPagesPage() {
  let pages: PageRecord[] = fallbackPages;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      pages = data;
    }
  } catch {
    // Fallback
  }

  return <PageBuilderManager initialPages={pages} />;
}
