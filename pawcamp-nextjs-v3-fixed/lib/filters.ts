import { campsites } from '@/data/campsites';
import { Campsite, Filters } from '@/lib/types';

export const defaultFilters: Filters = {
  query: '',
  petType: 'all',
  priceType: 'all',
  water: false,
  parking: false,
  campfire: false,
  beginnerFriendly: false,
  quiet: false,
  distanceMax: 100,
};

export function applyFilters(items: Campsite[], filters: Filters) {
  const q = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesQuery = !q || [item.name, item.location, item.region, item.summary].join(' ').toLowerCase().includes(q);
    const matchesPet = filters.petType === 'all'
      ? true
      : filters.petType === 'dog'
        ? item.petPolicy.dogFriendly
        : filters.petType === 'cat'
          ? item.petPolicy.catFriendly
          : item.petPolicy.dogFriendly && item.petPolicy.catFriendly;
    const matchesPrice = filters.priceType === 'all' || item.priceType === filters.priceType;
    const matchesWater = !filters.water || item.amenities.water;
    const matchesParking = !filters.parking || item.amenities.parking;
    const matchesCampfire = !filters.campfire || item.amenities.campfire;
    const matchesBeginner = !filters.beginnerFriendly || item.atmosphere.beginnerFriendly;
    const matchesQuiet = !filters.quiet || item.atmosphere.quiet;
    const matchesDistance = item.distanceKm <= filters.distanceMax;

    return matchesQuery && matchesPet && matchesPrice && matchesWater && matchesParking && matchesCampfire && matchesBeginner && matchesQuiet && matchesDistance;
  });
}

export function getCampsiteBySlugOrId(slugOrId: string) {
  return campsites.find((item) => item.slug === slugOrId || item.id === slugOrId);
}
