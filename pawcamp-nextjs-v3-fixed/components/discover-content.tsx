'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { campsites } from '@/data/campsites';
import { CampsiteCard } from '@/components/campsite-card';
import { FiltersPanel } from '@/components/filters-panel';
import { Card, Pill, SectionHeader, SegmentedControl } from '@/components/ui';
import { applyFilters, defaultFilters } from '@/lib/filters';
import { MapboxMap } from '@/components/mapbox-map';

export function DiscoverContent() {
  const [filters, setFilters] = useState(defaultFilters);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const results = useMemo(() => applyFilters(campsites, filters), [filters]);

  const activeChips = [
    filters.petType !== 'all' ? `Pet: ${filters.petType}` : null,
    filters.priceType !== 'all' ? filters.priceType : null,
    filters.quiet ? 'Quiet' : null,
    filters.beginnerFriendly ? 'Beginner' : null,
    filters.water ? 'Water' : null,
    filters.parking ? 'Parking' : null,
    filters.campfire ? 'Campfire' : null,
  ].filter(Boolean) as string[];

  const highlighted = selectedId ? results.find((site) => site.id === selectedId) : results[0];

  return (
    <div className="space-y-5 px-4 pb-6 pt-5">
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Discover V3</p>
        <h1 className="text-[38px] leading-[1.03] font-semibold">Live map, location-aware browsing, and faster campsite decisions.</h1>
        <p className="text-sm leading-6 text-muted">Scan real markers, center on your location, and shortlist the sites that fit your dog or cat setup without leaving the same screen.</p>
      </section>

      <Card className="space-y-4 bg-surface-muted">
        <div className="flex items-center gap-3 rounded-[24px] bg-surface px-4 py-3 shadow-soft">
          <Search size={18} className="text-muted" />
          <input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Search city, campsite, or vibe" className="w-full bg-transparent outline-none" />
          <button onClick={() => setFiltersOpen(true)} className="rounded-full bg-surface-alt p-2 text-muted"><SlidersHorizontal size={16} /></button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{results.length} results</p>
            <p className="text-sm text-muted">{filters.petType === 'all' ? 'All pet types' : `${filters.petType} focused`} · within {filters.distanceMax} km</p>
          </div>
          <SegmentedControl
            value={view}
            onChange={(next) => setView(next as 'map' | 'list')}
            options={[{ label: 'Map', value: 'map' }, { label: 'List', value: 'list' }]}
          />
        </div>
        {activeChips.length ? <div className="flex flex-wrap gap-2">{activeChips.map((chip) => <Pill key={chip} active>{chip}</Pill>)}</div> : null}
      </Card>

      <FiltersPanel filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} open={filtersOpen} onOpenChange={setFiltersOpen} />

      {view === 'map' ? (
        <div className="space-y-4">
          <MapboxMap campsites={results} selectedId={selectedId} onSelect={setSelectedId} />
          <Card className="bg-surface-muted">
            <SectionHeader eyebrow="Focused result" title={highlighted ? highlighted.name : 'No focused campsite'} subtitle={highlighted ? `${highlighted.location} · ${highlighted.distanceKm} km in dataset` : 'Change filters or tap a marker.'} />
            {highlighted ? (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Pill active={highlighted.petPolicy.dogFriendly}>Dog friendly</Pill>
                  <Pill active={highlighted.petPolicy.catFriendly}>Cat friendly</Pill>
                  {highlighted.atmosphere.quiet ? <Pill>Quiet</Pill> : <Pill tone="warning">Livelier site</Pill>}
                  {highlighted.atmosphere.beginnerFriendly ? <Pill tone="success">Beginner friendly</Pill> : null}
                </div>
                <p className="text-sm leading-6 text-muted">{highlighted.summary}</p>
              </div>
            ) : null}
          </Card>
        </div>
      ) : null}

      {results.length === 0 ? (
        <Card>
          <h3 className="text-lg font-semibold">No campsites match this filter set.</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Try widening your distance, switching pet type, or removing one amenity requirement.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <SectionHeader eyebrow="Results" title={view === 'map' ? 'Visible on map now' : 'Detailed shortlist'} subtitle="Tap any card to open the full decision page." />
          {results.map((campsite) => (
            <div key={campsite.id} onMouseEnter={() => setSelectedId(campsite.id)} onClick={() => setSelectedId(campsite.id)}>
              <CampsiteCard campsite={campsite} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
