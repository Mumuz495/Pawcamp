'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Heart, MapPin, Shield, Star } from 'lucide-react';
import { Campsite } from '@/lib/types';
import { useFavorites } from '@/components/favorites-provider';
import { Card, Pill, SectionHeader } from '@/components/ui';

function riskLevel(notes: string[]) {
  const text = notes.join(' ').toLowerCase();
  if (text.includes('cliff') || text.includes('coyote') || text.includes('heat')) return 'Medium';
  if (text.includes('mosquito') || text.includes('wind') || text.includes('slick')) return 'Watchful';
  return 'Low';
}

export function DetailContent({ campsite }: { campsite: Campsite }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(campsite.id);

  return (
    <div className="pb-6">
      <div className="relative h-[360px] overflow-hidden rounded-b-[34px]">
        <Image src={campsite.heroImage} alt={campsite.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link href="/discover" className="rounded-full bg-surface/92 p-2.5 text-foreground shadow-soft"><ArrowLeft size={18} /></Link>
          <button onClick={() => toggleFavorite(campsite.id)} className="rounded-full bg-surface/92 p-2.5 text-foreground shadow-soft"><Heart size={18} className={favorite ? 'fill-primary text-primary' : ''} /></button>
        </div>
        <div className="absolute bottom-5 left-4 right-4 text-white">
          <div className="mb-2 flex items-center gap-3 text-sm text-white/82">
            <span>{campsite.region}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={14} /> {campsite.location}</span>
          </div>
          <h1 className="text-[40px] leading-[1.02] font-semibold">{campsite.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/16 px-3 py-1.5 text-sm font-medium backdrop-blur">{campsite.priceNote}</span>
            <span className="rounded-full bg-white/16 px-3 py-1.5 text-sm font-medium backdrop-blur">{campsite.distanceKm} km away</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-3 py-1.5 text-sm font-medium backdrop-blur"><Star size={14} className="fill-yellow-400 text-yellow-400" /> {campsite.rating} · {campsite.reviews}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        <Card className="bg-surface-muted">
          <SectionHeader eyebrow="Quick decision" title="Can you bring the right pet here?" subtitle="The top answer first, so the page works like a decision tool." />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[24px] bg-surface p-4">
              <div className="text-muted">🐶 Dog friendly</div>
              <div className="mt-1 text-lg font-semibold">{campsite.petPolicy.dogFriendly ? 'Yes' : 'No'}</div>
            </div>
            <div className="rounded-[24px] bg-surface p-4">
              <div className="text-muted">🐱 Cat friendly</div>
              <div className="mt-1 text-lg font-semibold">{campsite.petPolicy.catFriendly ? 'Yes' : 'No / difficult'}</div>
            </div>
            <div className="rounded-[24px] bg-surface p-4">
              <div className="text-muted">🪢 Leash rule</div>
              <div className="mt-1 text-lg font-semibold">{campsite.petPolicy.leashRequired ? 'Required' : 'Use judgment'}</div>
            </div>
            <div className="rounded-[24px] bg-surface p-4">
              <div className="text-muted">⚠️ Risk level</div>
              <div className="mt-1 text-lg font-semibold">{riskLevel(campsite.safetyNotes)}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">{campsite.petPolicy.notes}</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Quick summary</p>
              <h2 className="mt-1 text-2xl font-semibold">{campsite.summary}</h2>
            </div>
            <div className="rounded-2xl bg-primary-soft px-3 py-2 text-sm font-medium text-primary">{campsite.atmosphere.socialStyle}</div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">{campsite.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill active={campsite.petPolicy.dogFriendly}>Dog friendly</Pill>
            <Pill active={campsite.petPolicy.catFriendly}>Cat friendly</Pill>
            {campsite.atmosphere.beginnerFriendly ? <Pill tone="success">Beginner friendly</Pill> : null}
            {campsite.atmosphere.quiet ? <Pill>Quiet</Pill> : null}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Pet policy" title="Rules and restrictions" />
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            {campsite.petPolicy.restrictions.map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </Card>

        <Card>
          <SectionHeader eyebrow="Amenities" title="What you get on site" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {Object.entries(campsite.amenities).map(([key, value]) => (
              <div key={key} className="rounded-[24px] bg-surface-alt p-4">
                <div className="capitalize text-muted">{key}</div>
                <div className="mt-1 text-base font-semibold">{value ? 'Available' : 'Not available'}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Safety" title="Outdoor watch-outs" action={<Shield size={18} className="text-primary" />} />
          <div className="mt-4 rounded-[24px] bg-danger-soft p-4 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2"><AlertTriangle size={16} /> Risk level: {riskLevel(campsite.safetyNotes)}</div>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            {campsite.safetyNotes.map((note) => <li key={note}>• {note}</li>)}
          </ul>
          <div className="mt-4 rounded-[24px] bg-primary-soft p-4 text-sm text-primary">Weather placeholder: {campsite.weatherPreview}</div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Best for" title="Trip fit" />
          <div className="mt-4 flex flex-wrap gap-2">
            {campsite.bestFor.map((item) => <Pill key={item}>{item}</Pill>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
