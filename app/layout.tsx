import type { Metadata } from 'next';
import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';
import { FavoritesProvider } from '@/components/favorites-provider';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: 'PawCamp V4',
  description: 'Pet-friendly campsite finder MVP with stronger dog-vs-cat matching, Mapbox, and geolocation',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          <SiteShell>{children}</SiteShell>
        </FavoritesProvider>
      </body>
    </html>
  );
}
