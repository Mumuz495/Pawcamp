'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { CampsiteCard } from '@/components/campsite-card';
import { Card, SectionHeader } from '@/components/ui';
import { campsites } from '@/data/campsites';
import { useFavorites } from '@/components/favorites-provider';

export function FavoritesContent() {
  const { favorites } = useFavorites();
  const items = campsites.filter((item) => favorites.includes(item.id));
  const catFriendly = items.filter((item) => item.petPolicy.catFriendly).length;

  return (
    <div className="space-y-5 px-4 pb-6 pt-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Favorites</p>
        <h1 className="mt-2 text-[38px] leading-[1.03] font-semibold">Your shortlist</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Keep strong matches for your next dog trip, cat setup, or shared outdoor weekend.</p>
      </div>

      <Card className="bg-surface-muted">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted">Saved campsites</div>
            <div className="mt-1 text-3xl font-semibold">{items.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Cat-friendly saved</div>
            <div className="mt-1 text-3xl font-semibold">{catFriendly}</div>
          </div>
        </div>
      </Card>

      {items.length === 0 ? (
        <Card className="py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary"><Heart size={22} /></div>
          <h2 className="mt-4 text-lg font-semibold">No favorites yet.</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Tap the heart icon on any campsite card to build your shortlist.</p>
          <Link href="/discover" className="mt-4 inline-flex rounded-full bg-primary px-4 py-3 text-sm font-medium text-white">Explore campsites</Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <SectionHeader eyebrow="Saved" title="Return-ready campsites" />
          {items.map((item) => <CampsiteCard key={item.id} campsite={item} />)}
        </div>
      )}
    </div>
  );
}
