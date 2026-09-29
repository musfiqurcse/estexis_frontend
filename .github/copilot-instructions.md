# Estexis Frontend (grihoo.com) Copilot Instructions

## Project Overview
- This repository is the frontend for **grihoo.com**, a multilingual real estate marketplace. The folder is named `estexis_frontend` but the product name is grihoo.
- The app has two areas: the public marketing/marketplace site and an admin console behind auth.
- Prefer simple, production-sensible React over premature abstraction.

## Tech Stack
- React 18 + Vite 6
- react-router-dom v7
- Tailwind CSS v3 with custom design tokens
- lucide-react (icons)
- recharts (admin dashboards)
- Custom context-based i18n (en, de, ar, bn — Arabic is RTL)
- Cloudflare Pages (deployment)

## Current Code Layout
- `src/App.jsx`: root layout + route definitions
- `src/main.jsx`: entry point, wraps app with `I18nProvider` + `BrowserRouter`
- `src/pages/`: public route pages; `src/pages/admin/`: admin console pages
- `src/components/`: public UI; `src/components/admin/` (+ `widgets/`): admin UI
- `src/layouts/`: `PublicLayout`, `AdminRouteLayout`
- `src/context/`: `BlogContext`
- `src/lib/`: API clients — `adminApi.js`, `blogApi.js`, `googleMapsApi.js`, `listingApi.js`, `listingUtils.js`
- `src/i18n/`: i18n provider + `{en,de,ar,bn}.js` dictionaries
- `src/hooks/`: shared hooks (`useVisitorLocation`)
- `src/data/`: static placeholder data (`properties.js`)

## Design Tokens (`tailwind.config.js`)
| Token | Hex | Usage |
| --- | --- | --- |
| `ink` | `#18221f` | Primary text / dark bg |
| `forest` | `#164b3f` | Brand green / CTAs |
| `sage` | `#dfe8dd` | Soft green accents |
| `linen` | `#f7f3ed` | Page background |
| `gold` | `#b88a44` | Highlight / star accents |
| `mist` | `#eef1ee` | Card backgrounds |

Font: Quicksand. Do not introduce another font family or icon library.

## Coding Guidelines
- Never hardcode public-facing strings — use `useTranslation()`/`t(key)` and add the key to all four dictionaries.
- Use `formatCurrency()`/`formatDate()`/`formatNumber()` for locale-sensitive values.
- Fetch data through `src/lib/*Api.js`, not direct `fetch` calls in components.
- Keep admin-only code under `src/pages/admin/` / `src/components/admin/`, gated by `ProtectedAdminRoute` and `AdminAuthContext`.
- Register new routes in `src/App.jsx` with the correct layout.
- Preserve `public/_redirects` (`/* /index.html 200`) for Cloudflare Pages SPA routing.

## Workflow Guidelines
- `npm run dev` for local development.
- `npm run build:stage` / `npm run build:production` for real builds (output `dist/`); the plain `npm run build` script is an intentional guard that errors — do not "fix" it to build directly.
- `npm run preview` to check a production build locally.
- `npx wrangler pages deploy dist --project-name <project-name>` for manual Cloudflare Pages deploys.

## Expectations For Suggestions
- Keep suggestions compatible with the existing route table, layouts, and i18n system.
- For any new user-facing copy, always propose the key/value for all four languages, not just English.
- Do not remove the stage/production `Secrets/`/`.env.*` split.

## Project Skills And Agent Guidance
- Shared agent instructions are indexed in `AGENTS.md`.
- Canonical reusable skills live in `.claude/skills/`.
- Path-specific Copilot instructions live in `.github/instructions/`.
- When guidance conflicts, prefer explicit user instructions first, then `CLAUDE.md`, then the canonical skill, then adapter files.
