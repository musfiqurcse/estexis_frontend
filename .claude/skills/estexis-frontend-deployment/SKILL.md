---
name: estexis-frontend-deployment
description: Handle estexis_frontend (grihoo.com) build and Cloudflare Pages deployment changes safely.
---

# Estexis Frontend Deployment

Use this skill when changing build configuration, environment/secrets handling, or deployment steps. Full details live in `CLOUDFLARE_DEPLOYMENT.md` — treat it as the source of truth and update it if a step changes.

## Build

- Do not "fix" the plain `npm run build` script — it is intentionally a guard that fails and tells the caller to use `npm run build:stage` or `npm run build:production` so the correct `Secrets/`/`.env.*` file loads.
- `npm run build:stage` and `npm run build:production` are the real build entry points; output goes to `dist/`.
- `npm run preview` serves the production build locally for a final check.

## Cloudflare Pages

- Framework preset: React (Vite); build output directory: `dist`.
- Production branch: `main`; custom domain: `grihoo.com`.
- SPA routing depends on `public/_redirects` containing `/* /index.html 200` — never remove it while `react-router-dom` is in use.
- CLI deploy: `npx wrangler pages deploy dist --project-name <project-name>`.

## Environment/Secrets

- Environment-specific values live under `Secrets/` and `.env.*`; do not commit real secret values, and do not collapse the stage/production split back into a single `.env`.
- New environment variables need to be added in the Cloudflare Pages dashboard for both Production and Preview, then redeployed.

## Verification

- `npm run build:stage` (or `build:production` for a production-bound change) completes without errors.
- `npm run preview` and click through `/properties`, a property detail page, and a legal page to confirm SPA fallback and asset loading.
