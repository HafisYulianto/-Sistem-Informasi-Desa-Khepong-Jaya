import { getUMKMProducts } from '@/lib/data/api';
import UMKMManager from '@/components/admin/UMKMManager';

export const metadata = {
  title: 'Kelola UMKM Desa | Admin',
};

export default async function AdminUMKMPage() {
  const products = await getUMKMProducts();
  return <UMKMManager initialProducts={products} />;
}
