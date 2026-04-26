import type { Metadata, Viewport } from 'next';
import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';
import { FavoritesProvider } from '@/components/favorites-provider';
import { PwaRegistration } from '@/components/pwa-registration';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'PawCamp',
  description: 'Pet-friendly campsite finder MVP with Mapbox, geolocation, and iPhone-ready install support.',
  applicationName: 'PawCamp',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PawCamp',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-512.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.svg' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#2c6c56',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          <PwaRegistration />
          <SiteShell>{children}</SiteShell>
        </FavoritesProvider>
      </body>
    </html>
  );
}
