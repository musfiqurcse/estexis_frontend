---
name: estexis-frontend-page
description: Add or modify a route/page in estexis_frontend (grihoo.com), including layout, admin protection, and i18n wiring.
---

# Estexis Frontend Page

Use this skill when adding a new route or changing an existing one.

## Required Shape

1. Create the page component in `src/pages/` (public) or `src/pages/admin/` (admin).
2. Register the route in `src/App.jsx`, matching the existing route table style.
3. Wrap public routes with `PublicLayout`; wrap admin routes with `AdminRouteLayout` and `ProtectedAdminRoute`.
4. Reuse `Navbar`/`Footer` from the layout — do not re-render them inside the page.

## Current Route Map (for reference — verify against `src/App.jsx` before relying on it)

| Route | Component |
| --- | --- |
| `/` | `HomePage` |
| `/properties` | `PropertiesPage` |
| `/properties/:id` | `PropertyDetailsPage` |
| `/inquiry/:id`, `/booking/:id` | `BookingPage` |
| `/dashboard` | `DashboardPage` |
| `/terms-and-conditions`, `/privacy-policy`, `/imprint`, `/impressum` | `LegalPage` |
| Admin routes | `src/pages/admin/*` behind `ProtectedAdminRoute` |

## i18n and RTL

- Every public page must source its copy through `useTranslation()` — no hardcoded strings.
- Verify the page renders correctly with Arabic (`ar`) selected, since Arabic is RTL and `document.documentElement.dir` flips.

## Deployment Note

- Because routing is client-side (`react-router-dom`), a new nested route needs `public/_redirects` (`/* /index.html 200`) to already exist for Cloudflare Pages — do not remove it.

## Verification

- `npm run dev`, navigate to the new route directly (not just via in-app link) to confirm SPA fallback works.
- `npm run build:stage`.
