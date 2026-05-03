# CLAUDE.md — estexis_frontend (grihoo.com)

## Project Overview

**grihoo.com** — A premium multilingual real estate marketplace focused on buying and selling properties. The repo folder is named `estexis_frontend` but the product name is **grihoo**.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6 |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v3 (custom design tokens) |
| Icons | lucide-react |
| i18n | Custom context-based system (no external lib) |
| Deployment | Cloudflare Pages |

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Project Structure

```
src/
  App.jsx               # root layout + route definitions
  main.jsx              # entry point, wraps with I18nProvider + BrowserRouter
  styles.css            # global styles / Tailwind base
  assets/               # images, SVGs (main_logo, app store badges)
  components/           # reusable UI components
  data/                 # static data (properties, categories)
  i18n/                 # i18n provider + language dictionaries
  pages/                # route-level page components
email_templates/        # standalone HTML email templates
```

## Pages & Routes

| Route | Component |
|---|---|
| `/` | `HomePage` |
| `/properties` | `PropertiesPage` |
| `/properties/:id` | `PropertyDetailsPage` |
| `/inquiry/:id` | `BookingPage` |
| `/booking/:id` | `BookingPage` |
| `/dashboard` | `DashboardPage` |
| `/terms-and-conditions` | `LegalPage` (terms) |
| `/privacy-policy` | `LegalPage` (privacy) |
| `/imprint` | `LegalPage` (imprint) |
| `/impressum` | `LegalPage` (impressum) |

## Tailwind Design Tokens

Custom colors defined in `tailwind.config.js`:

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#18221f` | Primary text / dark bg |
| `forest` | `#164b3f` | Brand green / CTAs |
| `sage` | `#dfe8dd` | Soft green accents |
| `linen` | `#f7f3ed` | Page background |
| `gold` | `#b88a44` | Highlight / star accents |
| `mist` | `#eef1ee` | Card backgrounds |

Font: **Quicksand** (Google Fonts).

## i18n System

- Languages: **en**, **de**, **ar**, **bn**
- Arabic is RTL; the provider sets `document.documentElement.dir` accordingly
- Language persisted to `localStorage`
- Access via `useTranslation()` hook — `t(key)`, `formatCurrency()`, `formatDate()`, `formatNumber()`
- Dictionaries live in `src/i18n/{en,de,ar,bn}.js`

## Data Layer

Static mock data in `src/data/properties.js`:
- `categories` array (6 categories: apartments, villas, family, beach, city, luxury)
- `properties` array (4 sample properties with i18n title/location/description keys)

Properties have: `id`, `titleKey`, `locationKey`, `descriptionKey`, `typeKey`, `price` (EUR), `rating`, `reviews`, `bedrooms`, `bathrooms`, `guests`, `host`, `amenities`, `images`.

## Deployment

Hosted on **Cloudflare Pages**:
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: add `public/_redirects` with `/* /index.html 200`
- Custom domain: `grihoo.com`
- CLI deploy: `npx wrangler pages deploy dist --project-name <project-name>`
