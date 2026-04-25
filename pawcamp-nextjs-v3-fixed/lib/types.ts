export type PriceType = 'Free' | 'Paid';
export type SocialStyle = 'Quiet' | 'Balanced' | 'Social';
export type PetType = 'dog' | 'cat' | 'both';

export type Campsite = {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  rating: number;
  reviews: number;
  priceType: PriceType;
  priceNote: string;
  heroImage: string;
  images: string[];
  summary: string;
  description: string;
  bestFor: string[];
  petPolicy: {
    dogFriendly: boolean;
    catFriendly: boolean;
    leashRequired: boolean;
    restrictions: string[];
    notes: string;
  };
  amenities: {
    water: boolean;
    toilet: boolean;
    parking: boolean;
    campfire: boolean;
    signal: boolean;
  };
  atmosphere: {
    quiet: boolean;
    beginnerFriendly: boolean;
    familyFriendly: boolean;
    socialStyle: SocialStyle;
  };
  safetyNotes: string[];
  weatherPreview: string;
};

export type Filters = {
  query: string;
  petType: 'all' | PetType;
  priceType: 'all' | PriceType;
  water: boolean;
  parking: boolean;
  campfire: boolean;
  beginnerFriendly: boolean;
  quiet: boolean;
  distanceMax: number;
};
