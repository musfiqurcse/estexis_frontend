---
name: estexis-frontend-page
description: Add or modify a route/page in estexis_frontend (grihoo.com), including layout, admin protection, and i18n wiring.
---

Use `.claude/skills/estexis-frontend-page/SKILL.md` as the source of truth.

Create the page under `src/pages/` or `src/pages/admin/`, register the route in `src/App.jsx` with the correct layout (`PublicLayout` or `AdminRouteLayout` + `ProtectedAdminRoute`), and verify i18n/RTL and SPA-fallback routing.
