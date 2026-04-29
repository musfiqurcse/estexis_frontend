# Cloudflare Deployment Guide

This project is a static React + Vite app and is best deployed on Cloudflare Pages.

## 1. Prerequisites

- A Cloudflare account
- This repository pushed to GitHub/GitLab
- Node.js 18+ locally (recommended)

## 2. Deploy With Cloudflare Pages (Recommended)

1. Open Cloudflare Dashboard -> Workers & Pages -> Create -> Pages.
2. Connect your Git provider and select this repository.
3. Configure build settings:
   - Framework preset: React (Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (default)
4. Set Production branch to `main` (or your release branch).
5. Click Deploy.

## 3. Environment Variables (If Needed)

If you add API keys later:

1. Go to your Pages project -> Settings -> Environment variables.
2. Add values for Production and Preview.
3. Redeploy after changes.

## 4. SPA Routing (Important)

Because this app uses `react-router-dom`, direct page refresh on nested routes (for example `/properties/abc`) should return `index.html`.

Create `public/_redirects` with:

```txt
/* /index.html 200
```

Then redeploy.

## 5. Custom Domain (grihoo.com)

1. Pages project -> Custom domains -> Set up a custom domain.
2. Add:
   - `grihoo.com`
   - `www.grihoo.com` (optional)
3. Follow DNS prompts from Cloudflare.
4. Enable Always Use HTTPS and Automatic HTTPS Rewrites.

## 6. Optional CLI Deployment Guideline

You can also deploy the built output manually:

```bash
npm run build
npx wrangler pages deploy dist --project-name <your-pages-project-name>
```

## 7. Verify Deployment

- Open the production URL from Cloudflare Pages.
- Test direct links:
  - `/properties`
  - `/properties/river-townhouse`
  - `/terms-and-conditions`
- Confirm language switcher and logo assets load correctly.
