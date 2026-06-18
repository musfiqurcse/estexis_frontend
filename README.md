# grihoo.com

Premium multilingual real estate marketplace (buy/sell focused) built with React, Vite, Tailwind CSS, lucide-react, and react-router-dom.

## Local Development

```bash
npm install
npm run dev
```

## Environment

Copy the relevant `Secrets/.env.*` file for your target mode and configure:

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_GOOGLE_MAPS_API_KEY=google-maps-api-key
```

`VITE_GOOGLE_MAPS_API_KEY` enables Google Places autocomplete in the admin listing wizard. Enable Maps JavaScript API and Places API for the key. The listing UI uses the `/api/v1/listings` and `/api/v1/admin/listings` APIs from `VITE_API_BASE_URL`.

## Build

```bash
npm run build:stage
npm run build:production
```

## Cloudflare Deployment

For complete deployment instructions, see:

- [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)

Quick settings summary:

- Framework preset: React / Vite
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
