---
name: estexis-frontend-component
description: Build or modify estexis_frontend (grihoo.com) React components using the repository's Tailwind design tokens, i18n, and data-layer conventions.
---

# Estexis Frontend Component

Use this skill when creating or changing a React component in `src/components/`.

## Placement

- Public-site components go in `src/components/`.
- Admin-console components go in `src/components/admin/` (widgets under `src/components/admin/widgets/`).
- Route-level components belong in `src/pages/` or `src/pages/admin/`, not `src/components/`.

## Styling

- Use Tailwind utility classes with the custom tokens from `tailwind.config.js`:
  - `ink` (#18221f) — primary text / dark background
  - `forest` (#164b3f) — brand green / CTAs
  - `sage` (#dfe8dd) — soft green accents
  - `linen` (#f7f3ed) — page background
  - `gold` (#b88a44) — highlights / star accents
  - `mist` (#eef1ee) — card backgrounds
- Font is Quicksand; do not introduce another font family.
- Use `lucide-react` for icons; do not add another icon library.

## i18n

- Never hardcode user-facing strings in a public-site component.
- Use `useTranslation()` and `t(key)`; add missing keys via the `estexis-frontend-i18n` skill.
- Use `formatCurrency()`, `formatDate()`, `formatNumber()` from the same hook for locale-sensitive values.
- Admin-console-only strings may stay in English unless the task says otherwise.

## Data

- Fetch data through `src/lib/*Api.js` (`adminApi.js`, `blogApi.js`, `googleMapsApi.js`, `listingApi.js`); do not call `fetch` directly from a component.
- Use `src/data/properties.js`-style static data only for placeholder/demo content, not new production features.
- Admin components that need auth state use `AdminAuthContext`; do not duplicate auth logic.

## Verification

- `npm run dev` and manually exercise the changed component.
- `npm run build:stage` before finalizing non-trivial UI changes.
