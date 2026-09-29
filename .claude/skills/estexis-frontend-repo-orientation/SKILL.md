---
name: estexis-frontend-repo-orientation
description: Build a concise orientation report before changing the estexis_frontend (grihoo.com) app. Use when starting unfamiliar work, locating the right component/page, or planning a non-trivial change.
---

# Estexis Frontend Repo Orientation

Use this skill before implementation when the task touches unfamiliar frontend behavior or spans more than one area (public site, admin console, i18n, deployment).

## Read First

- `CLAUDE.md`
- `CLOUDFLARE_DEPLOYMENT.md` (if the task touches build/deploy)
- `package.json` scripts
- `src/App.jsx` for current routes and layouts

## Process

1. Identify the user goal: public site, admin console, i18n, data layer, or deployment.
2. Locate the relevant area:
   - `src/pages/` and `src/pages/admin/` — route-level page components.
   - `src/components/` and `src/components/admin/` — reusable UI.
   - `src/layouts/` — `PublicLayout`, `AdminRouteLayout`.
   - `src/context/` — `BlogContext` and other app-wide state.
   - `src/lib/` — API clients (`adminApi.js`, `blogApi.js`, `googleMapsApi.js`, `listingApi.js`, `listingUtils.js`).
   - `src/i18n/` — translation provider and `{en,de,ar,bn}.js` dictionaries.
   - `src/data/` — static mock data (`properties.js`).
   - `src/hooks/` — shared hooks (e.g. `useVisitorLocation`).
3. Note whether the change is public-facing (must support i18n) or admin-only (behind `ProtectedAdminRoute`).
4. Identify the minimum files likely to change.
5. List required verification (`npm run dev`, `npm run build:stage`).

## Output

Return a concise orientation report:

- Target area and affected route(s)/component(s).
- Existing patterns to preserve (layout, i18n, Tailwind tokens, data source).
- Files likely to change.
- i18n keys likely needed, if any.
- Any open product or design decision that cannot be inferred from the repo.

Do not implement code inside this skill unless the user explicitly asks for implementation after the orientation.
