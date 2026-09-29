---
applyTo: "src/pages/**,src/App.jsx,src/layouts/**"
---

# Estexis Frontend Page Instructions

Follow the canonical guidance in `.claude/skills/estexis-frontend-page/SKILL.md`.

- Register new routes in `src/App.jsx` with the correct layout (`PublicLayout` for public pages, `AdminRouteLayout` + `ProtectedAdminRoute` for admin pages).
- Every public page must source copy through `useTranslation()` and render correctly in RTL (Arabic).
- Keep `public/_redirects` (`/* /index.html 200`) intact for Cloudflare Pages SPA routing.
