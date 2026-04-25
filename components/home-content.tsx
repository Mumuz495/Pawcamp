'use client';

import Link from 'next/link';
import { Compass, Heart, MapPinned, ShieldCheck, Sparkles, TentTree } from 'lucide-react';
import { featuredCampsites, campsites } from '@/data/campsites';
import { CampsiteCard } from '@/components/campsite-card';
import { Card, MetricCard, Pill, SectionHeader } from '@/components/ui';

export function HomeContent() {
  const catFriendlyCount = campsites.filter((item) => item.petPolicy.catFriendly).length;
  const dogFriendlyCount = campsites.filter((item) => item.petPolicy.dogFriendly).length;

  return (
    <div className="space-y-6 px-4 pb-6 pt-5">
      <section className="app-gradient soft-grid rounded-[34px] p-5 text-white shadow-lg">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/72">PawCamp V4</p>
            <h1 className="mt-2 text-[44px] leading-[1.02] font-semibold">Live campsite discovery built for pet travel.</h1>
            <p className="mt-3 max-w-[90%] text-sm leading-6 text-white/76">Real map browsing, geolocation, stronger dog-vs-cat matching, and faster shortlist decisions in one mobile-first experience.</p>
          </div>
          <span className="rounded-full bg-white/14 p-3"><Sparkles size={22} /></span>
        </div>

        <div className="rounded-[26px] bg-white/10 p-3 backdrop-blur">
          <Link href="/discover" className="flex items-center gap-3 rounded-[22px] bg-white/96 px-4 py-3 text-foreground shadow-soft">
            <MapPinned size={18} />
            <span className="text-sm text-muted">Open the live map and find a site near you</span>
          </Link>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="warning">Dog friendly</Pill>
            <Pill tone="warning">Cat friendly</Pill>
            <Pill tone="warning">Live map</Pill>
            <Pill tone="warning">Location aware</Pill>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Pet-first" title="Start with the right pet setup" subtitle="Jump directly into dog-first, cat-first, or shared-pet discovery flows." />
        <div className="grid grid-cols-3 gap-3">
          <Link href="/discover?pet=dog" className="rounded-[26px] border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <h3 className="text-base font-semibold">Dogs</h3>
            <p className="mt-2 text-xs leading-5 text-muted">Trail access, easier movement, dog-first camps.</p>
          </Link>
          <Link href="/discover?pet=cat" className="rounded-[26px] border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <h3 className="text-base font-semibold">Cats</h3>
            <p className="mt-2 text-xs leading-5 text-muted">Quiet camps, lower stimulation, safer cat setups.</p>
          </Link>
          <Link href="/discover?pet=both" className="rounded-[26px] border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <h3 className="text-base font-semibold">Both</h3>
            <p className="mt-2 text-xs leading-5 text-muted">Shared trips that work across both pet profiles.</p>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <MetricCard value={campsites.length} label="Curated sites" />
        <MetricCard value={dogFriendlyCount} label="Dog friendly" />
        <MetricCard value={catFriendlyCount} label="Cat friendly" />
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Start here" title="Quick paths" subtitle="The fastest way to narrow your shortlist." />
        <div className="grid grid-cols-2 gap-3">
          <Link href="/discover" className="rounded-[30px] border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <TentTree size={18} className="text-primary" />
            <h3 className="mt-3 text-lg font-semibold">Explore nearby</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Map, geolocation, and quick-fit campsite cards.</p>
          </Link>
          <Link href="/favorites" className="rounded-[30px] border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <Heart size={18} className="text-primary" />
            <h3 className="mt-3 text-lg font-semibold">Saved places</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Hold onto strong matches for later review.</p>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <Card className="bg-surface-muted">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-success-soft p-3 text-primary"><ShieldCheck size={18} /></span>
            <div>
              <p className="text-sm font-semibold">Why V4 feels more real</p>
              <p className="mt-1 text-sm leading-6 text-muted">V4 adds pet-first quick starts, clearer dog-vs-cat decision cues, and stronger sync between the shortlist and the live map.</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Recommended" title="Best pet-friendly matches" action={<Link href="/discover" className="text-sm font-medium text-primary">See all</Link>} />
        <div className="space-y-4">
          {featuredCampsites.map((campsite) => <CampsiteCard key={campsite.id} campsite={campsite} />)}
        </div>
      </section>

      <section className="rounded-[30px] border border-border bg-surface p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-primary-soft p-3 text-primary"><Compass size={18} /></span>
          <div>
            <h3 className="text-lg font-semibold">Next build path</h3>
            <p className="text-sm leading-6 text-muted">Add Mapbox Search, user reviews, and real-time weather for launch-grade discovery.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
