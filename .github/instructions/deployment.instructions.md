---
applyTo: "vite.config.js,package.json,public/_redirects,CLOUDFLARE_DEPLOYMENT.md,Secrets/**,.env.*"
---

# Estexis Frontend Deployment Instructions

Follow the canonical guidance in `.claude/skills/estexis-frontend-deployment/SKILL.md` and `CLOUDFLARE_DEPLOYMENT.md`.

- Real builds run through `npm run build:stage` / `npm run build:production`; do not turn plain `npm run build` into a working build command — it is an intentional guard.
- Keep `public/_redirects` (`/* /index.html 200`) for SPA routing on Cloudflare Pages.
- Do not commit real values from `Secrets/` or `.env.*`, and keep the stage/production split.
