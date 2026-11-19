import { getAPBDesRecords } from '@/lib/data/api';
import APBDesManager from '@/components/admin/APBDesManager';

export const metadata = {
  title: 'Kelola APBDes | Admin',
};

export default async function AdminAPBDesPage() {
  const records = await getAPBDesRecords(2026);
  return <APBDesManager initialRecords={records} />;
}
