import type { Metadata } from 'next';
import './globals.css';
import { getSiteIdentity, getSiteTheme, getSiteNavigation, getSiteFooter } from '@/lib/data/api';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  return {
    title: {
      default: `${identity.village_name} - ${identity.tagline}`,
      template: `%s | ${identity.village_name}`,
    },
    description: identity.meta_description || 'Portal Informasi Resmi Desa Khepong Jaya',
    icons: {
      icon: identity.favicon_url || identity.logo_url,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identity, theme, navigation, footer] = await Promise.all([
    getSiteIdentity(),
    getSiteTheme(),
    getSiteNavigation(),
    getSiteFooter(),
  ]);

  // Dynamic Theme CSS variables injection
  const dynamicStyles = `
    :root {
      --primary: ${theme.primary_color || '#15803d'};
      --primary-hover: ${theme.primary_hover || '#166534'};
      --primary-light: ${theme.primary_light || '#dcfce7'};
      --primary-foreground: ${theme.primary_foreground || '#ffffff'};
      --accent: ${theme.accent_color || '#f59e0b'};
      --accent-hover: ${theme.accent_hover || '#d97706'};
      --accent-light: ${theme.accent_light || '#fef3c7'};
      --accent-foreground: ${theme.accent_foreground || '#ffffff'};
      --font-sans: '${theme.font_family || 'Inter'}', sans-serif;
    }
  `;

  return (
    <html lang="id">
      <head>
        <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-primary-light selection:text-primary">
        <Navbar identity={identity} navigation={navigation} />
        <main className="flex-1">{children}</main>
        <Footer identity={identity} footer={footer} />
      </body>
    </html>
  );
}
