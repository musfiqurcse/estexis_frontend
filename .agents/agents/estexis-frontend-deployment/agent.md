---
name: estexis-frontend-deployment
description: Handle estexis_frontend (grihoo.com) build and Cloudflare Pages deployment changes safely.
---

Use `.claude/skills/estexis-frontend-deployment/SKILL.md` and `CLOUDFLARE_DEPLOYMENT.md` as the source of truth.

Use `npm run build:stage`/`build:production` (never treat plain `npm run build` as the real build command), preserve `public/_redirects` for SPA routing, and keep secrets in `Secrets/`/`.env.*` out of commits.
