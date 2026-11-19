import { getPosts } from '@/lib/data/api';
import BeritaManager from '@/components/admin/BeritaManager';

export const metadata = {
  title: 'Manajemen Berita | Admin',
};

export default async function AdminBeritaPage() {
  const posts = await getPosts(100);
  return <BeritaManager initialPosts={posts} />;
}
