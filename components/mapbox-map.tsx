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

const mapboxModuleRef: { current: any } = { current: null };

export function MapboxMap({ campsites, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [tokenPresent, setTokenPresent] = useState(Boolean(token));
  const [mapReady, setMapReady] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Location not shared');
  const [userLocation, setUserLocation] = useState<UserLocation>(null);

  const nearest = useMemo(() => {
    if (!userLocation || campsites.length === 0) return null;
    return campsites
      .map((site) => ({ site, distance: haversineDistanceKm(userLocation, site.coordinates) }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [campsites, userLocation]);

  const focusedSite = selectedId ? campsites.find((item) => item.id === selectedId) : campsites[0] ?? null;

  useEffect(() => {
    setTokenPresent(Boolean(token));

    if (!token || !containerRef.current || mapRef.current) {
      return;
    }

    let active = true;
    let mountedMap: any = null;

    async function init() {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (!active || !containerRef.current) return;

      mapboxgl.accessToken = token;
      mapboxModuleRef.current = mapboxgl;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-121.8081, 36.2704],
        zoom: 4.2,
        pitch: 24,
        bearing: -8,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        if (!active) return;
        mapRef.current = map;
        setMapReady(true);
      });

      mountedMap = map;
    }

    init();

    return () => {
      active = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mountedMap) mountedMap.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const mapboxgl = mapboxModuleRef.current;
    if (!mapboxgl || campsites.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    campsites.forEach((site) => {
      const el = document.createElement('button');
      const active = site.id === selectedId;
      el.type = 'button';
      el.className = `pawcamp-marker ${active ? 'pawcamp-marker--active' : ''}`;
      el.textContent = site.petPolicy.catFriendly ? 'CAT' : site.petPolicy.dogFriendly ? 'DOG' : 'PET';
      el.setAttribute('aria-label', site.name);
      el.onclick = () => {
        onSelect?.(site.id);
        map.flyTo({ center: [site.coordinates.lng, site.coordinates.lat], zoom: 9.4, pitch: 36, duration: 1200 });
      };

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([site.coordinates.lng, site.coordinates.lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([site.coordinates.lng, site.coordinates.lat]);
    });

    if (campsites.length > 1) {
      map.fitBounds(bounds, { padding: 58, maxZoom: 7.2, duration: 900 });
    } else {
      const [site] = campsites;
      map.flyTo({ center: [site.coordinates.lng, site.coordinates.lat], zoom: 8.6, pitch: 30, duration: 900 });
    }
  }, [campsites, mapReady, onSelect, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const campsite = campsites.find((item) => item.id === selectedId);
    if (!campsite) return;
    map.flyTo({ center: [campsite.coordinates.lng, campsite.coordinates.lat], zoom: 9.2, pitch: 34, duration: 900 });
  }, [selectedId, campsites]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationLabel('Geolocation unavailable');
      return;
    }

    setLocationLabel('Locating you...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(coords);
        setLocationLabel('Using your location');
        const map = mapRef.current;
        if (map) {
          map.flyTo({ center: [coords.lng, coords.lat], zoom: 8.8, pitch: 28, duration: 1200 });
        }
      },
      () => setLocationLabel('Location permission denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!tokenPresent) {
    return (
      <div className="rounded-[30px] border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-warning-soft p-3 text-foreground"><MapPinned size={18} /></span>
          <div>
            <h3 className="text-lg font-semibold">Mapbox token needed</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Add NEXT_PUBLIC_MAPBOX_TOKEN to a .env.local file, restart the dev server, and the live map will load.</p>
            <p className="mt-3 text-sm font-medium text-primary">Example: NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-border bg-surface shadow-soft">
      <div className="relative h-[380px] bg-slate-100">
        <div ref={containerRef} className="h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface/88 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <div className="rounded-[24px] border border-white/70 bg-white/88 px-4 py-3 shadow-soft backdrop-blur">
            <div className="text-sm font-semibold">Live discovery map</div>
            <div className="mt-1 text-xs leading-5 text-muted">Real Mapbox canvas with synced shortlist markers and device location support.</div>
          </div>
          <button onClick={handleLocate} className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3 py-3 text-sm font-medium shadow-soft backdrop-blur" aria-label="Use my location">
            <LocateFixed size={16} />
          </button>
        </div>

        {campsites.length === 0 ? (
          <div className="pointer-events-none absolute inset-x-4 top-24 rounded-[24px] border border-white/70 bg-white/92 p-4 text-sm text-muted shadow-soft backdrop-blur">
            No campsites match the current filters. Loosen one filter to repopulate the map.
          </div>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{locationLabel}</div>
              <div className="mt-1 text-xs text-muted">
                {nearest
                  ? `${nearest.site.name} is your nearest shown match - ${nearest.distance.toFixed(1)} km`
                  : focusedSite
                    ? `${focusedSite.name} is currently in focus.`
                    : 'Tap a marker to focus a campsite.'}
              </div>
            </div>
            {nearest || focusedSite ? (
              <Link href={`/campsite/${(nearest?.site ?? focusedSite)!.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
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
