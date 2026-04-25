# PawCamp V3

Mobile-first Next.js MVP for finding pet-friendly campsites, now upgraded with a real Mapbox map, browser geolocation, and a more iOS-like floating bottom navigation.

## What changed in V3

- Real Mapbox GL JS map on `/discover`
- Device location button and nearest-site hint
- Marker selection synced with shortlist cards
- More iOS-like floating tab bar
- Same mock campsite dataset, ready for API replacement later

## Folder structure

```text
pawcamp-nextjs/
├── app/
│   ├── campsite/[id]/page.tsx
│   ├── discover/page.tsx
│   ├── favorites/page.tsx
│   ├── profile/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── campsite-card.tsx
│   ├── detail-content.tsx
│   ├── discover-content.tsx
│   ├── favorites-content.tsx
│   ├── favorites-provider.tsx
│   ├── filters-panel.tsx
│   ├── home-content.tsx
│   ├── mapbox-map.tsx
│   ├── profile-content.tsx
│   ├── site-shell.tsx
│   └── ui.tsx
├── data/
│   └── campsites.ts
├── lib/
│   ├── filters.ts
│   ├── geo.ts
│   └── types.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Run locally

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_public_mapbox_token_here
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Notes

- The map will show a setup card until a Mapbox public token is added.
- Geolocation depends on browser permission and is most reliable over HTTPS or localhost.
- This version still uses mock campsite data so the UI can be iterated quickly.
