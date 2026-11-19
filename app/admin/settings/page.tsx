import { getSiteIdentity, getSiteTheme, getSiteNavigation, getSiteFooter } from '@/lib/data/api';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = {
  title: 'Pengaturan Global & Tema | Admin',
};

export default async function AdminSettingsPage() {
  const [identity, theme, navigation, footer] = await Promise.all([
    getSiteIdentity(),
    getSiteTheme(),
    getSiteNavigation(),
    getSiteFooter(),
  ]);

  return (
    <SettingsForm
      initialIdentity={identity}
      initialTheme={theme}
      initialNavigation={navigation}
      initialFooter={footer}
    />
  );
}
