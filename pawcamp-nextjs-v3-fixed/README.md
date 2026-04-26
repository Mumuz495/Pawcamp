# PawCamp V3

Mobile-first Next.js MVP for finding pet-friendly campsites, now upgraded with a real Mapbox map, browser geolocation, iPhone-installable PWA support, and Capacitor prep for a native iOS shell.

## What changed in V3

- Real Mapbox GL JS map on `/discover`
- Device location button and nearest-site hint
- Marker selection synced with shortlist cards
- More iOS-like floating tab bar
- Static export support for deployment and Capacitor packaging
- PWA manifest, icons, and service worker registration
- Capacitor configuration aimed at iPhone packaging
- Same mock campsite dataset, ready for API replacement later

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
- `npm run build:web` creates a static export in `out/`.
- Safari on iPhone can install the deployed site with Add to Home Screen.
- Capacitor is prepared through `capacitor.config.ts`, `npm run cap:sync`, and `npm run cap:open:ios`.
- GitHub Actions can deploy this folder to Cloudflare Pages automatically on push.

## iPhone route

Build the static web output:

```bash
npm install
npm run build:web
```

For a PWA deployment, host the generated `out/` folder on a static host and add the site to your iPhone Home Screen.

For a native iOS shell later:

```bash
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
```

You will need a Mac with Xcode to run or install the Capacitor iOS app on your iPhone.
