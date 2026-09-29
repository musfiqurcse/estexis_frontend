# Project Memory

## Project
- Name: estexis_frontend (product name: grihoo, grihoo.com)
- Path: `/Users/musfiqur.rahman/apps/personal/blackbox/estexis_frontend`
- Type: multilingual real estate marketplace frontend (public site + admin console)
- Package manager/workflow: `npm`

## Stack
- React 18 + Vite 6
- react-router-dom v7
- Tailwind CSS v3 with custom design tokens (`ink`, `forest`, `sage`, `linen`, `gold`, `mist`)
- lucide-react icons
- recharts (admin dashboards)
- Custom context-based i18n (no external i18n library) — languages: en, de, ar (RTL), bn
- Deployment: Cloudflare Pages, custom domain grihoo.com

## Structure
- `src/pages/` — public route pages; `src/pages/admin/` — admin console pages
- `src/components/` — public UI; `src/components/admin/` (+ `widgets/`) — admin UI
- `src/layouts/` — `PublicLayout`, `AdminRouteLayout`
- `src/context/` — `BlogContext`
- `src/lib/` — API clients: `adminApi.js`, `blogApi.js`, `googleMapsApi.js`, `listingApi.js`, `listingUtils.js`
- `src/i18n/` — provider + `{en,de,ar,bn}.js` dictionaries
- `src/hooks/` — `useVisitorLocation`
- `src/data/` — static placeholder data (`properties.js`)
- `email_templates/` — standalone HTML email templates

## Build
- `npm run dev` — local dev server
- `npm run build:stage` / `npm run build:production` — real build entry points (output `dist/`); plain `npm run build` is intentionally a guard script that errors and tells you to pick stage/production
- `npm run preview` — preview production build

## Conventions
- Public-facing strings always go through `useTranslation()`/`t(key)`; every new key must exist in all four dictionaries.
- Admin routes are gated by `ProtectedAdminRoute` + `AdminAuthContext`.
- Data fetching goes through `src/lib/*Api.js`, not ad-hoc `fetch` calls in components.
- SPA routing depends on `public/_redirects` (`/* /index.html 200`) for Cloudflare Pages.
- Secrets/environment values live under `Secrets/` and `.env.*`, split by stage/production — do not collapse or commit real values.

## Canonical Skills
Canonical skills live in `.claude/skills/` and are mirrored for Codex/OpenAI Skills, GitHub Copilot, and Google Antigravity via `AGENTS.md`:
- `estexis-frontend-repo-orientation`
- `estexis-frontend-component`
- `estexis-frontend-page`
- `estexis-frontend-i18n`
- `estexis-frontend-code-review`
- `estexis-frontend-deployment`
