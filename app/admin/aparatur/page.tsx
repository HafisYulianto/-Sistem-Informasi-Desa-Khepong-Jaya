import { getVillageOfficials } from '@/lib/data/api';
import AparaturManager from '@/components/admin/AparaturManager';

export const metadata = {
  title: 'Kelola Perangkat Desa | Admin',
};

export default async function AdminAparaturPage() {
  const officials = await getVillageOfficials();
  return <AparaturManager initialOfficials={officials} />;
}
