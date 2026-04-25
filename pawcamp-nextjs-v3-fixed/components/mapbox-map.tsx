'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { LocateFixed, MapPinned, Navigation, SearchX } from 'lucide-react';
import { Campsite } from '@/lib/types';
import { haversineDistanceKm } from '@/lib/geo';

type Props = {
  campsites: Campsite[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

type UserLocation = { lat: number; lng: number } | null;

export function MapboxMap({ campsites, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  // FIX: was a module-level mutable object; now a proper useRef
  const mapboxglRef = useRef<any>(null);

  const [tokenPresent, setTokenPresent] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState('Location off');
  const [userLocation, setUserLocation] = useState<UserLocation>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const nearest = useMemo(() => {
    if (!userLocation || campsites.length === 0) return null;
    return campsites
      .map((site) => ({ site, distance: haversineDistanceKm(userLocation, site.coordinates) }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [campsites, userLocation]);

  // FIX: campsites removed from deps — this effect only initialises the map once.
  // Marker updates are handled by the second effect below, preventing full
  // map teardown + rebuild on every filter change.
  useEffect(() => {
    if (!token || !containerRef.current) {
      setTokenPresent(false);
      return;
    }

    let active = true;

    async function init() {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (!active || !containerRef.current) return;

      mapboxgl.accessToken = token as string;
      mapboxglRef.current = mapboxgl;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-121.8081, 36.2704],
        zoom: 4.2,
        pitch: 28,
        bearing: -12,
        // FIX: attribution must stay visible to comply with Mapbox ToS.
        // Use compact mode instead of hiding.
        attributionControl: true,
        customAttribution: '',
      });
      mapRef.current = map;

      // FIX: removed the duplicate GeolocateControl — the custom handleLocate
      // button is the single geolocation path so userLocation state stays in sync.
      map.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right',
      );

      map.on('load', () => {
        if (!active) return;
        setMapReady(true);
        setMapLoading(false);
      });
    }

    init();

    return () => {
      active = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      mapboxglRef.current = null;
      setMapReady(false);
      setMapLoading(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // intentionally excludes campsites

  // Marker sync — runs whenever filtered campsites or selection changes
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxglRef.current;
    if (!map || !mapReady || !mapboxgl) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    campsites.forEach((site) => {
      const el = document.createElement('button');
      const isActive = site.id === selectedId;

      // FIX: both-friendly sites now show 🐾 instead of always losing to 🐱
      const emoji =
        site.petPolicy.dogFriendly && site.petPolicy.catFriendly
          ? '🐾'
          : site.petPolicy.catFriendly
            ? '🐱'
            : site.petPolicy.dogFriendly
              ? '🐶'
              : '🏕️';

      el.className = `pawcamp-marker ${isActive ? 'pawcamp-marker--active' : ''}`;
      el.innerHTML = `<span>${emoji}</span>`;
      el.setAttribute('aria-label', site.name);
      el.onclick = () => {
        onSelect?.(site.id);
        map.flyTo({
          center: [site.coordinates.lng, site.coordinates.lat],
          zoom: 9.4,
          pitch: 36,
          duration: 1200,
        });
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([site.coordinates.lng, site.coordinates.lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([site.coordinates.lng, site.coordinates.lat]);
    });

    if (campsites.length > 1) {
      map.fitBounds(bounds, { padding: 58, maxZoom: 7.2, duration: 900 });
    }
  }, [campsites, mapReady, onSelect, selectedId]);

  // Fly-to on external selection (clicking a card)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const campsite = campsites.find((item) => item.id === selectedId);
    if (!campsite) return;
    map.flyTo({
      center: [campsite.coordinates.lng, campsite.coordinates.lat],
      zoom: 9.2,
      pitch: 34,
      duration: 900,
    });
  }, [selectedId, campsites]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationLabel('Geolocation unavailable');
      return;
    }
    setLocationLabel('Finding you…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(coords);
        setLocationLabel('Using your location');
        mapRef.current?.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 8.8,
          pitch: 28,
          duration: 1200,
        });
      },
      () => setLocationLabel('Permission denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  if (!tokenPresent) {
    return (
      <div className="rounded-[30px] border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-warning-soft p-3 text-foreground">
            <MapPinned size={18} />
          </span>
          <div>
            <h3 className="text-lg font-semibold">Mapbox token needed</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Add{' '}
              <code className="rounded bg-surface-alt px-1 text-xs">
                NEXT_PUBLIC_MAPBOX_TOKEN
              </code>{' '}
              to{' '}
              <code className="rounded bg-surface-alt px-1 text-xs">.env.local</code>, restart the
              dev server, and the live map will load.
            </p>
            <p className="mt-3 text-sm font-medium text-primary">
              Example: NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-border bg-surface shadow-soft">
      <div className="relative h-[380px] bg-slate-100">
        <div ref={containerRef} className="h-full w-full" />

        {/* Loading skeleton shown until Mapbox fires the 'load' event */}
        {mapLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-muted">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted">Loading map…</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface/88 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <div className="rounded-[24px] border border-white/70 bg-white/88 px-4 py-3 shadow-soft backdrop-blur">
            <div className="text-sm font-semibold">Live discovery map</div>
            <div className="mt-1 text-xs leading-5 text-muted">
              {campsites.length} site{campsites.length !== 1 ? 's' : ''} shown
            </div>
          </div>
          <button
            onClick={handleLocate}
            aria-label="Use my location"
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 p-3 shadow-soft backdrop-blur"
          >
            <LocateFixed size={16} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{locationLabel}</div>
              <div className="mt-1 text-xs text-muted">
                {nearest
                  ? `${nearest.site.name} · ${nearest.distance.toFixed(1)} km nearest`
                  : 'Tap 📍 above to find sites near you.'}
              </div>
            </div>
            {nearest ? (
              <Link
                href={`/campsite/${nearest.site.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Open
                <Navigation size={14} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-alt px-4 py-2 text-sm text-muted">
                <SearchX size={14} />
                Select
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
