'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, Heart, MapPin, PawPrint, Sparkles, Star } from 'lucide-react';
import { Campsite } from '@/lib/types';
import { useFavorites } from '@/components/favorites-provider';
import { Pill } from '@/components/ui';

function getBestForText(campsite: Campsite) {
  if (campsite.petPolicy.catFriendly && campsite.petPolicy.dogFriendly) return 'Best for dogs + cats';
  if (campsite.petPolicy.catFriendly) return 'Best for cat campers';
  if (campsite.petPolicy.dogFriendly) return 'Best for dog campers';
  return 'Check restrictions';
}

function getRiskTone(campsite: Campsite) {
  const notes = campsite.safetyNotes.join(' ').toLowerCase();
  if (notes.includes('cliff') || notes.includes('coyote') || notes.includes('heat')) return 'Elevated outdoor risk';
  if (notes.includes('mosquito') || notes.includes('slick') || notes.includes('wind')) return 'Moderate watch-outs';
  return 'Low-friction stay';
}

export function CampsiteCard({ campsite, selected = false }: { campsite: Campsite; selected?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(campsite.id);

  return (
    <Link
      href={`/campsite/${campsite.slug}`}
      className={`group block rounded-[30px] border bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? 'border-primary ring-2 ring-primary/16' : 'border-border'
      }`}
    >
      <div className="relative h-52 overflow-hidden rounded-t-[30px]">
        <Image src={campsite.heroImage} alt={campsite.name} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-surface/92 px-3 py-1.5 text-xs font-medium text-foreground">{campsite.priceType}</span>
            <span className="rounded-full bg-surface/92 px-3 py-1.5 text-xs font-medium text-foreground">{campsite.distanceKm} km</span>
            {selected ? <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white">Focused</span> : null}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(campsite.id);
            }}
            className="rounded-full bg-surface/92 p-2.5 text-foreground shadow-soft"
            aria-label="Toggle favorite"
          >
            <Heart size={18} className={favorite ? 'fill-primary text-primary' : ''} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="mb-2 flex items-center gap-2 text-sm text-white/82">
            <MapPin size={14} />
            <span>{campsite.location}</span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-[26px] leading-tight font-semibold">{campsite.name}</h3>
              <p className="mt-1 max-w-[80%] text-sm text-white/82">{campsite.summary}</p>
            </div>
            <div className="rounded-full bg-black/25 px-3 py-2 text-sm font-medium backdrop-blur">Rating {campsite.rating}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Pill active={campsite.petPolicy.dogFriendly} tone="success">Dog {campsite.petPolicy.dogFriendly ? 'yes' : 'no'}</Pill>
          <Pill active={campsite.petPolicy.catFriendly} tone="success">Cat {campsite.petPolicy.catFriendly ? 'yes' : 'no'}</Pill>
          {campsite.petPolicy.leashRequired ? <Pill>Leash required</Pill> : <Pill tone="warning">Off-leash caution</Pill>}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-surface-alt p-3">
            <div className="flex items-center gap-2 text-muted"><PawPrint size={15} /> Quick fit</div>
            <div className="mt-1 font-semibold text-foreground">{getBestForText(campsite)}</div>
          </div>
          <div className="rounded-2xl bg-surface-alt p-3">
            <div className="flex items-center gap-2 text-muted"><AlertTriangle size={15} /> Watch-out</div>
            <div className="mt-1 font-semibold text-foreground">{getRiskTone(campsite)}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {campsite.bestFor.slice(0, 2).map((item) => <Pill key={item}>{item}</Pill>)}
          {campsite.atmosphere.beginnerFriendly ? <Pill tone="success"><Sparkles size={12} className="mr-1" /> Beginner friendly</Pill> : null}
          {!campsite.petPolicy.catFriendly && campsite.petPolicy.dogFriendly ? <Pill tone="warning">Dog-first pick</Pill> : null}
          {campsite.petPolicy.catFriendly ? <Pill tone="success">Cat-ready setup</Pill> : null}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
            <span>{campsite.rating} - {campsite.reviews} reviews</span>
          </div>
          <span className="font-medium text-primary">View details</span>
        </div>
      </div>
    </Link>
  );
}
